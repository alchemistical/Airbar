import { z } from 'zod'

export const userRoleSchema = z.enum(['TRAVELER', 'SENDER'])

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: z.string().nullable().optional(),
  role: userRoleSchema,
  isActive: z.boolean().default(true),
  passwordHash: z.string(),
  emailVerified: z.boolean().default(false),
  phoneVerified: z.boolean().default(false),
  kycStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED']).default('PENDING'),
  lastLoginAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const earningSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.number(),
  date: z.date(),
  source: z.string(),
  description: z.string().optional(),
})

export type User = z.infer<typeof userSchema>
export type Earning = z.infer<typeof earningSchema>