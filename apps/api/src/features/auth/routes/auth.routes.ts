/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';
import {
  loginRateLimit,
  passwordResetRateLimit,
  registrationRateLimit,
  otpRateLimit,
  bruteForceProtection,
} from '../../../middleware/rateLimiter';
import { body, validationResult } from 'express-validator';

const router = Router();

// Validation middleware
const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors.array(),
      },
    });
  }
  next();
};

// Registration validation
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
];

// Login validation
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Password reset validation
const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
];

const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

// OTP validation
const otpValidation = [
  body('code')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP code must be 6 digits'),
];

// Public routes

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user account
 *     description: |
 *       Creates a new user account with email, password, and username.
 *       
 *       **Rate Limiting:** 3 requests per hour per IP address
 *       
 *       **Password Requirements:**
 *       - Minimum 8 characters
 *       - At least one uppercase letter
 *       - At least one lowercase letter  
 *       - At least one number
 *       
 *       **Username Requirements:**
 *       - 3-30 characters
 *       - Letters, numbers, underscores, and hyphens only
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             example1:
 *               summary: Complete registration
 *               value:
 *                 email: "john.doe@example.com"
 *                 password: "SecurePass123"
 *                 username: "johndoe"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *             example2:
 *               summary: Minimal registration
 *               value:
 *                 email: "jane@example.com"
 *                 password: "MyPassword1"
 *                 username: "jane_smith"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               success: true
 *               data:
 *                 user:
 *                   id: "123e4567-e89b-12d3-a456-426614174000"
 *                   email: "john.doe@example.com"
 *                   username: "johndoe"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   emailVerified: false
 *                   phoneVerified: false
 *                   kycStatus: "PENDING"
 *                   isActive: true
 *                   createdAt: "2024-01-01T12:00:00.000Z"
 *                   updatedAt: "2024-01-01T12:00:00.000Z"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken: "refresh_token_here"
 *                 expiresIn: 3600
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Email or username already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "USER_ALREADY_EXISTS"
 *                 message: "Email or username already exists"
 *       429:
 *         $ref: '#/components/responses/RateLimitError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  '/register',
  registrationRateLimit,
  registerValidation,
  handleValidationErrors,
  AuthController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Authenticate user and obtain JWT token
 *     description: |
 *       Authenticates a user with email and password, returning JWT tokens for API access.
 *       
 *       **Rate Limiting:** 5 failed attempts per 10 minutes per IP address
 *       **Brute Force Protection:** Account locked after 10 failed attempts per hour
 *       
 *       The returned JWT token should be included in subsequent API requests:
 *       `Authorization: Bearer <token>`
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "john.doe@example.com"
 *             password: "SecurePass123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "INVALID_CREDENTIALS"
 *                 message: "Invalid email or password"
 *       429:
 *         description: Rate limit exceeded or account locked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               rate_limit:
 *                 summary: Rate limit exceeded
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "RATE_LIMIT_EXCEEDED"
 *                     message: "Too many login attempts, please try again in 10 minutes"
 *                     retryAfter: 600
 *               account_locked:
 *                 summary: Account temporarily locked
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "ACCOUNT_TEMPORARILY_LOCKED"
 *                     message: "Account temporarily locked due to too many failed attempts"
 *                     retryAfter: 3600
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  '/login',
  loginRateLimit,
  bruteForceProtection,
  loginValidation,
  handleValidationErrors,
  AuthController.login
);

router.post(
  '/refresh',
  AuthController.refreshToken
);

router.post(
  '/logout',
  AuthController.logout
);

router.post(
  '/forgot-password',
  passwordResetRateLimit,
  forgotPasswordValidation,
  handleValidationErrors,
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  resetPasswordValidation,
  handleValidationErrors,
  AuthController.resetPassword
);

router.post(
  '/verify-otp',
  otpRateLimit,
  otpValidation,
  handleValidationErrors,
  AuthController.verifyOTP
);

// Protected routes
router.get(
  '/me',
  authenticateToken,
  AuthController.getCurrentUser
);

router.get(
  '/sessions',
  authenticateToken,
  AuthController.getUserSessions
);

router.delete(
  '/sessions/:sessionId',
  authenticateToken,
  AuthController.revokeSession
);

// Request OTP for authenticated users
router.post(
  '/request-otp',
  authenticateToken,
  otpRateLimit,
  body('type')
    .isIn(['2fa', 'email_verify', 'password_reset'])
    .withMessage('Invalid OTP type'),
  handleValidationErrors,
  async (req: any, res: any) => {
    try {
      const { type } = req.body;
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        });
      }

      // Generate OTP code
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in database
      const { db } = require('../db');
      const { otpCodes } = require('../../shared/auth-schema');

      await db.insert(otpCodes).values({
        userId: user.id,
        code: otpCode,
        type,
        expiresAt,
        isUsed: false,
      });

      // In production, send OTP via email
      console.log(`OTP for ${user.email}: ${otpCode}`);

      res.status(200).json({
        success: true,
        data: {
          message: 'OTP sent successfully',
          // In development, return the code for testing
          ...(process.env.NODE_ENV === 'development' && { code: otpCode }),
        },
      });
    } catch (error) {
      console.error('Request OTP error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'OTP_REQUEST_FAILED',
          message: 'Failed to send OTP',
        },
      });
    }
  }
);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Auth service is healthy',
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;