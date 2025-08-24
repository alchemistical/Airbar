import {
  Package,
  Location,
  PackageCategory,
  PackageStatus,
} from "@prisma/client";
import prisma from "./database";
import { CacheService } from "./cacheService";

export interface CreatePackageData {
  senderId: string;
  originId: string;
  destinationId: string;
  description: string;
  weight: number;
  dimensions?: { length: number; width: number; height: number };
  declaredValue: number;
  category: PackageCategory;
  fragile?: boolean;
  urgent?: boolean;
  pickupAddress: string;
  deliveryAddress: string;
  pickupWindow: { start: Date; end: Date };
  deliveryWindow?: { start: Date; end: Date };
  receiverName: string;
  receiverPhone: string;
  receiverEmail?: string;
  maxReward: number;
}

export interface PackageSearchFilters {
  originId?: string;
  destinationId?: string;
  category?: PackageCategory;
  maxWeight?: number;
  minReward?: number;
  urgent?: boolean;
  status?: PackageStatus;
}

export class PackageService {
  /**
   * Create a new package
   */
  static async createPackage(
    data: CreatePackageData
  ): Promise<Package & { origin: Location; destination: Location }> {
    // Calculate estimated costs and savings
    const estimatedReward = Math.min(data.maxReward, data.weight * 15); // Base rate
    const traditionalCost = estimatedReward * 2.5; // Estimate traditional shipping
    const savings = Math.round(
      ((traditionalCost - estimatedReward) / traditionalCost) * 100
    );

    const package_ = await prisma.package.create({
      data: {
        ...data,
        estimatedReward,
        traditionalCost,
        savings,
        status: "PENDING",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        views: 0,
      },
      include: {
        origin: true,
        destination: true,
        sender: {
          include: {
            profile: true,
          },
        },
      },
    });

    return package_;
  }

  /**
   * Search packages with filters
   */
  static async searchPackages(
    filters: PackageSearchFilters,
    limit = 20,
    offset = 0
  ) {
    const where: any = {
      status: filters.status || "PENDING",
      expiresAt: {
        gt: new Date(),
      },
    };

    if (filters.originId) {
      where.originId = filters.originId;
    }

    if (filters.destinationId) {
      where.destinationId = filters.destinationId;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.maxWeight) {
      where.weight = {
        lte: filters.maxWeight,
      };
    }

    if (filters.minReward) {
      where.maxReward = {
        gte: filters.minReward,
      };
    }

    if (filters.urgent !== undefined) {
      where.urgent = filters.urgent;
    }

    const [packages, total] = await Promise.all([
      prisma.package.findMany({
        where,
        include: {
          origin: true,
          destination: true,
          sender: {
            include: {
              profile: true,
            },
          },
          _count: {
            select: {
              matches: true,
            },
          },
        },
        orderBy: [{ urgent: "desc" }, { createdAt: "desc" }],
        take: limit,
        skip: offset,
      }),
      prisma.package.count({ where }),
    ]);

    return {
      packages,
      total,
      hasMore: offset + limit < total,
    };
  }

