import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { AppError } from '../utils/AppError';

/**
 * Authorization middleware — restricts access to admin users only.
 * Must be used AFTER the `authenticate` middleware.
 */
export const requireAdmin = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'admin') {
    throw new AppError('Access denied. Admin privileges required.', 403);
  }
  next();
};
