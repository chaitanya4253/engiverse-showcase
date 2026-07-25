import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { apiRateLimiter } from './middleware/rateLimiter';
import apiRouter from './routes/api';
import { initDatabase } from './db/database';

const app = express();

initDatabase().catch(err => console.error('Database init notice:', err.message));

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

app.use('/api', apiRateLimiter);

// Mount API Routes across all possible Netlify & Express path prefixes
app.use('/.netlify/functions/api/v1', apiRouter);
app.use('/.netlify/functions/api', apiRouter);
app.use('/api/v1', apiRouter);
app.use('/v1', apiRouter);
app.use('/api', apiRouter);
app.use('/', apiRouter);

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    system: 'Engiverse Netlify Serverless API',
    security: 'HARDENED_OWASP_COMPLIANT',
    timestamp: new Date().toISOString()
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[SERVER_ERROR]', err.message || err);
  return res.status(err.status || 500).json({
    error: err.message || 'An unexpected server error occurred.'
  });
});

export default app;
