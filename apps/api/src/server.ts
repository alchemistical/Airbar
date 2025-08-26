import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec, generateOpenApiJson, generateOpenApiYaml } from './config/swagger'
import { addCorrelationId, errorHandler, notFoundHandler } from './middleware/errorHandler'
import { healthService, metricsMiddleware } from './services/healthService'
import { globalRateLimit, rateLimitBypass } from './middleware/advancedRateLimit'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(addCorrelationId) // Add correlation ID to all requests
app.use(metricsMiddleware) // Track requests for metrics
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rate limiting with bypass for admin/testing
app.use(rateLimitBypass)
app.use('/api/', globalRateLimit)

// Health check endpoints

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Basic health check
 *     description: |
 *       Returns basic system health information including uptime, version, and environment.
 *       This is a lightweight endpoint suitable for load balancer health checks.
 *     responses:
 *       200:
 *         description: System is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *             example:
 *               status: "ok"
 *               timestamp: "2024-01-01T12:00:00.000Z"
 *               uptime: 3600
 *               version: "1.0.0"
 *               environment: "development"
 *       503:
 *         description: System is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *             example:
 *               status: "error"
 *               timestamp: "2024-01-01T12:00:00.000Z"
 *               error: "Database connection failed"
 */
app.get('/api/health', async (req, res) => {
  try {
    const health = await healthService.getBasicHealth()
    const statusCode = health.status === 'ok' ? 200 : 503
    res.status(statusCode).json(health)
  } catch (error) {
    res.status(503).json({
      success: false,
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: error instanceof Error ? error.message : 'Health check failed',
        correlationId: req.correlationId
      }
    })
  }
})

/**
 * @swagger
 * /api/health/detailed:
 *   get:
 *     tags: [Health]
 *     summary: Detailed health check with service dependencies
 *     description: |
 *       Comprehensive health check that tests connectivity to all dependencies
 *       including database and Redis. This endpoint is slower but provides
 *       detailed service status information.
 *     responses:
 *       200:
 *         description: All services are healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       503:
 *         description: One or more services are unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get('/api/health/detailed', async (req, res) => {
  try {
    const health = await healthService.getDetailedHealth()
    const statusCode = health.status === 'ok' ? 200 : 503
    res.status(statusCode).json(health)
  } catch (error) {
    res.status(503).json({
      success: false,
      error: {
        code: 'DETAILED_HEALTH_CHECK_FAILED',
        message: error instanceof Error ? error.message : 'Detailed health check failed',
        correlationId: req.correlationId
      }
    })
  }
})

// Readiness probe (Kubernetes compatible)
app.get('/api/ready', async (req, res) => {
  try {
    const readiness = await healthService.getReadiness()
    const statusCode = readiness.ready ? 200 : 503
    res.status(statusCode).json({
      ready: readiness.ready,
      services: readiness.services,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(503).json({
      ready: false,
      error: error instanceof Error ? error.message : 'Readiness check failed',
      timestamp: new Date().toISOString()
    })
  }
})

// Liveness probe (Kubernetes compatible)
app.get('/api/live', (req, res) => {
  const liveness = healthService.getLiveness()
  res.json({
    alive: liveness.alive,
    uptime: liveness.uptime,
    timestamp: new Date().toISOString()
  })
})

// Metrics endpoint (Prometheus compatible)
app.get('/api/metrics', (req, res) => {
  try {
    const metrics = healthService.getMetrics()
    res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
    res.send(metrics)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'METRICS_ERROR',
        message: 'Failed to generate metrics',
        correlationId: req.correlationId
      }
    })
  }
})

// API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Airbar API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'list',
    filter: true,
    showRequestDuration: true
  }
}));

// OpenAPI spec endpoints
app.get('/api/openapi.json', generateOpenApiJson);
app.get('/api/openapi.yaml', generateOpenApiYaml);

// API routes
import authRoutes from './features/auth/routes/auth.routes'
import dashboardRoutes from './features/dashboard/routes/dashboard.routes'
import unifiedDashboardRoutes from './features/dashboard/routes/unified-dashboard.routes'

app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/dashboard', unifiedDashboardRoutes)

// Additional feature routes will be added here as they're implemented
// app.use('/api/trips', tripRoutes)
// app.use('/api/parcels', parcelRoutes)
// app.use('/api/booking', bookingRoutes)
// app.use('/api/wallet', walletRoutes)
// app.use('/api/chat', chatRoutes)

// Error handling middleware
app.use(errorHandler)

// 404 handler for undefined routes  
app.use('*', notFoundHandler)

app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/health`)
})