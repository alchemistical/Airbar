import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../db';
import { sessions } from '../shared/auth-schema';
import { users } from '../shared/schema';
import { eq, and, gt } from 'drizzle-orm';

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: number;
  sessionId: string;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

export class JWTService {
  private static readonly ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'airbar-jwt-secret-2025';
  private static readonly REFRESH_TOKEN_SECRET = process.env.REFRESH_SECRET || 'airbar-refresh-secret-2025';
  private static readonly ACCESS_TOKEN_EXPIRY = '15m';
  private static readonly REFRESH_TOKEN_EXPIRY = '7d';

  /**
   * Generate access token (short-lived)
   */
  static generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.ACCESS_TOKEN_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
      algorithm: 'HS256',
    });
  }

  /**
   * Generate refresh token (long-lived)
   */
  static generateRefreshToken(payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.REFRESH_TOKEN_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
      algorithm: 'HS256',
    });
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.ACCESS_TOKEN_SECRET) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      return jwt.verify(token, this.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Generate token pair (access + refresh)
   */
  static async generateTokenPair(
    userId: number,
    email: string,
    role: string,
    userAgent?: string,
    ipAddress?: string,
    deviceInfo?: any
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    sessionId: string;
  }> {
    // Generate session ID
    const sessionId = crypto.randomUUID();
    const tokenVersion = 1;

    // Generate tokens
    const accessToken = this.generateAccessToken({
      userId,
      email,
      role,
      sessionId,
    });

    const refreshToken = this.generateRefreshToken({
      userId,
      sessionId,
      tokenVersion,
    });

    // Hash refresh token for storage
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    // Store session in database
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await db.insert(sessions).values({
      id: sessionId,
      userId,
      refreshTokenHash,
      userAgent,
      ipAddress,
      deviceInfo,
      expiresAt,
      lastAccessedAt: new Date(),
      isActive: true,
    });

    return {
      accessToken,
      refreshToken,
      sessionId,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: any;
  }> {
    // Verify refresh token
    const payload = this.verifyRefreshToken(refreshToken);

    // Hash refresh token to check against database
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    // Find active session
    const session = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.refreshTokenHash, refreshTokenHash),
          eq(sessions.isActive, true),
          gt(sessions.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!session.length) {
      throw new Error('Invalid refresh token');
    }

    // Get user details
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user.length) {
      throw new Error('User not found');
    }

    // Generate new token pair
    const newTokens = await this.generateTokenPair(
      user[0].id,
      user[0].email,
      user[0].role || 'TRAVELER',
      session[0].userAgent || undefined,
      session[0].ipAddress || undefined,
      session[0].deviceInfo || undefined
    );

    // Revoke old session
    await db
      .update(sessions)
      .set({
        isActive: false,
        revokedAt: new Date(),
      })
      .where(eq(sessions.id, session[0].id));

    return {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
      user: {
        id: user[0].id,
        email: user[0].email,
        username: user[0].username,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        avatar: user[0].avatar || null,
        role: user[0].role || 'TRAVELER',
        isKYCVerified: user[0].isKYCVerified || false,
        emailVerified: user[0].emailVerified || false,
        twoFactorEnabled: user[0].twoFactorEnabled || false,
      },
    };
  }

  /**
   * Revoke refresh token (logout)
   */
  static async revokeRefreshToken(refreshToken: string): Promise<void> {
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await db
      .update(sessions)
      .set({
        isActive: false,
        revokedAt: new Date(),
      })
      .where(eq(sessions.refreshTokenHash, refreshTokenHash));
  }

  /**
   * Revoke all user sessions
   */
  static async revokeAllUserSessions(userId: number): Promise<void> {
    await db
      .update(sessions)
      .set({
        isActive: false,
        revokedAt: new Date(),
      })
      .where(eq(sessions.userId, userId));
  }

  /**
   * Generate OTP code
   */
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Generate secure reset token
   */
  static generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash password
   */
  static async hashPassword(password: string): Promise<string> {
    const bcrypt = await import('bcryptjs');
    return bcrypt.hash(password, 12);
  }

  /**
   * Verify password
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    const bcrypt = await import('bcryptjs');
    return bcrypt.compare(password, hash);
  }
}

export default JWTService;