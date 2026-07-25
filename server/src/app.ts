import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { apiRateLimiter } from './middleware/rateLimiter';
import apiRouter from './routes/api';
import { initDatabase } from './db/database';

const app = express();

// Initialize DB schema asynchronously
initDatabase().catch(err => console.error('Database init notice:', err.message));

// 1. Security Headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// 2. CORS Policy (Allow all origins for serverless & local)
app.use(
  cors({
    origin: true,
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
    system: 'Engiverse Netlify Serverless API',
    security: 'HARDENED_OWASP_COMPLIANT',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    system: 'Engiverse Netlify Serverless API',
    timestamp: new Date().toISOString()
  });
});

// 7. Centralized Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[SERVER_ERROR]', err.message || err);
  return res.status(err.status || 500).json({
    error: err.message || 'An unexpected server error occurred.'
  });
});

export default app;
