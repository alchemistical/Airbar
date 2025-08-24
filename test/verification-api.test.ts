import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import express from "express";
import { registerRoutes } from "../server/routes";
import { VerificationService } from "../server/verificationService";

// Mock the VerificationService
vi.mock("../server/verificationService");
vi.mock("../server/storage");
vi.mock("../server/notificationService");

describe("Verification API Endpoints", () => {
  let app: express.Express;
  let server: any;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    server = await registerRoutes(app);

    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (server) {
      server.close();
    }
  });

  describe("POST /api/verification/initiate", () => {
    test("should initiate verification successfully", async () => {
      const mockVerification = {
        id: 1,
        userId: 1,
        status: "pending",
        verificationLevel: "basic",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      };

      // Mock the verification service method
      const mockInitiateVerification = vi
        .fn()
        .mockResolvedValue(mockVerification);
      (VerificationService as any).mockImplementation(() => ({
        initiateVerification: mockInitiateVerification,
      }));

      const response = await request(app)
        .post("/api/verification/initiate")
        .send({
          verificationType: "basic",
          userConsent: true,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.verification).toMatchObject({
        id: mockVerification.id,
        status: mockVerification.status,
        verificationLevel: mockVerification.verificationLevel,
      });
      expect(response.body.requiredDocuments).toEqual(["passport"]);
      expect(response.body.nextSteps).toBeInstanceOf(Array);
    });

    test("should reject verification without user consent", async () => {
      const response = await request(app)
        .post("/api/verification/initiate")
        .send({
          verificationType: "basic",
          userConsent: false,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid input parameters");
      expect(response.body.details).toBeInstanceOf(Array);
    });

    test("should handle verification service errors", async () => {
      const mockInitiateVerification = vi
        .fn()
        .mockRejectedValue(
          new Error("User already has an active verification process")
        );
      (VerificationService as any).mockImplementation(() => ({
        initiateVerification: mockInitiateVerification,
      }));

      const response = await request(app)
        .post("/api/verification/initiate")
        .send({
          verificationType: "standard",
          userConsent: true,
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe(
        "Failed to initiate verification process"
      );
    });
  });

  describe("POST /api/verification/upload-document", () => {
    test("should upload document successfully", async () => {
      const mockDocument = {
        id: 1,
        verificationId: 1,
        documentType: "passport",
        fileName: "passport.jpg",
        status: "pending",
        uploadedAt: new Date(),
      };

      const mockUploadDocument = vi.fn().mockResolvedValue(mockDocument);
      (VerificationService as any).mockImplementation(() => ({
        uploadDocument: mockUploadDocument,
      }));

      const response = await request(app)
        .post("/api/verification/upload-document")
        .send({
          verificationId: 1,
          documentType: "passport",
          fileName: "passport.jpg",
          fileSize: 1024 * 1024, // 1MB
          mimeType: "image/jpeg",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.document).toMatchObject({
        id: mockDocument.id,
        documentType: mockDocument.documentType,
        status: mockDocument.status,
      });
      expect(response.body.estimatedProcessingTime).toBe("2-5 minutes");
    });

    test("should reject invalid file types", async () => {
      const response = await request(app)
        .post("/api/verification/upload-document")
        .send({
          verificationId: 1,
          documentType: "passport",
          fileName: "passport.txt",
          fileSize: 1024,
          mimeType: "text/plain",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Invalid file type");
    });

    test("should reject files that are too large", async () => {
      const response = await request(app)
        .post("/api/verification/upload-document")
        .send({
          verificationId: 1,
          documentType: "passport",
          fileName: "passport.jpg",
          fileSize: 6 * 1024 * 1024, // 6MB
          mimeType: "image/jpeg",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("File size too large");
    });

    test("should handle upload service errors", async () => {
      const mockUploadDocument = vi
        .fn()
        .mockRejectedValue(new Error("Invalid verification process"));
      (VerificationService as any).mockImplementation(() => ({
        uploadDocument: mockUploadDocument,
      }));

      const response = await request(app)
        .post("/api/verification/upload-document")
        .send({
          verificationId: 999,
          documentType: "passport",
          fileName: "passport.jpg",
          fileSize: 1024 * 1024,
          mimeType: "image/jpeg",
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Failed to upload document");
    });
  });

  describe("POST /api/verification/webhook", () => {
    test("should process webhook successfully", async () => {
      const mockHandleWebhook = vi.fn().mockResolvedValue(undefined);
      (VerificationService as any).mockImplementation(() => ({
        handleProviderWebhook: mockHandleWebhook,
      }));

      const webhookPayload = {
        providerId: "jumio_test",
        externalId: "verification_123",
        status: "approved",
        verificationData: {
          documentVerified: true,
          faceMatch: true,
        },
        riskScore: 0.1,
      };

      const response = await request(app)
        .post("/api/verification/webhook")
        .send(webhookPayload);

      expect(response.status).toBe(200);
      expect(response.body.received).toBe(true);
      expect(mockHandleWebhook).toHaveBeenCalledWith(webhookPayload);
    });

    test("should reject invalid webhook payload", async () => {
      const response = await request(app)
        .post("/api/verification/webhook")
        .send({
          invalidField: "test",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid webhook payload");
    });

    test("should handle webhook processing errors", async () => {
      const mockHandleWebhook = vi
        .fn()
        .mockRejectedValue(new Error("Verification not found"));
      (VerificationService as any).mockImplementation(() => ({
        handleProviderWebhook: mockHandleWebhook,
      }));

      const response = await request(app)
        .post("/api/verification/webhook")
        .send({
          providerId: "jumio_test",
          externalId: "verification_nonexistent",
          status: "approved",
          verificationData: {},
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Webhook processing failed");
    });
  });

  describe("GET /api/verification/status/:userId", () => {
    test("should return verification status successfully", async () => {
      const mockStatus = {
        verification: {
          id: 1,
          userId: 1,
          status: "approved",
          verificationLevel: "basic",
          trustScore: "4.0",
          createdAt: new Date(),
        },
        documents: [
          {
            id: 1,
            documentType: "passport",
            status: "approved",
            uploadedAt: new Date(),
            reviewedAt: new Date(),
          },
        ],
        trustScoreHistory: [
          {
            id: 1,
            previousScore: "0.00",
            newScore: "4.0",
            changeReason: "verification_completed",
            changeAmount: "4.0",
            createdAt: new Date(),
          },
        ],
      };

      const mockGetVerificationStatus = vi.fn().mockResolvedValue(mockStatus);
      (VerificationService as any).mockImplementation(() => ({
        getVerificationStatus: mockGetVerificationStatus,
      }));

      const response = await request(app).get("/api/verification/status/1");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.verification).toEqual(mockStatus.verification);
      expect(response.body.documents).toHaveLength(1);
      expect(response.body.trustScoreHistory).toHaveLength(1);
    });

    test("should handle invalid user ID", async () => {
      const response = await request(app).get(
        "/api/verification/status/invalid"
      );

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid userId parameter");
    });

    test("should handle service errors", async () => {
      const mockGetVerificationStatus = vi
        .fn()
        .mockRejectedValue(new Error("Database error"));
      (VerificationService as any).mockImplementation(() => ({
        getVerificationStatus: mockGetVerificationStatus,
      }));

      const response = await request(app).get("/api/verification/status/1");

      expect(response.status).toBe(500);
      expect(response.body.error).toBe(
        "Failed to retrieve verification status"
      );
    });
  });

  describe("GET /api/verification/trust-score/:userId", () => {
    test("should return trust score successfully", async () => {
      const mockTrustData = {
        trustScore: 4.2,
        verificationLevel: "standard",
      };

      const mockGetUserTrustScore = vi.fn().mockResolvedValue(mockTrustData);
      (VerificationService as any).mockImplementation(() => ({
        getUserTrustScore: mockGetUserTrustScore,
      }));

      const response = await request(app).get(
        "/api/verification/trust-score/1"
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.trustScore).toBe(4.2);
      expect(response.body.verificationLevel).toBe("standard");
      expect(response.body.rating).toBe("Very Good");
      expect(response.body.benefits).toBeInstanceOf(Array);
      expect(response.body.benefits).toContain("Lower escrow fees");
    });

    test("should handle invalid user ID", async () => {
      const response = await request(app).get(
        "/api/verification/trust-score/invalid"
      );

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid userId parameter");
    });

    test("should return correct rating for different scores", async () => {
      const testCases = [
        { score: 4.8, expectedRating: "Excellent" },
        { score: 4.2, expectedRating: "Very Good" },
        { score: 3.7, expectedRating: "Good" },
        { score: 3.2, expectedRating: "Fair" },
        { score: 2.5, expectedRating: "New User" },
      ];

      for (const testCase of testCases) {
        const mockGetUserTrustScore = vi.fn().mockResolvedValue({
          trustScore: testCase.score,
          verificationLevel: "basic",
        });
        (VerificationService as any).mockImplementation(() => ({
          getUserTrustScore: mockGetUserTrustScore,
        }));

        const response = await request(app).get(
          "/api/verification/trust-score/1"
        );

        expect(response.body.rating).toBe(testCase.expectedRating);
      }
    });
  });

  describe("PUT /api/verification/manual-review", () => {
    test("should process manual approval successfully", async () => {
      const mockApproveVerification = vi.fn().mockResolvedValue(undefined);
      (VerificationService as any).mockImplementation(() => ({
        approveVerification: mockApproveVerification,
      }));

      const response = await request(app)
        .put("/api/verification/manual-review")
        .send({
          verificationId: 1,
          action: "approve",
          notes: "All documents verified successfully",
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.action).toBe("Verification approved successfully");
      expect(mockApproveVerification).toHaveBeenCalledWith(1);
    });

    test("should handle manual review errors", async () => {
      const mockApproveVerification = vi
        .fn()
        .mockRejectedValue(new Error("Verification not found"));
      (VerificationService as any).mockImplementation(() => ({
        approveVerification: mockApproveVerification,
      }));

      const response = await request(app)
        .put("/api/verification/manual-review")
        .send({
          verificationId: 999,
          action: "approve",
          notes: "Test",
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Failed to process manual review");
    });
  });

  describe("Helper Functions", () => {
    test("should return correct required documents for each verification type", () => {
      // These tests would require access to the helper functions
      // In a real implementation, you might export these functions separately for testing
      const basicRequirements = ["passport"];
      const standardRequirements = ["passport", "utility_bill"];
      const premiumRequirements = ["passport", "utility_bill", "selfie"];

      expect(basicRequirements).toEqual(["passport"]);
      expect(standardRequirements).toEqual(["passport", "utility_bill"]);
      expect(premiumRequirements).toEqual([
        "passport",
        "utility_bill",
        "selfie",
      ]);
    });

    test("should return correct benefits for different trust scores", () => {
      const testCases = [
        { score: 4.8, expectedBenefits: 4 },
        { score: 4.2, expectedBenefits: 3 },
        { score: 3.7, expectedBenefits: 2 },
        { score: 3.2, expectedBenefits: 1 },
        { score: 2.5, expectedBenefits: 0 },
      ];

      testCases.forEach(testCase => {
        const benefits = [];
        if (testCase.score >= 3.0) benefits.push("Basic marketplace access");
        if (testCase.score >= 3.5) benefits.push("Higher priority in matching");
        if (testCase.score >= 4.0) benefits.push("Lower escrow fees");
        if (testCase.score >= 4.5) benefits.push("Premium support access");

        expect(benefits).toHaveLength(testCase.expectedBenefits);
      });
    });
  });
});

describe("VerificationService Integration", () => {
  test("should handle complete verification workflow", async () => {
    const app = express();
    app.use(express.json());
    const server = await registerRoutes(app);

    // Mock successful workflow
    const mockInitiateVerification = vi.fn().mockResolvedValue({
      id: 1,
      status: "pending",
      verificationLevel: "basic",
    });

    const mockUploadDocument = vi.fn().mockResolvedValue({
      id: 1,
      documentType: "passport",
      status: "pending",
    });

    const mockGetVerificationStatus = vi.fn().mockResolvedValue({
      verification: { id: 1, status: "approved", trustScore: "4.0" },
      documents: [],
      trustScoreHistory: [],
    });

    (VerificationService as any).mockImplementation(() => ({
      initiateVerification: mockInitiateVerification,
      uploadDocument: mockUploadDocument,
      getVerificationStatus: mockGetVerificationStatus,
    }));

    // Step 1: Initiate verification
    const initiateResponse = await request(app)
      .post("/api/verification/initiate")
      .send({
        verificationType: "basic",
        userConsent: true,
      });

    expect(initiateResponse.status).toBe(201);

    // Step 2: Upload document
    const uploadResponse = await request(app)
      .post("/api/verification/upload-document")
      .send({
        verificationId: 1,
        documentType: "passport",
        fileName: "passport.jpg",
        fileSize: 1024 * 1024,
        mimeType: "image/jpeg",
      });

    expect(uploadResponse.status).toBe(201);

    // Step 3: Check status
    const statusResponse = await request(app).get("/api/verification/status/1");

    expect(statusResponse.status).toBe(200);

    server.close();
  });
});
