import { 
  users, trips, parcelRequests, earnings, notifications, disputes,
  type User, type Trip, type ParcelRequest, type Earning, type Notification, type Dispute,
  type InsertUser, type InsertTrip, type InsertParcelRequest, type InsertEarning, type InsertNotification, type InsertDispute,
  type DashboardMetrics, type TripWithRequests, type ParcelRequestWithSender
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Dashboard methods
  getDashboardMetrics(userId: number): Promise<DashboardMetrics>;
  getUpcomingTrips(userId: number): Promise<TripWithRequests[]>;
  getParcelRequestsForUser(userId: number): Promise<ParcelRequestWithSender[]>;
  getRecentEarnings(userId: number): Promise<Earning[]>;
  getUserNotifications(userId: number): Promise<Notification[]>;

  // Trip methods
  createTrip(trip: InsertTrip): Promise<Trip>;
  getUserTrips(userId: number): Promise<Trip[]>;

  // Parcel request methods
  createParcelRequest(request: InsertParcelRequest): Promise<ParcelRequest>;
  getParcelRequestsForTrip(tripId: number): Promise<ParcelRequest[]>;

  // Dispute methods
  createDispute(dispute: InsertDispute): Promise<Dispute>;
  getDispute(id: number): Promise<Dispute | undefined>;
  getUserDisputes(userId: number): Promise<Dispute[]>;
  updateDisputeStatus(id: number, status: string, timelineEntry: any): Promise<Dispute>;
  addDisputeTimeline(id: number, timelineEntry: any): Promise<Dispute>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private trips: Map<number, Trip>;
  private parcelRequests: Map<number, ParcelRequest>;
  private earnings: Map<number, Earning>;
  private notifications: Map<number, Notification>;
  private disputes: Map<number, Dispute>;
  private currentUserId: number;
  private currentTripId: number;
  private currentParcelRequestId: number;
  private currentEarningId: number;
  private currentNotificationId: number;
  private currentDisputeId: number;

  constructor() {
    this.users = new Map();
    this.trips = new Map();
    this.parcelRequests = new Map();
    this.earnings = new Map();
    this.notifications = new Map();
    this.disputes = new Map();
    this.currentUserId = 1;
    this.currentTripId = 1;
    this.currentParcelRequestId = 1;
    this.currentEarningId = 1;
    this.currentNotificationId = 1;
    this.currentDisputeId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Create sample user
    const sampleUser: User = {
      id: 1,
      username: "alexkim",
      password: "password123",
      firstName: "Alex",
      lastName: "Kim",
      email: "alex.kim@example.com",
      isKycVerified: true,
      rating: "4.8",
      createdAt: new Date(),
    };
    this.users.set(1, sampleUser);
    this.currentUserId = 2;

    // Create sample trips
    const trip1: Trip = {
      id: 1,
      userId: 1,
      fromCity: "New York",
      toCity: "Los Angeles",
      departureDate: new Date("2024-05-10"),
      arrivalDate: new Date("2024-05-12"),
      status: "active",
      maxWeight: "20.00",
      pricePerKg: "15.00",
      createdAt: new Date(),
    };

    const trip2: Trip = {
      id: 2,
      userId: 1,
      fromCity: "London",
      toCity: "Paris",
      departureDate: new Date("2024-05-15"),
      arrivalDate: new Date("2024-05-15"),
      status: "active",
      maxWeight: "15.00",
      pricePerKg: "12.00",
      createdAt: new Date(),
    };

    this.trips.set(1, trip1);
    this.trips.set(2, trip2);
    this.currentTripId = 3;

    // Create sample parcel requests
    const parcelRequest1: ParcelRequest = {
      id: 1,
      senderId: 2,
      tripId: 1,
      fromCity: "San Francisco",
      toCity: "Seattle",
      weight: "5.00",
      description: "Electronics package",
      collectionDate: new Date("2024-05-06"),
      deliveryDate: new Date("2024-05-08"),
      status: "pending",
      offerAmount: "75.00",
      createdAt: new Date(),
    };

    const parcelRequest2: ParcelRequest = {
      id: 2,
      senderId: 3,
      tripId: null,
      fromCity: "Atlanta",
      toCity: "Miami",
      weight: "3.50",
      description: "Documents",
      collectionDate: new Date("2024-05-08"),
      deliveryDate: new Date("2024-05-10"),
      status: "pending",
      offerAmount: "50.00",
      createdAt: new Date(),
    };

    const parcelRequest3: ParcelRequest = {
      id: 3,
      senderId: 4,
      tripId: null,
      fromCity: "Berlin",
      toCity: "Rome",
      weight: "2.00",
      description: "Gift package",
      collectionDate: new Date("2024-05-12"),
      deliveryDate: new Date("2024-05-14"),
      status: "pending",
      offerAmount: "40.00",
      createdAt: new Date(),
    };

    this.parcelRequests.set(1, parcelRequest1);
    this.parcelRequests.set(2, parcelRequest2);
    this.parcelRequests.set(3, parcelRequest3);
    this.currentParcelRequestId = 4;

    // Create sample earnings
    const earning1: Earning = {
      id: 1,
      userId: 1,
      amount: "500.00",
      status: "pending",
      tripId: 1,
      parcelRequestId: 1,
      createdAt: new Date("2024-04-15"),
    };

    const earning2: Earning = {
      id: 2,
      userId: 1,
      amount: "750.00",
      status: "completed",
      tripId: 2,
      parcelRequestId: 2,
      createdAt: new Date("2024-04-20"),
    };

    this.earnings.set(1, earning1);
    this.earnings.set(2, earning2);
    this.currentEarningId = 3;

    // Create sample notifications
    const notification1: Notification = {
      id: 1,
      userId: 1,
      title: "Trip Update",
      message: "Trip to Los Angeles starts soon",
      type: "info",
      isRead: false,
      createdAt: new Date(),
    };

    const notification2: Notification = {
      id: 2,
      userId: 1,
      title: "New Request",
      message: "You have a new parcel request",
      type: "success",
      isRead: false,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    };

    const notification3: Notification = {
      id: 3,
      userId: 1,
      title: "Trip Completed",
      message: "Trip to Paris completed",
      type: "success",
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    };

    this.notifications.set(1, notification1);
    this.notifications.set(2, notification2);
    this.notifications.set(3, notification3);
    this.currentNotificationId = 4;

    // Create additional sample users for parcel requests
    const user2: User = {
      id: 2,
      username: "tomsmith",
      password: "password123",
      firstName: "Tom",
      lastName: "Smith",
      email: "tom.smith@example.com",
      isKycVerified: true,
      rating: "4.5",
      createdAt: new Date(),
    };

    const user3: User = {
      id: 3,
      username: "lilapark",
      password: "password123",
      firstName: "Lila",
      lastName: "Park",
      email: "lila.park@example.com",
      isKycVerified: true,
      rating: "4.7",
      createdAt: new Date(),
    };

    const user4: User = {
      id: 4,
      username: "johndoe",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      isKycVerified: false,
      rating: "4.2",
      createdAt: new Date(),
    };

    this.users.set(2, user2);
    this.users.set(3, user3);
    this.users.set(4, user4);
    this.currentUserId = 5;

    // Create sample disputes
    const dispute1: Dispute = {
      id: 1,
      matchId: 1,
      senderId: 2,
      travelerId: 1,
      status: "open",
      reason: "damaged",
      description: "The package arrived with significant damage. The electronic device inside was broken and the packaging was torn. I have photos showing the condition.",
      preferredOutcome: "refund",
      evidence: [
        { url: "/sample/damage1.jpg", type: "image/jpeg", uploadedAt: "2025-01-10T10:00:00Z" },
        { url: "/sample/damage2.jpg", type: "image/jpeg", uploadedAt: "2025-01-10T10:01:00Z" }
      ],
      timeline: [
        {
          timestamp: "2025-01-10T10:00:00Z",
          actor: "User 2",
          actorRole: "sender",
          type: "created",
          message: "Dispute created - damaged item reported"
        }
      ],
      firstReplyDue: new Date("2025-01-11T10:00:00Z"),
      resolutionDue: new Date("2025-01-15T10:00:00Z"),
      createdAt: new Date("2025-01-10T10:00:00Z"),
      updatedAt: new Date("2025-01-10T10:00:00Z"),
    };

    const dispute2: Dispute = {
      id: 2,
      matchId: 2,
      senderId: 3,
      travelerId: 1,
      status: "offer",
      reason: "late",
      description: "Package was delivered 3 days after the agreed delivery date. This caused significant inconvenience as it was meant for a birthday gift.",
      preferredOutcome: "partial",
      evidence: [],
      timeline: [
        {
          timestamp: "2025-01-08T14:00:00Z",
          actor: "User 3",
          actorRole: "sender",
          type: "created",
          message: "Dispute created - late delivery reported"
        },
        {
          timestamp: "2025-01-09T09:00:00Z",
          actor: "User 1",
          actorRole: "traveler",
          type: "reply",
          message: "I apologize for the delay. There were unexpected travel disruptions due to weather."
        },
        {
          timestamp: "2025-01-09T15:00:00Z",
          actor: "Support Agent",
          actorRole: "support",
          type: "offer",
          message: "Based on our review, we're offering a partial refund",
          payload: { amount: 25, description: "50% refund for late delivery" }
        }
      ],
      firstReplyDue: new Date("2025-01-09T14:00:00Z"),
      resolutionDue: new Date("2025-01-13T14:00:00Z"),
      createdAt: new Date("2025-01-08T14:00:00Z"),
      updatedAt: new Date("2025-01-09T15:00:00Z"),
    };

    this.disputes.set(dispute1.id, dispute1);
    this.disputes.set(dispute2.id, dispute2);
    this.currentDisputeId = 3;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      isKycVerified: insertUser.isKycVerified ?? false,
      rating: insertUser.rating ?? "0.00",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getDashboardMetrics(userId: number): Promise<DashboardMetrics> {
    const userTrips = Array.from(this.trips.values()).filter(
      trip => trip.userId === userId && trip.status === "active"
    );
    
    const userParcelRequests = Array.from(this.parcelRequests.values()).filter(
      request => request.status === "pending"
    );
    
    const userEarnings = Array.from(this.earnings.values()).filter(e => e.userId === userId);
    
    const availableBalance = userEarnings
      .filter(e => e.status === "completed")
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);
    
    const pendingEarnings = userEarnings
      .filter(e => e.status === "pending")
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);
    
    const totalEarned = userEarnings
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);
    
    const user = this.users.get(userId);
    
    return {
      activeTrips: userTrips.length,
      parcelRequests: userParcelRequests.length,
      inEscrowAmount: `$${(pendingEarnings * 0.3).toFixed(2)}`,
      averageRating: user?.rating || "0.0",
      availableBalance: `$${availableBalance.toFixed(2)}`,
      pendingEarnings: `$${pendingEarnings.toFixed(2)}`,
      totalEarned: `$${totalEarned.toFixed(2)}`,
      role: "traveler", // Could be dynamic based on user data
      unacceptedMatches: 2,
      pendingConfirmations: 1,
      receiptsRequired: 1,
      kycComplete: user?.isKycVerified || false,
      payoutsPending: 0
    };
  }

  async getUpcomingTrips(userId: number): Promise<TripWithRequests[]> {
    const userTrips = Array.from(this.trips.values()).filter(
      trip => trip.userId === userId && trip.status === "active"
    );
    
    return userTrips.map(trip => {
      const requestCount = Array.from(this.parcelRequests.values()).filter(
        request => request.tripId === trip.id
      ).length;
      
      return {
        ...trip,
        requestCount,
      };
    });
  }

  async getParcelRequestsForUser(userId: number): Promise<ParcelRequestWithSender[]> {
    const requests = Array.from(this.parcelRequests.values())
      .filter(request => request.status === "pending")
      .slice(0, 3); // Get latest 3 requests
    
    return requests.map(request => {
      const sender = this.users.get(request.senderId);
      return {
        ...request,
        senderName: sender ? `${sender.firstName} ${sender.lastName.charAt(0)}.` : "Unknown",
      };
    });
  }

  async getRecentEarnings(userId: number): Promise<Earning[]> {
    return Array.from(this.earnings.values())
      .filter(earning => earning.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, 6); // Get last 6 earnings for chart
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, 5); // Get latest 5 notifications
  }

  async createTrip(trip: InsertTrip): Promise<Trip> {
    const id = this.currentTripId++;
    const newTrip: Trip = {
      ...trip,
      id,
      status: trip.status ?? "active",
      arrivalDate: trip.arrivalDate ?? null,
      maxWeight: trip.maxWeight ?? null,
      pricePerKg: trip.pricePerKg ?? null,
      createdAt: new Date(),
    };
    this.trips.set(id, newTrip);
    return newTrip;
  }

  async getUserTrips(userId: number): Promise<Trip[]> {
    return Array.from(this.trips.values()).filter(trip => trip.userId === userId);
  }

  async createParcelRequest(request: InsertParcelRequest): Promise<ParcelRequest> {
    const id = this.currentParcelRequestId++;
    const newRequest: ParcelRequest = {
      ...request,
      id,
      status: request.status ?? "pending",
      tripId: request.tripId ?? null,
      description: request.description ?? null,
      deliveryDate: request.deliveryDate ?? null,
      offerAmount: request.offerAmount ?? null,
      createdAt: new Date(),
    };
    this.parcelRequests.set(id, newRequest);
    return newRequest;
  }

  async getParcelRequestsForTrip(tripId: number): Promise<ParcelRequest[]> {
    return Array.from(this.parcelRequests.values()).filter(
      request => request.tripId === tripId
    );
  }

  async createDispute(dispute: InsertDispute): Promise<Dispute> {
    const id = this.currentDisputeId++;
    const now = new Date();
    const firstReplyDue = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    const resolutionDue = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days
    
    const newDispute: Dispute = {
      id,
      matchId: dispute.matchId,
      senderId: dispute.senderId,
      travelerId: dispute.travelerId,
      status: "open",
      reason: dispute.reason,
      description: dispute.description,
      preferredOutcome: dispute.preferredOutcome,
      evidence: dispute.evidence || [],
      timeline: [{
        timestamp: now.toISOString(),
        actor: `User ${dispute.senderId}`,
        actorRole: "sender",
        type: "created",
        message: "Dispute created"
      }],
      firstReplyDue,
      resolutionDue,
      createdAt: now,
      updatedAt: now,
    };
    
    this.disputes.set(id, newDispute);
    return newDispute;
  }

  async getDispute(id: number): Promise<Dispute | undefined> {
    return this.disputes.get(id);
  }

  async getUserDisputes(userId: number): Promise<Dispute[]> {
    const userDisputes = Array.from(this.disputes.values()).filter(
      dispute => dispute.senderId === userId || dispute.travelerId === userId
    );
    
    // Add mock package descriptions for display
    return userDisputes.map(dispute => ({
      ...dispute,
      otherPartyName: dispute.senderId === userId 
        ? `User ${dispute.travelerId}` 
        : `User ${dispute.senderId}`,
      packageDescription: `Package for Match #${dispute.matchId}`
    }));
  }

  async updateDisputeStatus(id: number, status: string, timelineEntry: any): Promise<Dispute> {
    const dispute = this.disputes.get(id);
    if (!dispute) {
      throw new Error(`Dispute with id ${id} not found`);
    }
    
    dispute.status = status;
    dispute.timeline.push({
      ...timelineEntry,
      timestamp: new Date().toISOString()
    });
    dispute.updatedAt = new Date();
    
    this.disputes.set(id, dispute);
    return dispute;
  }

  async addDisputeTimeline(id: number, timelineEntry: any): Promise<Dispute> {
    const dispute = this.disputes.get(id);
    if (!dispute) {
      throw new Error(`Dispute with id ${id} not found`);
    }
    
    dispute.timeline.push({
      ...timelineEntry,
      timestamp: new Date().toISOString()
    });
    dispute.updatedAt = new Date();
    
    this.disputes.set(id, dispute);
    return dispute;
  }
}

export const storage = new MemStorage();
