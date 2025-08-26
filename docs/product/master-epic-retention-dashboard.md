# MASTER EPIC: Retention-Optimized Unified Dashboard

## Epic Overview
**Goal**: Transform Airbar into a habit-forming daily check-in app with intelligent matching and unified user experience  
**Impact**: 3x increase in user lifetime value through cross-selling and retention optimization  
**Timeline**: 8 weeks (4 sprints of 2 weeks each)  
**Team**: Full-stack (2 FE, 2 BE, 1 Product, 1 Designer)

## Architecture Impact Analysis

### Current State Assessment
- ✅ **Database Schema**: Solid foundation with User, Profile, Trip, Package, Match entities
- ✅ **API Gateway**: Express.js with auth, rate limiting, swagger docs
- ✅ **Microservices**: Auth, Dashboard services partially implemented
- ❌ **Missing**: Smart matching service, activity stream, gamification
- ❌ **Missing**: Unified dashboard UX, role-based context switching

### Required Microservice Updates

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        UPDATED MICROSERVICES ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│   │    AUTH     │  │ DASHBOARD   │  │  MATCHING   │  │  ACTIVITY   │           │
│   │   SERVICE   │  │  SERVICE    │  │   ENGINE    │  │  STREAM     │           │
│   │ (Enhanced)  │  │ (Enhanced)  │  │    (NEW)    │  │   (NEW)     │           │
│   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                                 │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│   │   TRIPS     │  │  PACKAGES   │  │ GAMIFICATION│  │NOTIFICATIONS│           │
│   │  SERVICE    │  │   SERVICE   │  │   SERVICE   │  │   SERVICE   │           │
│   │ (Enhanced)  │  │ (Enhanced)  │  │    (NEW)    │  │ (Enhanced)  │           │
│   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## SPRINT BREAKDOWN

### SPRINT 1: Foundation & Unified Dashboard (Weeks 1-2)
**Theme**: Core Infrastructure & Dashboard Layout

#### 1.1 Database Schema Enhancements
**Service**: Database/Prisma  
**Effort**: 13 points  
**Owner**: Backend Engineer

**Requirements**:
```sql
-- New gamification fields in Profile
ALTER TABLE profiles ADD COLUMN trust_level VARCHAR(20) DEFAULT 'BRONZE';
ALTER TABLE profiles ADD COLUMN streak_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN badges JSON DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN last_activity_date DATE;

-- Activity stream table
CREATE TABLE activity_events (
  id VARCHAR(30) PRIMARY KEY,
  user_id VARCHAR(30) REFERENCES users(id),
  event_type VARCHAR(50) NOT NULL,
  event_data JSON NOT NULL,
  display_message TEXT,
  action_url VARCHAR(255),
  priority INTEGER DEFAULT 1,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User preferences for dashboard context
CREATE TABLE user_preferences (
  id VARCHAR(30) PRIMARY KEY,
  user_id VARCHAR(30) REFERENCES users(id),
  preferred_mode VARCHAR(20) DEFAULT 'DUAL', -- SENDER, TRAVELER, DUAL
  dashboard_layout JSON DEFAULT '{}',
  notification_settings JSON DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Match scoring for intelligent ranking
ALTER TABLE matches ADD COLUMN match_score FLOAT DEFAULT 0.0;
ALTER TABLE matches ADD COLUMN compatibility_factors JSON DEFAULT '{}';
```

#### 1.2 Enhanced Dashboard API Service
**Service**: apps/api/src/features/dashboard  
**Effort**: 21 points  
**Owner**: Backend Engineer

**New Endpoints**:
```typescript
// apps/api/src/features/dashboard/controllers/unified-dashboard.controller.ts
POST /api/dashboard/context          // Set user dashboard mode (SENDER/TRAVELER/DUAL)
GET  /api/dashboard/unified          // Get personalized unified dashboard data
GET  /api/dashboard/activity-stream  // Get user activity feed
GET  /api/dashboard/quick-actions    // Get contextual quick actions
GET  /api/dashboard/smart-suggestions// Get AI-powered suggestions
```

**Core Logic**:
```typescript
interface UnifiedDashboardResponse {
  userMode: 'SENDER' | 'TRAVELER' | 'DUAL';
  quickActions: QuickAction[];
  bestMatches: Match[];
  activityStream: ActivityEvent[];
  stats: UserStats;
  suggestions: SmartSuggestion[];
  gamification: GamificationData;
}
```

