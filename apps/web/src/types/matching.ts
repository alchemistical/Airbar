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

export interface MatchResult {
  id: string
  packageId: string
  tripId: string
  status: MatchStatus
  reward: number
  price: number
  type: "travel_profile" | "package_request"
  matchScore: number
  travelDate: string
  capacity?: number
  description?: string
  createdAt: string
  
  user: {
    id: string
    name: string
    avatar?: string
    verified?: boolean
    trustScore: number
  }
  
  route: {
    origin: string
    destination: string
  }
  
  package: {
    description: string
    weight: number
    origin: string
    destination: string
  }
  
  trip: {
    departureDate: string
    origin: string
    destination: string
  }
  
  traveler: {
    name: string
    rating: number
  }
}

export interface MatchDiscoveryParams {
  origin?: string
  destination?: string
  dateFrom?: string
  dateTo?: string
  weightMin?: number
  weightMax?: number
  rewardMin?: number
  rewardMax?: number
  radius?: number
  userType?: "sender" | "traveler"
  dateRange?: {
    start: string
    end: string
  }
  filters?: {
    categories?: string[]
    maxWeight?: number
    minReward?: number
    maxReward?: number
  }
}