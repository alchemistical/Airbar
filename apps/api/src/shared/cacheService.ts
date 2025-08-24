import { createClient, RedisClientType } from "redis";

export class CacheService {
  private static client: RedisClientType | null = null;
  private static isConnected = false;

  /**
   * Initialize Redis connection
   */
  static async initialize(): Promise<void> {
    if (this.client) return;

    try {
      this.client = createClient({
        url: process.env.REDIS_URL || "redis://localhost:6379",
        socket: {
          connectTimeout: 60000,
        },
      });

      this.client.on("error", err => {
        console.error("Redis Client Error:", err);
        this.isConnected = false;
      });

      this.client.on("connect", () => {
        console.log("✅ Redis connected successfully");
        this.isConnected = true;
      });

      this.client.on("disconnect", () => {
        console.log("⚠️ Redis disconnected");
        this.isConnected = false;
      });

      await this.client.connect();
    } catch (error) {
      console.error("❌ Failed to initialize Redis:", error);
      // Don't throw error - app should work without cache
      this.client = null;
    }
  }

  /**
   * Get value from cache
   */
  static async get<T = any>(key: string): Promise<T | null> {
    if (!this.client || !this.isConnected) return null;

    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Cache GET error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache with optional TTL
   */
  static async set(
    key: string,
    value: any,
    ttlSeconds: number = 3600
  ): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;

    try {
      await this.client.setEx(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Cache SET error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete key from cache
   */
  static async delete(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error(`Cache DELETE error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete multiple keys matching pattern
   */
  static async deletePattern(pattern: string): Promise<number> {
    if (!this.client || !this.isConnected) return 0;

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        return await this.client.del(keys);
      }
      return 0;
    } catch (error) {
      console.error(
        `Cache DELETE_PATTERN error for pattern ${pattern}:`,
        error
      );
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  static async exists(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Cache EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Set TTL for existing key
   */
  static async expire(key: string, ttlSeconds: number): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;

    try {
      const result = await this.client.expire(key, ttlSeconds);
      return result === 1;
    } catch (error) {
      console.error(`Cache EXPIRE error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get multiple values at once
   */
  static async mGet<T = any>(keys: string[]): Promise<(T | null)[]> {
    if (!this.client || !this.isConnected || keys.length === 0) {
      return keys.map(() => null);
    }

    try {
      const values = await this.client.mGet(keys);
      return values.map(value => (value ? JSON.parse(value) : null));
    } catch (error) {
      console.error("Cache MGET error:", error);
      return keys.map(() => null);
    }
  }

  /**
   * Set multiple values at once
   */
  static async mSet(
    keyValuePairs: Record<string, any>,
    ttlSeconds: number = 3600
  ): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;

    try {
      const pipeline = this.client.multi();

      Object.entries(keyValuePairs).forEach(([key, value]) => {
        pipeline.setEx(key, ttlSeconds, JSON.stringify(value));
      });

      await pipeline.exec();
      return true;
    } catch (error) {
      console.error("Cache MSET error:", error);
      return false;
    }
  }

  /**
   * Increment numeric value
   */
  static async increment(key: string, by: number = 1): Promise<number | null> {
    if (!this.client || !this.isConnected) return null;

    try {
      return await this.client.incrBy(key, by);
    } catch (error) {
      console.error(`Cache INCREMENT error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Add item to set
   */
  static async sAdd(key: string, ...members: string[]): Promise<number | null> {
    if (!this.client || !this.isConnected) return null;

    try {
      return await this.client.sAdd(key, members);
    } catch (error) {
      console.error(`Cache SADD error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Get all members of set
   */
  static async sMembers(key: string): Promise<string[]> {
    if (!this.client || !this.isConnected) return [];

    try {
      return await this.client.sMembers(key);
    } catch (error) {
      console.error(`Cache SMEMBERS error for key ${key}:`, error);
      return [];
    }
  }

  /**
   * Check if member exists in set
   */
  static async sIsMember(key: string, member: string): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;

    try {
      const result = await this.client.sIsMember(key, member);
      return result === 1;
    } catch (error) {
      console.error(`Cache SISMEMBER error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Cache key generators for consistent naming
   */
  static keys = {
    location: (id: string) => `location:${id}`,
    locationSearch: (query: string) => `location_search:${query}`,
    nearbyLocations: (lat: number, lng: number, radius: number) =>
      `nearby_locations:${lat}:${lng}:${radius}`,
    trip: (id: string) => `trip:${id}`,
    tripSearch: (query: string) => `trip_search:${query}`,
    tripMatches: (tripId: string) => `trip_matches:${tripId}`,
    package: (id: string) => `package:${id}`,
    packageSearch: (query: string) => `package_search:${query}`,
    packageMatches: (packageId: string) => `package_matches:${packageId}`,
    user: (id: string) => `user:${id}`,
    userDashboard: (userId: string) => `user_dashboard:${userId}`,
    popularRoutes: () => "popular_routes",
    routeStats: (originId: string, destinationId: string) =>
      `route_stats:${originId}:${destinationId}`,
    session: (sessionToken: string) => `session:${sessionToken}`,
    userSessions: (userId: string) => `user_sessions:${userId}`,
  };

  /**
   * Cache TTL constants (in seconds)
   */
  static TTL = {
    SHORT: 300, // 5 minutes
    MEDIUM: 1800, // 30 minutes
    LONG: 3600, // 1 hour
    DAILY: 86400, // 24 hours
    WEEKLY: 604800, // 7 days
  };

  /**
   * Close Redis connection
   */
  static async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.disconnect();
      this.client = null;
      this.isConnected = false;
      console.log("✅ Redis disconnected");
    }
  }

  /**
   * Get connection status
   */
  static isReady(): boolean {
    return this.client !== null && this.isConnected;
  }

  /**
   * Flush all cache data (use with caution!)
   */
  static async flushAll(): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;

    try {
      await this.client.flushAll();
      console.log("⚠️ All cache data flushed");
      return true;
    } catch (error) {
      console.error("Cache FLUSH_ALL error:", error);
      return false;
    }
  }
}