#### 1.3 Unified Dashboard Frontend
**Service**: apps/web/src/pages/Dashboard.tsx  
**Effort**: 34 points  
**Owner**: Frontend Engineer

**Components to Build**:
```
apps/web/src/components/dashboard/
├── UnifiedDashboard.tsx           // Main dashboard container
├── TopActionBar.tsx               // 📦 SEND PKG | ✈️ ADD TRIP | 💰 EARNINGS | 🔔 ALERTS
├── SmartMatchFinder.tsx           // Best 3 matches display
├── ActivityStream.tsx             // Live activity feed
├── ContextSwitcher.tsx            // Role mode toggle
├── QuickStats.tsx                 // Earnings, trips, packages counters
└── WelcomeOnboarding.tsx          // First-time user experience
```

**Key Features**:
- Role-based context switching (Sender/Traveler/Dual mode)
- Responsive design for mobile-first experience
- Real-time updates via WebSocket
- Progressive Web App capabilities

#### 1.4 Activity Stream Service
**Service**: apps/api/src/features/activity (NEW)  
**Effort**: 21 points  
**Owner**: Backend Engineer

**Architecture**:
```typescript
// Event-driven architecture for activity tracking
interface ActivityEvent {
  id: string;
  userId: string;
  eventType: ActivityType;
  eventData: Record<string, any>;
  displayMessage: string;
  actionUrl?: string;
  priority: number;
  isRead: boolean;
  createdAt: Date;
}

enum ActivityType {
  MATCH_FOUND = 'MATCH_FOUND',
  TRIP_POSTED = 'TRIP_POSTED',
  PACKAGE_DELIVERED = 'PACKAGE_DELIVERED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  REVIEW_RECEIVED = 'REVIEW_RECEIVED'
}
```

### SPRINT 2: Intelligent Matching Engine (Weeks 3-4)
**Theme**: Smart Matching & AI Recommendations

#### 2.1 Smart Matching Algorithm Service
**Service**: apps/api/src/features/matching (NEW)  
**Effort**: 55 points  
**Owner**: Backend Engineer + Product Manager

**Core Algorithm**:
```typescript
// apps/api/src/features/matching/services/smart-matching.service.ts
interface MatchingCriteria {
  routeOptimization: number;    // 40% weight
  trustScore: number;           // 25% weight
  priceValue: number;           // 20% weight
  timelineMatch: number;        // 10% weight
  pastSuccessRate: number;      // 5% weight
}

class SmartMatchingEngine {
  async generateBestMatches(userId: string, context: 'SENDER' | 'TRAVELER'): Promise<Match[]> {
    // AI-powered matching logic
    // Returns top 3 matches with scoring
  }
  
  async calculateMatchScore(package: Package, trip: Trip): Promise<number> {
    // Weighted scoring algorithm
  }
}
```

**Endpoints**:
```typescript
GET  /api/matching/best-three/:userId     // Get top 3 matches for user
POST /api/matching/calculate-score        // Calculate match compatibility
GET  /api/matching/suggestions/:userId    // Get smart suggestions
POST /api/matching/feedback              // Learn from user decisions
```

#### 2.2 Enhanced Trip & Package Services
**Service**: apps/api/src/features/trips & packages  
**Effort**: 21 points each (42 total)  
**Owner**: Backend Engineer

**Enhancements**:
```typescript
// Add intelligent search and filtering
GET /api/trips/intelligent-search        // AI-powered trip discovery
GET /api/packages/intelligent-search     // AI-powered package discovery
PUT /api/trips/:id/optimize-route        // Route optimization suggestions
PUT /api/packages/:id/estimate-delivery  // Delivery time predictions
```

#### 2.3 Match Request Flow Frontend
**Service**: apps/web/src/components/matching  
**Effort**: 34 points  
**Owner**: Frontend Engineer

**Components**:
```
apps/web/src/components/matching/
├── BestThreeMatches.tsx           // Primary match display
├── MatchCard.tsx                  // Individual match card
├── OneClickRequest.tsx            // Instant request sending
├── MatchScoreIndicator.tsx        // Visual compatibility scoring
├── SmartSuggestions.tsx           // AI-powered recommendations
└── MatchingPreferences.tsx        // User preference settings
```

### SPRINT 3: Gamification & Retention Features (Weeks 5-6)
**Theme**: User Engagement & Habit Formation

#### 3.1 Gamification Service
**Service**: apps/api/src/features/gamification (NEW)  
**Effort**: 34 points  
**Owner**: Backend Engineer

