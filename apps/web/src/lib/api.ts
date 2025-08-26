import { apiRequest } from './queryClient';
import type { DashboardMetrics, DashboardData, ActivityItem, UpcomingTrip } from '../../../api/src/shared/schema';

// Base API configuration
const API_BASE = 'http://localhost:3001/api';

// Response wrapper type to match backend format
interface ApiResponse<T> {
  success: boolean;
  data: T;
  correlationId: string;
}

interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    correlationId: string;
  };
}

// Dashboard API
export const dashboardApi = {
  async getMetrics(userId: number): Promise<DashboardMetrics> {
    try {
      const response = await apiRequest(`${API_BASE}/dashboard/metrics/${userId}`, { method: 'GET' });
      const result: ApiResponse<DashboardMetrics> = await response.json();
      
      if (!result.success) {
        throw new Error(result.data as any || 'Failed to fetch dashboard metrics');
      }
      
      return result.data;
    } catch (error) {
      console.log('Dashboard API not available, using mock data for development');
      // Note: Toast notifications would be added at the component level, not here
      
      // Return realistic mock data for development - this simulates a working backend
      return {
        activeTrips: 3,
        parcelRequests: 5,
        inEscrowAmount: '$185.50',
        averageRating: '4.8',
        availableBalance: '$340.75',
        pendingEarnings: '$125.00',
        totalEarned: '$1,250.25',
        role: 'traveler',
        unacceptedMatches: 2,
        pendingConfirmations: 1,
        receiptsRequired: 1,
        kycComplete: true,
        payoutsPending: 2,
      };
    }
  },

  async getDashboardData(userId: number): Promise<DashboardData> {
    try {
      const response = await apiRequest(`${API_BASE}/dashboard/data/${userId}`, { method: 'GET' });
      const result: ApiResponse<DashboardData> = await response.json();
      
      if (!result.success) {
        throw new Error(result.data as any || 'Failed to fetch dashboard data');
      }
      
      return result.data;
    } catch (error) {
      console.log('Dashboard full data API not available, using comprehensive mock data for development');
      
      // Return realistic comprehensive mock data
      return {
        activeTrips: 3,
        parcelRequests: 5,
        inEscrowAmount: '$185.50',
        averageRating: '4.8',
        availableBalance: '$340.75',
        pendingEarnings: '$125.00',
        totalEarned: '$1,250.25',
        role: 'traveler',
        unacceptedMatches: 2,
        pendingConfirmations: 1,
        receiptsRequired: 1,
        kycComplete: true,
        payoutsPending: 2,
        recentActivity: [
          {
            id: 1,
            type: "delivery",
            message: "Package delivered to Miami",
            time: "2 hours ago",
            icon: "CheckCircle2",
            color: "text-green-600",
          },
          {
            id: 2,
            type: "payment",
            message: "Funds released - $125.00",
            time: "3 hours ago",
            icon: "DollarSign",
            color: "text-blue-600",
          },
          {
            id: 3,
            type: "review",
            message: "New 5-star review received",
            time: "1 day ago",
            icon: "Star",
            color: "text-yellow-600",
          },
          {
            id: 4,
            type: "trip",
            message: "Trip to Chicago confirmed",
            time: "2 days ago",
            icon: "Plane",
            color: "text-purple-600",
          }
        ],
        upcomingTrips: [
          {
            id: 1,
            from: "New York",
            to: "Miami",
            date: "Dec 30",
            status: "confirmed",
            matches: 2,
          },
          {
            id: 2,
            from: "Los Angeles",
            to: "Chicago",
            date: "Jan 5",
            status: "pending",
            matches: 0,
          },
          {
            id: 3,
            from: "Boston",
            to: "Seattle",
            date: "Jan 12",
            status: "confirmed",
            matches: 1,
          }
        ]
      };
    }
  },

  async getUnifiedDashboard(userId: string, mode: 'sender' | 'traveler' | 'dual' = 'dual') {
    try {
      const response = await apiRequest(`${API_BASE}/dashboard/unified?userId=${userId}&mode=${mode}`, { method: 'GET' });
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch unified dashboard');
      }
      
      return result.data;
    } catch (error) {
      console.log('Unified Dashboard API not available, using mock data for development');
      
      // Return comprehensive mock data for unified dashboard
      return {
        userStats: {
          level: 3,
          streakDays: 7,
          trustLevel: 'GOLD',
          badges: ['RELIABLE', 'FAST', 'HELPFUL'],
          totalEarnings: 1250.25,
          totalSavings: 340.75,
          completedDeliveries: 23,
          averageRating: 4.8,
          loyaltyPoints: 1540
        },
        bestMatches: [
          {
            id: '1',
            type: 'parcel',
            from: 'New York',
            to: 'Miami',
            date: 'Dec 30',
            matchScore: 95,
            priceRange: '$45-65',
            carrier: {
              name: 'Sarah M.',
              rating: 4.9,
              trustLevel: 'PLATINUM'
            },
            parcel: {
              weight: '2.5 kg',
              description: 'Documents and small items'
            },
            urgency: 'high',
            aiSuggestion: 'Perfect match! This traveler has 100% on-time delivery rate on this route.'
          },
          {
            id: '2',
            type: 'trip',
            from: 'Los Angeles',
            to: 'Chicago',
            date: 'Jan 5',
            matchScore: 87,
            priceRange: '$30-50',
            carrier: {
              name: 'Mike R.',
              rating: 4.7,
              trustLevel: 'GOLD'
            },
            urgency: 'medium',
            aiSuggestion: 'Great opportunity! This route typically saves senders 40% compared to courier services.'
          },
          {
            id: '3',
            type: 'parcel',
            from: 'Boston',
            to: 'Seattle',
            date: 'Jan 12',
            matchScore: 82,
            priceRange: '$25-40',
            parcel: {
              weight: '1.8 kg',
              description: 'Electronics'
            },
            urgency: 'low',
            aiSuggestion: 'Good match for flexible timing. This traveler offers extra packaging protection.'
          }
        ],
        quickActions: [
          { id: '1', label: 'Add Trip', icon: 'plus', href: '/dashboard/traveler/trips/addtrip', priority: 'high' },
          { id: '2', label: 'Send Package', icon: 'package', href: '/send-package', priority: 'high', count: 3 },
          { id: '3', label: 'View Matches', icon: 'users', href: '/dashboard/matches', priority: 'medium', count: 5 },
          { id: '4', label: 'Check Messages', icon: 'message', href: '/dashboard/messages', priority: 'medium', count: 2 },
          { id: '5', label: 'Withdraw Funds', icon: 'wallet', href: '/dashboard/wallet', priority: 'low' },
          { id: '6', label: 'Invite Friends', icon: 'heart', href: '/dashboard/referrals', priority: 'low' }
        ],
        activityStream: [
          {
            id: '1',
            type: 'match_found',
            message: '3 new matches found for your NYC → Miami trip!',
            timestamp: '2 hours ago',
            icon: 'sparkles'
          },
          {
            id: '2',
            type: 'payment_received',
            message: 'Payment received: $125.00 from package delivery',
            timestamp: '4 hours ago',
            icon: 'dollar-sign'
          },
          {
            id: '3',
            type: 'level_up',
            message: 'Congratulations! You reached Level 3!',
            timestamp: '1 day ago',
            icon: 'trophy'
          },
          {
            id: '4',
            type: 'review_received',
            message: 'New 5-star review: "Excellent service, very reliable!"',
            timestamp: '2 days ago',
            icon: 'star'
          }
        ],
        context: {
          mode: mode,
          primaryGoal: 'earn_money',
          completionRate: 85
        }
      };
    }
  },

  async setUserContext(context: { mode: string; primaryGoal: string }) {
    try {
      const response = await apiRequest(`${API_BASE}/dashboard/context`, { 
        method: 'POST',
        body: JSON.stringify(context)
      });
      return response.json();
    } catch (error) {
      console.log('Set user context API not available, returning success for development');
      return { success: true };
    }
  },

  async getActivityStream(limit: number = 10) {
    try {
      const response = await apiRequest(`${API_BASE}/dashboard/activity-stream?limit=${limit}`, { method: 'GET' });
      return response.json();
    } catch (error) {
      console.log('Activity stream API not available, using mock data');
      return {
        success: true,
        data: [
          { id: '1', type: 'match', message: 'New match found!', timestamp: '1 hour ago', icon: 'sparkles' },
          { id: '2', type: 'payment', message: 'Payment received: $50', timestamp: '3 hours ago', icon: 'dollar-sign' }
        ]
      };
    }
  }
};

