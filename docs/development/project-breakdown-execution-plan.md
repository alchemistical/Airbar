# Project Breakdown & Execution Plan
## Retention-Optimized Unified Dashboard Implementation

### 🎯 PROJECT KICKOFF CHECKLIST

**Pre-Development Setup (Week 0)**
- [ ] Team alignment meeting - review master epic
- [ ] Development environment setup validation
- [ ] Database backup and staging environment prep
- [ ] Feature flag system setup for gradual rollout
- [ ] Monitoring and analytics baseline establishment

---

## 🏗️ SPRINT 1: FOUNDATION & UNIFIED DASHBOARD (Weeks 1-2)

### **MILESTONE 1.1: Database Schema Enhancement**
**Owner**: Backend Engineer  
**Effort**: 13 points (3-4 days)  
**Priority**: CRITICAL - Blocks all other work

#### Tasks:
```sql
-- Task 1.1.1: Create migration files
prisma/migrations/20250825_add_gamification_features/migration.sql
prisma/migrations/20250825_add_user_preferences/migration.sql
prisma/migrations/20250825_add_activity_events/migration.sql
```

#### Detailed Implementation:
```bash
# Step 1: Create migration files
cd /Users/hadinem/Projects/AirbarDashboard
npx prisma migrate dev --name add_gamification_features

# Step 2: Update prisma/schema.prisma
```

**Schema Updates Needed:**
```prisma
// Add to existing Profile model
model Profile {
  // ... existing fields ...
  
  // NEW: Gamification fields
  trustLevel       TrustLevel @default(BRONZE) @map("trust_level")
  streakCount      Int        @default(0) @map("streak_count") 
  badges           Json       @default([]) @map("badges")
  lastActivityDate DateTime?  @map("last_activity_date")
  totalEarnings    Float      @default(0) @map("total_earnings")
  totalSavings     Float      @default(0) @map("total_savings")
}

// NEW: Activity Events model
model ActivityEvent {
  id             String            @id @default(cuid())
  userId         String            @map("user_id")
  eventType      ActivityEventType @map("event_type")
  eventData      Json              @map("event_data")
  displayMessage String            @map("display_message")
  actionUrl      String?           @map("action_url")
  priority       Int               @default(1)
  isRead         Boolean           @default(false) @map("is_read")
  createdAt      DateTime          @default(now()) @map("created_at")
  updatedAt      DateTime          @updatedAt @map("updated_at")

  // Relationships
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt])
  @@index([userId, isRead])
  @@map("activity_events")
}

// NEW: User Preferences model  
model UserPreference {
  id                   String   @id @default(cuid())
  userId               String   @unique @map("user_id")
  preferredMode        UserMode @default(DUAL) @map("preferred_mode")
  dashboardLayout      Json     @default("{}") @map("dashboard_layout")
  notificationSettings Json     @default("{}") @map("notification_settings")
  matchingPreferences  Json     @default("{}") @map("matching_preferences")
  createdAt            DateTime @default(now()) @map("created_at")
  updatedAt            DateTime @updatedAt @map("updated_at")

  // Relationships
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_preferences")
}

// NEW: Enums
enum TrustLevel {
  BRONZE
  SILVER  
  GOLD
  PLATINUM
}

enum UserMode {
  SENDER
  TRAVELER
  DUAL
}

enum ActivityEventType {
  MATCH_FOUND
  TRIP_POSTED
  PACKAGE_DELIVERED
  PAYMENT_RECEIVED
  REVIEW_RECEIVED
  ACHIEVEMENT_EARNED
}

// UPDATE: Enhance existing Match model
model Match {
  // ... existing fields ...
  
  // NEW: AI matching fields
  matchScore          Float @default(0.0) @map("match_score")
  compatibilityFactors Json  @default("{}") @map("compatibility_factors") 
  aiConfidence        Float @default(0.0) @map("ai_confidence")

  @@index([matchScore])
}

// UPDATE: Add relationships to User model
model User {
  // ... existing fields ...
  
  // NEW: Add relationships
  activityEvents  ActivityEvent[]
  preferences     UserPreference?
}
```