**Features**:
```typescript
// Trust level progression system
enum TrustLevel {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER', 
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM'
}

interface GamificationData {
  trustLevel: TrustLevel;
  progress: number;        // Progress to next level (0-100)
  streakCount: number;     // Consecutive successful deliveries
  badges: Badge[];         // Earned achievements
  leaderboardRank: number; // Position in monthly rankings
}

// Achievement system
interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt: Date;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}
```

**Endpoints**:
```typescript
GET  /api/gamification/user/:userId      // Get user gamification data
POST /api/gamification/award-badge       // Award achievement badge
PUT  /api/gamification/update-streak     // Update streak counter
GET  /api/gamification/leaderboard       // Get monthly rankings
```

#### 3.2 Smart Suggestions Engine
**Service**: apps/api/src/features/suggestions (NEW)  
**Effort**: 21 points  
**Owner**: Backend Engineer

**AI-Powered Suggestions**:
```typescript
interface SmartSuggestion {
  id: string;
  type: 'REPEAT_ROUTE' | 'NEW_OPPORTUNITY' | 'SOCIAL_REFERRAL';
  title: string;
  description: string;
  actionUrl: string;
  estimatedValue: number; // Potential earning/saving
  confidence: number;     // AI confidence score (0-1)
  expiresAt: Date;
}

// Examples:
// "You flew NYC→LA last month. Post this route again?" 
// "Package to Paris available - matches your upcoming trip!"
// "Your friend Sarah just sent a package. Try earning money too!"
```

#### 3.3 Gamification UI Components  
**Service**: apps/web/src/components/gamification  
**Effort**: 21 points  
**Owner**: Frontend Engineer

**Components**:
```
apps/web/src/components/gamification/
├── TrustLevelIndicator.tsx        // User level display
├── StreakCounter.tsx              // Success streak display
├── BadgeShowcase.tsx              // Achievement gallery
├── ProgressBar.tsx                // Level progression
├── Leaderboard.tsx                // Monthly rankings
└── AchievementNotification.tsx    // Real-time achievement popups
```

### SPRINT 4: Advanced Features & Polish (Weeks 7-8)
**Theme**: Performance, Analytics & Production Readiness

#### 4.1 Real-time Updates & WebSocket
**Service**: apps/api/src/services/websocket (NEW)  
**Effort**: 21 points  
**Owner**: Backend Engineer

**Real-time Events**:
```typescript
enum WebSocketEvent {
  MATCH_FOUND = 'MATCH_FOUND',
  MATCH_ACCEPTED = 'MATCH_ACCEPTED', 
  PACKAGE_STATUS_UPDATE = 'PACKAGE_STATUS_UPDATE',
  ACHIEVEMENT_EARNED = 'ACHIEVEMENT_EARNED',
  NEW_MESSAGE = 'NEW_MESSAGE'
}

// WebSocket server for real-time dashboard updates
```

#### 4.2 Analytics & Tracking
**Service**: Enhanced UserAnalytics table usage  
**Effort**: 13 points  
**Owner**: Backend Engineer

**Key Metrics to Track**:
```typescript
interface DashboardAnalytics {
  dailyActiveUsers: number;
  conversionRates: {
    viewToRequest: number;
    requestToAcceptance: number;
    acceptanceToCompletion: number;
  };
  retentionMetrics: {
    day1: number;
    day7: number;
    day30: number;
  };
  crossSellingSuccess: number; // Users doing both send & travel
}
```

#### 4.3 Performance Optimization
**Service**: Frontend optimization  
**Effort**: 13 points  
**Owner**: Frontend Engineer

**Optimizations**:
- Route-based code splitting
- Image optimization and lazy loading
- PWA service worker implementation  
- Bundle size reduction
- Database query optimization

#### 4.4 E2E Testing & QA
**Service**: test/e2e/dashboard-flows.spec.ts  
**Effort**: 13 points  
**Owner**: QA Engineer

**Test Coverage**:
- Unified dashboard user flows
- Match request end-to-end journey
- Gamification feature testing
- Cross-browser compatibility
- Mobile responsiveness testing

## API ENDPOINTS SUMMARY

