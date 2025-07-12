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

  const httpServer = createServer(app);
  return httpServer;
}
