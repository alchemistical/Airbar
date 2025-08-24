import { z } from 'zod'

export const tripStatusSchema = z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED'])

export const createTripSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  departureDate: z.string().datetime(),
  arrivalDate: z.string().datetime(),
  capacity: z.number().positive('Capacity must be positive'),
  pricePerKg: z.number().positive('Price must be positive'),
})