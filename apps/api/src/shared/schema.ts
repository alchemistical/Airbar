// Import Prisma types and re-export for API consistency
import type {
  User,
  Profile,
  Trip,
  Package,
  Match,
  Transaction,
  KYCStatus,
  BagType,
  TripStatus,
  PackageStatus,
  PackageCategory,
  MatchStatus,
  TransactionType,
  TransactionStatus,
  DashboardMetrics,
  ActivityItem,
  UpcomingTrip,
  DashboardData
} from '../types/prisma';

export type {
  User,
  Profile,
  Trip,
  Package,
  Match,
  Transaction,
  KYCStatus,
  BagType,
  TripStatus,
  PackageStatus,
  PackageCategory,
  MatchStatus,
  TransactionType,
  TransactionStatus,
  DashboardMetrics,
  ActivityItem,
  UpcomingTrip,
  DashboardData
};

// Legacy aliases for backward compatibility
export type ParcelRequest = Package;
export type Earning = Transaction;
export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: Date;
};

// Extended types for frontend compatibility
export type TripWithRequests = Trip & {
  requestCount: number;
};

export type ParcelRequestWithSender = ParcelRequest & {
  senderName: string;
};