import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { loginAttempts } from '../shared/auth-schema';
import { eq, and, gte } from 'drizzle-orm';

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxAttempts: number; // Maximum attempts per window
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  keyGenerator?: (req: Request) => string; // Custom key generator
  message?: string; // Custom error message
}

/**
 * Rate limiter for authentication endpoints
 */
export const createRateLimiter = (options: RateLimitOptions) => {
  const {
    windowMs,
    maxAttempts,
    skipSuccessfulRequests = false,
    keyGenerator = (req: Request) => req.ip,
    message = 'Too many attempts, please try again later',
  } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = keyGenerator(req);
      const windowStart = new Date(Date.now() - windowMs);

      // Count recent attempts
      const attempts = await db
        .select()
        .from(loginAttempts)
        .where(
          and(
            eq(loginAttempts.ipAddress, key),
            gte(loginAttempts.createdAt, windowStart)
          )
        );

      // Filter out successful requests if configured
      const failedAttempts = skipSuccessfulRequests
        ? attempts.filter((attempt: any) => !attempt.success)
        : attempts;

      if (failedAttempts.length >= maxAttempts) {
        res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message,
            retryAfter: Math.ceil(windowMs / 1000),
          },
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Don't block request if rate limiter fails
      next();
    }
  };
};

/**
 * Log login attempt
 */
export const logLoginAttempt = async (
  req: Request,
  email: string,
  success: boolean,
  failureReason?: string
): Promise<void> => {
  try {
    await db.insert(loginAttempts).values({
      ipAddress: req.ip,
      email,
      userAgent: req.get('User-Agent'),
      success,
      failureReason,
    });
  } catch (error) {
    console.error('Failed to log login attempt:', error);
  }
};

/**
 * Rate limiter for login attempts
 */
export const loginRateLimit = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  maxAttempts: 5,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again in 10 minutes',
});

/**
 * Rate limiter for password reset
 */
export const passwordResetRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxAttempts: 3,
  keyGenerator: (req: Request) => req.body.email || req.ip,
  message: 'Too many password reset attempts, please try again in 1 hour',
});

/**
 * Rate limiter for registration
 */
export const registrationRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxAttempts: 3,
  message: 'Too many registration attempts, please try again in 1 hour',
});

/**
 * Rate limiter for OTP requests
 */
export const otpRateLimit = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxAttempts: 3,
  keyGenerator: (req: Request) => req.user?.email || req.ip || 'unknown',
  message: 'Too many OTP requests, please try again in 5 minutes',
});

/**
 * Rate limiter for email verification
 */
export const emailVerificationRateLimit = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxAttempts: 3,
  keyGenerator: (req: Request) => req.user?.email || req.ip || 'unknown',
  message: 'Too many verification requests, please try again in 5 minutes',
});

/**
 * General API rate limiter
 */
export const apiRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 100,
  message: 'Too many API requests, please try again later',
});

/**
 * Brute force protection middleware
 */
export const bruteForceProtection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return next();
    }

    const windowStart = new Date(Date.now() - 60 * 60 * 1000); // 1 hour
    
    // Count failed attempts for this email
    const failedAttempts = await db
      .select()
      .from(loginAttempts)
      .where(
        and(
          eq(loginAttempts.email, email),
          eq(loginAttempts.success, false),
          gte(loginAttempts.createdAt, windowStart)
        )
      );

    if (failedAttempts.length >= 10) {
      res.status(429).json({
        success: false,
        error: {
          code: 'ACCOUNT_TEMPORARILY_LOCKED',
          message: 'Account temporarily locked due to too many failed attempts',
          retryAfter: 3600, // 1 hour
        },
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Brute force protection error:', error);
    next();
  }
};