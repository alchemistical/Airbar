export interface MatchingSummary {
  totalMatches: number
  activeMatches: number
  completedMatches: number
  pendingMatches: number
}

export interface MatchDetails {
  id: string
  packageId: string
  tripId: string
  senderId: string
  travelerId: string
  status: MatchStatus
  agreedReward: number
  trackingCode?: string
  estimatedDelivery?: string
  currentLocation?: {
    lat: number
    lng: number
    address: string
  }
  createdAt: string
  updatedAt: string
  
  // Related data
  package?: {
    id: string
    description: string
    weight: number
    dimensions?: {
      length: number
      width: number
      height: number
    }
    declaredValue: number
    category: string
    origin: {
      name: string
      city: string
      country: string
    }
    destination: {
      name: string
      city: string
      country: string
    }
  }
  
  trip?: {
    id: string
    departureDate: string
    arrivalDate?: string
    airline?: string
    flightNumber?: string
    origin: {
      name: string
      city: string
      country: string
    }
    destination: {
      name: string
      city: string
      country: string
    }
  }
  
  sender?: {
    id: string
    firstName: string
    lastName: string
    rating: number
    reviewCount: number
  }
  
  traveler?: {
    id: string
    firstName: string
    lastName: string
    rating: number
    reviewCount: number
  }
}

export type MatchStatus = 
  | 'PROPOSED'
  | 'ACCEPTED'
  | 'CONFIRMED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED'

export interface MatchFilters {
  status?: MatchStatus[]
  dateRange?: {
    start: string
    end: string
  }
  rewardRange?: {
    min: number
    max: number
  }
}

export interface MatchSortOptions {
  field: 'createdAt' | 'updatedAt' | 'agreedReward' | 'status'
  direction: 'asc' | 'desc'
}