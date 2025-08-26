# 🚀 IMMEDIATE ACTION CHECKLIST
## Get Started with Retention Dashboard Development

### ⚡ RIGHT NOW (Next 30 minutes)

#### 1. Validate Development Environment
```bash
# Navigate to project directory
cd /Users/hadinem/Projects/AirbarDashboard

# Check that all services start successfully
pnpm dev

# Verify these URLs work:
# ✅ Frontend: http://localhost:5173
# ✅ API: http://localhost:3001/api/health  
# ✅ Database: Check connection in terminal
```

#### 2. Create Sprint 1 Feature Branch
```bash
# Create and switch to feature branch
git checkout -b feature/sprint-1-unified-dashboard

# Push branch to remote
git push -u origin feature/sprint-1-unified-dashboard
```

#### 3. Setup Progress Tracking
```bash
# Create sprint tracking file
mkdir -p docs/sprints
touch docs/sprints/sprint-1-progress.md

# Copy template content
echo "# Sprint 1 Progress - Started $(date)" > docs/sprints/sprint-1-progress.md
```

---

### 🎯 TODAY'S PRIORITY TASKS (Next 4-6 hours)

#### TASK 1: Database Schema Enhancement (CRITICAL - Blocks everything else)
**Time Estimate**: 2-3 hours  
**Owner**: Backend Developer  
**Status**: 🔴 MUST COMPLETE TODAY

**Step-by-Step Implementation:**

1. **Update Prisma Schema** (30 min)
```bash
# Edit prisma/schema.prisma
code prisma/schema.prisma
```

Add these models and updates:
```prisma
// ADD to existing Profile model (around line 70)
model Profile {
  // ... existing fields ...
  
  // NEW: Gamification fields
  trustLevel       TrustLevel @default(BRONZE) @map("trust_level")
  streakCount      Int        @default(0) @map("streak_count") 
  badges           Json       @default("[]") @map("badges")
  lastActivityDate DateTime?  @map("last_activity_date")
  totalEarnings    Float      @default(0) @map("total_earnings")
  totalSavings     Float      @default(0) @map("total_savings")
  
  // ... rest of existing fields ...
}

// ADD to existing User model relationships (around line 45)
model User {
  // ... existing fields and relationships ...
  
  // NEW: Add these relationships
  activityEvents  ActivityEvent[]
  preferences     UserPreference?
}

// ADD to existing Match model (around line 320)  
model Match {
  // ... existing fields ...
  
  // NEW: AI matching fields
  matchScore           Float @default(0.0) @map("match_score")
  compatibilityFactors Json  @default("{}") @map("compatibility_factors") 
  aiConfidence         Float @default(0.0) @map("ai_confidence")
  
  // ... rest of existing fields ...
  
  @@index([matchScore])
}

// ADD these NEW models at the end of the file (after SystemHealth model)

// Activity Events model
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

// User Preferences model  
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

// ADD these NEW enums at the end with other enums (around line 590)

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
```

2. **Generate and Run Migration** (15 min)
```bash
# Generate migration
npx prisma migrate dev --name add_gamification_and_activity_features

# Verify migration worked
npx prisma studio
```

3. **Generate Updated Prisma Client** (5 min)
```bash
# Regenerate Prisma client with new models
npx prisma generate
```

4. **Test Database Changes** (10 min)
```bash
# Check that new tables exist
npm run db:studio

# Verify in Prisma Studio that you see:
# ✅ activity_events table
# ✅ user_preferences table  
# ✅ profiles table has new columns
# ✅ matches table has new columns
```

**✅ TASK 1 COMPLETION CRITERIA:**
- [ ] Schema updated with all new models and fields
- [ ] Migration runs successfully without errors
- [ ] Prisma Studio shows all new tables and columns
- [ ] No TypeScript compilation errors

---

#### TASK 2: Basic Dashboard API Service (Start Today)
**Time Estimate**: 2-3 hours  
**Owner**: Backend Developer  
**Dependencies**: Task 1 must be complete

**Implementation Steps:**

1. **Create Service Directory Structure** (10 min)
```bash
# Create new directories
mkdir -p apps/api/src/features/dashboard/services
mkdir -p apps/api/src/features/dashboard/controllers  
mkdir -p apps/api/src/features/dashboard/routes
mkdir -p apps/api/src/features/dashboard/types
```

