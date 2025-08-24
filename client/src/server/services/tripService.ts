import { Trip, Location, BagType, TripStatus } from "@prisma/client";
import prisma from "./database";
import { CacheService } from "./cacheService";

export interface CreateTripData {
  travelerId: string;
  originId: string;
  destinationId: string;
  departureDate: Date;
  arrivalDate?: Date;
  returnDate?: Date;
  airline?: string;
  flightNumber?: string;
  spaceAvailable: number;
  bagTypes: BagType[];
  numberOfBags?: number;
  pricePerKg?: number;
  acceptableItems?: string[];
  restrictions?: string[];
  additionalNotes?: string;
  flexibilityLevel?: number;
}

export interface TripSearchFilters {
  originId?: string;
  destinationId?: string;
  departureDate?: {
    from?: Date;
    to?: Date;
  };
  minSpace?: number;
  maxPricePerKg?: number;
  bagTypes?: BagType[];
  status?: TripStatus;
}

export class TripService {
  /**
   * Create a new trip
   */
  static async createTrip(
    data: CreateTripData
  ): Promise<Trip & { origin: Location; destination: Location }> {
    const trip = await prisma.trip.create({
      data: {
        ...data,
        status: "ACTIVE",
        views: 0,
      },
      include: {
        origin: true,
        destination: true,
        traveler: {
          include: {
            profile: true,
          },
        },
      },
    });

    return trip;
  }

