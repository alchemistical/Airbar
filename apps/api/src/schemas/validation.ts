import { z } from "zod";
import {
  BagType,
  PackageCategory,
  TripStatus,
  PackageStatus,
  KYCStatus,
} from "@prisma/client";

// =============================================================================
// BASE SCHEMAS
// =============================================================================

export const emailSchema = z.string().email("Invalid email address");
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number");
export const cuidSchema = z.string().cuid("Invalid ID format");

// =============================================================================
// USER SCHEMAS
// =============================================================================

export const createUserSchema = z.object({
  email: emailSchema,
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  password: passwordSchema,
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phoneNumber: phoneSchema.optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  phoneNumber: phoneSchema.optional(),
  languages: z.array(z.string()).max(10).optional(),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
});

export const updateKYCSchema = z.object({
  status: z.nativeEnum(KYCStatus),
  documents: z
    .array(
      z.object({
        type: z.string(),
        url: z.string().url(),
        uploadedAt: z.date(),
      })
    )
    .optional(),
});

// =============================================================================
// LOCATION SCHEMAS
// =============================================================================

export const locationSchema = z.object({
  name: z.string().min(1).max(100),
  city: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  countryCode: z.string().length(2),
  airportCode: z.string().length(3).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().optional(),
});

export const routeRestrictionSchema = z.object({
  originId: cuidSchema,
  destinationId: cuidSchema,
  restrictedItems: z.array(z.string()),
  description: z.string().optional(),
});

// =============================================================================
// TRIP SCHEMAS
// =============================================================================

export const createTripSchema = z.object({
  originId: cuidSchema,
  destinationId: cuidSchema,
  departureDate: z.coerce.date(),
  arrivalDate: z.coerce.date().optional(),
  returnDate: z.coerce.date().optional(),
  airline: z.string().max(50).optional(),
  flightNumber: z.string().max(20).optional(),
  spaceAvailable: z.number().min(0.1).max(50), // Max 50kg
  bagTypes: z.array(z.nativeEnum(BagType)).min(1),
  numberOfBags: z.number().int().min(1).max(5).default(1),
  pricePerKg: z.number().min(0).max(100).optional(),
  acceptableItems: z.array(z.string()).max(20).optional(),
  restrictions: z.array(z.string()).max(10).optional(),
  additionalNotes: z.string().max(500).optional(),
  flexibilityLevel: z.number().int().min(1).max(5).default(1),
});

export const updateTripSchema = createTripSchema.partial();

