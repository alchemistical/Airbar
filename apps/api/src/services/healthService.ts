import { createClient } from 'redis';
import { prisma } from '@airbar/db';

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    api: ServiceHealth;
    database: ServiceHealth;
    redis: ServiceHealth;
  };
  metrics?: SystemMetrics;
}

export interface ServiceHealth {
  status: 'ok' | 'degraded' | 'error';
  responseTime?: number;
  lastChecked: string;
  error?: string;
  details?: any;
}

export interface SystemMetrics {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
  };
  requests: {
    total: number;
    perSecond: number;
    errors: number;
    errorRate: number;
  };
}

class HealthService {
  private redis: any;
  private redisConnected: boolean = false;
  private startTime: number = Date.now();
  private requestCount: number = 0;
  private errorCount: number = 0;

  constructor() {
    this.initializeRedis();
  }

  private async initializeRedis() {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      this.redis = createClient({ url: redisUrl });
      
      this.redis.on('error', (err: Error) => {
        console.error('Redis health check connection error:', err);
        this.redisConnected = false;
      });

      this.redis.on('connect', () => {
        console.log('Redis connected for health checks');
        this.redisConnected = true;
      });

      await this.redis.connect();
    } catch (error) {
      console.error('Failed to initialize Redis for health checks:', error);
      this.redisConnected = false;
    }
  }

  // Increment request counters
  public recordRequest(isError: boolean = false) {
    this.requestCount++;
    if (isError) {
      this.errorCount++;
    }
  }

  // Check database connectivity
  private async checkDatabase(): Promise<ServiceHealth> {
    const startTime = Date.now();
    
    try {
      // Simple database query to test connectivity
      await prisma.$queryRaw`SELECT 1 as health_check`;
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'ok',
        responseTime,
        lastChecked: new Date().toISOString(),
        details: {
          connection: 'active',
          provider: 'postgresql'
        }
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'error',
        responseTime,
        lastChecked: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown database error',
        details: {
          connection: 'failed',
          provider: 'postgresql'
        }
      };
    }
  }

  // Check Redis connectivity
  private async checkRedis(): Promise<ServiceHealth> {
    const startTime = Date.now();
    
    if (!this.redis || !this.redisConnected) {
      return {
        status: 'error',
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        error: 'Redis client not connected',
        details: {
          connection: 'failed'
        }
      };
    }

    try {
      // Test Redis with a simple ping
      const pong = await this.redis.ping();
      const responseTime = Date.now() - startTime;
      
      if (pong === 'PONG') {
        return {
          status: 'ok',
          responseTime,
          lastChecked: new Date().toISOString(),
          details: {
            connection: 'active',
            ping: 'success'
          }
        };
      } else {
        return {
          status: 'degraded',
          responseTime,
          lastChecked: new Date().toISOString(),
          error: 'Redis ping returned unexpected response',
          details: {
            connection: 'degraded',
            ping: pong
          }
        };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'error',
        responseTime,
        lastChecked: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown Redis error',
        details: {
          connection: 'failed'
        }
      };
    }
  }

  // Get system metrics
  private getSystemMetrics(): SystemMetrics {
    const memUsage = process.memoryUsage();
    const uptime = Date.now() - this.startTime;
    const requestsPerSecond = this.requestCount / (uptime / 1000);
    const errorRate = this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0;

    return {
      memory: {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
        percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100
      },
      cpu: {
        usage: process.cpuUsage().user / 1000000 // Convert to seconds
      },
      requests: {
        total: this.requestCount,
        perSecond: Math.round(requestsPerSecond * 100) / 100,
        errors: this.errorCount,
        errorRate: Math.round(errorRate * 100) / 100
      }
    };
  }

  // Basic health check (fast)
  public async getBasicHealth(): Promise<HealthStatus> {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();
    const version = process.env.npm_package_version || '1.0.0';
    const environment = process.env.NODE_ENV || 'development';

    return {
      status: 'ok',
      timestamp,
      uptime,
      version,
      environment,
      services: {
        api: {
          status: 'ok',
          lastChecked: timestamp
        },
        database: {
          status: 'ok',
          lastChecked: timestamp
        },
        redis: {
          status: this.redisConnected ? 'ok' : 'error',
          lastChecked: timestamp,
          ...(this.redisConnected ? {} : { error: 'Not connected' })
        }
      }
    };
  }

  // Comprehensive health check (slower but detailed)
  public async getDetailedHealth(): Promise<HealthStatus> {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();
    const version = process.env.npm_package_version || '1.0.0';
    const environment = process.env.NODE_ENV || 'development';

    // Run all health checks in parallel
    const [databaseHealth, redisHealth] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis()
    ]);

    const apiHealth: ServiceHealth = {
      status: 'ok',
      lastChecked: timestamp,
      details: {
        uptime: uptime,
        pid: process.pid,
        nodeVersion: process.version
      }
    };

    // Determine overall status
    const services = { api: apiHealth, database: databaseHealth, redis: redisHealth };
    const allStatuses = Object.values(services).map(service => service.status);
    
    let overallStatus: 'ok' | 'degraded' | 'error';
    if (allStatuses.includes('error')) {
      overallStatus = 'error';
    } else if (allStatuses.includes('degraded')) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'ok';
    }

    return {
      status: overallStatus,
      timestamp,
      uptime,
      version,
      environment,
      services,
      metrics: this.getSystemMetrics()
    };
  }

  // Readiness check (for Kubernetes)
  public async getReadiness(): Promise<{ ready: boolean; services: string[] }> {
    try {
      const [databaseHealth, redisHealth] = await Promise.all([
        this.checkDatabase(),
        this.checkRedis()
      ]);

      const readyServices: string[] = [];
      const notReadyServices: string[] = [];

      if (databaseHealth.status === 'ok') {
        readyServices.push('database');
      } else {
        notReadyServices.push('database');
      }

      if (redisHealth.status === 'ok') {
        readyServices.push('redis');
      } else {
        notReadyServices.push('redis');
      }

      // API is ready if database is working (Redis is optional for core functionality)
      const ready = databaseHealth.status === 'ok';

      return {
        ready,
        services: ready ? readyServices : notReadyServices
      };
    } catch (error) {
      return {
        ready: false,
        services: ['error checking services']
      };
    }
  }

  // Liveness check (for Kubernetes)
  public getLiveness(): { alive: boolean; uptime: number } {
    return {
      alive: true,
      uptime: process.uptime()
    };
  }

  // Metrics endpoint (Prometheus-compatible format)
  public getMetrics(): string {
    const metrics = this.getSystemMetrics();
    const uptime = process.uptime();
    
    // Prometheus format metrics
    const prometheusMetrics = `
# HELP airbar_api_uptime_seconds API uptime in seconds
# TYPE airbar_api_uptime_seconds gauge
airbar_api_uptime_seconds ${uptime}

# HELP airbar_api_requests_total Total number of API requests
# TYPE airbar_api_requests_total counter
airbar_api_requests_total ${metrics.requests.total}

# HELP airbar_api_requests_per_second Current requests per second
# TYPE airbar_api_requests_per_second gauge  
airbar_api_requests_per_second ${metrics.requests.perSecond}

# HELP airbar_api_errors_total Total number of API errors
# TYPE airbar_api_errors_total counter
airbar_api_errors_total ${metrics.requests.errors}

# HELP airbar_api_error_rate_percent Current error rate percentage
# TYPE airbar_api_error_rate_percent gauge
airbar_api_error_rate_percent ${metrics.requests.errorRate}

# HELP airbar_api_memory_used_bytes Memory usage in bytes
# TYPE airbar_api_memory_used_bytes gauge
airbar_api_memory_used_bytes ${metrics.memory.used}

# HELP airbar_api_memory_usage_percent Memory usage percentage
# TYPE airbar_api_memory_usage_percent gauge
airbar_api_memory_usage_percent ${metrics.memory.percentage}

# HELP airbar_api_database_status Database health status (1=ok, 0=error)
# TYPE airbar_api_database_status gauge
airbar_api_database_status 1

# HELP airbar_api_redis_status Redis health status (1=ok, 0=error)  
# TYPE airbar_api_redis_status gauge
airbar_api_redis_status ${this.redisConnected ? 1 : 0}
`.trim();

    return prometheusMetrics;
  }

  // Graceful shutdown
  public async shutdown(): Promise<void> {
    console.log('Starting graceful shutdown...');
    
    try {
      // Close Redis connection
      if (this.redis && this.redisConnected) {
        await this.redis.quit();
        console.log('Redis connection closed');
      }

      // Close database connection
      await prisma.$disconnect();
      console.log('Database connection closed');
      
      console.log('Graceful shutdown completed');
    } catch (error) {
      console.error('Error during graceful shutdown:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const healthService = new HealthService();

// Middleware to track requests for metrics
export const metricsMiddleware = (req: any, res: any, next: any) => {
  const originalSend = res.send;
  
  res.send = function(body: any) {
    const isError = res.statusCode >= 400;
    healthService.recordRequest(isError);
    return originalSend.call(this, body);
  };
  
  next();
};