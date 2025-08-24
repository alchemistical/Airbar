import { describe, test, expect, beforeAll } from "vitest";
import request from "supertest";
import express from "express";
import { registerRoutes } from "../server/routes";

describe("NotificationService API", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    await registerRoutes(app);
  });

  describe("POST /api/notifications/send", () => {
    test("should create a new notification", async () => {
      const notificationData = {
        userId: 1,
        title: "Test Notification",
        message: "This is a test notification",
        type: "info",
      };

      const response = await request(app)
        .post("/api/notifications/send")
        .send(notificationData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("notification");
      expect(response.body.notification).toHaveProperty("id");
      expect(response.body.notification).toHaveProperty("userId", 1);
      expect(response.body.notification).toHaveProperty(
        "title",
        "Test Notification"
      );
      expect(response.body.notification).toHaveProperty(
        "message",
        "This is a test notification"
      );
      expect(response.body.notification).toHaveProperty("type", "info");
      expect(response.body.notification).toHaveProperty("isRead", false);
    });

    test("should validate required fields", async () => {
      const response = await request(app).post("/api/notifications/send").send({
        userId: 1,
        // Missing title and message
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    test("should validate field lengths", async () => {
      const response = await request(app).post("/api/notifications/send").send({
        userId: 1,
        title: "", // Empty title
        message: "Test message",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    test("should default to info type when not specified", async () => {
      const response = await request(app).post("/api/notifications/send").send({
        userId: 1,
        title: "Test",
        message: "Test message",
        // No type specified
      });

      expect(response.status).toBe(201);
      expect(response.body.notification).toHaveProperty("type", "info");
    });
  });

  describe("GET /api/notifications/:userId", () => {
    test("should return user notifications with pagination", async () => {
      const response = await request(app)
        .get("/api/notifications/1")
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("notifications");
      expect(response.body).toHaveProperty("pagination");
      expect(Array.isArray(response.body.notifications)).toBe(true);

      // Check pagination structure
      expect(response.body.pagination).toHaveProperty("total");
      expect(response.body.pagination).toHaveProperty("page", 1);
      expect(response.body.pagination).toHaveProperty("limit", 10);
      expect(response.body.pagination).toHaveProperty("totalPages");
      expect(response.body.pagination).toHaveProperty("hasNext");
      expect(response.body.pagination).toHaveProperty("hasPrev");
    });

    test("should filter unread notifications only", async () => {
      const response = await request(app)
        .get("/api/notifications/1")
        .query({ unreadOnly: "true" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("notifications");
      // All returned notifications should be unread
      response.body.notifications.forEach((notification: any) => {
        expect(notification.isRead).toBe(false);
      });
    });

    test("should handle invalid userId", async () => {
      const response = await request(app).get("/api/notifications/invalid");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PATCH /api/notifications/:id/read", () => {
    test("should mark notification as read", async () => {
      // First create a notification
      const createResponse = await request(app)
        .post("/api/notifications/send")
        .send({
          userId: 1,
          title: "Test Read Notification",
          message: "This will be marked as read",
        });

      const notificationId = createResponse.body.notification.id;

      // Then mark it as read
      const response = await request(app)
        .patch(`/api/notifications/${notificationId}/read`)
        .send({ isRead: true });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.notification).toHaveProperty("id", notificationId);
      expect(response.body.notification).toHaveProperty("isRead", true);
    });

    test("should mark notification as unread", async () => {
      // First create a notification
      const createResponse = await request(app)
        .post("/api/notifications/send")
        .send({
          userId: 1,
          title: "Test Unread Notification",
          message: "This will be marked as unread",
        });

      const notificationId = createResponse.body.notification.id;

      // Mark as read first, then unread
      await request(app)
        .patch(`/api/notifications/${notificationId}/read`)
        .send({ isRead: true });

      const response = await request(app)
        .patch(`/api/notifications/${notificationId}/read`)
        .send({ isRead: false });

      expect(response.status).toBe(200);
      expect(response.body.notification).toHaveProperty("isRead", false);
    });

    test("should handle invalid notification ID", async () => {
      const response = await request(app)
        .patch("/api/notifications/invalid/read")
        .send({ isRead: true });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    test("should handle non-existent notification", async () => {
      const response = await request(app)
        .patch("/api/notifications/99999/read")
        .send({ isRead: true });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/notifications/:userId/unread-count", () => {
    test("should return unread notification count", async () => {
      const response = await request(app).get(
        "/api/notifications/1/unread-count"
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("unreadCount");
      expect(typeof response.body.unreadCount).toBe("number");
      expect(response.body.unreadCount).toBeGreaterThanOrEqual(0);
    });

    test("should handle invalid userId", async () => {
      const response = await request(app).get(
        "/api/notifications/invalid/unread-count"
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("Integration with MatchingService", () => {
    test("should create notification when match request is created", async () => {
      // Get initial unread count
      const initialCountResponse = await request(app).get(
        "/api/notifications/2/unread-count"
      );
      const initialCount = initialCountResponse.body.unreadCount;

      // Create a match request (this should trigger a notification)
      await request(app).post("/api/matches/request").send({
        targetUserId: 2,
        proposedPrice: 50,
        message: "Please carry my package",
      });

      // Check that unread count increased
      const newCountResponse = await request(app).get(
        "/api/notifications/2/unread-count"
      );
      const newCount = newCountResponse.body.unreadCount;

      expect(newCount).toBe(initialCount + 1);

      // Check that the notification was created
      const notificationsResponse = await request(app)
        .get("/api/notifications/2")
        .query({ limit: 1 });

      expect(notificationsResponse.body.notifications[0]).toHaveProperty(
        "title",
        "New Match Request"
      );
    });
  });
});
