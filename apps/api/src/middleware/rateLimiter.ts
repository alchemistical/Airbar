// Simplified rate limiter for testing Prisma connection
import { Request, Response, NextFunction } from 'express';

interface RateLimitOptions {
  windowMs: number;
  maxAttempts: number;
  message?: string;
}

// In-memory store for testing (would use Redis in production)
const attemptStore: Map<string, { count: number; resetTime: number }> = new Map();

export const createRateLimiter = (options: RateLimitOptions) => {
  const { windowMs, maxAttempts, message = 'Too many attempts, please try again later' } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = req.ip || 'unknown';
      const now = Date.now();
      
      const attempts = attemptStore.get(key);
      
      if (!attempts || now > attempts.resetTime) {
        attemptStore.set(key, { count: 1, resetTime: now + windowMs });
        return next();
      }
      
      if (attempts.count >= maxAttempts) {
        res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message,
            retryAfter: Math.ceil((attempts.resetTime - now) / 1000),
          },
        });
        return;
      }
      
      attempts.count += 1;
      next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      next();
    }
  };
};

export const loginRateLimit = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  maxAttempts: 5,
  message: 'Too many login attempts, please try again in 10 minutes',
});

export const apiRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 100,
  message: 'Too many API requests, please try again later',
});

export const passwordResetRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxAttempts: 3,
  message: 'Too many password reset attempts, please try again in 1 hour',
});

export const registrationRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxAttempts: 3,
  message: 'Too many registration attempts, please try again in 1 hour',
});

export const otpRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5,
  message: 'Too many OTP requests, please try again in 15 minutes',
});

// Simplified logging function
export const logLoginAttempt = async (
  req: Request,
  email: string,
  success: boolean,
  failureReason?: string
): Promise<void> => {
  console.log('Login attempt:', { email, success, ip: req.ip, failureReason });
};

// Simplified brute force protection
export const bruteForceProtection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(); // Skip for now
};