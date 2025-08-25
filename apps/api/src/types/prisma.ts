// Prisma types extracted from schema for use until client generation works
// These correspond to the schema.prisma file

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycStatus: KYCStatus;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  nationality?: string;
  address?: string;
  city?: string;
  country?: string;
  languages: string[];
  totalTrips: number;
  totalDeliveries: number;
  rating: number;
  reviewCount: number;
  reliabilityScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Trip {
  id: string;
  travelerId: string;
  originId: string;
  destinationId: string;
  departureDate: Date;
  arrivalDate?: Date;
  returnDate?: Date;
  airline?: string;
  flightNumber?: string;
  spaceAvailable: number;
  bagTypes: BagType[];
  numberOfBags: number;
  pricePerKg?: number;
  acceptableItems: string[];
  restrictions: string[];
  additionalNotes?: string;
  flexibilityLevel: number;
  status: TripStatus;
  isPublic: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Package {
  id: string;
  senderId: string;
  originId: string;
  destinationId: string;
  description: string;
  weight: number;
  declaredValue: number;
  category: PackageCategory;
  fragile: boolean;
  urgent: boolean;
  pickupAddress: string;
  deliveryAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverEmail?: string;
  maxReward: number;
  estimatedReward?: number;
  traditionalCost?: number;
  savings?: number;
  status: PackageStatus;
  expiresAt?: Date;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: string;
  packageId: string;
  tripId: string;
  senderId: string;
  travelerId: string;
  agreedReward: number;
  escrowAmount: number;
  platformFee: number;
  status: MatchStatus;
  proposedAt: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date;
  trackingCode?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  matchId?: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod?: string;
  paymentId?: string;
  description?: string;
  processedAt?: Date;
  failedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Enums from schema.prisma
export enum KYCStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export enum BagType {
  CARRY_ON = 'CARRY_ON',
  CHECKED = 'CHECKED',
  PERSONAL_ITEM = 'PERSONAL_ITEM',
  BACKPACK = 'BACKPACK',
  SUITCASE = 'SUITCASE'
}

export enum TripStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  BOOKED = 'BOOKED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export enum PackageStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  MATCHED = 'MATCHED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export enum PackageCategory {
  DOCUMENTS = 'DOCUMENTS',
  ELECTRONICS = 'ELECTRONICS',
  CLOTHING = 'CLOTHING',
  GIFTS = 'GIFTS',
  FOOD = 'FOOD',
  MEDICINE = 'MEDICINE',
  BOOKS = 'BOOKS',
  PERSONAL_ITEMS = 'PERSONAL_ITEMS',
  BUSINESS_ITEMS = 'BUSINESS_ITEMS',
  OTHER = 'OTHER'
}

export enum MatchStatus {
  PROPOSED = 'PROPOSED',
  ACCEPTED = 'ACCEPTED',
  CONFIRMED = 'CONFIRMED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED'
}

export enum TransactionType {
  ESCROW_DEPOSIT = 'ESCROW_DEPOSIT',
  ESCROW_RELEASE = 'ESCROW_RELEASE',
  REWARD_PAYMENT = 'REWARD_PAYMENT',
  PLATFORM_FEE = 'PLATFORM_FEE',
  REFUND = 'REFUND',
  WITHDRAWAL = 'WITHDRAWAL',
  DEPOSIT = 'DEPOSIT'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

// Dashboard specific types
export interface DashboardMetrics {
  activeTrips: number;
  parcelRequests: number;
  inEscrowAmount: string;
  averageRating: string;
  availableBalance: string;
  pendingEarnings: string;
  totalEarned: string;
  role: "traveler" | "sender" | "both";
  unacceptedMatches: number;
  pendingConfirmations: number;
  receiptsRequired: number;
  kycComplete: boolean;
  payoutsPending: number;
}

export interface ActivityItem {
  id: number;
  type: "delivery" | "payment" | "review" | "trip" | "request";
  message: string;
  time: string;
  icon: string;
  color: string;
}

export interface UpcomingTrip {
  id: number;
  from: string;
  to: string;
  date: string;
  status: "confirmed" | "pending" | "cancelled";
  matches: number;
}

export interface DashboardData extends DashboardMetrics {
  recentActivity: ActivityItem[];
  upcomingTrips: UpcomingTrip[];
}