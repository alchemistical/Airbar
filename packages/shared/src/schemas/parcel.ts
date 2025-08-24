import { z } from 'zod'

export const parcelStatusSchema = z.enum(['PENDING', 'MATCHED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'])

export const parcelDimensionsSchema = z.object({
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
})

export const createParcelSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  weight: z.number().positive('Weight must be positive'),
  dimensions: parcelDimensionsSchema,
  description: z.string().min(1, 'Description is required'),
  value: z.number().positive('Value must be positive'),
})