**Deliverable**: ✅ Database schema updated and migrated

---

### **MILESTONE 1.2: Enhanced Dashboard API Service**
**Owner**: Backend Engineer  
**Effort**: 21 points (5-6 days)  
**Dependencies**: Milestone 1.1 complete

#### File Structure:
```
apps/api/src/features/dashboard/
├── controllers/
│   ├── dashboard.controller.ts              # Existing - enhance
│   └── unified-dashboard.controller.ts      # NEW - main controller
├── services/
│   ├── dashboard.service.ts                # Existing - enhance  
│   ├── unified-dashboard.service.ts        # NEW - core service
│   └── activity-stream.service.ts          # NEW - activity service
├── routes/
│   └── unified-dashboard.routes.ts         # NEW - API routes
└── types/
    └── dashboard.types.ts                  # NEW - TypeScript interfaces
```

#### Implementation Tasks:

**Task 1.2.1: Core Service Logic**
```typescript
// apps/api/src/features/dashboard/services/unified-dashboard.service.ts
import { PrismaClient } from '@prisma/client';

interface UnifiedDashboardData {
  userMode: 'SENDER' | 'TRAVELER' | 'DUAL';
  quickActions: QuickAction[];
  bestMatches: BestMatch[];
  activityStream: ActivityEvent[];
  stats: UserStats;
  suggestions: SmartSuggestion[];
  gamification: GamificationData;
}

export class UnifiedDashboardService {
  constructor(private prisma: PrismaClient) {}

  async getDashboardData(userId: string): Promise<UnifiedDashboardData> {
    const [user, preferences, profile, recentActivity] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.getUserPreferences(userId),
      this.prisma.profile.findUnique({ where: { userId } }),
      this.prisma.activityEvent.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    return {
      userMode: preferences?.preferredMode || 'DUAL',
      quickActions: await this.generateQuickActions(userId, preferences?.preferredMode),
      bestMatches: await this.getBestMatches(userId),
      activityStream: recentActivity,
      stats: await this.getUserStats(userId),
      suggestions: await this.getSmartSuggestions(userId),
      gamification: this.getGamificationData(profile)
    };
  }

  private async getBestMatches(userId: string): Promise<BestMatch[]> {
    // Implementation for intelligent matching
    // This will be enhanced in Sprint 2
    return [];
  }

  private async generateQuickActions(userId: string, mode: string): Promise<QuickAction[]> {
    const baseActions = [
      { type: 'SEND_PACKAGE', label: '📦 Send Package', url: '/send-package' },
      { type: 'ADD_TRIP', label: '✈️ Add Trip', url: '/add-trip' },
      { type: 'VIEW_EARNINGS', label: '💰 Earnings', url: '/wallet' },
      { type: 'NOTIFICATIONS', label: '🔔 Alerts', url: '/notifications' }
    ];
    
    // Customize based on user mode and history
    return baseActions;
  }
}
```

**Task 1.2.2: API Controllers**
```typescript
// apps/api/src/features/dashboard/controllers/unified-dashboard.controller.ts
import { Request, Response } from 'express';
import { UnifiedDashboardService } from '../services/unified-dashboard.service';

export class UnifiedDashboardController {
  constructor(private dashboardService: UnifiedDashboardService) {}

  /**
   * @swagger
   * /api/dashboard/unified:
   *   get:
   *     summary: Get unified dashboard data
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Unified dashboard data
   */
  async getUnifiedDashboard(req: Request, res: Response) {
    try {
      const userId = req.user.id; // From JWT middleware
      const dashboardData = await this.dashboardService.getDashboardData(userId);
      
      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'DASHBOARD_ERROR',
          message: 'Failed to load dashboard data'
        }
      });
    }
  }

  async setUserContext(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { preferredMode } = req.body;
      
      await this.dashboardService.updateUserPreferences(userId, { preferredMode });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { code: 'CONTEXT_UPDATE_ERROR', message: error.message }
      });
    }
  }
}
```

