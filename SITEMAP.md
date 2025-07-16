# Airbar Application Sitemap

## Overview
This document provides a comprehensive sitemap of the Airbar crowdshipping platform, showing all available pages, their hierarchical structure, and navigation flow.

## Last Updated: January 16, 2025

## Sitemap Structure

```
/
├── Marketing & Public Pages
│   ├── / (Homepage - Conversion Optimized)
│   ├── /about (About Us)
│   ├── /how-it-works (How It Works)
│   ├── /pricing (Pricing Calculator)
│   ├── /safety (Safety & Trust)
│   ├── /faq (Frequently Asked Questions)
│   ├── /contact (Contact Us)
│   ├── /terms (Terms of Service)
│   ├── /privacy (Privacy Policy)
│   ├── /business (Business Solutions)
│   └── /careers (Career Opportunities)
│
├── Marketplace
│   ├── /marketplace/trips (Browse Available Trips)
│   │   └── /marketplace/trips/:id (Trip Details & Match Request)
│   └── /browse-packages (Browse Package Requests)
│
├── Dashboard (Authenticated Area)
│   ├── /dashboard (Main Dashboard)
│   ├── /dashboard/traveler/trips (Trip Management)
│   │   └── /dashboard/traveler/trips/addtrip (Add New Trip - 6 Steps)
│   ├── /dashboard/parcel-requests (Browse Parcel Requests)
│   │   └── /dashboard/parcel-requests/:id (Parcel Request Detail)
│   ├── /dashboard/sender/parcels (My Parcels - Sender View)
│   ├── /dashboard/matches (Active Matches & Requests)
│   ├── /send-package (Send Package Form - Multi-step)
│   ├── /dashboard/tracking (Package Tracking)
│   └── /dashboard/support (Help & Support)
│
├── User Menu (Dropdown)
│   ├── /dashboard/wallet (Wallet Overview)
│   │   └── /dashboard/wallet/transactions (Transaction History)
│   ├── /dashboard/notifications (Notification Center)
│   ├── /dashboard/profile (Profile & Settings)
│   ├── /dashboard/referrals (Referral Program)
│   └── /dashboard/history (Delivery History)
│       ├── /dashboard/history/view/:id (History Detail)
│       ├── /dashboard/history/traveler (Traveler History)
│       └── /dashboard/history/sender (Sender History)
│
├── Dispute Resolution
│   ├── /dashboard/disputes (Dispute List)
│   ├── /dashboard/disputes/new (Create New Dispute - 3 Steps)
│   └── /dashboard/disputes/:id (Dispute Details & Timeline)
│
└── Payment & Checkout
    └── /payment/checkout/:matchRequestId (Stripe Payment)
```

## Page Descriptions

### Core Navigation (Sidebar)

#### 1. Dashboard (`/dashboard`)
- **Purpose**: Main landing page with role-based metrics and quick actions
- **Features**: 
  - Dynamic stats based on user role (Traveler/Sender)
  - Quick Actions widget
  - Wallet Snapshot with toggle views
  - To-Do List
  - Trip Timeline
  - Recent Notifications

#### 2. Trips (`/dashboard/traveler/trips`)
- **Purpose**: Manage all traveler trips
- **Features**:
  - List/Grid view toggle
  - Search and filtering
  - Trip status tracking
  - Quick actions per trip
- **Sub-page**: Add Trip (`/dashboard/traveler/trips/addtrip`)
  - Multi-step form (6 steps)
  - Progress tracking
  - Validation
  - Pricing calculator
  - Consent checkboxes

#### 3. Parcel Requests (`/dashboard/parcel-requests`)
- **Purpose**: Browse available package delivery requests
- **Features**:
  - Filter by status, route, date
  - Sort options
  - Match suggestions
  - Request details preview
- **Sub-page**: Request Detail (`/dashboard/parcel-requests/:id`)
  - Full request information
  - Sender details
  - Accept/Decline actions

#### 4. My Parcels (`/dashboard/sender/parcels`)
- **Purpose**: Sender's view of their posted packages
- **Features**:
  - Status tracking
  - Traveler information
  - Edit/Cancel options
  - Payment status

#### 5. Matches (`/dashboard/matches`)
- **Purpose**: Manage confirmed delivery matches
- **Features**:
  - Role-based view (Traveler/Sender)
  - Status updates
  - Communication tools
  - Next action prompts

#### 6. Send Package (`/send-package`)
- **Purpose**: Multi-step form to post new package requests
- **Features**:
  - 6-step workflow
  - Real-time validation
  - Price estimation
  - Photo upload

#### 7. Tracking (`/dashboard/tracking`)
- **Purpose**: Real-time package tracking
- **Features**:
  - Timeline visualization
  - Status updates
  - Location tracking
  - Delivery confirmation

#### 8. Support (`/dashboard/support`)
- **Purpose**: Help center and customer support
- **Features**:
  - FAQ with search
  - Support ticket system
  - Category filtering
  - Contact form

