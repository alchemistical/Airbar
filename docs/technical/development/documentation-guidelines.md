# Airbar Platform Documentation

## Table of Contents
1. [Overview](#overview)
2. [Sitemap Schema](#sitemap-schema)
3. [Page Screenshots](#page-screenshots)
4. [Technical Architecture](#technical-architecture)
5. [API Documentation](#api-documentation)

---

## Overview

Airbar is a peer-to-peer crowdshipping platform that connects travelers with people who need packages delivered. The platform provides a comprehensive dashboard interface for both travelers and senders, with features for trip management, package tracking, financial transactions, and customer support.

**Platform URL**: https://airbar.app  
**Version**: 1.0.0  
**Last Updated**: January 11, 2025

---

## Sitemap Schema

### Visual Sitemap Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                          AIRBAR APP                             │
│                     (Authenticated Users)                       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                        ┌───────────────┐
                        │   Dashboard   │
                        │      /        │
                        └───────┬───────┘
                                │
        ┌───────────────────────┴────────────────────────┐
        │                                                │
        ▼                                                ▼
┌─────────────────┐                           ┌──────────────────┐
│  Sidebar Menu   │                           │ User Dropdown    │
│  (Core Actions) │                           │ (User Features)  │
└────────┬────────┘                           └────────┬─────────┘
         │                                             │
         ├─► Trips (/dashboard/traveler/trips)         ├─► Wallet
         │    └─► Add Trip (.../addtrip)               │    └─► Transactions
         │                                             │
         ├─► Parcel Requests                           ├─► Notifications
         │    └─► Request Detail (/:id)                │
         │                                             ├─► Profile
         ├─► My Parcels (sender)                       │
         │                                             ├─► Referrals
         ├─► Matches                                   │
         │                                             └─► History
         ├─► Send Package                                   ├─► View Detail
         │                                                  ├─► Traveler History
         ├─► Tracking                                       └─► Sender History
         │
         └─► Support
```

### Hierarchical Site Structure

```yaml
Root:
  path: "/"
  redirect_to: "/dashboard"
  
  Dashboard:
    path: "/dashboard"
    description: "Main dashboard with role-based metrics and widgets"
    components:
      - MetricsCards (dynamic based on role)
      - QuickActions
      - WalletSnapshot
      - ToDoList
      - TripTimeline
      - RecentNotifications
    
    # Sidebar Navigation (Core Features)
    Trips:
      path: "/dashboard/traveler/trips"
      description: "Trip management for travelers"
      features:
        - List/Grid view toggle
        - Search and filtering
        - Status tracking
      sub_pages:
        AddTrip:
          path: "/dashboard/traveler/trips/addtrip"
          description: "Multi-step trip creation form"
          steps: 5
    
    ParcelRequests:
      path: "/dashboard/parcel-requests"
      description: "Browse available delivery requests"
      features:
        - Advanced filtering
        - Sort options
        - Match suggestions
      sub_pages:
        RequestDetail:
          path: "/dashboard/parcel-requests/:id"
          description: "Detailed view of specific request"
    
    SenderParcels:
      path: "/dashboard/sender/parcels"
      description: "Sender's package management"
      access: "sender_only"
    
    Matches:
      path: "/dashboard/matches"
      description: "Active delivery matches"
      features:
        - Role-based views
        - Status updates
        - Communication tools
    
    SendPackage:
      path: "/send-package"
      description: "Create new package request"
      steps: 6
      features:
        - Multi-step form
        - Real-time validation
        - Price estimation
    
    Tracking:
      path: "/dashboard/tracking"
      description: "Real-time package tracking"
      features:
        - Timeline visualization
        - Status updates
        - Location tracking
    
    Support:
      path: "/dashboard/support"
      description: "Help center and support"
      features:
        - FAQ system
        - Ticket management
        - Search functionality
    
    # User Dropdown (Secondary Features)
    Wallet:
      path: "/dashboard/wallet"
      description: "Financial management"
      sub_pages:
        Transactions:
          path: "/dashboard/wallet/transactions"
          description: "Transaction history"
    
    Notifications:
      path: "/dashboard/notifications"
      description: "Notification center"
      features:
        - Type filtering
        - Read/Unread status
    
    Profile:
      path: "/dashboard/profile"
      description: "User profile and settings"
      sections:
        - Personal Information
        - KYC Verification
        - Security Settings
        - Privacy Controls
    
    Referrals:
      path: "/dashboard/referrals"
      description: "Referral program"
      features:
        - Code sharing
        - Earnings tracking
    
    History:
      path: "/dashboard/history"
      description: "Delivery history"
      sub_pages:
        ViewDetail:
          path: "/dashboard/history/view/:id"
        TravelerHistory:
          path: "/dashboard/history/traveler"
        SenderHistory:
          path: "/dashboard/history/sender"
```

---

## Page Screenshots

### 1. Dashboard (/)
**Path**: `/dashboard`  
**Description**: Main landing page with role-based metrics and quick actions
![Dashboard Screenshot - Placeholder]

### 2. Trips Management
**Path**: `/dashboard/traveler/trips`  
**Description**: Comprehensive trip management interface
![Trips Screenshot - Placeholder]

### 3. Add Trip
**Path**: `/dashboard/traveler/trips/addtrip`  
**Description**: Multi-step trip creation form
![Add Trip Screenshot - Placeholder]

### 4. Parcel Requests
**Path**: `/dashboard/parcel-requests`  
**Description**: Browse and filter available delivery requests
![Parcel Requests Screenshot - Placeholder]

### 5. Parcel Request Detail
**Path**: `/dashboard/parcel-requests/:id`  
**Description**: Detailed view of a specific parcel request
![Request Detail Screenshot - Placeholder]

### 6. My Parcels (Sender)
**Path**: `/dashboard/sender/parcels`  
**Description**: Sender's package management dashboard
![My Parcels Screenshot - Placeholder]

### 7. Matches
**Path**: `/dashboard/matches`  
**Description**: Active delivery matches with status tracking
![Matches Screenshot - Placeholder]

### 8. Send Package
**Path**: `/send-package`  
**Description**: Multi-step package submission form
![Send Package Screenshot - Placeholder]

### 9. Tracking
**Path**: `/dashboard/tracking`  
**Description**: Real-time package tracking with timeline
![Tracking Screenshot - Placeholder]

### 10. Support
**Path**: `/dashboard/support`  
**Description**: Help center with FAQ and ticket system
![Support Screenshot - Placeholder]

### 11. Wallet
**Path**: `/dashboard/wallet`  
**Description**: Financial overview and management
![Wallet Screenshot - Placeholder]

### 12. Wallet Transactions
**Path**: `/dashboard/wallet/transactions`  
**Description**: Detailed transaction history
![Transactions Screenshot - Placeholder]

### 13. Notifications
**Path**: `/dashboard/notifications`  
**Description**: Centralized notification center
![Notifications Screenshot - Placeholder]

### 14. Profile
**Path**: `/dashboard/profile`  
**Description**: User profile and settings management
![Profile Screenshot - Placeholder]

### 15. Referrals
**Path**: `/dashboard/referrals`  
**Description**: Referral program dashboard
![Referrals Screenshot - Placeholder]

### 16. History
**Path**: `/dashboard/history`  
**Description**: Complete delivery history
![History Screenshot - Placeholder]

### 17. History Detail
**Path**: `/dashboard/history/view/:id`  
**Description**: Detailed view of delivery record
![History Detail Screenshot - Placeholder]

### 18. Traveler History
**Path**: `/dashboard/history/traveler`  
**Description**: Traveler-specific delivery history
![Traveler History Screenshot - Placeholder]

### 19. Sender History
**Path**: `/dashboard/history/sender`  
**Description**: Sender-specific package history
![Sender History Screenshot - Placeholder]

---

## Technical Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query)
- **Build Tool**: Vite

### Backend Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (via Neon)
- **ORM**: Drizzle ORM

### Key Dependencies
```json
{
  "frontend": {
    "@radix-ui/*": "UI primitives",
    "@tanstack/react-query": "Server state management",
    "tailwindcss": "Utility-first CSS",
    "wouter": "Routing",
    "react-hook-form": "Form handling",
    "zod": "Schema validation"
  },
  "backend": {
    "express": "Web framework",
    "drizzle-orm": "Type-safe ORM",
    "passport": "Authentication",
    "express-session": "Session management"
  }
}
```

---

## API Documentation

### Authentication Endpoints
```
GET  /api/user/:id         - Get user by ID
POST /api/auth/login       - User login
POST /api/auth/logout      - User logout
POST /api/auth/register    - User registration
```

### Dashboard Endpoints
```
GET /api/dashboard/metrics/:userId        - User dashboard metrics
GET /api/dashboard/trips/:userId          - User's trips
GET /api/dashboard/parcel-requests/:userId - Available parcel requests
GET /api/dashboard/earnings/:userId       - User earnings
GET /api/dashboard/notifications/:userId  - User notifications
```

### Trip Management
```
POST /api/trips                - Create new trip
GET  /api/trips/:userId        - Get user's trips
PUT  /api/trips/:id           - Update trip
DELETE /api/trips/:id         - Delete trip
```

### Parcel Requests
```
POST /api/parcel-requests              - Create parcel request
GET  /api/parcel-requests/:id          - Get request details
GET  /api/parcel-requests/trip/:tripId - Get requests for trip
PUT  /api/parcel-requests/:id         - Update request
```

### Response Format
All API responses follow this structure:
```typescript
{
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
```

---

## Navigation Flow Diagrams

### Traveler User Journey
```
Dashboard → View Metrics → Add Trip → Browse Parcel Requests → 
Accept Request → Manage in Matches → Update Status in Tracking → 
Complete Delivery → Receive Payment in Wallet → Withdraw Earnings
```

### Sender User Journey
```
Dashboard → Send Package (Multi-step) → Track in My Parcels → 
Monitor Matches → Track Delivery → Confirm Receipt → 
Rate Experience → View in History
```

### Support Flow
```
Any Page → Support → Search FAQ → Not Found → Contact Support → 
Fill Form → Submit Ticket → Receive Confirmation → 
Track Resolution in Support Tickets
```

---

## Responsive Design Breakpoints

- **Mobile**: < 768px
  - Bottom navigation
  - Hamburger menu
  - Single column layout

- **Tablet**: 768px - 1024px
  - Collapsible sidebar
  - 2-column layouts
  - Touch-optimized interfaces

- **Desktop**: > 1024px
  - Full sidebar always visible
  - Multi-column layouts
  - Hover states and tooltips

---

## Security & Access Control

### Authentication
- Session-based authentication
- Secure cookie storage
- CSRF protection

### Role-Based Access
- **Traveler**: Access to trips, parcel browsing, earnings
- **Sender**: Access to package sending, tracking, payments
- **Both**: Universal access to shared features

### Data Protection
- Input validation with Zod
- SQL injection prevention via Drizzle ORM
- XSS protection through React
- HTTPS enforcement in production

---

## Performance Optimizations

1. **Code Splitting**: Route-based lazy loading
2. **Caching**: React Query with smart invalidation
3. **Asset Optimization**: Vite build optimization
4. **Database**: Indexed queries, connection pooling
5. **CDN**: Static assets served via CDN

---

## Deployment

### Environment Variables
```env
DATABASE_URL=postgresql://...
SESSION_SECRET=...
NODE_ENV=production
VITE_API_URL=...
```

### Build Process
```bash
npm run build  # Builds both frontend and backend
npm start      # Runs production server
```

### Hosting
- Platform: Replit Deployments
- Database: Neon PostgreSQL
- Domain: Custom domain support

---

*This documentation is maintained as part of the Airbar development process. For updates or corrections, please submit a pull request.*