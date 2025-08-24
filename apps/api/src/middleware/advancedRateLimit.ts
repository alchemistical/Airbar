import { Request, Response, NextFunction } from 'express';
import { createClient } from 'redis';
import { RateLimitError } from './errorHandler';

interface RateLimitConfig {
  windowMs: number;           // Time window in milliseconds
  maxRequests: number;        // Max requests per window
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  message?: string;
  headers?: boolean;          // Include rate limit headers
  tier?: string;             // Rate limit tier name
}

interface UserTier {
  name: string;
  limits: {
    global: number;           // Global requests per hour
    perEndpoint: number;      // Per endpoint requests per hour  
    authentication: number;   // Auth endpoint requests per hour
  };
}

// User tier configurations
export const USER_TIERS: Record<string, UserTier> = {
  free: {
    name: 'Free',
    limits: {
      global: 1000,          // 1k requests/hour
      perEndpoint: 100,      // 100/hour per endpoint
      authentication: 10     // 10 auth requests/hour
    }
  },
  premium: {
    name: 'Premium',
    limits: {
      global: 5000,          // 5k requests/hour  
      perEndpoint: 500,      // 500/hour per endpoint
      authentication: 50     // 50 auth requests/hour
    }
  },
  business: {
    name: 'Business',
    limits: {
      global: 20000,         // 20k requests/hour
      perEndpoint: 2000,     // 2k/hour per endpoint
      authentication: 200    // 200 auth requests/hour
    }
  },
  admin: {
    name: 'Admin',
    limits: {
      global: 100000,        // 100k requests/hour
      perEndpoint: 10000,    // 10k/hour per endpoint  
      authentication: 1000   // 1k auth requests/hour
    }
  }
};

class RedisRateLimiter {
  private redis: any;
  private connected: boolean = false;

  constructor() {
    this.initializeRedis();
  }

  private async initializeRedis() {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      this.redis = createClient({ url: redisUrl });
      
      this.redis.on('error', (err: Error) => {
        console.error('Redis connection error:', err);
        this.connected = false;
      });

      this.redis.on('connect', () => {
        console.log('Redis connected for rate limiting');
        this.connected = true;
      });

      await this.redis.connect();
    } catch (error) {
      console.error('Failed to initialize Redis for rate limiting:', error);
      this.connected = false;
    }
  }

  async checkRateLimit(key: string, windowMs: number, maxRequests: number): Promise<{
    allowed: boolean;
    count: number;
    resetTime: number;
    remaining: number;
  }> {
    if (!this.connected) {
      // Fallback: allow request if Redis is down
      console.warn('Redis not connected, allowing request (fallback mode)');
      return {
        allowed: true,
        count: 0,
        resetTime: Date.now() + windowMs,
        remaining: maxRequests
      };
    }

    try {
      const now = Date.now();
      const window = Math.floor(now / windowMs);
      const redisKey = `rate_limit:${key}:${window}`;

      // Use sliding window with Redis
      const pipeline = this.redis.multi();
      pipeline.incr(redisKey);
      pipeline.expire(redisKey, Math.ceil(windowMs / 1000));
      const results = await pipeline.exec();
      
      const count = results[0][1];
      const resetTime = (window + 1) * windowMs;
      const remaining = Math.max(0, maxRequests - count);

      return {
        allowed: count <= maxRequests,
        count,
        resetTime,
        remaining
      };
    } catch (error) {
      console.error('Rate limit check error:', error);
      // Fallback: allow request if Redis check fails
      return {
        allowed: true,
        count: 0,
        resetTime: Date.now() + windowMs,
        remaining: maxRequests
      };
    }
  }
}

const rateLimiter = new RedisRateLimiter();

// Enhanced rate limiting middleware
export const createAdvancedRateLimit = (config: RateLimitConfig) => {
  const {
    windowMs,
    maxRequests,
    keyGenerator = (req: Request) => req.ip || 'unknown',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    message = 'Too many requests',
    headers = true,
    tier = 'default'
  } = config;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Check if rate limiting is bypassed
      if ((req as any).rateLimitBypassed) {
        res.setHeader('X-RateLimit-Bypassed', 'true');
        next();
        return;
      }

      const key = keyGenerator(req);
      const rateLimitKey = `${tier}:${key}`;

      const result = await rateLimiter.checkRateLimit(
        rateLimitKey,
        windowMs,
        maxRequests
      );

      // Add rate limit headers
      if (headers) {
        res.setHeader('X-RateLimit-Limit', maxRequests);
        res.setHeader('X-RateLimit-Remaining', result.remaining);
        res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000));
        res.setHeader('X-RateLimit-Window', Math.ceil(windowMs / 1000));
        res.setHeader('X-RateLimit-Tier', tier);
      }

      if (!result.allowed) {
        const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
        res.setHeader('Retry-After', retryAfter);
        
        throw new RateLimitError(message, retryAfter);
      }

      next();
    } catch (error) {
      if (error instanceof RateLimitError) {
        next(error);
        return;
      }
      console.error('Rate limiting error:', error);
      // Continue on rate limiter errors (fail open)
      next();
    }
  };
};

