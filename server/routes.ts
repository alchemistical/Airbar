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
  return httpServer;
}
