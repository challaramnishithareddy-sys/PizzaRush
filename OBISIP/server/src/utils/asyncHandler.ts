import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps async Express route handlers to automatically catch and forward errors.
 * Eliminates the need for try/catch boilerplate in every controller.
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
