// Temporary auth types - these should be moved to Prisma schema eventually
export interface Session {
  id: string;
  userId: string;
  refreshTokenHash: string;
  userAgent?: string;
  ipAddress?: string;
  deviceInfo?: any;
  createdAt: Date;
  lastAccessedAt: Date;
  expiresAt: Date;
  revokedAt?: Date;
  isActive: boolean;
}

export interface OAuthAccount {
  id: string;
  userId: string;
  provider: string;
  providerId: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  scope?: string;
  tokenType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OtpCode {
  id: string;
  userId: string;
  code: string;
  type: string;
  createdAt: Date;
  expiresAt: Date;
  usedAt?: Date;
  isUsed: boolean;
  metadata?: any;
}

export interface LoginAttempt {
  id: string;
  ipAddress: string;
  email?: string;
  userAgent?: string;
  success: boolean;
  failureReason?: string;
  createdAt: Date;
}