import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Custom error class for API errors
export class APIError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;
  public correlationId?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_SERVER_ERROR',
    details?: any
  ) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Pre-defined error types for consistency
export class ValidationError extends APIError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends APIError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends APIError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

export class RateLimitError extends APIError {
  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', retryAfter ? { retryAfter } : undefined);
  }
}

export class InternalServerError extends APIError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
  }
}

// Add correlation ID to requests
export const addCorrelationId = (req: Request, res: Response, next: NextFunction): void => {
  const correlationId = req.headers['x-correlation-id'] as string || uuidv4();
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  next();
};

// Structured logging utility
export const logError = (error: Error, req: Request, additionalInfo?: any) => {
  const logData = {
    timestamp: new Date().toISOString(),
    correlationId: req.correlationId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof APIError && {
        code: error.code,
        statusCode: error.statusCode,
        details: error.details
      })
    },
    ...additionalInfo
  };

  if (error instanceof APIError && error.statusCode < 500) {
    console.warn('API Warning:', JSON.stringify(logData, null, 2));
  } else {
    console.error('API Error:', JSON.stringify(logData, null, 2));
  }
};

// Main error handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Set correlation ID if not already set
  if (!req.correlationId) {
    req.correlationId = uuidv4();
    res.setHeader('X-Correlation-ID', req.correlationId);
  }

  // Log the error
  logError(err, req);

  // Handle known API errors
  if (err instanceof APIError) {
    const errorResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        correlationId: req.correlationId,
        ...(err.details && { details: err.details }),
        ...(err.code === 'RATE_LIMIT_EXCEEDED' && err.details?.retryAfter && {
          retryAfter: err.details.retryAfter
        })
      }
    };

    res.status(err.statusCode).json(errorResponse);
    return;
  }

  // Handle express-validator errors
  if (err.name === 'ValidationError' || (err as any).errors) {
    const validationError = new ValidationError('Validation failed', (err as any).errors);
    const errorResponse = {
      success: false,
      error: {
        code: validationError.code,
        message: validationError.message,
        correlationId: req.correlationId,
        details: validationError.details
      }
    };

    res.status(validationError.statusCode).json(errorResponse);
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    const authError = new AuthenticationError('Invalid token');
    const errorResponse = {
      success: false,
      error: {
        code: authError.code,
        message: authError.message,
        correlationId: req.correlationId
      }
    };

    res.status(authError.statusCode).json(errorResponse);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    const authError = new AuthenticationError('Token expired');
    const errorResponse = {
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: authError.message,
        correlationId: req.correlationId
      }
    };

    res.status(authError.statusCode).json(errorResponse);
    return;
  }

  // Handle database errors (Prisma/PostgreSQL)
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    
    switch (prismaError.code) {
      case 'P2002': // Unique constraint violation
        const conflictError = new ConflictError('Resource already exists');
        const conflictResponse = {
          success: false,
          error: {
            code: conflictError.code,
            message: conflictError.message,
            correlationId: req.correlationId,
            details: {
              field: prismaError.meta?.target?.[0] || 'unknown'
            }
          }
        };
        res.status(conflictError.statusCode).json(conflictResponse);
        return;
        
      case 'P2025': // Record not found
        const notFoundError = new NotFoundError('Resource not found');
        const notFoundResponse = {
          success: false,
          error: {
            code: notFoundError.code,
            message: notFoundError.message,
            correlationId: req.correlationId
          }
        };
        res.status(notFoundError.statusCode).json(notFoundResponse);
        return;
    }
  }

  // Handle unknown errors (fallback)
  const internalError = new InternalServerError('An unexpected error occurred');
  const errorResponse = {
    success: false,
    error: {
      code: internalError.code,
      message: internalError.message,
      correlationId: req.correlationId,
      ...(process.env.NODE_ENV === 'development' && {
        details: {
          originalError: err.message,
          stack: err.stack
        }
      })
    }
  };

  res.status(internalError.statusCode).json(errorResponse);
};

// 404 handler for undefined routes
export const notFoundHandler = (req: Request, res: Response): void => {
  const correlationId = req.correlationId || uuidv4();
  res.setHeader('X-Correlation-ID', correlationId);
  
  const notFoundError = new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`);
  const errorResponse = {
    success: false,
    error: {
      code: notFoundError.code,
      message: notFoundError.message,
      correlationId
    }
  };

  res.status(notFoundError.statusCode).json(errorResponse);
};

// Async error wrapper for route handlers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Type augmentation for Express Request
declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
      user?: {
        id: string;
        email: string;
        [key: string]: any;
      };
    }
  }
}