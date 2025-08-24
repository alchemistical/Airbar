// Re-export Prisma types for shared use across the application
// This file serves as the single source of truth for database types

// Import and re-export Prisma client from db package
import { prisma as dbClient } from '@airbar/db'
export const prisma = dbClient

// Import types first, then re-export them
import type {
  User,
  Profile,
  Session,
  Location,
  RouteRestriction,
  Trip,
  Package,
  Match,
  Transaction,
  Message,
  Review,
  Notification,
  Dispute,
  KYCStatus,
  LocationType,
  BagType,
  TripStatus,
  PackageStatus,
  PackageCategory,
  MatchStatus,
  TransactionType,
  TransactionStatus,
  MessageType,
  NotificationType,
  NotificationPriority,
  DisputeType,
  DisputeStatus,
  Prisma
} from '@prisma/client'

// Re-export all types
export type {
  User,
  Profile,
  Session,
  Location,
  RouteRestriction,
  Trip,
  Package,
  Match,
  Transaction,
  Message,
  Review,
  Notification,
  Dispute,
  KYCStatus,
  LocationType,
  BagType,
  TripStatus,
  PackageStatus,
  PackageCategory,
  MatchStatus,
  TransactionType,
  TransactionStatus,
  MessageType,
  NotificationType,
  NotificationPriority,
  DisputeType,
  DisputeStatus,
  Prisma
}

// Additional composite types for application use
export type UserWithProfile = User & { profile: Profile | null }
export type TripWithLocation = Trip & { 
  origin: Location 
  destination: Location 
}
export type PackageWithLocation = Package & { 
  origin: Location 
  destination: Location 
}
export type MatchWithDetails = Match & {
  package: Package
  trip: Trip
  sender: User
  traveler: User
}

// Dashboard specific types (keeping from original schema)
export type DashboardMetrics = {
  activeTrips: number
  parcelRequests: number
  inEscrowAmount: string
  averageRating: string
  availableBalance: string
  pendingEarnings: string
  totalEarned: string
  role: "traveler" | "sender" | "both"
  unacceptedMatches: number
  pendingConfirmations: number
  receiptsRequired: number
  kycComplete: boolean
  payoutsPending: number
}

export type TripWithRequests = Trip & {
  requestCount: number
}

export type ParcelRequestWithSender = Package & {
  senderName: string
}