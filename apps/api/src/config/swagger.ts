import swaggerJsdoc from 'swagger-jsdoc';
import { Request, Response } from 'express';

// OpenAPI 3.0 configuration
const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Airbar API',
      version: '1.0.0',
      description: `
        **Airbar Crowdshipping Platform API**
        
        A comprehensive API for the Airbar peer-to-peer crowdshipping platform that connects travelers with people who need packages delivered.
        
        ## Features
        - User authentication and authorization
        - Trip and package management  
        - Matching system for travelers and senders
        - Wallet and payment processing
        - Real-time chat functionality
        - Booking and escrow services
        
        ## Authentication
        This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
        \`Authorization: Bearer <your-jwt-token>\`
        
        ## Rate Limiting
        API endpoints are rate limited to prevent abuse:
        - General endpoints: 100 requests per 15 minutes per IP
        - Authentication endpoints: Various limits (see individual endpoints)
        - Authenticated users may have higher limits
        
        ## Error Handling
        All errors follow a consistent format with appropriate HTTP status codes and detailed error information.
      `,
      contact: {
        name: 'Airbar API Support',
        email: 'api-support@airbar.com',
        url: 'https://docs.airbar.com'
      },
      license: {
        name: 'Proprietary',
        url: 'https://airbar.com/terms'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'https://api-staging.airbar.com',
        description: 'Staging server'
      },
      {
        url: 'https://api.airbar.com', 
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from login endpoint'
        },
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for service-to-service authentication'
        }
      },
      schemas: {
        // Common response schemas
        SuccessResponse: {
          type: 'object',
          required: ['success', 'data'],
          properties: {
            success: {
              type: 'boolean',
              example: true,
              description: 'Indicates if the request was successful'
            },
            data: {
              type: 'object',
              description: 'Response data payload'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          required: ['success', 'error'],
          properties: {
            success: {
              type: 'boolean',
              example: false,
              description: 'Always false for error responses'
            },
            error: {
              type: 'object',
              required: ['code', 'message'],
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR',
                  description: 'Machine-readable error code'
                },
                message: {
                  type: 'string',
                  example: 'Validation failed',
                  description: 'Human-readable error message'
                },
                details: {
                  type: 'object',
                  description: 'Additional error context (validation errors, etc.)'
                },
                correlationId: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Unique request identifier for tracing'
                },
                retryAfter: {
                  type: 'integer',
                  description: 'Seconds to wait before retrying (rate limiting)'
                }
              }
            }
          }
        },
        // User schemas
        User: {
          type: 'object',
          required: ['id', 'email', 'username'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique user identifier'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 30,
              pattern: '^[a-zA-Z0-9_-]+$',
              description: 'Unique username'
            },
            firstName: {
              type: 'string',
              maxLength: 50,
              description: 'User first name (optional)'
            },
            lastName: {
              type: 'string',
              maxLength: 50,
              description: 'User last name (optional)'
            },
            emailVerified: {
              type: 'boolean',
              description: 'Whether email is verified'
            },
            phoneVerified: {
              type: 'boolean',
              description: 'Whether phone is verified'
            },
            kycStatus: {
              type: 'string',
              enum: ['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'],
              description: 'Know Your Customer verification status'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether user account is active'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account last update timestamp'
            }
          }
        },
        // Authentication schemas
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              minLength: 8,
              description: 'User password'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'username'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              minLength: 8,
              pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)',
              description: 'Password (min 8 chars, must contain uppercase, lowercase, and number)'
            },
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 30,
              pattern: '^[a-zA-Z0-9_-]+$',
              description: 'Unique username'
            },
            firstName: {
              type: 'string',
              maxLength: 50,
              description: 'First name (optional)'
            },
            lastName: {
              type: 'string',
              maxLength: 50,
              description: 'Last name (optional)'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          required: ['success', 'data'],
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              required: ['user', 'token', 'refreshToken'],
              properties: {
                user: {
                  '$ref': '#/components/schemas/User'
                },
                token: {
                  type: 'string',
                  description: 'JWT access token'
                },
                refreshToken: {
                  type: 'string',
                  description: 'Refresh token for obtaining new access tokens'
                },
                expiresIn: {
                  type: 'integer',
                  description: 'Token expiration time in seconds'
                }
              }
            }
          }
        },
        // Health check schemas
        HealthResponse: {
          type: 'object',
          required: ['status', 'timestamp'],
          properties: {
            status: {
              type: 'string',
              enum: ['ok', 'degraded', 'error'],
              description: 'Overall system health status'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Health check timestamp'
            },
            uptime: {
              type: 'number',
              description: 'System uptime in seconds'
            },
            version: {
              type: 'string',
              description: 'API version'
            },
            environment: {
              type: 'string',
              enum: ['development', 'staging', 'production'],
              description: 'Current environment'
            },
            services: {
              type: 'object',
              properties: {
                database: {
                  type: 'string',
                  enum: ['ok', 'checking', 'error'],
                  description: 'Database connectivity status'
                },
                redis: {
                  type: 'string',
                  enum: ['ok', 'checking', 'error'],
                  description: 'Redis connectivity status'
                },
                api: {
                  type: 'string',
                  enum: ['ok', 'error'],
                  description: 'API service status'
                }
              }
            }
          }
        }
      },
      parameters: {
        CorrelationId: {
          name: 'X-Correlation-ID',
          in: 'header',
          required: false,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'Optional correlation ID for request tracing'
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                '$ref': '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                error: {
                  code: 'UNAUTHORIZED',
                  message: 'Authentication required',
                  correlationId: '123e4567-e89b-12d3-a456-426614174000'
                }
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                '$ref': '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                error: {
                  code: 'FORBIDDEN',
                  message: 'Insufficient permissions',
                  correlationId: '123e4567-e89b-12d3-a456-426614174000'
                }
              }
            }
          }
        },
        ValidationError: {
          description: 'Input validation failed',
          content: {
            'application/json': {
              schema: {
                '$ref': '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                error: {
                  code: 'VALIDATION_ERROR',
                  message: 'Validation failed',
                  details: [
                    {
                      field: 'email',
                      message: 'Valid email is required'
                    },
                    {
                      field: 'password',
                      message: 'Password must be at least 8 characters'
                    }
                  ],
                  correlationId: '123e4567-e89b-12d3-a456-426614174000'
                }
              }
            }
          }
        },
        RateLimitError: {
          description: 'Rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                '$ref': '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                error: {
                  code: 'RATE_LIMIT_EXCEEDED',
                  message: 'Too many requests, please try again later',
                  retryAfter: 900,
                  correlationId: '123e4567-e89b-12d3-a456-426614174000'
                }
              }
            }
          }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                '$ref': '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                error: {
                  code: 'INTERNAL_SERVER_ERROR',
                  message: 'An unexpected error occurred',
                  correlationId: '123e4567-e89b-12d3-a456-426614174000'
                }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Users',
        description: 'User management and profile operations'
      },
      {
        name: 'Trips',
        description: 'Trip creation and management'
      },
      {
        name: 'Packages',
        description: 'Package and parcel management'
      },
      {
        name: 'Booking',
        description: 'Booking and matching system'
      },
      {
        name: 'Wallet',
        description: 'Payment and wallet operations'
      },
      {
        name: 'Chat',
        description: 'Real-time messaging system'
      },
      {
        name: 'Health',
        description: 'System health and monitoring endpoints'
      }
    ]
  },
  apis: [
    './src/features/*/routes/*.ts',
    './src/server.ts',
    './src/routes/*.ts'
  ]
};

export const swaggerSpec = swaggerJsdoc(options);

// Generate OpenAPI JSON for external tools
export const generateOpenApiJson = (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerSpec);
};

// Generate OpenAPI YAML for external tools
export const generateOpenApiYaml = (req: Request, res: Response) => {
  const YAML = require('yamljs');
  const yamlString = YAML.stringify(swaggerSpec, 4);
  res.setHeader('Content-Type', 'application/x-yaml');
  res.send(yamlString);
};