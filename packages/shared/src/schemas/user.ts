import { z } from 'zod'

export const userRoleSchema = z.enum(['TRAVELER', 'SENDER'])

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: userRoleSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})