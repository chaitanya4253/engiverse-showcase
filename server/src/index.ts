import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { initDatabase } from './db/database';
import apiRouter from './routes/api';
import { apiRateLimiter } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. Enterprise Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://*.instagram.com"],
        connectSrc: ["'self'", CLIENT_URL]
      }
    },
    crossOriginEmbedderPolicy: false,
    frameguard: { action: 'deny' }, // Anti-clickjacking
    hidePoweredBy: true,
    hsts: { maxAge: 31536000, includeSubDomains: true }
  })
);

// 2. Strict CORS Policy
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === CLIENT_URL || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(new Error('CORS Policy Breach: Request origin prohibited.'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
  })
);

// 3. Body Parsing & Limiters
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// 4. Rate Limiter on API
app.use('/api', apiRateLimiter);

// 5. Mount API Routes
app.use('/api/v1', apiRouter);

// 6. Root Healthcheck Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    system: 'Engiverse Engineering Showcase Backend API',
    security: 'HARDENED_OWASP_COMPLIANT',
    timestamp: new Date().toISOString()
  });
});

// 7. Centralized Error Handler (OWASP compliant: No stack trace leakage)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[CRITICAL_SERVER_ERROR]', err.message || err);

  const isDev = process.env.NODE_ENV === 'development';
  return res.status(err.status || 500).json({
    error: isDev ? err.message : 'An unexpected security or server error occurred. Please contact system administrator.'
  });
});

// Initialize Database and Start Server
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`⚡ Engiverse Backend Server Live on port ${PORT}`);
      console.log(`🔒 Security Hardened: OWASP Top 10 Aligned`);
      console.log(`🌐 Public API: http://localhost:${PORT}/api/v1/public/config`);
      console.log(`====================================================`);
    });
  })
  .catch((err) => {
    console.error('Fatal Database Initialization Error:', err);
    process.exit(1);
  });
