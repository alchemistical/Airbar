import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

// Health check endpoints
app.get('/api/health', async (req, res) => {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }
    res.json(health)
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Detailed health check with dependencies
app.get('/api/health/detailed', async (req, res) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: 'checking',
      redis: 'checking',
      api: 'ok'
    }
  }

  try {
    // Check database connectivity (implement when db is set up)
    // const dbCheck = await checkDatabase()
    healthCheck.services.database = 'ok' // placeholder
    
    // Check Redis connectivity (implement when redis is set up)  
    // const redisCheck = await checkRedis()
    healthCheck.services.redis = 'ok' // placeholder

    const allServicesOk = Object.values(healthCheck.services).every(status => status === 'ok')
    healthCheck.status = allServicesOk ? 'ok' : 'degraded'
    
    res.status(allServicesOk ? 200 : 503).json(healthCheck)
  } catch (error) {
    healthCheck.status = 'error'
    res.status(503).json({
      ...healthCheck,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Readiness probe
app.get('/api/ready', (req, res) => {
  res.json({ 
    status: 'ready',
    timestamp: new Date().toISOString()
  })
})

// Liveness probe  
app.get('/api/live', (req, res) => {
  res.json({
    status: 'alive', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API routes will be added here
// app.use('/api/auth', authRoutes)
// app.use('/api/trips', tripRoutes)
// app.use('/api/parcels', parcelRoutes)
// app.use('/api/booking', bookingRoutes)
// app.use('/api/wallet', walletRoutes)
// app.use('/api/chat', chatRoutes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/health`)
})