**Task 1.2.3: API Routes Setup**
```typescript
// apps/api/src/features/dashboard/routes/unified-dashboard.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../../../middleware/auth';
import { UnifiedDashboardController } from '../controllers/unified-dashboard.controller';

const router = Router();
const controller = new UnifiedDashboardController();

// Protected routes
router.use(authMiddleware);

router.get('/unified', controller.getUnifiedDashboard);
router.post('/context', controller.setUserContext);
router.get('/activity-stream', controller.getActivityStream);
router.get('/quick-actions', controller.getQuickActions);

export default router;
```

**Task 1.2.4: Update Main Server**
```typescript
// apps/api/src/server.ts - ADD this import and route
import unifiedDashboardRoutes from './features/dashboard/routes/unified-dashboard.routes';

// Add after existing routes
app.use('/api/dashboard', unifiedDashboardRoutes);
```

**Deliverable**: ✅ Enhanced Dashboard API with unified endpoint

---

### **MILESTONE 1.3: Unified Dashboard Frontend**  
**Owner**: Frontend Engineer  
**Effort**: 34 points (8-9 days)  
**Dependencies**: Milestone 1.2 complete

#### Component Architecture:
```
apps/web/src/components/dashboard/
├── UnifiedDashboard.tsx               # Main container
├── TopActionBar.tsx                   # Primary action buttons
├── SmartMatchFinder.tsx               # Best 3 matches display
├── ActivityStream.tsx                 # Live activity feed
├── ContextSwitcher.tsx                # Role mode toggle
├── QuickStats.tsx                     # Metrics display
├── WelcomeOnboarding.tsx              # First-time UX
└── index.ts                           # Exports
```

#### Implementation Tasks:

**Task 1.3.1: Main Dashboard Container**
```typescript
// apps/web/src/components/dashboard/UnifiedDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TopActionBar } from './TopActionBar';
import { SmartMatchFinder } from './SmartMatchFinder';
import { ActivityStream } from './ActivityStream';
import { QuickStats } from './QuickStats';

interface DashboardData {
  userMode: 'SENDER' | 'TRAVELER' | 'DUAL';
  quickActions: QuickAction[];
  bestMatches: BestMatch[];
  activityStream: ActivityEvent[];
  stats: UserStats;
  suggestions: SmartSuggestion[];
  gamification: GamificationData;
}

export function UnifiedDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/unified', {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      if (result.success) {
        setDashboardData(result.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Action Bar */}
        <TopActionBar 
          quickActions={dashboardData.quickActions}
          userMode={dashboardData.userMode}
        />
        
        {/* Smart Match Finder */}
        <SmartMatchFinder 
          matches={dashboardData.bestMatches}
          userMode={dashboardData.userMode}
        />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Activity Stream */}
          <div className="lg:col-span-2">
            <ActivityStream events={dashboardData.activityStream} />
          </div>
          
          {/* Side Panel */}
          <div className="space-y-6">
            <QuickStats stats={dashboardData.stats} />
            {/* Additional widgets will go here */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Task 1.3.2: Top Action Bar**
```typescript
// apps/web/src/components/dashboard/TopActionBar.tsx
import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface QuickAction {
  type: string;
  label: string;
  url: string;
  count?: number;
}

interface TopActionBarProps {
  quickActions: QuickAction[];
  userMode: 'SENDER' | 'TRAVELER' | 'DUAL';
}

