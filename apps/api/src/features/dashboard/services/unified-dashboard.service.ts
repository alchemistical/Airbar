import { PrismaClient } from '@prisma/client';
import { UnifiedDashboardData, QuickAction, UserStats, GamificationData } from '../types/dashboard.types';

export class UnifiedDashboardService {
  constructor(private prisma: PrismaClient) {}

  async getDashboardData(userId: string): Promise<UnifiedDashboardData> {
    try {
      // Parallel data fetching for performance
      const [user, profile, preferences, recentActivity, activeTrips, activePackages] = await Promise.all([
        this.prisma.user.findUnique({ where: { id: userId } }),
        this.prisma.profile.findUnique({ where: { userId } }),
        this.getUserPreferences(userId),
        this.getRecentActivity(userId),
        this.getActiveTrips(userId),
        this.getActivePackages(userId)
      ]);

      if (!user || !profile) {
        throw new Error('User or profile not found');
      }

      const userMode = preferences?.preferredMode || 'DUAL';
      
      return {
        userMode,
        quickActions: this.generateQuickActions(userMode, activeTrips.length, activePackages.length),
        bestMatches: await this.getBestMatches(userId, userMode),
        activityStream: recentActivity,
        stats: this.generateUserStats(profile, activeTrips.length, activePackages.length),
        suggestions: await this.getSmartSuggestions(userId),
        gamification: this.getGamificationData(profile)
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  private async getUserPreferences(userId: string) {
    return await this.prisma.userPreference.findUnique({
      where: { userId }
    });
  }

  private async getRecentActivity(userId: string) {
    return await this.prisma.activityEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
  }

  private async getActiveTrips(userId: string) {
    return await this.prisma.trip.findMany({
      where: {
        travelerId: userId,
        status: { in: ['ACTIVE', 'BOOKED'] }
      }
    });
  }

  private async getActivePackages(userId: string) {
    return await this.prisma.package.findMany({
      where: {
        senderId: userId,
        status: { in: ['PENDING', 'MATCHED'] }
      }
    });
  }

  private generateQuickActions(userMode: string, activeTrips: number, activePackages: number): QuickAction[] {
    const actions: QuickAction[] = [];
    
    if (userMode === 'SENDER' || userMode === 'DUAL') {
      actions.push({
        type: 'SEND_PACKAGE',
        label: '📦 Send Package',
        url: '/send-package'
      });
    }
    
    if (userMode === 'TRAVELER' || userMode === 'DUAL') {
      actions.push({
        type: 'ADD_TRIP',
        label: '✈️ Add Trip',
        url: '/add-trip'
      });
    }
    
    actions.push(
      {
        type: 'VIEW_EARNINGS',
        label: '💰 Earnings',
        url: '/wallet'
      },
      {
        type: 'NOTIFICATIONS',
        label: '🔔 Alerts',
        url: '/notifications'
      }
    );
    
    return actions;
  }

  private async getBestMatches(userId: string, userMode: string) {
    // For now, return empty array - will be enhanced in Sprint 2
    return [];
  }

  private generateUserStats(profile: any, activeTrips: number, activePackages: number): UserStats {
    return {
      totalEarnings: profile.totalEarnings || 0,
      totalSavings: profile.totalSavings || 0,
      completedDeliveries: profile.totalDeliveries || 0,
      activeListings: activeTrips + activePackages,
      trustLevel: profile.trustLevel || 'BRONZE',
      rating: profile.rating || 0
    };
  }

  private async getSmartSuggestions(userId: string) {
    // For now, return empty array - will be enhanced in Sprint 3
    return [];
  }

  private getGamificationData(profile: any): GamificationData {
    const trustLevel = profile.trustLevel || 'BRONZE';
    const streakCount = profile.streakCount || 0;
    const badges = JSON.parse(profile.badges || '[]');
    
    // Calculate progress to next level
    const levelRequirements = {
      BRONZE: 5,
      SILVER: 15,
      GOLD: 50,
      PLATINUM: 100
    };
    
    const currentRequirement = levelRequirements[trustLevel] || 5;
    const completedDeliveries = profile.totalDeliveries || 0;
    const progress = Math.min((completedDeliveries / currentRequirement) * 100, 100);
    
    return {
      trustLevel,
      progress,
      streakCount,
      badges,
      nextLevelRequirement: `${completedDeliveries}/${currentRequirement} deliveries`
    };
  }

  async updateUserPreferences(userId: string, preferences: Partial<any>) {
    return await this.prisma.userPreference.upsert({
      where: { userId },
      update: preferences,
      create: {
        userId,
        ...preferences
      }
    });
  }
}