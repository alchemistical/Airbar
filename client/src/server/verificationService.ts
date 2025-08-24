// Temporary placeholder - verification service disabled due to missing schema tables
export class VerificationService {
  constructor() {
    // Placeholder
  }

  async initiateVerification(userId: number, verificationType: string = "basic"): Promise<any> {
    throw new Error("Verification service is temporarily disabled");
  }

  async uploadDocument(verificationId: number, documentType: string, fileData: any): Promise<any> {
    throw new Error("Verification service is temporarily disabled");
  }

  async approveVerification(verificationId: number): Promise<void> {
    throw new Error("Verification service is temporarily disabled");
  }

  async updateTrustScore(params: any): Promise<void> {
    throw new Error("Verification service is temporarily disabled");
  }

  async handleProviderWebhook(params: any): Promise<void> {
    throw new Error("Verification service is temporarily disabled");
  }

  async getVerificationById(id: number): Promise<any> {
    throw new Error("Verification service is temporarily disabled");
  }

  async getVerificationStatus(userId: number): Promise<any> {
    throw new Error("Verification service is temporarily disabled");
  }

  async getUserTrustScore(userId: number): Promise<any> {
    throw new Error("Verification service is temporarily disabled");
  }
}