2. **Create TypeScript Interfaces** (20 min)
```typescript
// Create: apps/api/src/features/dashboard/types/dashboard.types.ts
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
```

3. **Build Core Service Logic** (90 min)
```typescript
// Create: apps/api/src/features/dashboard/services/unified-dashboard.service.ts
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
```

4. **Create API Controller** (30 min)
```typescript
// Create: apps/api/src/features/dashboard/controllers/unified-dashboard.controller.ts
import { Request, Response } from 'express';
import { UnifiedDashboardService } from '../services/unified-dashboard.service';
import { prisma } from '../../../lib/prisma';

const dashboardService = new UnifiedDashboardService(prisma);

export class UnifiedDashboardController {
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
  static async getUnifiedDashboard(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
        });
      }

      const dashboardData = await dashboardService.getDashboardData(userId);
      
      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'DASHBOARD_ERROR',
          message: 'Failed to load dashboard data'
        }
      });
    }
  }

  static async setUserContext(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { preferredMode } = req.body;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
        });
      }
      
      await dashboardService.updateUserPreferences(userId, { preferredMode });
      
      res.json({ success: true });
    } catch (error) {
      console.error('Context update error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'CONTEXT_UPDATE_ERROR', message: 'Failed to update user context' }
      });
    }
  }
}
```

5. **Setup API Routes** (20 min)
```typescript
// Create: apps/api/src/features/dashboard/routes/unified-dashboard.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../../../middleware/auth';
import { UnifiedDashboardController } from '../controllers/unified-dashboard.controller';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Dashboard routes
router.get('/unified', UnifiedDashboardController.getUnifiedDashboard);
router.post('/context', UnifiedDashboardController.setUserContext);

export default router;
```

6. **Update Main Server** (10 min)
```typescript
// Edit: apps/api/src/server.ts
// Add this import near the top with other route imports:
import unifiedDashboardRoutes from './features/dashboard/routes/unified-dashboard.routes'

// Add this route registration after existing dashboard routes (around line 198):
app.use('/api/dashboard', unifiedDashboardRoutes)
```

**✅ TASK 2 COMPLETION CRITERIA:**
- [ ] Service compiles without TypeScript errors
- [ ] API endpoint returns valid JSON response
- [ ] Database queries execute successfully
- [ ] Authentication middleware works correctly

---

### 🎯 END OF DAY GOALS

**Must Complete Today:**
- ✅ Task 1: Database schema updated and migrated
- ✅ Task 2: Basic dashboard API service functional

**Test Your Progress:**
```bash
# Test API endpoint (after completing both tasks)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     http://localhost:3001/api/dashboard/unified

# Should return JSON with dashboard data structure
```

**Document Progress:**
```bash
# Update your progress file
echo "Day 1 Progress: Database schema ✅, Dashboard API ✅" >> docs/sprints/sprint-1-progress.md
```

---

### 🚨 TROUBLESHOOTING GUIDE

**Common Issues & Solutions:**

1. **Prisma Migration Fails**
```bash
# Reset database (CAUTION: loses all data)
npx prisma migrate reset

# Or fix migration conflicts
npx prisma db push --accept-data-loss
```

2. **TypeScript Compilation Errors**
```bash
# Check for missing dependencies
pnpm install

# Regenerate Prisma client
npx prisma generate

# Check TypeScript config
npx tsc --noEmit
```

3. **API Endpoint Returns 404**
```bash
# Verify route registration in server.ts
# Check that authMiddleware is working
# Confirm database connection is active
```

4. **Database Connection Issues**
```bash
# Check .env.local file exists and has correct DATABASE_URL
# Verify PostgreSQL is running
# Test connection with: npx prisma studio
```

---

### 📞 SUPPORT & ESCALATION

**If you're blocked or need help:**
1. Check this troubleshooting guide first
2. Review the detailed implementation in project-breakdown-execution-plan.md
3. Test each component individually to isolate issues
4. Document the specific error message and steps to reproduce

**Success Indicators:**
- Database schema updates applied successfully
- API endpoint returns proper JSON response
- No TypeScript compilation errors
- Ready to start frontend development tomorrow

This immediate action checklist gives you everything needed to make significant progress on Day 1. Focus on completing these two critical tasks that unblock all subsequent development work.