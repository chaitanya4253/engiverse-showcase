import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import sanitizeHtml from 'sanitize-html';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'engiverse_super_secret_jwt_key_9405456978_8010895511_8788705811';

// 1. JWT Authentication Middleware
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token: string | undefined = undefined;

  // Check HttpOnly cookie first, then Authorization Header
  if (req.cookies && req.cookies.engiverse_token) {
    token = req.cookies.engiverse_token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Authentication token missing or invalid.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or token invalid. Please log in again.' });
  }
};

// 2. Role-Based Access Control (RBAC) Middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden. Requires one of roles: [${allowedRoles.join(', ')}]` });
    }

    next();
  };
};

// 3. Strict Rate Limiters
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 failed login attempts per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts from this IP. Please try again after 15 minutes.' }
});

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Rate limit exceeded. Please slow down your requests.' }
});

// 4. Input Sanitization Middleware (XSS & Injection Protection)
export const sanitizeInputs = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    sanitizeObject(req.query);
  }
  next();
};

function sanitizeObject(obj: Record<string, any>) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = sanitizeHtml(obj[key], {
        allowedTags: [],
        allowedAttributes: {}
      }).trim();
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}
