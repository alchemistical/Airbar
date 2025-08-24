import { User, Profile, KYCStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "./database";

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  phoneNumber?: string;
  languages?: string[];
  address?: string;
  city?: string;
  country?: string;
}

export class UserService {
  /**
   * Create a new user with profile
   */
  static async createUser(
    data: CreateUserData
  ): Promise<User & { profile: Profile }> {
    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash,
        emailVerified: false,
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return user as any; // TODO: Fix profile type mismatches
  }

  /**
   * Find user by email (for authentication)
   */
  static async findByEmail(
    email: string
  ): Promise<(User & { profile: Profile | null }) | null> {
    return await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  /**
   * Find user by ID with profile and statistics
   */
  static async findById(
    id: string
  ): Promise<(User & { profile: Profile | null }) | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        _count: {
          select: {
            trips: true,
            packages: true,
            senderMatches: true,
            travelerMatches: true,
          },
        },
      },
    });
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    data: UpdateProfileData
  ): Promise<Profile> {
    return await prisma.profile.update({
      where: { userId },
      data,
    });
  }

  /**
   * Update KYC status
   */
  static async updateKYCStatus(
    userId: string,
    status: KYCStatus,
    documents?: any[]
  ): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: status,
        profile: {
          update: {
            kycDocuments: documents || [],
          },
        },
      },
    });
  }

  /**
   * Verify password
   */
  static async verifyPassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.passwordHash);
  }

  /**
   * Get user dashboard metrics
   */
  static async getDashboardMetrics(userId: string) {
    const [
      user,
      activeTrips,
      pendingPackages,
      completedMatches,
      totalEarnings,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      }),
      prisma.trip.count({
        where: {
          travelerId: userId,
          status: "ACTIVE",
        },
      }),
      prisma.package.count({
        where: {
          senderId: userId,
          status: "PENDING",
        },
      }),
      prisma.match.count({
        where: {
          OR: [{ senderId: userId }, { travelerId: userId }],
          status: "COMPLETED",
        },
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          type: "REWARD_PAYMENT",
          status: "COMPLETED",
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      user,
      activeTrips,
      pendingPackages,
      completedMatches,
      totalEarnings: totalEarnings._sum.amount || 0,
    };
  }
}
