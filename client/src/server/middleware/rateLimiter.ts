import { Request, Response, NextFunction } from 'express';

export const apiRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  next();
};
