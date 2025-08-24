export interface Parcel {
  id: string
  senderId: string
  origin: string
  destination: string
  weight: number
  dimensions: ParcelDimensions
  description: string
  value: number
  status: ParcelStatus
  createdAt: Date
  updatedAt: Date
}

export interface ParcelDimensions {
  length: number
  width: number
  height: number
}

export type ParcelStatus = 'PENDING' | 'MATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'