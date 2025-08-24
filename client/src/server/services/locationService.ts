import { Location, LocationType } from "@prisma/client";
import prisma from "./database";
import { CacheService } from "./cacheService";

export interface CreateLocationData {
  name: string;
  city: string;
  country: string;
  countryCode: string;
  airportCode?: string;
  type: LocationType;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface LocationSearchFilters {
  city?: string;
  country?: string;
  countryCode?: string;
  type?: LocationType;
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
}

export class LocationService {
  /**
   * Create a new location
   */
  static async createLocation(data: CreateLocationData): Promise<Location> {
    return await prisma.location.create({
      data,
    });
  }

  /**
   * Find locations by search criteria
   */
  static async searchLocations(
    filters: LocationSearchFilters,
    limit = 20
  ): Promise<Location[]> {
    const where: any = {};

    if (filters.city) {
      where.city = {
        contains: filters.city,
        mode: "insensitive",
      };
    }

    if (filters.country) {
      where.country = {
        contains: filters.country,
        mode: "insensitive",
      };
    }

    if (filters.countryCode) {
      where.countryCode = filters.countryCode;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    let locations = await prisma.location.findMany({
      where,
      take: limit,
      orderBy: {
        name: "asc",
      },
    });

    // If geospatial search is requested, filter by distance
    if (filters.latitude && filters.longitude && filters.radius) {
      locations = this.filterLocationsByDistance(
        locations,
        filters.latitude,
        filters.longitude,
        filters.radius
      );
    }

    return locations;
  }

  /**
   * Find locations within radius using Haversine formula
   */
  static async findNearbyLocations(
    latitude: number,
    longitude: number,
    radiusKm: number = 50,
    limit: number = 20
  ): Promise<(Location & { distance: number })[]> {
    // Check cache first
    const cacheKey = CacheService.keys.nearbyLocations(
      latitude,
      longitude,
      radiusKm
    );
    const cached =
      await CacheService.get<(Location & { distance: number })[]>(cacheKey);

    if (cached) {
      return cached.slice(0, limit);
    }

    // Use raw SQL for efficient geospatial query
    const nearbyLocations = await prisma.$queryRaw<
      (Location & { distance: number })[]
    >`
      SELECT *,
             (6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * 
              cos(radians(longitude) - radians(${longitude})) + 
              sin(radians(${latitude})) * sin(radians(latitude)))) as distance
      FROM "Location"
      WHERE (6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * 
             cos(radians(longitude) - radians(${longitude})) + 
             sin(radians(${latitude})) * sin(radians(latitude)))) <= ${radiusKm}
      ORDER BY distance ASC
      LIMIT ${limit}
    `;

    // Cache the results for 1 hour
    await CacheService.set(cacheKey, nearbyLocations, CacheService.TTL.LONG);

    return nearbyLocations;
  }

  /**
   * Get popular routes (most frequently used origin-destination pairs)
   */
  static async getPopularRoutes(limit = 10) {
    // Check cache first
    const cacheKey = CacheService.keys.popularRoutes();
    const cached = await CacheService.get(cacheKey);

    if (cached) {
      return cached.slice(0, limit);
    }

    const popularRoutes = await prisma.$queryRaw`
      SELECT 
        o.id as origin_id,
        o.name as origin_name,
        o.city as origin_city,
        o.country as origin_country,
        o."airportCode" as origin_airport_code,
        d.id as destination_id,
        d.name as destination_name,
        d.city as destination_city,
        d.country as destination_country,
        d."airportCode" as destination_airport_code,
        COUNT(DISTINCT t.id) + COUNT(DISTINCT p.id) as total_activity
      FROM "Location" o
      CROSS JOIN "Location" d
      LEFT JOIN "Trip" t ON t."originId" = o.id AND t."destinationId" = d.id
      LEFT JOIN "Package" p ON p."originId" = o.id AND p."destinationId" = d.id
      WHERE o.id != d.id
        AND (t.id IS NOT NULL OR p.id IS NOT NULL)
      GROUP BY o.id, o.name, o.city, o.country, o."airportCode",
               d.id, d.name, d.city, d.country, d."airportCode"
      ORDER BY total_activity DESC
      LIMIT ${limit}
    `;

    // Cache popular routes for 24 hours
    await CacheService.set(cacheKey, popularRoutes, CacheService.TTL.DAILY);

    return popularRoutes;
  }

  /**
   * Calculate distance between two locations using Haversine formula
   */
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  /**
   * Filter locations by distance from a point
   */
  private static filterLocationsByDistance(
    locations: Location[],
    latitude: number,
    longitude: number,
    radiusKm: number
  ): Location[] {
    return locations.filter(location => {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        location.latitude,
        location.longitude
      );
      return distance <= radiusKm;
    });
  }

  /**
   * Convert degrees to radians
   */
  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get location by ID
   */
  static async getLocationById(id: string): Promise<Location | null> {
    // Check cache first
    const cacheKey = CacheService.keys.location(id);
    const cached = await CacheService.get<Location>(cacheKey);

    if (cached) {
      return cached;
    }

    const location = await prisma.location.findUnique({
      where: { id },
    });

    if (location) {
      // Cache location for 1 hour
      await CacheService.set(cacheKey, location, CacheService.TTL.LONG);
    }

    return location;
  }

  /**
   * Get all airports
   */
  static async getAirports(): Promise<Location[]> {
    return await prisma.location.findMany({
      where: {
        type: "AIRPORT",
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  /**
   * Get route statistics
   */
  static async getRouteStats(originId: string, destinationId: string) {
    const [tripCount, packageCount, avgDeliveryTime] = await Promise.all([
      prisma.trip.count({
        where: {
          originId,
          destinationId,
          status: "ACTIVE",
        },
      }),
      prisma.package.count({
        where: {
          originId,
          destinationId,
          status: "PENDING",
        },
      }),
      // Calculate average delivery time from completed matches
      prisma.match.aggregate({
        where: {
          trip: {
            originId,
            destinationId,
          },
          status: "COMPLETED",
        },
        _avg: {
          // This would need a calculated field for delivery time
        },
      }),
    ]);

    return {
      activeTrips: tripCount,
      pendingPackages: packageCount,
      // avgDeliveryDays: Math.round(avgDeliveryTime || 5)
      avgDeliveryDays: 3, // Placeholder - would calculate from actual data
    };
  }
}
