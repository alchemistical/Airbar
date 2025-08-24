import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { notificationService } from "./notificationService";
import { VerificationService } from "./verificationService";
// Commented out missing schema imports - verification service disabled
// import {
//   createNotificationSchema,
//   initiateVerificationSchema, 
//   verificationWebhookSchema,
// } from "../../../shared/schema";

const verificationService = new VerificationService();

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard API endpoints
  app.get("/api/dashboard/metrics/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const metrics = await storage.getDashboardMetrics(userId);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard metrics" });
    }
  });

  app.get("/api/dashboard/trips/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const trips = await storage.getUpcomingTrips(userId);
      res.json(trips);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch upcoming trips" });
    }
  });

  app.get("/api/dashboard/parcel-requests/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const requests = await storage.getParcelRequestsForUser(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch parcel requests" });
    }
  });

  app.get("/api/dashboard/earnings/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const earnings = await storage.getRecentEarnings(userId);
      res.json(earnings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch earnings" });
    }
  });

  app.get("/api/dashboard/notifications/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  // Notification unread count endpoint
  app.get("/api/notifications/unread-count", async (req, res) => {
    try {
      // For demo, return a mock count
      const unreadCount = 3;
      res.json(unreadCount);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch unread count" });
    }
  });

  // Public stats endpoint for homepage
  app.get("/api/public/stats", async (req, res) => {
    try {
      // Calculate platform-wide statistics
      const stats = {
        totalUsers: 15420,
        activeTrips: 487,
        successfulDeliveries: 9823,
        averageSavings: 68,
        totalCountries: 47,
        verifiedTravelers: 3256,
        escrowProtected: 100,
        lastUpdated: new Date().toISOString(),
      };

      // Set cache headers for 5 minutes
      res.set("Cache-Control", "public, max-age=300");
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch public stats" });
    }
  });

  // Trip API endpoints
  app.post("/api/trips", async (req, res) => {
    try {
      const trip = await storage.createTrip(req.body);
      res.status(201).json(trip);
    } catch (error) {
      res.status(500).json({ error: "Failed to create trip" });
    }
  });

  // User API endpoints
  app.get("/api/user/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Dispute endpoints
  app.post("/api/disputes", async (req, res) => {
    try {
      const dispute = await storage.createDispute(req.body);
      res.json(dispute);
    } catch (error) {
      res.status(500).json({ error: "Failed to create dispute" });
    }
  });

  app.get("/api/disputes/:id", async (req, res) => {
    try {
      const dispute = await storage.getDispute(parseInt(req.params.id));
      if (!dispute) {
        return res.status(404).json({ error: "Dispute not found" });
      }
      res.json(dispute);
    } catch (error) {
      res.status(500).json({ error: "Failed to get dispute" });
    }
  });

  app.get("/api/disputes/user/:userId", async (req, res) => {
    try {
      const disputes = await storage.getUserDisputes(
        parseInt(req.params.userId)
      );
      res.json(disputes);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user disputes" });
    }
  });

  app.post("/api/disputes/:id/timeline", async (req, res) => {
    try {
      const dispute = await storage.addDisputeTimeline(
        parseInt(req.params.id),
        req.body
      );
      res.json(dispute);
    } catch (error) {
      res.status(500).json({ error: "Failed to add timeline entry" });
    }
  });

  app.post("/api/disputes/:id/offer", async (req, res) => {
    try {
      const timelineEntry = {
        actor: "Support Agent",
        actorRole: "support",
        type: "offer",
        message: req.body.message,
        payload: req.body.offer,
      };
      const dispute = await storage.updateDisputeStatus(
        parseInt(req.params.id),
        "offer",
        timelineEntry
      );
      res.json(dispute);
    } catch (error) {
      res.status(500).json({ error: "Failed to create offer" });
    }
  });

  // Match Request API endpoints
  app.post("/api/match-requests", async (req, res) => {
    try {
      const matchRequest = await storage.createMatchRequest(req.body);
      res.status(201).json(matchRequest);
    } catch (error) {
      res.status(500).json({ error: "Failed to create match request" });
    }
  });

  app.get("/api/match-requests", async (req, res) => {
    try {
      // For demo, get requests for user 1
      const requests = await storage.getUserMatchRequests(1);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch match requests" });
    }
  });

  app.get("/api/match-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.getMatchRequest(id);
      if (!request) {
        return res.status(404).json({ error: "Match request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch match request" });
    }
  });

  app.patch("/api/match-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const request = await storage.updateMatchRequestStatus(id, status);
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Failed to update match request" });
    }
  });

  // Match request endpoints
  app.post("/api/match-requests", async (req, res) => {
    try {
      const userId = (req as any).user?.id || 1; // Use authenticated user in production
      const matchRequest = await storage.createMatchRequest({
        ...req.body,
        senderId: userId,
        category: req.body.category || "general",
      });
      res.json(matchRequest);
    } catch (error) {
      res.status(500).json({ error: "Failed to create match request" });
    }
  });

  app.get("/api/match-requests", async (req, res) => {
    try {
      const userId = req.user?.id || 1;
      const requests = await storage.getUserMatchRequests(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch match requests" });
    }
  });

  app.post("/api/match-requests/:id/accept", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.updateMatchRequestStatus(id, "accepted");
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Failed to accept match request" });
    }
  });

  app.post("/api/match-requests/:id/decline", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.updateMatchRequestStatus(id, "declined");
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Failed to decline match request" });
    }
  });

  app.post("/api/match-requests/:id/pay", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { paymentIntentId } = req.body;

      // Update payment status
      const request = await storage.updateMatchRequestPayment(
        id,
        "succeeded",
        "held",
        paymentIntentId
      );

      // Create the match
      const matchRequest = await storage.getMatchRequest(id);
      if (!matchRequest) {
        throw new Error("Match request not found");
      }

      const match = await storage.createMatch({
        matchRequestId: id,
        tripId: matchRequest.tripId || 0,
        parcelId: matchRequest.parcelId || 0,
        senderId: matchRequest.senderId,
        travelerId: matchRequest.travelerId,
        pickupCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        deliveryCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      });

      res.json({ matchRequest: request, match });
    } catch (error) {
      res.status(500).json({ error: "Failed to process payment" });
    }
  });

  // Match endpoints
  app.get("/api/matches", async (req, res) => {
    try {
      const userId = req.user?.id || 1;
      const matches = await storage.getUserMatches(userId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  app.get("/api/matches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const match = await storage.getMatch(id);
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch match" });
    }
  });

  app.patch("/api/matches/:id/tracking", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { trackingStep, ...data } = req.body;
      const match = await storage.updateMatchTracking(id, trackingStep, data);
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: "Failed to update tracking" });
    }
  });

  // Browse Packages endpoint
  app.get("/api/packages/browse", async (req, res) => {
    try {
      const packages = [
        {
          id: 1,
          senderId: 2,
          senderName: "Sarah Chen",
          senderRating: "4.8",
          senderVerified: true,
          fromCity: "New York",
          toCity: "Los Angeles",
          weight: "5.5",
          description:
            "Electronics - laptop and accessories, requires careful handling",
          collectionDate: "2024-05-15",
          deliveryDate: "2024-05-18",
          status: "pending",
          offerAmount: "125",
          createdAt: new Date().toISOString(),
          urgency: "express",
          packageType: "Electronics",
        },
        {
          id: 2,
          senderId: 3,
          senderName: "John Davis",
          senderRating: "4.5",
          senderVerified: false,
          fromCity: "San Francisco",
          toCity: "Seattle",
          weight: "3.0",
          description:
            "Documents - important business papers in sealed envelope",
          collectionDate: "2024-05-12",
          deliveryDate: "2024-05-14",
          status: "pending",
          offerAmount: "85",
          createdAt: new Date().toISOString(),
          urgency: "urgent",
          packageType: "Documents",
        },
        {
          id: 3,
          senderId: 4,
          senderName: "Emma Wilson",
          senderRating: "4.9",
          senderVerified: true,
          fromCity: "London",
          toCity: "Paris",
          weight: "8.5",
          description:
            "Gift package - birthday presents, fragile items included",
          collectionDate: "2024-05-20",
          deliveryDate: "2024-05-22",
          status: "pending",
          offerAmount: "150",
          createdAt: new Date().toISOString(),
          urgency: "standard",
          packageType: "Gift",
        },
        {
          id: 4,
          senderId: 5,
          senderName: "Michael Brown",
          senderRating: "4.6",
          senderVerified: true,
          fromCity: "Berlin",
          toCity: "Rome",
          weight: "12.0",
          description: "Art supplies - canvases and painting materials",
          collectionDate: "2024-05-25",
          deliveryDate: "2024-05-28",
          status: "pending",
          offerAmount: "200",
          createdAt: new Date().toISOString(),
          urgency: "standard",
          packageType: "Art",
        },
        {
          id: 5,
          senderId: 6,
          senderName: "Lisa Martinez",
          senderRating: "4.7",
          senderVerified: false,
          fromCity: "Miami",
          toCity: "Atlanta",
          weight: "6.5",
          description: "Fashion items - designer clothing and accessories",
          collectionDate: "2024-05-16",
          deliveryDate: "2024-05-18",
          status: "pending",
          offerAmount: "110",
          createdAt: new Date().toISOString(),
          urgency: "express",
          packageType: "Fashion",
        },
        {
          id: 6,
          senderId: 7,
          senderName: "David Lee",
          senderRating: "4.9",
          senderVerified: true,
          fromCity: "Toronto",
          toCity: "Montreal",
          weight: "4.0",
          description: "Medical supplies - non-prescription items",
          collectionDate: "2024-05-14",
          deliveryDate: "2024-05-15",
          status: "pending",
          offerAmount: "95",
          createdAt: new Date().toISOString(),
          urgency: "urgent",
          packageType: "Medical",
        },
      ];

      res.json(packages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch packages" });
    }
  });

  // Payment API endpoints
  app.post("/api/payments/checkout-session", async (req, res) => {
    try {
      // Mock payment intent creation for demo
      const { matchRequestId, amount } = req.body;
      const clientSecret = `pi_mock_${matchRequestId}_secret`;
      res.json({ clientSecret });
    } catch (error) {
      res.status(500).json({ error: "Failed to create payment session" });
    }
  });

  app.post("/api/webhooks/stripe", async (req, res) => {
    try {
      // Mock webhook handler for payment success
      const { type, data } = req.body;
      if (type === "payment_intent.succeeded") {
        const matchRequestId = parseInt(data.metadata.matchRequestId);
        await storage.updateMatchRequestPayment(
          matchRequestId,
          "succeeded",
          "held",
          data.id
        );
      }
      res.json({ received: true });
    } catch (error) {
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  const httpServer = createServer(app);
  // Debug endpoint for form testing
  app.post("/api/debug/send-package", (req, res) => {
    console.log("Send Package Form Data:", req.body);
    res.json({ success: true, data: req.body });
  });

  app.post("/api/debug/add-trip", (req, res) => {
    console.log("Add Trip Form Data:", req.body);
    res.json({ success: true, data: req.body });
  });

  // Quote endpoint for landing page
  app.get("/api/quote", (req, res) => {
    const { from, to } = req.query;

    // Simulate calculation with mock data
    // In production, this would calculate based on distance, weight, etc.
    const regularPrice = Math.floor(Math.random() * 150) + 200; // $200-350
    const airbarPrice = Math.floor(regularPrice * 0.32); // ~68% savings
    const savings = regularPrice - airbarPrice;
    const savingsPercentage = Math.round((savings / regularPrice) * 100);

    // Ensure savings are at least 60% as per requirements
    const finalSavingsPercentage = Math.max(60, savingsPercentage);
    const finalAirbarPrice = Math.floor(
      regularPrice * (1 - finalSavingsPercentage / 100)
    );

    setTimeout(() => {
      res.json({
        regularPrice,
        airbarPrice: finalAirbarPrice,
        savings: regularPrice - finalAirbarPrice,
        savingsPercentage: finalSavingsPercentage,
        from,
        to,
      });
    }, 400); // Simulate network delay under 2s
  });

  // Public stats endpoint for landing page
  app.get("/api/public/stats", (req, res) => {
    res.json({
      totalUsers: 25000,
      packagesDelivered: 150000,
      countriesServed: 45,
      avgSavings: 68,
    });
  });

  // Location API endpoints
  app.get("/api/locations/search", (req, res) => {
    const { query } = req.query;

    if (!query || typeof query !== "string" || query.length < 2) {
      return res.json([]);
    }

    // Mock location search - in production would use a real geocoding API
    const mockResults = [
      {
        id: "loc_" + query.toLowerCase().replace(/\s/g, "_"),
        type: "city" as const,
        name: query,
        state: "State",
        country: "United States",
        countryCode: "US",
        lat: 40.7128,
        lon: -74.006,
      },
    ];

    res.json(mockResults);
  });

  app.get("/api/locations/recent", (req, res) => {
    // Return empty array for now - in production would track user's recent locations
    res.json([]);
  });

  app.get("/api/locations/favorites", (req, res) => {
    // Return empty array for now - in production would return user's saved favorites
    res.json([]);
  });

  // Match discovery endpoint
  app.get("/api/matches/discover", async (req, res) => {
    try {
      const { userType, origin, destination, dateRange, filters } = req.query;

      // Validate required parameters
      if (!userType || !origin || !destination) {
        return res.status(400).json({
          error: "Missing required parameters: userType, origin, destination",
        });
      }

      let matches = [];

      if (userType === "sender") {
        // Senders looking for travelers (trips)
        matches = await storage.discoverTravelersForSenders({
          origin: origin as string,
          destination: destination as string,
          dateRange: dateRange ? JSON.parse(dateRange as string) : null,
          filters: filters ? JSON.parse(filters as string) : {},
        });
      } else if (userType === "traveler") {
        // Travelers looking for packages (parcel requests)
        matches = await storage.discoverPackagesForTravelers({
          origin: origin as string,
          destination: destination as string,
          dateRange: dateRange ? JSON.parse(dateRange as string) : null,
          filters: filters ? JSON.parse(filters as string) : {},
        });
      } else {
        return res
          .status(400)
          .json({ error: "Invalid userType. Must be 'sender' or 'traveler'" });
      }

      res.json({
        success: true,
        matches,
        pagination: {
          total: matches.length,
          page: 1,
          limit: 20,
        },
      });
    } catch (error) {
      console.error("Match discovery error:", error);
      res.status(500).json({ error: "Failed to discover matches" });
    }
  });

  // Match request creation endpoint
  app.post("/api/matches/request", async (req, res) => {
    try {
      const {
        targetUserId,
        packageRequestId,
        travelProfileId,
        proposedPrice,
        message,
        urgency,
        terms,
      } = req.body;
      const currentUserId = (req as any).user?.id || 1; // Use authenticated user in production

      // Validate required parameters
      if (!targetUserId || !proposedPrice) {
        return res.status(400).json({
          error: "Missing required parameters: targetUserId, proposedPrice",
        });
      }

      // Create match request
      const matchRequest = await storage.createMatchRequest({
        senderId: currentUserId,
        travelerId: targetUserId,
        tripId: travelProfileId,
        parcelId: packageRequestId,
        weight: 1, // Would be derived from package request
        reward: proposedPrice.toString(),
        message: message || "",
        category: "general",
        urgency: urgency || "standard",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      });

      // Send notification to traveler about new match request
      await notificationService.notifyMatchRequest(matchRequest);

      res.json({
        success: true,
        matchRequest: {
          id: matchRequest.id,
          status: matchRequest.status,
          expiresAt: matchRequest.expiresAt,
          createdAt: matchRequest.createdAt,
        },
        estimatedResponseTime: "4 hours",
      });
    } catch (error) {
      console.error("Match request creation error:", error);
      res.status(500).json({ error: "Failed to create match request" });
    }
  });

  // User matches endpoint
  app.get("/api/matches/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid userId parameter" });
      }

      const matches = await storage.getUserMatches(userId);
      res.json(matches);
    } catch (error) {
      console.error("Get user matches error:", error);
      res.status(500).json({ error: "Failed to retrieve user matches" });
    }
  });

  // Notification endpoints - validation disabled temporarily
  app.post("/api/notifications/send", async (req, res) => {
    try {
      // Validate input using Zod schema - DISABLED
      // const validationResult = createNotificationSchema.safeParse(req.body);
      // if (!validationResult.success) {
      //   return res.status(400).json({
      //     error: "Invalid input parameters",
      //     details: validationResult.error.errors,
      //   });
      // }

      const { userId, title, message, type } = req.body;

      // Create notification using service
      const notification = await notificationService.createNotification({
        userId,
        title,
        message,
        type,
      });

      res.status(201).json({
        success: true,
        notification: {
          id: notification.id,
          userId: notification.userId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
        },
      });
    } catch (error) {
      console.error("Notification creation error:", error);
      res.status(500).json({ error: "Failed to create notification" });
    }
  });

  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { page = 1, limit = 20, unreadOnly } = req.query;

      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid userId parameter" });
      }

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const showUnreadOnly = unreadOnly === "true";

      // Get notifications with pagination using service
      const result = await notificationService.getUserNotifications(userId, {
        page: pageNum,
        limit: limitNum,
        unreadOnly: showUnreadOnly,
      });

      res.json({
        success: true,
        notifications: result.notifications,
        pagination: {
          total: result.total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(result.total / limitNum),
          hasNext: pageNum * limitNum < result.total,
          hasPrev: pageNum > 1,
        },
      });
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ error: "Failed to retrieve notifications" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const { isRead = true } = req.body;

      if (isNaN(notificationId)) {
        return res
          .status(400)
          .json({ error: "Invalid notification ID parameter" });
      }

      const notification = await notificationService.markAsRead(
        notificationId,
        isRead
      );

      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      res.json({
        success: true,
        notification: {
          id: notification.id,
          isRead: notification.isRead,
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Mark notification as read error:", error);
      res.status(500).json({ error: "Failed to update notification" });
    }
  });

  // Get unread notification count
  app.get("/api/notifications/:userId/unread-count", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid userId parameter" });
      }

      const count = await notificationService.getUnreadCount(userId);
      res.json({ unreadCount: count });
    } catch (error) {
      console.error("Get unread count error:", error);
      res.status(500).json({ error: "Failed to get unread count" });
    }
  });

  // Unified matches endpoint
  app.get("/api/user/matches", (req, res) => {
    const { status } = req.query;

    // Mock matches data with various statuses
    const allMatches = [
      // Pending matches
      {
        id: 1,
        tripId: 1,
        parcelId: 1,
        senderId: 1,
        travelerId: 2,
        senderName: "Alex Kim",
        travelerName: "Sarah Johnson",
        fromCity: "San Francisco, CA",
        toCity: "Los Angeles, CA",
        departureDate: "2025-01-25",
        weight: 2.5,
        reward: 35,
        category: "Electronics",
        status: "pending",
        createdAt: "2025-01-20T10:00:00Z",
        hasNewMessage: true,
      },
      {
        id: 2,
        tripId: 2,
        parcelId: 2,
        senderId: 3,
        travelerId: 1,
        senderName: "Mike Chen",
        travelerName: "Alex Kim",
        fromCity: "New York, NY",
        toCity: "Boston, MA",
        departureDate: "2025-01-28",
        weight: 1.8,
        reward: 25,
        category: "Documents",
        status: "accepted",
        acceptedAt: "2025-01-21T14:30:00Z",
        createdAt: "2025-01-20T12:00:00Z",
      },
      // Active matches
      {
        id: 3,
        tripId: 3,
        parcelId: 3,
        senderId: 1,
        travelerId: 4,
        senderName: "Alex Kim",
        travelerName: "Emma Davis",
        fromCity: "Seattle, WA",
        toCity: "Portland, OR",
        departureDate: "2025-01-22",
        weight: 3.2,
        reward: 40,
        category: "Clothing",
        status: "paid",
        paymentStatus: "completed",
        escrowStatus: "held",
        escrowAmount: 40,
        paidAt: "2025-01-20T16:00:00Z",
        createdAt: "2025-01-19T10:00:00Z",
      },
      {
        id: 4,
        tripId: 4,
        parcelId: 4,
        senderId: 5,
        travelerId: 1,
        senderName: "Lisa Wong",
        travelerName: "Alex Kim",
        fromCity: "Chicago, IL",
        toCity: "Detroit, MI",
        departureDate: "2025-01-23",
        weight: 2.0,
        reward: 30,
        category: "Books",
        status: "in_transit",
        trackingStep: "in_transit",
        paymentStatus: "completed",
        escrowStatus: "held",
        escrowAmount: 30,
        createdAt: "2025-01-18T10:00:00Z",
      },
      // Completed matches
      {
        id: 5,
        tripId: 5,
        parcelId: 5,
        senderId: 1,
        travelerId: 6,
        senderName: "Alex Kim",
        travelerName: "John Martinez",
        fromCity: "Miami, FL",
        toCity: "Orlando, FL",
        departureDate: "2025-01-15",
        weight: 1.5,
        reward: 20,
        category: "Electronics",
        status: "delivered",
        trackingStep: "delivered",
        paymentStatus: "released",
        escrowStatus: "released",
        deliveredAt: "2025-01-16T18:00:00Z",
        createdAt: "2025-01-10T10:00:00Z",
        rating: 5,
      },
      {
        id: 6,
        tripId: 6,
        parcelId: 6,
        senderId: 7,
        travelerId: 1,
        senderName: "Robert Taylor",
        travelerName: "Alex Kim",
        fromCity: "Denver, CO",
        toCity: "Phoenix, AZ",
        departureDate: "2025-01-12",
        weight: 4.0,
        reward: 50,
        category: "Gifts",
        status: "cancelled",
        createdAt: "2025-01-08T10:00:00Z",
      },
    ];

    // Filter by status if provided
    if (status && status !== "all") {
      const filtered = allMatches.filter(match => match.status === status);
      return res.json(filtered);
    }

    res.json(allMatches);
  });

  // Verification API endpoints - DISABLED temporarily
  app.post("/api/verification/initiate", async (req, res) => {
    try {
      const userId = (req as any).user?.id || 1; // Use authenticated user in production
      // const validationResult = initiateVerificationSchema.safeParse(req.body);

      // if (!validationResult.success) {
      //   return res.status(400).json({
      //     error: "Invalid input parameters",
      //     details: validationResult.error.errors,
      //   });
      // }

      const { verificationType } = req.body;
      const verification = await verificationService.initiateVerification(
        userId,
        verificationType
      );

      res.status(201).json({
        success: true,
        verification: {
          id: verification.id,
          status: verification.status,
          verificationLevel: verification.verificationLevel,
          expiresAt: verification.expiresAt,
          createdAt: verification.createdAt,
        },
        requiredDocuments: getRequiredDocuments(verificationType),
        nextSteps: [
          "Upload required identity documents",
          "Wait for document processing (2-5 minutes)",
          "Receive verification status notification",
        ],
      });
    } catch (error) {
      console.error("Verification initiation error:", error);
      res
        .status(500)
        .json({ error: "Failed to initiate verification process" });
    }
  });

  app.post("/api/verification/upload-document", async (req, res) => {
    try {
      // In production, this would use proper file upload middleware like multer
      const { verificationId, documentType, fileName, fileSize, mimeType } =
        req.body;

      // Validate file type and size
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(mimeType)) {
        return res
          .status(400)
          .json({
            error:
              "Invalid file type. Only JPEG, PNG, and PDF files are allowed.",
          });
      }

      if (fileSize > maxSize) {
        return res
          .status(400)
          .json({ error: "File size too large. Maximum 5MB allowed." });
      }

      // Mock encrypted file path (in production, files would be encrypted and stored securely)
      const encryptedPath = `/secure/verification/${verificationId}/${Date.now()}_${documentType}`;

      const document = await verificationService.uploadDocument(
        verificationId,
        documentType,
        {
          fileName,
          fileSize,
          mimeType,
          encryptedPath,
        }
      );

      res.status(201).json({
        success: true,
        document: {
          id: document.id,
          documentType: document.documentType,
          status: document.status,
          uploadedAt: document.uploadedAt,
        },
        estimatedProcessingTime: "2-5 minutes",
      });
    } catch (error) {
      console.error("Document upload error:", error);
      res.status(500).json({ error: "Failed to upload document" });
    }
  });

  app.post("/api/verification/webhook", async (req, res) => {
    try {
      // Validate webhook payload - DISABLED
      // const validationResult = verificationWebhookSchema.safeParse(req.body);

      // if (!validationResult.success) {
      //   return res.status(400).json({
      //     error: "Invalid webhook payload",
      //     details: validationResult.error.errors,
      //   });
      // }

      // In production, verify webhook signature for security
      await verificationService.handleProviderWebhook(req.body);

      res.json({ received: true });
    } catch (error) {
      console.error("Verification webhook error:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  app.get("/api/verification/status/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid userId parameter" });
      }

      const status = await verificationService.getVerificationStatus(userId);

      res.json({
        success: true,
        verification: status.verification,
        documents: status.documents.map(doc => ({
          id: doc.id,
          documentType: doc.documentType,
          status: doc.status,
          uploadedAt: doc.uploadedAt,
          reviewedAt: doc.reviewedAt,
        })),
        trustScoreHistory: status.trustScoreHistory.map(entry => ({
          id: entry.id,
          previousScore: entry.previousScore,
          newScore: entry.newScore,
          changeReason: entry.changeReason,
          changeAmount: entry.changeAmount,
          createdAt: entry.createdAt,
        })),
      });
    } catch (error) {
      console.error("Verification status error:", error);
      res.status(500).json({ error: "Failed to retrieve verification status" });
    }
  });

  app.get("/api/verification/trust-score/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid userId parameter" });
      }

      const trustData = await verificationService.getUserTrustScore(userId);

      res.json({
        success: true,
        trustScore: trustData.trustScore,
        verificationLevel: trustData.verificationLevel,
        rating: getTrustRating(trustData.trustScore),
        benefits: getTrustBenefits(trustData.trustScore),
      });
    } catch (error) {
      console.error("Trust score error:", error);
      res.status(500).json({ error: "Failed to retrieve trust score" });
    }
  });

  app.put("/api/verification/manual-review", async (req, res) => {
    try {
      // This endpoint would be used by admin users for manual review
      const { verificationId, action, notes } = req.body;

      // In production, this would require admin authentication
      if (action === "approve") {
        await verificationService.approveVerification(verificationId);
      }

      res.json({
        success: true,
        action: `Verification ${action}d successfully`,
      });
    } catch (error) {
      console.error("Manual review error:", error);
      res.status(500).json({ error: "Failed to process manual review" });
    }
  });

  return httpServer;
}

// Helper functions
function getRequiredDocuments(verificationType: string): string[] {
  switch (verificationType) {
    case "basic":
      return ["passport"];
    case "standard":
      return ["passport", "utility_bill"];
    case "premium":
      return ["passport", "utility_bill", "selfie"];
    default:
      return ["passport"];
  }
}

function getTrustRating(score: number): string {
  if (score >= 4.5) return "Excellent";
  if (score >= 4.0) return "Very Good";
  if (score >= 3.5) return "Good";
  if (score >= 3.0) return "Fair";
  return "New User";
}

function getTrustBenefits(score: number): string[] {
  const benefits = [];

  if (score >= 3.0) benefits.push("Basic marketplace access");
  if (score >= 3.5) benefits.push("Higher priority in matching");
  if (score >= 4.0) benefits.push("Lower escrow fees");
  if (score >= 4.5) benefits.push("Premium support access");

  return benefits;
}