// User-tier based rate limiting
export const createUserTierRateLimit = (limitType: 'global' | 'perEndpoint' | 'authentication') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get user tier from request (set by auth middleware)
      const userTier = (req.user as any)?.tier || 'free';
      const tierConfig = USER_TIERS[userTier] || USER_TIERS.free;
      
      const limit = tierConfig.limits[limitType];
      const windowMs = 60 * 60 * 1000; // 1 hour window
      
      const keyGenerator = (req: Request) => {
        const userId = req.user?.id || req.ip || 'anonymous';
        return `${limitType}:${userId}`;
      };

      const rateLimitMiddleware = createAdvancedRateLimit({
        windowMs,
        maxRequests: limit,
        keyGenerator,
        message: `${tierConfig.name} tier limit exceeded for ${limitType}`,
        tier: `user_${userTier}_${limitType}`
      });

      await rateLimitMiddleware(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// Endpoint-specific rate limiting
export const endpointRateLimit = (endpoint: string, maxRequests: number, windowMs: number) => {
  return createAdvancedRateLimit({
    windowMs,
    maxRequests,
    keyGenerator: (req: Request) => {
      const userId = req.user?.id || req.ip || 'anonymous';
      return `endpoint:${endpoint}:${userId}`;
    },
    message: `Too many requests to ${endpoint}`,
    tier: `endpoint_${endpoint}`
  });
};

// Global IP-based rate limiting
export const globalRateLimit = createAdvancedRateLimit({
  windowMs: 15 * 60 * 1000,    // 15 minutes
  maxRequests: 5000,            // 5000 requests per 15 min (increased for development)
  keyGenerator: (req: Request) => `global:${req.ip}`,
  message: 'Global rate limit exceeded',
  tier: 'global'
});

// Authentication rate limiting (stricter)
export const authRateLimit = createAdvancedRateLimit({
  windowMs: 60 * 60 * 1000,     // 1 hour
  maxRequests: 20,              // 20 auth attempts per hour
  keyGenerator: (req: Request) => `auth:${req.ip}`,
  message: 'Authentication rate limit exceeded',
  tier: 'auth'
});

// Expensive operation rate limiting
export const expensiveOperationRateLimit = createAdvancedRateLimit({
  windowMs: 60 * 60 * 1000,     // 1 hour
  maxRequests: 10,              // 10 expensive ops per hour
  keyGenerator: (req: Request) => {
    const userId = req.user?.id || req.ip || 'anonymous';
    return `expensive:${userId}`;
  },
  message: 'Expensive operation rate limit exceeded',
  tier: 'expensive'
});

// Rate limit bypass for admin users
export const rateLimitBypass = (req: Request, res: Response, next: NextFunction): void => {
  // Check if user has admin role or bypass token
  const userRole = (req.user as any)?.role;
  const bypassToken = req.headers['x-ratelimit-bypass'] as string;
  const validBypassToken = process.env.RATE_LIMIT_BYPASS_TOKEN;

  if (userRole === 'admin' || (validBypassToken && bypassToken === validBypassToken)) {
    // Add bypass headers
    res.setHeader('X-RateLimit-Bypassed', 'true');
    res.setHeader('X-RateLimit-Bypass-Reason', userRole === 'admin' ? 'admin_role' : 'bypass_token');
    
    // Skip all rate limiting
    (req as any).rateLimitBypassed = true;
  }
  
  next();
};

// Rate limit monitoring and metrics
export const getRateLimitStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = {
      redis: {
        connected: rateLimiter['connected']
      },
      tiers: USER_TIERS,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_STATS_ERROR',
        message: 'Failed to retrieve rate limit statistics'
      }
    });
  }
};

export { rateLimiter };