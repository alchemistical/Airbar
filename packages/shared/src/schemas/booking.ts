import { z } from 'zod'

export const bookingStatusSchema = z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])

export const createBookingSchema = z.object({
  parcelId: z.string(),
  tripId: z.string(),
  price: z.number().positive('Price must be positive'),
})