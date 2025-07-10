import { 
  users, trips, parcelRequests, earnings, notifications,
  type User, type Trip, type ParcelRequest, type Earning, type Notification,
  type InsertUser, type InsertTrip, type InsertParcelRequest, type InsertEarning, type InsertNotification,
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private trips: Map<number, Trip>;
  private parcelRequests: Map<number, ParcelRequest>;
  private earnings: Map<number, Earning>;
  private notifications: Map<number, Notification>;
  private currentUserId: number;
  private currentTripId: number;
  private currentParcelRequestId: number;
  private currentEarningId: number;
  private currentNotificationId: number;

  constructor() {
    this.users = new Map();
    this.trips = new Map();
    this.parcelRequests = new Map();
    this.earnings = new Map();
    this.notifications = new Map();
    this.currentUserId = 1;
    this.currentTripId = 1;
    this.currentParcelRequestId = 1;
    this.currentEarningId = 1;
    this.currentNotificationId = 1;
    
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
}

export const storage = new MemStorage();
