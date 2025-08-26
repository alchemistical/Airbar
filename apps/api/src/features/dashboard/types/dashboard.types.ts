export interface UnifiedDashboardData {
  userMode: 'SENDER' | 'TRAVELER' | 'DUAL';
  quickActions: QuickAction[];
  bestMatches: BestMatch[];
  activityStream: ActivityEvent[];
  stats: UserStats;
  suggestions: SmartSuggestion[];
  gamification: GamificationData;
}

export interface QuickAction {
  type: string;
  label: string;
  url: string;
  count?: number;
}

export interface BestMatch {
  id: string;
  type: 'TRIP' | 'PACKAGE';
  title: string;
  rating: number;
  price: number;
  timeline: string;
  location: string;
  compatibility: number;
}

export interface UserStats {
  totalEarnings: number;
  totalSavings: number;
  completedDeliveries: number;
  activeListings: number;
  trustLevel: string;
  rating: number;
}

export interface SmartSuggestion {
  id: string;
  type: 'REPEAT_ROUTE' | 'NEW_OPPORTUNITY' | 'SOCIAL_REFERRAL';
  title: string;
  description: string;
  actionUrl: string;
  estimatedValue: number;
  confidence: number;
  expiresAt: Date;
}

export interface GamificationData {
  trustLevel: string;
  progress: number;
  streakCount: number;
  badges: Badge[];
  nextLevelRequirement: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt: Date;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}

export interface ActivityEvent {
  id: string;
  eventType: string;
  displayMessage: string;
  actionUrl?: string;
  createdAt: Date;
  isRead: boolean;
}