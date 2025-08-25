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