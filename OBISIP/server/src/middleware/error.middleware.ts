import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

/**
 * Global error handling middleware.
 * Handles operational errors, validation errors, JWT errors, and unknown errors.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: Record<string, string> | undefined;

  // Known operational error
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Zod validation error
  else if (err instanceof ZodError) {
    statusCode = 422;
    message = 'Validation failed';
    errors = err.errors.reduce(
      (acc, e) => {
        acc[e.path.join('.')] = e.message;
        return acc;
      },
      {} as Record<string, string>
    );
  }

  // Mongoose duplicate key
  else if ((err as NodeJS.ErrnoException).code === '11000' || (err as any).code === 11000) {
    statusCode = 409;
    const field = Object.keys((err as any).keyValue || {})[0] || 'field';
    message = `${field} already exists`;
  }

  // JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired. Please log in again.';
  }

  // Mongoose CastError (invalid ObjectId)
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource ID format';
  }

  // Log non-operational errors in development
  if (!env.IS_PRODUCTION && statusCode === 500) {
    console.error('🔴 Unhandled error:', err);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || message,
    ...(errors && { errors }),
    ...(env.IS_DEVELOPMENT && statusCode === 500 && { stack: err.stack }),
  });
};
