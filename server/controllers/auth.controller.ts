import { Request, Response } from 'express';
import { JWTService } from '../utils/jwt';
import { db } from '../db';
import { users } from '../../shared/schema';
import { sessions, otpCodes, oauthAccounts } from '../../shared/auth-schema';
import { eq, and, gt, lt } from 'drizzle-orm';
import { logLoginAttempt } from '../middleware/rateLimiter';
import crypto from 'crypto';

export interface AuthRequest extends Request {
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

export class AuthController {
  /**
   * Register new user
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
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        await logLoginAttempt(req, email, false, 'USER_EXISTS');
        res.status(409).json({
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'User with this email already exists',
          },
        });
        return;
      }

      // Check username availability
      const existingUsername = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      if (existingUsername.length > 0) {
        res.status(409).json({
          success: false,
          error: {
            code: 'USERNAME_EXISTS',
            message: 'Username is already taken',
          },
        });
        return;
      }

      // Hash password
      const passwordHash = await JWTService.hashPassword(password);

      // Create user
      const newUser = await db
        .insert(users)
        .values({
          email,
          username,
          firstName: firstName || null,
          lastName: lastName || null,
          passwordHash,
          role: 'both',
          isKYCVerified: false,
          emailVerified: false,
          twoFactorEnabled: false,
          accountLocked: false,
          failedLoginAttempts: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      // Generate tokens
      const tokenPair = await JWTService.generateTokenPair(
        newUser[0].id,
        newUser[0].email,
        newUser[0].role,
        req.get('User-Agent'),
        req.ip,
        {
          platform: req.get('sec-ch-ua-platform'),
          mobile: req.get('sec-ch-ua-mobile'),
        }
      );

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', tokenPair.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Log successful registration
      await logLoginAttempt(req, email, true);

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: newUser[0].id,
            email: newUser[0].email,
            username: newUser[0].username,
            firstName: newUser[0].firstName,
            lastName: newUser[0].lastName,
            avatar: newUser[0].avatar,
            role: newUser[0].role,
            isKYCVerified: newUser[0].isKYCVerified,
            emailVerified: newUser[0].emailVerified,
            twoFactorEnabled: newUser[0].twoFactorEnabled,
            createdAt: newUser[0].createdAt,
          },
          accessToken: tokenPair.accessToken,
          needsEmailVerification: true,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: 'Registration failed',
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

      // Find user
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user.length) {
        await logLoginAttempt(req, email, false, 'USER_NOT_FOUND');
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        });
        return;
      }

      const foundUser = user[0];

      // Check if account is locked
      if (foundUser.accountLocked) {
        await logLoginAttempt(req, email, false, 'ACCOUNT_LOCKED');
        res.status(401).json({
          success: false,
          error: {
            code: 'ACCOUNT_LOCKED',
            message: 'Account is locked due to too many failed attempts',
          },
        });
        return;
      }

      // Verify password
      const isValidPassword = await JWTService.verifyPassword(password, foundUser.passwordHash);

      if (!isValidPassword) {
        // Increment failed attempts
        await db
          .update(users)
          .set({
            failedLoginAttempts: (foundUser.failedLoginAttempts || 0) + 1,
            lastFailedLogin: new Date(),
          })
          .where(eq(users.id, foundUser.id));

        // Lock account if too many failed attempts
        if ((foundUser.failedLoginAttempts || 0) >= 4) {
          await db
            .update(users)
            .set({
              accountLocked: true,
            })
            .where(eq(users.id, foundUser.id));
        }

        await logLoginAttempt(req, email, false, 'INVALID_PASSWORD');
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        });
        return;
      }

      // Reset failed attempts on successful login
      await db
        .update(users)
        .set({
          failedLoginAttempts: 0,
          lastFailedLogin: null,
          lastLoginAt: new Date(),
        })
        .where(eq(users.id, foundUser.id));

      // Check if 2FA is enabled and this is a new device
      const requiresOTP = foundUser.twoFactorEnabled && await AuthController.isNewDevice(req, foundUser.id);

      if (requiresOTP) {
        // Generate and store OTP
        const otpCode = JWTService.generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await db.insert(otpCodes).values({
          userId: foundUser.id,
          code: otpCode,
          type: 'login',
          expiresAt,
          isUsed: false,
        });

        // In production, send OTP via email
        console.log(`OTP for ${email}: ${otpCode}`);

        res.status(200).json({
          success: true,
          data: {
            needsOTP: true,
            message: 'OTP sent to your email',
          },
        });
        return;
      }

      // Generate tokens
      const tokenPair = await JWTService.generateTokenPair(
        foundUser.id,
        foundUser.email,
        foundUser.role,
        req.get('User-Agent'),
        req.ip,
        {
          platform: req.get('sec-ch-ua-platform'),
          mobile: req.get('sec-ch-ua-mobile'),
        }
      );

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', tokenPair.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Log successful login
      await logLoginAttempt(req, email, true);

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: foundUser.id,
            email: foundUser.email,
            username: foundUser.username,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            avatar: foundUser.avatar,
            role: foundUser.role,
            isKYCVerified: foundUser.isKYCVerified,
            emailVerified: foundUser.emailVerified,
            twoFactorEnabled: foundUser.twoFactorEnabled,
            lastLoginAt: foundUser.lastLoginAt,
          },
          accessToken: tokenPair.accessToken,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: 'Login failed',
        },
      });
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          error: {
            code: 'MISSING_REFRESH_TOKEN',
            message: 'Refresh token is required',
          },
        });
        return;
      }

      // Refresh tokens
      const result = await JWTService.refreshAccessToken(refreshToken);

      // Set new refresh token as httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        error: {
          code: 'REFRESH_FAILED',
          message: 'Token refresh failed',
        },
      });
    }
  }

  /**
   * Logout user
   */
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        // Revoke refresh token
        await JWTService.revokeRefreshToken(refreshToken);
      }

      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        data: {
          message: 'Logged out successfully',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'LOGOUT_FAILED',
          message: 'Logout failed',
        },
      });
    }
  }

  /**
   * Request password reset
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

      // Find user
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      // Always return success to prevent email enumeration
      if (!user.length) {
        res.status(200).json({
          success: true,
          data: {
            message: 'If an account exists, a password reset link has been sent',
          },
        });
        return;
      }

      const foundUser = user[0];

      // Generate reset token
      const resetToken = JWTService.generateResetToken();
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      // Store reset token
      await db
        .update(users)
        .set({
          passwordResetToken: resetToken,
          passwordResetExpires: expiresAt,
        })
        .where(eq(users.id, foundUser.id));

      // In production, send reset email
      console.log(`Password reset token for ${email}: ${resetToken}`);

      res.status(200).json({
        success: true,
        data: {
          message: 'If an account exists, a password reset link has been sent',
        },
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'FORGOT_PASSWORD_FAILED',
          message: 'Password reset request failed',
        },
      });
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Token and new password are required',
          },
        });
        return;
      }

      // Find user with valid reset token
      const user = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.passwordResetToken, token),
            gt(users.passwordResetExpires, new Date())
          )
        )
        .limit(1);

      if (!user.length) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired reset token',
          },
        });
        return;
      }

      const foundUser = user[0];

      // Hash new password
      const passwordHash = await JWTService.hashPassword(newPassword);

      // Update password and clear reset token
      await db
        .update(users)
        .set({
          passwordHash,
          passwordResetToken: null,
          passwordResetExpires: null,
          failedLoginAttempts: 0,
          accountLocked: false,
        })
        .where(eq(users.id, foundUser.id));

      // Revoke all user sessions
      await JWTService.revokeAllUserSessions(foundUser.id);

      res.status(200).json({
        success: true,
        data: {
          message: 'Password reset successful',
        },
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'RESET_PASSWORD_FAILED',
          message: 'Password reset failed',
        },
      });
    }
  }

  /**
   * Verify OTP
   */
  static async verifyOTP(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { code, email } = req.body;

      if (!code) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_CODE',
            message: 'OTP code is required',
          },
        });
        return;
      }

      // Find user if email provided (for login OTP)
      let userId = req.user?.id;
      if (!userId && email) {
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!user.length) {
          res.status(400).json({
            success: false,
            error: {
              code: 'USER_NOT_FOUND',
              message: 'User not found',
            },
          });
          return;
        }
        userId = user[0].id;
      }

      if (!userId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_USER',
            message: 'User identification required',
          },
        });
        return;
      }

      // Find valid OTP
      const otp = await db
        .select()
        .from(otpCodes)
        .where(
          and(
            eq(otpCodes.userId, userId),
            eq(otpCodes.code, code),
            eq(otpCodes.isUsed, false),
            gt(otpCodes.expiresAt, new Date())
          )
        )
        .limit(1);

      if (!otp.length) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_OTP',
            message: 'Invalid or expired OTP code',
          },
        });
        return;
      }

      // Mark OTP as used
      await db
        .update(otpCodes)
        .set({
          isUsed: true,
          usedAt: new Date(),
        })
        .where(eq(otpCodes.id, otp[0].id));

      // If this is for login, generate tokens
      if (otp[0].type === 'login') {
        const user = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (user.length) {
          const tokenPair = await JWTService.generateTokenPair(
            user[0].id,
            user[0].email,
            user[0].role,
            req.get('User-Agent'),
            req.ip,
            {
              platform: req.get('sec-ch-ua-platform'),
              mobile: req.get('sec-ch-ua-mobile'),
            }
          );

          res.cookie('refreshToken', tokenPair.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });

          res.status(200).json({
            success: true,
            data: {
              user: {
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
              },
              accessToken: tokenPair.accessToken,
            },
          });
          return;
        }
      }

      res.status(200).json({
        success: true,
        data: {
          message: 'OTP verified successfully',
        },
      });
    } catch (error) {
      console.error('OTP verification error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'OTP_VERIFICATION_FAILED',
          message: 'OTP verification failed',
        },
      });
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
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

      res.status(200).json({
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_USER_FAILED',
          message: 'Failed to get current user',
        },
      });
    }
  }

  /**
   * Get user sessions
   */
  static async getUserSessions(req: AuthRequest, res: Response): Promise<void> {
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

      const userSessions = await db
        .select({
          id: sessions.id,
          userAgent: sessions.userAgent,
          ipAddress: sessions.ipAddress,
          deviceInfo: sessions.deviceInfo,
          createdAt: sessions.createdAt,
          lastAccessedAt: sessions.lastAccessedAt,
          isActive: sessions.isActive,
          isCurrent: sessions.id,
        })
        .from(sessions)
        .where(
          and(
            eq(sessions.userId, req.user.id),
            eq(sessions.isActive, true),
            gt(sessions.expiresAt, new Date())
          )
        )
        .orderBy(sessions.lastAccessedAt);

      // Mark current session
      const sessionsWithCurrent = userSessions.map(session => ({
        ...session,
        isCurrent: session.id === req.user.sessionId,
      }));

      res.status(200).json({
        success: true,
        data: {
          sessions: sessionsWithCurrent,
        },
      });
    } catch (error) {
      console.error('Get user sessions error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_SESSIONS_FAILED',
          message: 'Failed to get user sessions',
        },
      });
    }
  }

  /**
   * Revoke session
   */
  static async revokeSession(req: AuthRequest, res: Response): Promise<void> {
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

      const { sessionId } = req.params;

      // Revoke session
      await db
        .update(sessions)
        .set({
          isActive: false,
          revokedAt: new Date(),
        })
        .where(
          and(
            eq(sessions.id, sessionId),
            eq(sessions.userId, req.user.id)
          )
        );

      res.status(200).json({
        success: true,
        data: {
          message: 'Session revoked successfully',
        },
      });
    } catch (error) {
      console.error('Revoke session error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'REVOKE_SESSION_FAILED',
          message: 'Failed to revoke session',
        },
      });
    }
  }

  /**
   * Helper: Check if this is a new device
   */
  private static async isNewDevice(req: Request, userId: number): Promise<boolean> {
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip;

    if (!userAgent || !ipAddress) {
      return true;
    }

    // Check if we have a recent session from this device
    const recentSession = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.userId, userId),
          eq(sessions.userAgent, userAgent),
          eq(sessions.ipAddress, ipAddress),
          gt(sessions.lastAccessedAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // 30 days
        )
      )
      .limit(1);

    return recentSession.length === 0;
  }
}

export default AuthController;