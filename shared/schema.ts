import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
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

// Types
export type User = typeof users.$inferSelect;
export type Trip = typeof trips.$inferSelect;
export type ParcelRequest = typeof parcelRequests.$inferSelect;
export type Earning = typeof earnings.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type InsertParcelRequest = z.infer<typeof insertParcelRequestSchema>;
export type InsertEarning = z.infer<typeof insertEarningSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

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
