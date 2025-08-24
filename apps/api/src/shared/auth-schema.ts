import { pgTable, serial, varchar, text, timestamp, boolean, integer, inet, jsonb, uuid } from 'drizzle-orm/pg-core';
import { users } from './schema';

// Sessions table for refresh token management
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  refreshTokenHash: varchar('refresh_token_hash', { length: 255 }).notNull().unique(),
  userAgent: text('user_agent'),
  ipAddress: inet('ip_address'),
  deviceInfo: jsonb('device_info'),
  createdAt: timestamp('created_at').defaultNow(),
  lastAccessedAt: timestamp('last_accessed_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  revokedAt: timestamp('revoked_at'),
  isActive: boolean('is_active').default(true),
});

// OAuth accounts table
export const oauthAccounts = pgTable('oauth_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  provider: varchar('provider', { length: 50 }).notNull(),
  providerId: varchar('provider_id', { length: 255 }).notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  scope: text('scope'),
  tokenType: varchar('token_type', { length: 50 }).default('Bearer'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// OTP codes table for verification
export const otpCodes = pgTable('otp_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  code: varchar('code', { length: 6 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'email_verify', 'password_reset', '2fa', 'login'
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  isUsed: boolean('is_used').default(false),
  metadata: jsonb('metadata'),
});

// Login attempts table for rate limiting
export const loginAttempts = pgTable('login_attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  ipAddress: inet('ip_address').notNull(),
  email: varchar('email', { length: 255 }),
  userAgent: text('user_agent'),
  success: boolean('success').default(false),
  failureReason: varchar('failure_reason', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// Extended user fields for auth
export const userAuthFields = {
  passwordHash: varchar('password_hash', { length: 255 }),
  otpSecret: varchar('otp_secret', { length: 32 }),
  twoFactorEnabled: boolean('twofactor_enabled').default(false),
  emailVerified: boolean('email_verified').default(false),
  emailVerifiedAt: timestamp('email_verified_at'),
  lastLoginAt: timestamp('last_login_at'),
  passwordResetToken: varchar('password_reset_token', { length: 255 }),
  passwordResetExpires: timestamp('password_reset_expires'),
  accountLocked: boolean('account_locked').default(false),
  failedLoginAttempts: integer('failed_login_attempts').default(0),
  lastFailedLogin: timestamp('last_failed_login'),
};