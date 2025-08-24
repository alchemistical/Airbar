import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../utils/jwt';
import { db } from '../db';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        avatar: string;
        role: string;
        isKYCVerified: boolean;
        emailVerified: boolean;
        twoFactorEnabled: boolean;
        sessionId: string;
      };
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Access token is required',
        },
      });
      return;
    }

    // Verify token
    const payload = JWTService.verifyAccessToken(token);

    // Get user from database
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user.length) {
      res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
      return;
    }

    // Check if user account is locked
    if (user[0].accountLocked) {
      res.status(401).json({
        success: false,
        error: {
          code: 'ACCOUNT_LOCKED',
          message: 'Account is locked',
        },
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: user[0].id,
      email: user[0].email,
      username: user[0].username,
      firstName: user[0].firstName,
      lastName: user[0].lastName,
      avatar: user[0].avatar,
      role: user[0].role,
      isKYCVerified: user[0].isKYCVerified,
      emailVerified: user[0].emailVerified,
      twoFactorEnabled: user[0].twoFactorEnabled,
      sessionId: payload.sessionId,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
      },
    });
  }
};

/**
 * Middleware to check if user has required role
 */
export const requireRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    const userRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!userRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Insufficient permissions',
        },
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to check if email is verified
 */
export const requireEmailVerification = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    });
    return;
  }

  if (!req.user.emailVerified) {
    res.status(403).json({
      success: false,
      error: {
        code: 'EMAIL_NOT_VERIFIED',
        message: 'Email verification required',
      },
    });
    return;
  }

  next();
};

/**
 * Middleware to check if KYC is verified
 */
export const requireKYCVerification = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    });
    return;
  }

  if (!req.user.isKYCVerified) {
    res.status(403).json({
      success: false,
      error: {
        code: 'KYC_NOT_VERIFIED',
        message: 'KYC verification required',
      },
    });
    return;
  }

  next();
};

/**
 * Optional authentication middleware
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    // Verify token
    const payload = JWTService.verifyAccessToken(token);

    // Get user from database
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (user.length && !user[0].accountLocked) {
      req.user = {
        id: user[0].id,
        email: user[0].email,
        username: user[0].username,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        avatar: user[0].avatar,
        role: user[0].role,
        isKYCVerified: user[0].isKYCVerified,
        emailVerified: user[0].emailVerified,
        twoFactorEnabled: user[0].twoFactorEnabled,
        sessionId: payload.sessionId,
      };
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user
    next();
  }
};