### New Endpoints Required
```typescript
// Dashboard Service
POST /api/dashboard/context
GET  /api/dashboard/unified  
GET  /api/dashboard/activity-stream
GET  /api/dashboard/quick-actions
GET  /api/dashboard/smart-suggestions

// Matching Engine Service  
GET  /api/matching/best-three/:userId
POST /api/matching/calculate-score
GET  /api/matching/suggestions/:userId
POST /api/matching/feedback

// Gamification Service
GET  /api/gamification/user/:userId
POST /api/gamification/award-badge
PUT  /api/gamification/update-streak
GET  /api/gamification/leaderboard

// Activity Stream Service
GET  /api/activity/stream/:userId
POST /api/activity/mark-read
GET  /api/activity/notifications/:userId

// Smart Suggestions Service
GET  /api/suggestions/:userId
POST /api/suggestions/feedback
PUT  /api/suggestions/:id/dismiss
```

## DATABASE MIGRATIONS

### Migration 1: Gamification Schema
```sql
-- File: prisma/migrations/add_gamification_features/migration.sql

-- Enhance profiles table with gamification
ALTER TABLE profiles ADD COLUMN trust_level VARCHAR(20) DEFAULT 'BRONZE';
ALTER TABLE profiles ADD COLUMN streak_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN badges JSON DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN last_activity_date DATE;
ALTER TABLE profiles ADD COLUMN total_earnings DECIMAL(10,2) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN total_savings DECIMAL(10,2) DEFAULT 0;

-- Activity events table
CREATE TABLE activity_events (
  id VARCHAR(30) PRIMARY KEY,
  user_id VARCHAR(30) REFERENCES users(id),
  event_type VARCHAR(50) NOT NULL,
  event_data JSON NOT NULL,
  display_message TEXT NOT NULL,
  action_url VARCHAR(255),
  priority INTEGER DEFAULT 1,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_user_created ON activity_events(user_id, created_at DESC);
CREATE INDEX idx_activity_unread ON activity_events(user_id, is_read) WHERE is_read = false;
```

### Migration 2: User Preferences & Match Scoring
```sql  
-- File: prisma/migrations/add_user_preferences/migration.sql

-- User dashboard preferences
CREATE TABLE user_preferences (
  id VARCHAR(30) PRIMARY KEY,
  user_id VARCHAR(30) REFERENCES users(id) UNIQUE,
  preferred_mode VARCHAR(20) DEFAULT 'DUAL',
  dashboard_layout JSON DEFAULT '{}',
  notification_settings JSON DEFAULT '{}',
  matching_preferences JSON DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced match scoring
ALTER TABLE matches ADD COLUMN match_score FLOAT DEFAULT 0.0;
ALTER TABLE matches ADD COLUMN compatibility_factors JSON DEFAULT '{}';
ALTER TABLE matches ADD COLUMN ai_confidence FLOAT DEFAULT 0.0;

CREATE INDEX idx_matches_score ON matches(match_score DESC);
```

## SUCCESS METRICS & KPIs

### Primary Metrics
- **Daily Active Users**: +150% increase
- **User Retention**: 
  - Day 1: 65% → 85%
  - Day 7: 35% → 60% 
  - Day 30: 15% → 35%
- **Cross-selling Rate**: 25% → 75% (users doing both send & travel)

### Secondary Metrics  
- **Match Request Rate**: 8% → 25% (views to requests)
- **Match Acceptance Rate**: 30% → 60% (requests to acceptance)
- **Average Session Duration**: 2.5 min → 6 min
- **Monthly Transactions per User**: 1.2 → 3.8

### Business Impact
- **User Lifetime Value**: 3x increase
- **Revenue per User**: 2.5x increase  
- **Customer Acquisition Cost**: 40% reduction (through referrals)

## TECHNICAL DEBT & RISKS

### Technical Risks
- **Performance**: Complex matching algorithm may impact response times
- **Scalability**: Real-time features require WebSocket infrastructure
- **Data Privacy**: Enhanced analytics must comply with GDPR

### Mitigation Strategies
- Implement caching layer for matching results (Redis)
- Use database indexing for activity stream queries  
- Add comprehensive monitoring and alerting
- Gradual rollout with feature flags

## ROLLOUT STRATEGY

### Phase 1: Internal Testing (Week 7)
- Deploy to staging environment
- Internal team testing and feedback
- Performance benchmarking

### Phase 2: Beta Release (Week 8)
- Release to 10% of users via feature flags
- Monitor key metrics and user feedback
- A/B test against current dashboard

### Phase 3: Full Release (Week 9)
- Gradual rollout to 100% of users
- Monitor system performance and user adoption
- Iterate based on user feedback

This master epic transforms Airbar from a simple matching platform into a habit-forming, AI-powered crowdshipping experience that maximizes user retention and lifetime value through intelligent personalization and gamification.