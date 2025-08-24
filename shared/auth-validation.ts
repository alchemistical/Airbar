import { z } from 'zod';

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
  .regex(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
  .regex(/^(?=.*\d)/, 'Password must contain at least one number')
  .max(128, 'Password must be less than 128 characters');

// Email validation schema
const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(3, 'Email must be at least 3 characters')
  .max(254, 'Email must be less than 254 characters');

// Username validation schema
const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be less than 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens');

// Name validation schema
const nameSchema = z
  .string()
  .min(1, 'Name must be at least 1 character')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, apostrophes, and hyphens');

// OTP validation schema
const otpSchema = z
  .string()
  .length(6, 'OTP must be exactly 6 digits')
  .regex(/^\d+$/, 'OTP must contain only numbers');

// Registration schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
});

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Reset password schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: passwordSchema,
});

// Verify OTP schema
export const verifyOTPSchema = z.object({
  code: otpSchema,
  email: emailSchema.optional(),
});

// Request OTP schema
export const requestOTPSchema = z.object({
  type: z.enum(['email_verify', 'password_reset', '2fa', 'login'], {
    errorMap: () => ({ message: 'Invalid OTP type' }),
  }),
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

// Update profile schema
export const updateProfileSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  username: usernameSchema.optional(),
});

// Enable 2FA schema
export const enable2FASchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

// Disable 2FA schema
export const disable2FASchema = z.object({
  password: z.string().min(1, 'Password is required'),
  otpCode: otpSchema,
});

// Types for TypeScript
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>;
export type RequestOTPInput = z.infer<typeof requestOTPSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type Enable2FAInput = z.infer<typeof enable2FASchema>;
export type Disable2FAInput = z.infer<typeof disable2FASchema>;

// Helper function to validate and parse data
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// Common error messages
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'An account with this email already exists',
  USERNAME_EXISTS: 'This username is already taken',
  USER_NOT_FOUND: 'User not found',
  ACCOUNT_LOCKED: 'Account is locked due to too many failed attempts',
  EMAIL_NOT_VERIFIED: 'Please verify your email address',
  INVALID_TOKEN: 'Invalid or expired token',
  INVALID_OTP: 'Invalid or expired OTP code',
  OTP_EXPIRED: 'OTP code has expired',
  MISSING_FIELDS: 'Required fields are missing',
  WEAK_PASSWORD: 'Password does not meet security requirements',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
  SESSION_EXPIRED: 'Your session has expired, please login again',
  INSUFFICIENT_PERMISSIONS: 'You do not have permission to perform this action',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access denied',
  INTERNAL_ERROR: 'An internal error occurred',
} as const;

// Helper function to format validation errors
export function formatValidationErrors(errors: z.ZodError): Array<{ field: string; message: string }> {
  return errors.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}

// Helper function to check password strength
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score += 1;
  else feedback.push('Password should be at least 8 characters long');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Password should contain lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Password should contain uppercase letters');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Password should contain numbers');

  if (/[^a-zA-Z\d]/.test(password)) score += 1;
  else feedback.push('Password should contain special characters');

  if (password.length >= 12) score += 1;
  if (!/(.)\1{2,}/.test(password)) score += 1; // No repeated characters
  if (!/^(password|123456|qwerty|abc123|admin|user)$/i.test(password)) score += 1; // Not common password

  return { score, feedback };
}

export default {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyOTPSchema,
  requestOTPSchema,
  changePasswordSchema,
  updateProfileSchema,
  enable2FASchema,
  disable2FASchema,
  validateInput,
  formatValidationErrors,
  checkPasswordStrength,
  AUTH_ERROR_MESSAGES,
};