  /**
   * Search trips with filters
   */
  static async searchTrips(filters: TripSearchFilters, limit = 20, offset = 0) {
    const where: any = {
      status: filters.status || "ACTIVE",
      isPublic: true,
    };

    if (filters.originId) {
      where.originId = filters.originId;
    }

    if (filters.destinationId) {
      where.destinationId = filters.destinationId;
    }

    if (filters.departureDate) {
      where.departureDate = {};
      if (filters.departureDate.from) {
        where.departureDate.gte = filters.departureDate.from;
      }
      if (filters.departureDate.to) {
        where.departureDate.lte = filters.departureDate.to;
      }
    }

    if (filters.minSpace) {
      where.spaceAvailable = {
        gte: filters.minSpace,
      };
    }

    if (filters.maxPricePerKg) {
      where.pricePerKg = {
        lte: filters.maxPricePerKg,
      };
    }

    if (filters.bagTypes && filters.bagTypes.length > 0) {
      where.bagTypes = {
        hasAll: filters.bagTypes,
      };
    }

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        include: {
          origin: true,
          destination: true,
          traveler: {
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
        orderBy: [{ createdAt: "desc" }],
        take: limit,
        skip: offset,
      }),
      prisma.trip.count({ where }),
    ]);

    return {
      trips,
      total,
      hasMore: offset + limit < total,
    };
  }

  /**
   * Get trip by ID with details
   */
  static async getTripById(id: string): Promise<
    | (Trip & {
        origin: Location;
        destination: Location;
        traveler: any;
        matches: any[];
      })
    | null
  > {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        origin: true,
        destination: true,
        traveler: {
          include: {
            profile: true,
          },
        },
        matches: {
          include: {
            package: true,
            sender: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });

    if (trip) {
      // Increment view count
      await prisma.trip.update({
        where: { id },
        data: {
          views: {
            increment: 1,
          },
        },
      });
    }

    return trip;
  }

  /**
   * Get user's trips
   */
  static async getUserTrips(userId: string, status?: TripStatus) {
    const where: any = {
      travelerId: userId,
    };

    if (status) {
      where.status = status;
    }

    return await prisma.trip.findMany({
      where,
      include: {
        origin: true,
        destination: true,
        matches: {
          include: {
            package: true,
            sender: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
      orderBy: {
        departureDate: "asc",
      },
    });
  }

  /**
   * Update trip
   */
  static async updateTrip(
    id: string,
    data: Partial<CreateTripData>
  ): Promise<Trip> {
    return await prisma.trip.update({
      where: { id },
      data,
    });
  }

  /**
   * Cancel trip
   */
  static async cancelTrip(id: string): Promise<Trip> {
    return await prisma.trip.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    });
  }

  /**
   * Find matching packages for a trip
   */
  static async findMatchingPackages(tripId: string) {
    // Check cache first
    const cacheKey = CacheService.keys.tripMatches(tripId);
    const cached = await CacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        origin: true,
        destination: true,
      },
    });

    if (!trip) {
      throw new Error("Trip not found");
    }

    // Find packages with exact route match first
    const exactPackages = await prisma.package.findMany({
      where: {
        originId: trip.originId,
        destinationId: trip.destinationId,
        status: "PENDING",
        weight: {
          lte: trip.spaceAvailable,
        },
      },
      include: {
        sender: {
          include: {
            profile: true,
          },
        },
        origin: true,
        destination: true,
      },
    });

    // Find nearby packages using geospatial search
    const nearbyPackages = await this.findNearbyPackages(
      trip.origin,
      trip.destination,
      trip.spaceAvailable
    );

    // Combine and deduplicate results
    const allPackages = [...exactPackages];
    for (const nearbyPackage of nearbyPackages) {
      if (!allPackages.find(pkg => pkg.id === nearbyPackage.id)) {
        allPackages.push(nearbyPackage);
      }
    }

    // Cache results for 30 minutes
    await CacheService.set(cacheKey, allPackages, CacheService.TTL.MEDIUM);

    return allPackages;
  }

  /**
   * Find packages within geographic radius
   */
  private static async findNearbyPackages(
    originLocation: any,
    destinationLocation: any,
    maxWeight: number,
    radiusKm = 50
  ) {
    // Raw SQL query for geospatial distance calculation
    const nearbyPackages = await prisma.$queryRaw`
      SELECT p.*, 
             o.name as origin_name, o.city as origin_city, o.latitude as origin_lat, o.longitude as origin_lng,
             d.name as dest_name, d.city as dest_city, d.latitude as dest_lat, d.longitude as dest_lng,
             (6371 * acos(cos(radians(${originLocation.latitude})) * cos(radians(o.latitude)) * 
              cos(radians(o.longitude) - radians(${originLocation.longitude})) + 
              sin(radians(${originLocation.latitude})) * sin(radians(o.latitude)))) as origin_distance,
             (6371 * acos(cos(radians(${destinationLocation.latitude})) * cos(radians(d.latitude)) * 
              cos(radians(d.longitude) - radians(${destinationLocation.longitude})) + 
              sin(radians(${destinationLocation.latitude})) * sin(radians(d.latitude)))) as dest_distance
      FROM "Package" p
      JOIN "Location" o ON p."originId" = o.id
      JOIN "Location" d ON p."destinationId" = d.id
      WHERE p.status = 'PENDING'
        AND p.weight <= ${maxWeight}
        AND p."expiresAt" > NOW()
        AND (6371 * acos(cos(radians(${originLocation.latitude})) * cos(radians(o.latitude)) * 
             cos(radians(o.longitude) - radians(${originLocation.longitude})) + 
             sin(radians(${originLocation.latitude})) * sin(radians(o.latitude)))) <= ${radiusKm}
        AND (6371 * acos(cos(radians(${destinationLocation.latitude})) * cos(radians(d.latitude)) * 
             cos(radians(d.longitude) - radians(${destinationLocation.longitude})) + 
             sin(radians(${destinationLocation.latitude})) * sin(radians(d.latitude)))) <= ${radiusKm}
      ORDER BY origin_distance + dest_distance ASC
      LIMIT 20
    `;

    // Convert raw results back to proper Package objects with relations
    const packageIds = (nearbyPackages as any[]).map(pkg => pkg.id);

    return await prisma.package.findMany({
      where: {
        id: {
          in: packageIds,
        },
      },
      include: {
        sender: {
          include: {
            profile: true,
          },
        },
        origin: true,
        destination: true,
      },
    });
  }
}
