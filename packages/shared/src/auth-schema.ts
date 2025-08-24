// Authentication-related types and schemas
// Re-exports from Prisma schema with auth-specific utilities

export type {
  User,
  Profile,
  Session,
  KYCStatus
} from '@prisma/client'

// Legacy exports for compatibility - these will be removed when API code is updated
// For now, just provide type aliases to maintain compatibility
export type UserAuthFields = {
  passwordHash?: string
  otpSecret?: string  
  twoFactorEnabled?: boolean
  emailVerified?: boolean
  emailVerifiedAt?: Date
  lastLoginAt?: Date
  passwordResetToken?: string
  passwordResetExpires?: Date
  accountLocked?: boolean
  failedLoginAttempts?: number
  lastFailedLogin?: Date
}

// Placeholder exports for tables that exist in Prisma schema
// These should be removed once API code is updated to use Prisma directly
export const sessions = "LEGACY_DRIZZLE_EXPORT" as any
export const oauthAccounts = "LEGACY_DRIZZLE_EXPORT" as any
export const otpCodes = "LEGACY_DRIZZLE_EXPORT" as any
export const loginAttempts = "LEGACY_DRIZZLE_EXPORT" as any
export const userAuthFields = "LEGACY_DRIZZLE_EXPORT" as any