export interface Booking {
  id: string
  parcelId: string
  tripId: string
  senderId: string
  travelerId: string
  price: number
  status: BookingStatus
  createdAt: Date
  updatedAt: Date
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'