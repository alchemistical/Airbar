import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  isKycVerified: boolean("is_kyc_verified").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  fromCity: text("from_city").notNull(),
  toCity: text("to_city").notNull(),
  departureDate: timestamp("departure_date").notNull(),
  arrivalDate: timestamp("arrival_date"),
  status: text("status").default("active"), // active, completed, cancelled
  maxWeight: decimal("max_weight", { precision: 5, scale: 2 }),
  pricePerKg: decimal("price_per_kg", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const parcelRequests = pgTable("parcel_requests", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  tripId: integer("trip_id").references(() => trips.id),
  fromCity: text("from_city").notNull(),
  toCity: text("to_city").notNull(),
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(),
  description: text("description"),
  collectionDate: timestamp("collection_date").notNull(),
  deliveryDate: timestamp("delivery_date"),
  status: text("status").default("pending"), // pending, accepted, completed, cancelled
  offerAmount: decimal("offer_amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const earnings = pgTable("earnings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending"), // pending, completed, released
  tripId: integer("trip_id").references(() => trips.id),
  parcelRequestId: integer("parcel_request_id").references(() => parcelRequests.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").default("info"), // info, warning, success, error
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const disputes = pgTable("disputes", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").notNull(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  travelerId: integer("traveler_id").notNull().references(() => users.id),
  status: text("status").notNull().default("open"), // open|waiting|review|offer|resolved|escalated|closed
  reason: text("reason").notNull(), // lost|damaged|late|payment|other
  description: text("description").notNull(),
  preferredOutcome: text("preferred_outcome").notNull(), // refund|partial|replacement|other
  evidence: json("evidence").$type<Array<{ url: string; type: string; uploadedAt: string }>>().notNull().default([]),
  timeline: json("timeline").$type<Array<{ 
    timestamp: string; 
    actor: string; 
    actorRole: string;
    type: string; 
    message?: string;
    payload?: any 
  }>>().notNull().default([]),
  firstReplyDue: timestamp("first_reply_due").notNull(),
  resolutionDue: timestamp("resolution_due").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const matchRequests = pgTable("match_requests", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").references(() => trips.id),
  parcelId: integer("parcel_id").references(() => parcelRequests.id),
  senderId: integer("sender_id").notNull().references(() => users.id),
  travelerId: integer("traveler_id").notNull().references(() => users.id),
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(),
  reward: decimal("reward", { precision: 8, scale: 2 }).notNull(),
  category: text("category").notNull().default("general"),
  message: text("message"),
  status: text("status").notNull().default("pending"), // pending|accepted|declined|expired|paid|confirmed
  paymentStatus: text("payment_status"), // pending|succeeded|failed
  escrowStatus: text("escrow_status"), // held|released|refunded
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  acceptedAt: timestamp("accepted_at"),
  paidAt: timestamp("paid_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  matchRequestId: integer("match_request_id").notNull().references(() => matchRequests.id),
  tripId: integer("trip_id").notNull().references(() => trips.id),
  parcelId: integer("parcel_id").notNull().references(() => parcelRequests.id),
  senderId: integer("sender_id").notNull().references(() => users.id),
  travelerId: integer("traveler_id").notNull().references(() => users.id),
  status: text("status").notNull().default("confirmed"), // confirmed|in_transit|delivered|disputed
  trackingStep: text("tracking_step").notNull().default("picked_up"), // picked_up|in_transit|delivered
  pickupCode: text("pickup_code").notNull(),
  deliveryCode: text("delivery_code").notNull(),
  pickupAddress: text("pickup_address"),
  deliveryAddress: text("delivery_address"),
  pickupTime: timestamp("pickup_time"),
  pickupPhotos: text().array(),
  pickupNotes: text("pickup_notes"),
  deliveryPhotos: text().array(),
  deliveryNotes: text("delivery_notes"),
  pickedUpAt: timestamp("picked_up_at"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTripSchema = createInsertSchema(trips).omit({
  id: true,
  createdAt: true,
});

export const insertParcelRequestSchema = createInsertSchema(parcelRequests).omit({
  id: true,
  createdAt: true,
});

export const insertEarningSchema = createInsertSchema(earnings).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertDisputeSchema = createInsertSchema(disputes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMatchRequestSchema = createInsertSchema(matchRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type Trip = typeof trips.$inferSelect;
export type ParcelRequest = typeof parcelRequests.$inferSelect;
export type Earning = typeof earnings.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Dispute = typeof disputes.$inferSelect;
export type MatchRequest = typeof matchRequests.$inferSelect;
export type Match = typeof matches.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type InsertParcelRequest = z.infer<typeof insertParcelRequestSchema>;
export type InsertEarning = z.infer<typeof insertEarningSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertDispute = z.infer<typeof insertDisputeSchema>;
export type InsertMatchRequest = z.infer<typeof insertMatchRequestSchema>;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

// Dashboard specific types
export type DashboardMetrics = {
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
};

export type TripWithRequests = Trip & {
  requestCount: number;
};

export type ParcelRequestWithSender = ParcelRequest & {
  senderName: string;
};
