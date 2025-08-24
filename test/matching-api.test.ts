import { describe, test, expect, beforeAll } from "vitest";
import request from "supertest";
import express from "express";
import { registerRoutes } from "../server/routes";

describe("MatchingService API", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    await registerRoutes(app);
  });

  describe("GET /api/matches/discover", () => {
    test("should return matches for sender userType", async () => {
      const response = await request(app).get("/api/matches/discover").query({
        userType: "sender",
        origin: "New York",
        destination: "Los Angeles",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("matches");
      expect(response.body).toHaveProperty("pagination");
      expect(Array.isArray(response.body.matches)).toBe(true);
    });

    test("should return matches for traveler userType", async () => {
      const response = await request(app).get("/api/matches/discover").query({
        userType: "traveler",
        origin: "San Francisco",
        destination: "Seattle",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("matches");
      expect(Array.isArray(response.body.matches)).toBe(true);
    });

    test("should return error for missing required parameters", async () => {
      const response = await request(app).get("/api/matches/discover").query({
        userType: "sender",
        // Missing origin and destination
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    test("should return error for invalid userType", async () => {
      const response = await request(app).get("/api/matches/discover").query({
        userType: "invalid",
        origin: "New York",
        destination: "Los Angeles",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /api/matches/request", () => {
    test("should create a match request", async () => {
      const matchRequestData = {
        targetUserId: 2,
        proposedPrice: 50,
        message: "I'd like you to carry my package",
        urgency: "standard",
      };

      const response = await request(app)
        .post("/api/matches/request")
        .send(matchRequestData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("matchRequest");
      expect(response.body.matchRequest).toHaveProperty("id");
      expect(response.body.matchRequest).toHaveProperty("status");
    });

    test("should return error for missing required parameters", async () => {
      const response = await request(app).post("/api/matches/request").send({
        message: "Test message",
        // Missing targetUserId and proposedPrice
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/matches/:userId", () => {
    test("should return user matches", async () => {
      const response = await request(app).get("/api/matches/1");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test("should return error for invalid userId", async () => {
      const response = await request(app).get("/api/matches/invalid");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });
});