  /**
   * Get package by ID with details
   */
  static async getPackageById(id: string): Promise<
    | (Package & {
        origin: Location;
        destination: Location;
        sender: any;
        matches: any[];
      })
    | null
  > {
    const package_ = await prisma.package.findUnique({
      where: { id },
      include: {
        origin: true,
        destination: true,
        sender: {
          include: {
            profile: true,
          },
        },
        matches: {
          include: {
            trip: true,
            traveler: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });

    if (package_) {
      // Increment view count
      await prisma.package.update({
        where: { id },
        data: {
          views: {
            increment: 1,
          },
        },
      });
    }

    return package_;
  }

  /**
   * Get user's packages
   */
  static async getUserPackages(userId: string, status?: PackageStatus) {
    const where: any = {
      senderId: userId,
    };

    if (status) {
      where.status = status;
    }

    return await prisma.package.findMany({
      where,
      include: {
        origin: true,
        destination: true,
        matches: {
          include: {
            trip: true,
            traveler: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Update package
   */
  static async updatePackage(
    id: string,
    data: Partial<CreatePackageData>
  ): Promise<Package> {
    return await prisma.package.update({
      where: { id },
      data,
    });
  }

  /**
   * Cancel package
   */
  static async cancelPackage(id: string): Promise<Package> {
    return await prisma.package.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    });
  }

  /**
   * Find matching trips for a package
   */
  static async findMatchingTrips(packageId: string) {
    // Check cache first
    const cacheKey = CacheService.keys.packageMatches(packageId);
    const cached = await CacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const package_ = await prisma.package.findUnique({
      where: { id: packageId },
      include: {
        origin: true,
        destination: true,
      },
    });

    if (!package_) {
      throw new Error("Package not found");
    }

    // Find trips with exact route match first
    const exactTrips = await prisma.trip.findMany({
      where: {
        originId: package_.originId,
        destinationId: package_.destinationId,
        status: "ACTIVE",
        spaceAvailable: {
          gte: package_.weight,
        },
        departureDate: {
          gte: new Date(), // Only future trips
        },
      },
      include: {
        traveler: {
          include: {
            profile: true,
          },
        },
        origin: true,
        destination: true,
      },
      orderBy: {
        departureDate: "asc",
      },
    });

    // Find nearby trips using geospatial search (within 50km radius)
    const nearbyTrips = await this.findNearbyTrips(
      package_.origin,
      package_.destination,
      package_.weight
    );

    // Combine and deduplicate results
    const allTrips = [...exactTrips];
    for (const nearbyTrip of nearbyTrips) {
      if (!allTrips.find(trip => trip.id === nearbyTrip.id)) {
        allTrips.push(nearbyTrip);
      }
    }

    // Cache results for 30 minutes (shorter TTL because trips change frequently)
    await CacheService.set(cacheKey, allTrips, CacheService.TTL.MEDIUM);

    return allTrips;
  }

  /**
   * Find trips within geographic radius using Haversine formula
   */
  private static async findNearbyTrips(
    originLocation: any,
    destinationLocation: any,
    packageWeight: number,
    radiusKm = 50
  ) {
    // Raw SQL query for geospatial distance calculation
    const nearbyTrips = await prisma.$queryRaw`
      SELECT t.*, 
             o.name as origin_name, o.city as origin_city, o.latitude as origin_lat, o.longitude as origin_lng,
             d.name as dest_name, d.city as dest_city, d.latitude as dest_lat, d.longitude as dest_lng,
             (6371 * acos(cos(radians(${originLocation.latitude})) * cos(radians(o.latitude)) * 
              cos(radians(o.longitude) - radians(${originLocation.longitude})) + 
              sin(radians(${originLocation.latitude})) * sin(radians(o.latitude)))) as origin_distance,
             (6371 * acos(cos(radians(${destinationLocation.latitude})) * cos(radians(d.latitude)) * 
              cos(radians(d.longitude) - radians(${destinationLocation.longitude})) + 
              sin(radians(${destinationLocation.latitude})) * sin(radians(d.latitude)))) as dest_distance
      FROM "Trip" t
      JOIN "Location" o ON t."originId" = o.id
      JOIN "Location" d ON t."destinationId" = d.id
      WHERE t.status = 'ACTIVE'
        AND t."spaceAvailable" >= ${packageWeight}
        AND t."departureDate" >= NOW()
        AND (6371 * acos(cos(radians(${originLocation.latitude})) * cos(radians(o.latitude)) * 
             cos(radians(o.longitude) - radians(${originLocation.longitude})) + 
             sin(radians(${originLocation.latitude})) * sin(radians(o.latitude)))) <= ${radiusKm}
        AND (6371 * acos(cos(radians(${destinationLocation.latitude})) * cos(radians(d.latitude)) * 
             cos(radians(d.longitude) - radians(${destinationLocation.longitude})) + 
             sin(radians(${destinationLocation.latitude})) * sin(radians(d.latitude)))) <= ${radiusKm}
      ORDER BY origin_distance + dest_distance ASC
      LIMIT 20
    `;

    // Convert raw results back to proper Trip objects with relations
    const tripIds = (nearbyTrips as any[]).map(trip => trip.id);

    return await prisma.trip.findMany({
      where: {
        id: {
          in: tripIds,
        },
      },
      include: {
        traveler: {
          include: {
            profile: true,
          },
        },
        origin: true,
        destination: true,
      },
    });
  }

  /**
   * Get package quote estimation
   */
  static async getPackageQuote(
    weight: number,
    route: { originId: string; destinationId: string }
  ) {
    // Base calculation
    const baseRate = 12; // $12 per kg
    const estimatedReward = weight * baseRate;

    // Traditional shipping estimate (DHL/FedEx equivalent)
    const traditionalCost = estimatedReward * 2.8;

    // Savings calculation
    const savings = Math.round(
      ((traditionalCost - estimatedReward) / traditionalCost) * 100
    );

    // Estimated delivery time based on route popularity
    const estimatedDays = await this.getEstimatedDeliveryTime(route);

    return {
      estimatedReward,
      traditionalCost,
      savings,
      estimatedDays,
    };
  }

  /**
   * Get estimated delivery time for route
   */
  private static async getEstimatedDeliveryTime(route: {
    originId: string;
    destinationId: string;
  }): Promise<number> {
    // Check if there are active trips on this route
    const activeTripCount = await prisma.trip.count({
      where: {
        originId: route.originId,
        destinationId: route.destinationId,
        status: "ACTIVE",
        departureDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Next 14 days
        },
      },
    });

    // More active trips = faster delivery
    if (activeTripCount > 10) return 2;
    if (activeTripCount > 5) return 3;
    if (activeTripCount > 2) return 4;
    return 5; // Default
  }
}
