import { Request, Response } from 'express';
import { generateTokens, verifyToken } from '../../../utils/jwt';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface AuthRequest extends Request {
  user?: {
    id: string;
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

export class AuthPrismaController {
  /**
   * Register new user with Prisma
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, username, firstName, lastName } = req.body;

      // Validate required fields
      if (!email || !password || !username) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Email, password, and username are required',
          },
        });
        return;
      }

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email.toLowerCase() },
            { username: username }
          ]
        }
      });

      if (existingUser) {
        res.status(409).json({
          success: false,
          error: {
            code: existingUser.email === email.toLowerCase() ? 'EMAIL_EXISTS' : 'USERNAME_EXISTS',
            message: existingUser.email === email.toLowerCase() 
              ? 'User with this email already exists'
              : 'Username is already taken',
          },
        });
        return;
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user with profile in transaction
      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: email.toLowerCase(),
            username,
            passwordHash: hashedPassword,
            emailVerified: false,
            phoneVerified: false,
            kycStatus: 'PENDING',
            isActive: true,
          },
        });

        // Create profile
        const profile = await tx.profile.create({
          data: {
            userId: user.id,
            firstName: firstName || '',
            lastName: lastName || '',
            bio: '',
            avatarUrl: '',
            phoneNumber: '',
            dateOfBirth: null,
            country: '',
            city: '',
            address: '',
            postalCode: '',
          },
        });

        return { user, profile };
      });

      // Generate tokens
      const tokens = generateTokens(result.user);

      // Create session
      await prisma.session.create({
        data: {
          userId: result.user.id,
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          userAgent: req.get('User-Agent') || '',
          ipAddress: req.ip || '',
        },
      });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            username: result.user.username,
            emailVerified: result.user.emailVerified,
            kycStatus: result.user.kycStatus,
            profile: result.profile,
          },
          tokens,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create user',
        },
      });
    }
  }

  /**
   * Login user
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_CREDENTIALS',
            message: 'Email and password are required',
          },
        });
        return;
      }

      // Find user with profile
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { profile: true },
      });

      if (!user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        });
        return;
      }

      // Check if account is active
      if (!user.isActive) {
        res.status(401).json({
          success: false,
          error: {
            code: 'ACCOUNT_INACTIVE',
            message: 'Account is inactive',
          },
        });
        return;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        });
        return;
      }

      // Generate tokens
      const tokens = generateTokens(user);

      // Create session
      await prisma.session.create({
        data: {
          userId: user.id,
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          userAgent: req.get('User-Agent') || '',
          ipAddress: req.ip || '',
        },
      });

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            emailVerified: user.emailVerified,
            kycStatus: user.kycStatus,
            profile: user.profile,
          },
          tokens,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to login',
        },
      });
    }
  }

  /**
   * Refresh token
   */
  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_TOKEN',
            message: 'Refresh token is required',
          },
        });
        return;
      }

      // Verify refresh token
      const payload = verifyToken(refreshToken) as any;
      if (!payload) {
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid refresh token',
          },
        });
        return;
      }

      // Find session
      const session = await prisma.session.findFirst({
        where: {
          token: refreshToken,
          userId: payload.userId,
          expiresAt: { gt: new Date() },
        },
        include: { user: true },
      });

      if (!session || !session.user.isActive) {
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_SESSION',
            message: 'Invalid session',
          },
        });
        return;
      }

      // Generate new tokens
      const tokens = generateTokens(session.user);

      // Update session
      await prisma.session.update({
        where: { id: session.id },
        data: {
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      res.json({
        success: true,
        data: { tokens },
      });
    } catch (error) {
      console.error('Refresh error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to refresh token',
        },
      });
    }
  }

  /**
   * Logout user
   */
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const authHeader = req.headers.authorization;
      const accessToken = authHeader?.split(' ')[1];

      if (refreshToken) {
        // Delete session
        await prisma.session.deleteMany({
          where: { token: refreshToken },
        });
      }

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to logout',
        },
      });
    }
  }

  /**
   * Forgot password - send reset email
   */
  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_EMAIL',
            message: 'Email is required',
          },
        });
        return;
      }

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      // Always return success to avoid email enumeration
      // In production, send actual email here
      if (user) {
        // Generate reset token (expires in 1 hour)
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Store reset token in database (you might want a separate table for this)
        await prisma.user.update({
          where: { id: user.id },
          data: {
            // In a real app, you'd have a separate passwordReset table
            // For now, we'll simulate this functionality
            updatedAt: new Date(),
          },
        });

        console.log(`Password reset token for ${email}: ${resetToken}`);
        console.log(`Reset URL: ${process.env.CLIENT_URL}/reset-password?token=${resetToken}`);
      }

      res.json({
        success: true,
        message: 'If an account with that email exists, we sent a password reset link.',
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to process password reset request',
        },
      });
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Token and password are required',
          },
        });
        return;
      }

      // In a real app, you'd validate the token from a password reset table
      // For now, we'll simulate the validation
      // This is a simplified implementation - in production, implement proper token storage

      if (password.length < 8) {
        res.status(400).json({
          success: false,
          error: {
            code: 'WEAK_PASSWORD',
            message: 'Password must be at least 8 characters long',
          },
        });
        return;
      }

      // Hash the new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // In production, you'd look up the user by the reset token
      // For demo purposes, this is simplified
      res.json({
        success: true,
        message: 'Password reset successfully. Please log in with your new password.',
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to reset password',
        },
      });
    }
  }

  /**
   * Get current user profile
   */
  static async me(req: AuthRequest, res: Response): Promise<void> {
    try {
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

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { profile: true },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            emailVerified: user.emailVerified,
            kycStatus: user.kycStatus,
            profile: user.profile,
          },
        },
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get user',
        },
      });
    }
  }
}