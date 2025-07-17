import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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
        lastUpdated: new Date().toISOString()
      };
      
      // Set cache headers for 5 minutes
      res.set('Cache-Control', 'public, max-age=300');
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
      const disputes = await storage.getUserDisputes(parseInt(req.params.userId));
      res.json(disputes);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user disputes" });
    }
  });

  app.post("/api/disputes/:id/timeline", async (req, res) => {
    try {
      const dispute = await storage.addDisputeTimeline(parseInt(req.params.id), req.body);
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
        payload: req.body.offer
      };
      const dispute = await storage.updateDisputeStatus(parseInt(req.params.id), "offer", timelineEntry);
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
      const userId = req.user?.id || 1; // Use authenticated user in production
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
          description: "Electronics - laptop and accessories, requires careful handling",
          collectionDate: "2024-05-15",
          deliveryDate: "2024-05-18",
          status: "pending",
          offerAmount: "125",
          createdAt: new Date().toISOString(),
          urgency: "express",
          packageType: "Electronics"
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
          description: "Documents - important business papers in sealed envelope",
          collectionDate: "2024-05-12",
          deliveryDate: "2024-05-14",
          status: "pending",
          offerAmount: "85",
          createdAt: new Date().toISOString(),
          urgency: "urgent",
          packageType: "Documents"
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
          description: "Gift package - birthday presents, fragile items included",
          collectionDate: "2024-05-20",
          deliveryDate: "2024-05-22",
          status: "pending",
          offerAmount: "150",
          createdAt: new Date().toISOString(),
          urgency: "standard",
          packageType: "Gift"
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
          packageType: "Art"
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
          packageType: "Fashion"
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
          packageType: "Medical"
        }
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

  // Location API endpoints
  app.get("/api/locations/search", (req, res) => {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string' || query.length < 2) {
      return res.json([]);
    }
    
    // Mock location search - in production would use a real geocoding API
    const mockResults = [
      {
        id: "loc_" + query.toLowerCase().replace(/\s/g, '_'),
        type: "city" as const,
        name: query,
        state: "State",
        country: "United States",
        countryCode: "US",
        lat: 40.7128,
        lon: -74.0060
      }
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

  return httpServer;
}
