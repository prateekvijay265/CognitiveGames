import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;
  const isDev = process.env.NODE_ENV === 'development';

  // Log in dev
  if (isDev) {
    console.error('❌ Error:', err);
  }

  // Never expose internal errors to client
  const message =
    err.isOperational
      ? err.message
      : statusCode === 500
      ? 'Something went wrong. Please try again.'
      : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDev && { stack: err.stack }),
  });
}

export function createError(message: string, statusCode: number): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}

export function notFound(_req: Request, _res: Response, next: NextFunction): void {
  const error = createError('Route not found', 404);
  next(error);
}
