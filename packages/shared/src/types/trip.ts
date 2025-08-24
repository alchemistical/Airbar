export interface Trip {
  id: string
  userId: string
  origin: string
  destination: string
  departureDate: Date
  arrivalDate: Date
  capacity: number
  pricePerKg: number
  status: TripStatus
  createdAt: Date
  updatedAt: Date
}

export type TripStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'