### User Menu (Dropdown)

#### 9. Wallet (`/dashboard/wallet`)
- **Purpose**: Financial management hub
- **Features**:
  - Balance overview
  - Earnings summary
  - Withdrawal options
  - Escrow status
- **Sub-page**: Transactions (`/dashboard/wallet/transactions`)
  - Full transaction history
  - Advanced filtering
  - Export options

#### 10. Notifications (`/dashboard/notifications`)
- **Purpose**: Centralized notification center
- **Features**:
  - Type-based filtering
  - Read/Unread status
  - Priority indicators
  - Quick actions

#### 11. Profile (`/dashboard/profile`)
- **Purpose**: User profile and settings
- **Features**:
  - Personal information
  - KYC verification
  - Security settings
  - Privacy controls
  - Preferences

#### 12. Referrals (`/dashboard/referrals`)
- **Purpose**: Referral program management
- **Features**:
  - Referral code sharing
  - Earnings tracking
  - Performance metrics
  - Social sharing tools

#### 13. History (`/dashboard/history`)
- **Purpose**: Complete delivery history
- **Features**:
  - Role-based filtering
  - Advanced search
  - Date range selection
  - Export functionality
- **Sub-pages**:
  - History Detail (`/dashboard/history/view/:id`)
  - Traveler History (`/dashboard/history/traveler`)
  - Sender History (`/dashboard/history/sender`)

### Marketing & Public Pages

#### Homepage (`/`)
- **Purpose**: Conversion-optimized landing page
- **Recent Refactor (January 16, 2025)**:
  - Interactive Hero with intent capture (origin/destination fields)
  - Sender/Traveler role toggle
  - Trust badges highlighting escrow, KYC, tracking
  - Tabbed audience cards reducing scroll
  - Simplified 3-step visual process
  - Enhanced safety pillars with detailed cards
  - Auto-rotating testimonials with ratings
  - Business CTA band
  - Improved visual hierarchy

#### Safety (`/safety`)
- **Purpose**: Trust and safety information
- **Features**:
  - Escrow explanation
  - KYC verification details
  - Dispute resolution process
  - Photo documentation requirements
  - Prohibited items list

#### FAQ (`/faq`)
- **Purpose**: Comprehensive help resource
- **Features**:
  - 8 categorized sections
  - 50+ questions and answers
  - Search functionality
  - Direct links to support

### Marketplace

#### Browse Trips (`/marketplace/trips`)
- **Purpose**: Find available travelers
- **Features**:
  - Advanced filtering (location, dates, price, weight)
  - Date range picker
  - Verified traveler filter
  - Trip details modal
  - Match request system

### Dispute Resolution

#### Disputes (`/dashboard/disputes`)
- **Purpose**: Manage delivery disputes
- **Features**:
  - 8 status states
  - Timeline tracking
  - Evidence upload
  - 48-hour SLA
  - Resolution offers

### Payment Integration

#### Payment Checkout (`/payment/checkout/:matchRequestId`)
- **Purpose**: Secure payment processing
- **Features**:
  - Stripe integration ready
  - Escrow payment flow
  - 1-hour payment timeout
  - Secure card processing
  - Referral status
  - Bonus information

#### 13. History (`/dashboard/history`)
- **Purpose**: Complete delivery history
- **Features**:
  - Search and filters
  - Archive management
  - Export options
- **Sub-pages**:
  - Detail View (`/dashboard/history/view/:id`)
  - Traveler History (`/dashboard/history/traveler`)
  - Sender History (`/dashboard/history/sender`)

## Navigation Flow

### Primary User Flows

1. **Traveler Flow**:
   ```
   Dashboard → Trips → Add Trip → Parcel Requests → Accept Request → 
   Matches → Update Status → Tracking → Complete Delivery → 
   Wallet → Withdraw Earnings
   ```

2. **Sender Flow**:
   ```
   Dashboard → Send Package → My Parcels → View Matches → 
   Tracking → Confirm Delivery → History → Rate Experience
   ```

3. **Support Flow**:
   ```
   Any Page → Support → Search FAQ → Contact Support → 
   Submit Ticket → Track Resolution
   ```

## Responsive Behavior

- **Desktop**: Full sidebar navigation + header dropdown
- **Tablet**: Collapsible sidebar + header dropdown
- **Mobile**: Bottom navigation for core features + hamburger menu

## Access Control

- **Public Pages**: None (all require authentication)
- **Role-Based Access**:
  - Traveler-specific: Trips, Add Trip
  - Sender-specific: My Parcels
  - Universal: All other pages

## Future Enhancements (Planned)

- `/dashboard/analytics` - Advanced analytics dashboard
- `/dashboard/messages` - In-app messaging system
- `/dashboard/rewards` - Loyalty program
- `/public/how-it-works` - Public landing pages
- `/auth/*` - Authentication flows

---

*Last Updated: January 11, 2025*