export function TopActionBar({ quickActions, userMode }: TopActionBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Button
            key={action.type}
            variant={action.type === 'SEND_PACKAGE' || action.type === 'ADD_TRIP' ? 'default' : 'outline'}
            size="lg"
            className="h-16 flex flex-col items-center justify-center relative"
            onClick={() => window.location.href = action.url}
          >
            <span className="text-base font-semibold">{action.label}</span>
            {action.count && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs">
                {action.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
```

**Task 1.3.3: Smart Match Finder**
```typescript
// apps/web/src/components/dashboard/SmartMatchFinder.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Star, MapPin, Clock, DollarSign } from 'lucide-react';

interface BestMatch {
  id: string;
  type: 'TRIP' | 'PACKAGE';
  rating: number;
  price: number;
  timeline: string;
  location: string;
  title: string;
}

interface SmartMatchFinderProps {
  matches: BestMatch[];
  userMode: 'SENDER' | 'TRAVELER' | 'DUAL';
}

export function SmartMatchFinder({ matches, userMode }: SmartMatchFinderProps) {
  if (matches.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            🎯 Finding Your Best Matches...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            {userMode === 'SENDER' 
              ? "We're scanning available travelers for your packages."
              : "We're looking for packages that match your upcoming trips."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          🎯 Best 3 Matches For You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {matches.slice(0, 3).map((match, index) => (
            <div key={match.id} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{match.rating}</span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  index === 0 ? 'bg-green-100 text-green-800' :
                  index === 1 ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {index === 0 ? 'PERFECT' : index === 1 ? 'BUDGET' : 'PREMIUM'}
                </span>
              </div>
              
              <h3 className="font-semibold mb-2 truncate">{match.title}</h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>${match.price}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{match.timeline}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="truncate">{match.location}</span>
                </div>
              </div>
              
              <Button className="w-full mt-4" size="sm">
                Request Match
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

**Task 1.3.4: Activity Stream**
```typescript
// apps/web/src/components/dashboard/ActivityStream.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { formatDistanceToNow } from 'date-fns';

interface ActivityEvent {
  id: string;
  eventType: string;
  displayMessage: string;
  actionUrl?: string;
  createdAt: string;
  isRead: boolean;
}

interface ActivityStreamProps {
  events: ActivityEvent[];
}

export function ActivityStream({ events }: ActivityStreamProps) {
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'MATCH_FOUND': return '🔄';
      case 'TRIP_POSTED': return '✈️';
      case 'PACKAGE_DELIVERED': return '📦';
      case 'PAYMENT_RECEIVED': return '💰';
      case 'ACHIEVEMENT_EARNED': return '🏆';
      default: return '📱';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className={`flex items-start p-3 rounded-lg border ${
              event.isRead ? 'border-gray-200' : 'border-blue-200 bg-blue-50'
            }`}>
              <div className="text-xl mr-3">
                {getEventIcon(event.eventType)}
              </div>
              <div className="flex-1">
                <p className="text-sm">{event.displayMessage}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                </p>
              </div>
              {event.actionUrl && (
                <div className="ml-4">
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              )}
            </div>
          ))}
          
          {events.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
              <p className="text-sm">Start by sending a package or posting a trip!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

**Task 1.3.5: Update Main Dashboard Page**
```typescript
// apps/web/src/pages/Dashboard.tsx - REPLACE existing with:
import React from 'react';
import { UnifiedDashboard } from '../components/dashboard/UnifiedDashboard';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <UnifiedDashboard />
    </DashboardLayout>
  );
}
```

**Deliverable**: ✅ Unified Dashboard Frontend with responsive design

---

### **MILESTONE 1.4: Activity Stream Service**
**Owner**: Backend Engineer  
**Effort**: 21 points (5-6 days)  
**Dependencies**: Milestone 1.1 complete

#### Implementation Tasks:

**Task 1.4.1: Activity Service Core**
```typescript
// apps/api/src/features/activity/services/activity-stream.service.ts
import { PrismaClient } from '@prisma/client';

export class ActivityStreamService {
  constructor(private prisma: PrismaClient) {}

  async createActivityEvent(
    userId: string, 
    eventType: string, 
    eventData: any, 
    displayMessage: string,
    actionUrl?: string
  ) {
    return await this.prisma.activityEvent.create({
      data: {
        userId,
        eventType,
        eventData,
        displayMessage,
        actionUrl,
        priority: this.getEventPriority(eventType)
      }
    });
  }

  async getUserActivityStream(userId: string, limit = 20) {
    return await this.prisma.activityEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  async markEventsAsRead(userId: string, eventIds: string[]) {
    return await this.prisma.activityEvent.updateMany({
      where: {
        userId,
        id: { in: eventIds }
      },
      data: { isRead: true }
    });
  }

  private getEventPriority(eventType: string): number {
    const priorities = {
      'MATCH_FOUND': 3,
      'PAYMENT_RECEIVED': 3,
      'PACKAGE_DELIVERED': 2,
      'ACHIEVEMENT_EARNED': 1,
      'TRIP_POSTED': 1
    };
    return priorities[eventType] || 1;
  }
}
```

**Task 1.4.2: Event Triggers**
```typescript
// apps/api/src/features/activity/triggers/activity-triggers.ts
import { ActivityStreamService } from '../services/activity-stream.service';

export class ActivityTriggers {
  constructor(private activityService: ActivityStreamService) {}

  async onMatchFound(userId: string, matchData: any) {
    await this.activityService.createActivityEvent(
      userId,
      'MATCH_FOUND',
      matchData,
      `🔄 Your package to ${matchData.destination}: Traveler found!`,
      `/match/${matchData.matchId}`
    );
  }

  async onTripPosted(userId: string, tripData: any) {
    await this.activityService.createActivityEvent(
      userId,
      'TRIP_POSTED',
      tripData,
      `✈️ Trip ${tripData.origin}→${tripData.destination} posted successfully`,
      `/trips/${tripData.tripId}`
    );
  }

  async onPackageDelivered(userId: string, packageData: any) {
    await this.activityService.createActivityEvent(
      userId,
      'PACKAGE_DELIVERED',
      packageData,
      `📦 Package delivered successfully! Rate ${packageData.travelerName}`,
      `/history/${packageData.matchId}`
    );
  }
}
```

**Deliverable**: ✅ Activity Stream Service with event triggers

---

## 🎯 SPRINT 1 COMPLETION CRITERIA

### Definition of Done:
- [ ] Database schema updated and migrated to staging
- [ ] All API endpoints return valid responses  
- [ ] Frontend components render correctly on mobile and desktop
- [ ] Activity stream captures and displays events
- [ ] User can switch between Sender/Traveler/Dual modes
- [ ] Dashboard loads in under 2 seconds
- [ ] Unit tests written for core services (80% coverage)
- [ ] Integration tests pass for API endpoints
- [ ] Code review completed and approved
- [ ] Staging deployment successful

### Testing Checklist:
```bash
# API Testing
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/dashboard/unified

# Frontend Testing  
npm run test -- --testNamePattern="UnifiedDashboard"

# Database Testing
npm run db:test-migrations

# E2E Testing
npm run test:e2e -- --spec="dashboard-flow"
```

### Performance Benchmarks:
- Dashboard API response time: < 200ms
- Frontend initial render: < 1s
- Activity stream real-time updates: < 100ms latency

---

## 🚀 NEXT SPRINT PREPARATION

### Sprint 2 Pre-work:
- [ ] Design smart matching algorithm specifications
- [ ] Set up machine learning pipeline for match scoring
- [ ] Create test data sets for algorithm training
- [ ] Design UI mockups for enhanced match display

### Sprint 2 Dependencies:
- All Sprint 1 deliverables completed and deployed
- Performance benchmarks met
- User feedback collected from internal testing

---

## 📊 SUCCESS METRICS (Sprint 1)

### Technical Metrics:
- **API Response Time**: < 200ms for dashboard endpoint
- **Frontend Bundle Size**: < 500KB gzipped
- **Database Query Performance**: < 50ms for complex joins
- **Test Coverage**: > 80% for new code

### User Experience Metrics:
- **Dashboard Load Time**: < 2 seconds
- **Mobile Responsiveness**: 100% score on Google PageSpeed
- **Accessibility**: WCAG AA compliance
- **Error Rate**: < 1% for dashboard loads

This completes the detailed Sprint 1 breakdown. Each task has clear deliverables, file paths, and acceptance criteria. The team can start development immediately with this roadmap.

Would you like me to continue with the detailed breakdown for Sprint 2 (Intelligent Matching Engine) or would you prefer to start with Sprint 1 implementation first?