export const tripSearchSchema = z.object({
  originId: cuidSchema.optional(),
  destinationId: cuidSchema.optional(),
  departureDateFrom: z.coerce.date().optional(),
  departureDateTo: z.coerce.date().optional(),
  minSpace: z.number().min(0).optional(),
  maxPricePerKg: z.number().min(0).optional(),
  bagTypes: z.array(z.nativeEnum(BagType)).optional(),
  status: z.nativeEnum(TripStatus).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

// =============================================================================
// PACKAGE SCHEMAS
// =============================================================================

export const createPackageSchema = z.object({
  originId: cuidSchema,
  destinationId: cuidSchema,
  description: z.string().min(10).max(500),
  weight: z.number().min(0.1).max(30), // Max 30kg
  dimensions: z
    .object({
      length: z.number().min(1).max(200),
      width: z.number().min(1).max(200),
      height: z.number().min(1).max(200),
    })
    .optional(),
  declaredValue: z.number().min(0).max(10000), // Max $10k
  category: z.nativeEnum(PackageCategory),
  fragile: z.boolean().default(false),
  urgent: z.boolean().default(false),
  pickupAddress: z.string().min(10).max(200),
  deliveryAddress: z.string().min(10).max(200),
  pickupWindow: z.object({
    start: z.coerce.date(),
    end: z.coerce.date(),
  }),
  deliveryWindow: z
    .object({
      start: z.coerce.date(),
      end: z.coerce.date(),
    })
    .optional(),
  receiverName: z.string().min(1).max(100),
  receiverPhone: phoneSchema,
  receiverEmail: emailSchema.optional(),
  maxReward: z.number().min(5).max(500), // Min $5, Max $500
});

export const updatePackageSchema = createPackageSchema.partial();

export const packageSearchSchema = z.object({
  originId: cuidSchema.optional(),
  destinationId: cuidSchema.optional(),
  category: z.nativeEnum(PackageCategory).optional(),
  maxWeight: z.number().min(0).optional(),
  minReward: z.number().min(0).optional(),
  urgent: z.boolean().optional(),
  status: z.nativeEnum(PackageStatus).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const packageQuoteSchema = z.object({
  originId: cuidSchema,
  destinationId: cuidSchema,
  weight: z.number().min(0.1).max(30),
});

// =============================================================================
// MATCH SCHEMAS
// =============================================================================

export const createMatchSchema = z.object({
  packageId: cuidSchema,
  tripId: cuidSchema,
  agreedReward: z.number().min(5).max(500),
});

export const updateMatchStatusSchema = z.object({
  status: z.enum([
    "PROPOSED",
    "ACCEPTED",
    "CONFIRMED",
    "PICKED_UP",
    "IN_TRANSIT",
    "DELIVERED",
    "COMPLETED",
    "CANCELLED",
    "DISPUTED",
  ]),
  trackingData: z
    .object({
      location: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
      timestamp: z.coerce.date(),
      notes: z.string().max(200).optional(),
    })
    .optional(),
});

// =============================================================================
// TRANSACTION SCHEMAS
// =============================================================================

export const createTransactionSchema = z.object({
  matchId: cuidSchema.optional(),
  type: z.enum([
    "ESCROW_DEPOSIT",
    "ESCROW_RELEASE",
    "REWARD_PAYMENT",
    "PLATFORM_FEE",
    "REFUND",
    "WITHDRAWAL",
    "DEPOSIT",
  ]),
  amount: z.number().min(0.01).max(10000),
  currency: z.string().length(3).default("USD"),
  paymentMethod: z.string().optional(),
  description: z.string().max(200).optional(),
  metadata: z.record(z.any()).optional(),
});

// =============================================================================
// MESSAGE SCHEMAS
// =============================================================================

export const createMessageSchema = z.object({
  matchId: cuidSchema,
  content: z.string().min(1).max(1000),
  messageType: z
    .enum(["TEXT", "IMAGE", "LOCATION", "SYSTEM", "STATUS_UPDATE"])
    .default("TEXT"),
  attachments: z
    .array(
      z.object({
        type: z.string(),
        url: z.string().url(),
        filename: z.string(),
      })
    )
    .max(5)
    .optional(),
});

// =============================================================================
// REVIEW SCHEMAS
// =============================================================================

export const createReviewSchema = z.object({
  reviewedId: cuidSchema,
  matchId: cuidSchema.optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().max(500).optional(),
  categories: z.record(z.number().int().min(1).max(5)),
  isPublic: z.boolean().default(true),
});

// =============================================================================
// NOTIFICATION SCHEMAS
// =============================================================================

export const createNotificationSchema = z.object({
  userId: cuidSchema,
  type: z.enum([
    "MATCH_FOUND",
    "MATCH_ACCEPTED",
    "PICKUP_REMINDER",
    "DELIVERY_UPDATE",
    "PAYMENT_RECEIVED",
    "REVIEW_REQUEST",
    "SYSTEM_ALERT",
    "MARKETING",
  ]),
  title: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  data: z.record(z.any()).optional(),
  actionUrl: z.string().url().optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
});

// =============================================================================
// DISPUTE SCHEMAS
// =============================================================================

export const createDisputeSchema = z.object({
  matchId: cuidSchema,
  type: z.enum([
    "NON_DELIVERY",
    "DAMAGED_PACKAGE",
    "WRONG_ITEM",
    "PAYMENT_ISSUE",
    "COMMUNICATION_ISSUE",
    "SAFETY_CONCERN",
    "OTHER",
  ]),
  reason: z.string().min(10).max(200),
  description: z.string().min(20).max(1000),
  evidence: z
    .array(
      z.object({
        type: z.string(),
        url: z.string().url(),
        description: z.string().max(200),
      })
    )
    .max(10)
    .optional(),
});

// =============================================================================
// QUERY SCHEMAS
// =============================================================================

export const paginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// =============================================================================
// HELPER TYPES
// =============================================================================

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateTripInput = z.infer<typeof createTripSchema>;
export type TripSearchInput = z.infer<typeof tripSearchSchema>;
export type CreatePackageInput = z.infer<typeof createPackageSchema>;
export type PackageSearchInput = z.infer<typeof packageSearchSchema>;
export type PackageQuoteInput = z.infer<typeof packageQuoteSchema>;
export type CreateMatchInput = z.infer<typeof createMatchSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type CreateDisputeInput = z.infer<typeof createDisputeSchema>;