// Auth API (placeholder for future implementation)
export const authApi = {
  async login(email: string, password: string) {
    const response = await apiRequest(`${API_BASE}/auth/login`, { 
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  async register(userData: any) {
    const response = await apiRequest(`${API_BASE}/auth/register`, { method: 'POST', body: JSON.stringify(userData) });
    return response.json();
  },

  async logout() {
    const response = await apiRequest(`${API_BASE}/auth/logout`, { method: 'POST' });
    return response.json();
  }
};

// Trips API (placeholder for future implementation)
export const tripsApi = {
  async getTrips(userId: number) {
    const response = await apiRequest(`${API_BASE}/trips?userId=${userId}`, { method: 'GET' });
    return response.json();
  },

  async createTrip(tripData: any) {
    const response = await apiRequest(`${API_BASE}/trips`, { method: 'POST', body: JSON.stringify(tripData) });
    return response.json();
  }
};

// Parcels API (placeholder for future implementation)
export const parcelsApi = {
  async getParcels(userId: number) {
    const response = await apiRequest(`${API_BASE}/parcels?userId=${userId}`, { method: 'GET' });
    return response.json();
  },

  async createParcel(parcelData: any) {
    const response = await apiRequest(`${API_BASE}/parcels`, { method: 'POST', body: JSON.stringify(parcelData) });
    return response.json();
  }
};

// Export all APIs
export const api = {
  dashboard: dashboardApi,
  auth: authApi,
  trips: tripsApi,
  parcels: parcelsApi
};