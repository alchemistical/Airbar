# Airbar Application Sitemap

*Last Updated: January 24, 2025*

## Overview
This document provides a comprehensive sitemap of the Airbar crowdshipping platform, showing all available pages, their hierarchical structure, and navigation flow.

## Public Pages

### Landing & Authentication
- `/` - Landing page (redirects to dashboard if authenticated)
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password recovery
- `/reset-password/:token` - Password reset with token

### Marketing Pages
- `/about` - About Us
- `/how-it-works` - How It Works
- `/pricing` - Pricing Calculator
- `/safety` - Safety & Trust
- `/faq` - Frequently Asked Questions
- `/contact` - Contact Us
- `/terms` - Terms of Service
- `/privacy` - Privacy Policy
- `/business` - Business Solutions
- `/careers` - Career Opportunities

## Authenticated Pages

### Main Dashboard
- `/dashboard` - Main dashboard with metrics, activity feed, and quick actions
  - Active trips counter
  - Parcel requests counter
  - In-escrow amount
  - Average rating
  - Available balance
  - Pending earnings
  - Total earned
  - Recent activity feed

### Trips Management
- `/dashboard/traveler/trips` - List all trips
  - Active trips
  - Completed trips
  - Search and filter functionality
- `/dashboard/traveler/trips/addtrip` - Add new trip (6-step form)
  - Step 1: Route Details
  - Step 2: Travel Information
  - Step 3: Package Preferences
  - Step 4: Terms & Conditions
  - Step 5: Pricing Calculator
  - Step 6: Review & Submit

### Marketplace
- `/marketplace/trips` - Browse available trips
  - Advanced filters (city, date, price, weight)
  - Verified traveler filter
  - Sort options
  - Grid/list view toggle
- `/marketplace/trips/:id` - Trip details page
  - Traveler profile
  - Trip specifications
  - Match request modal
  - Similar trips
- `/browse-packages` - Browse Package Requests

### Parcel Management
- `/dashboard/parcel-requests` - View incoming parcel requests
  - Pending requests
  - Accepted requests
  - Filter by status
- `/parcel-request/:id` - Individual parcel request details
  - Package information
  - Sender details
  - Accept/decline actions
- `/dashboard/sender/parcels` - My Parcels (Sender View)
- `/send-package` - Send new package (multi-step form)
  - Package details
  - Route selection
  - Delivery preferences
  - Review & submit

### Matches & Connections
- `/dashboard/matches` - Active Matches & Requests
- `/match-requests` - Manage match requests
  - Sender view (sent requests)
  - Traveler view (received requests)
  - Status filters
  - Quick actions
- `/match-requests/:id` - Match request details
  - Timeline view
  - Escrow status
  - Payment information
  - Contact options

### Payment & Checkout
- `/payment/checkout/:matchRequestId` - Stripe payment page
- `/checkout/:matchId` - Alternative Stripe payment page
  - Payment form
  - Order summary
  - Escrow information

### Tracking
- `/dashboard/tracking` - Real-time package tracking
  - Active deliveries
  - Timeline visualization
  - Status updates
  - Role-based views (sender/traveler)

### Financial Management
- `/dashboard/wallet` - Wallet overview
  - Available balance
  - Pending earnings
  - In-escrow funds
  - Quick actions (withdraw, view history)
- `/dashboard/wallet/transactions` - Transaction history
  - Comprehensive filters
  - Date range selection
  - Export functionality
  - Transaction details

### User Profile & Settings
- `/dashboard/profile` - User profile management
  - Personal information
  - KYC verification
  - Security settings
  - Privacy preferences
  - Payment methods
- `/dashboard/notifications` - Notification center
  - All notifications
  - Filter by type
  - Mark as read
  - Notification preferences

### History & Records
- `/dashboard/history` - Complete delivery history
  - All deliveries
  - Role filter (sender/traveler)
  - Status filter
  - Search functionality
- `/dashboard/history/view/:id` - Individual history record
  - Complete timeline
  - Transaction details
  - Dispute history
  - Export/print options
- `/dashboard/history/traveler` - Traveler-specific history
- `/dashboard/history/sender` - Sender-specific history

### Referrals
- `/dashboard/referrals` - Referral program
  - Referral code
  - Earnings from referrals
  - Invited users list
  - Share options

### Support & Help
- `/dashboard/support` - Help center
  - FAQ section
  - Knowledge base
  - Contact support
  - Submit ticket

### Dispute Resolution
- `/dashboard/disputes` - Dispute List
- `/support/disputes` - Alternative dispute management
- `/support/disputes/new` - Create new dispute (3-step form)
  - Step 1: Issue details
  - Step 2: Evidence upload
  - Step 3: Resolution preference
- `/dashboard/disputes/new` - Alternative create dispute
- `/support/disputes/:id` - Dispute details
- `/dashboard/disputes/:id` - Alternative dispute details
  - Timeline tracking
  - Evidence gallery
  - Resolution offers
  - Communication thread

## API Endpoints

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/session`

### User Management
- `GET /api/user/:id`
- `PUT /api/user/:id`
- `POST /api/user/kyc`
- `POST /api/user/avatar`

### Dashboard
- `GET /api/dashboard/metrics/:userId`
- `GET /api/dashboard/trips/:userId`
- `GET /api/dashboard/parcel-requests/:userId`
- `GET /api/dashboard/earnings/:userId`
- `GET /api/dashboard/notifications/:userId`

### Trips
- `GET /api/trips`
- `GET /api/trips/:id`
- `POST /api/trips`
- `PUT /api/trips/:id`
- `DELETE /api/trips/:id`

### Parcel Requests
- `GET /api/parcel-requests`
- `GET /api/parcel-requests/:id`
- `POST /api/parcel-requests`
- `PUT /api/parcel-requests/:id`
- `DELETE /api/parcel-requests/:id`

### Match Requests
- `GET /api/match-requests`
- `GET /api/match-requests/:id`
- `POST /api/match-requests`
- `PATCH /api/match-requests/:id`

### Payments
- `POST /api/payments/checkout-session`
- `POST /api/payments/confirm`
- `GET /api/payments/status/:id`
- `POST /api/webhooks/stripe`

### Notifications
- `GET /api/notifications`
- `GET /api/notifications/unread-count`
- `PUT /api/notifications/:id/read`
- `PUT /api/notifications/read-all`

### Disputes
- `GET /api/disputes`
- `GET /api/disputes/:id`
- `POST /api/disputes`
- `PUT /api/disputes/:id`
- `POST /api/disputes/:id/timeline`
- `POST /api/disputes/:id/offer`

### Support
- `POST /api/support/tickets`
- `GET /api/support/tickets/:userId`
- `GET /api/support/faq`

## Navigation Structure

### Primary Navigation (Sidebar)
1. Dashboard
2. Browse Trips (Marketplace)
3. Parcel Requests
4. Send Package
5. Matches
6. Tracking
7. Support

### User Dropdown Menu
1. Profile
2. Wallet
3. History
4. Referrals
5. Logout

### Header Elements
- Logo (links to dashboard)
- Page title
- Notification bell (with unread count)
- User avatar dropdown

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

## Page States

### Loading States
- Skeleton loaders for data
- Spinner for actions
- Progress bars for multi-step forms

### Empty States
- No trips available
- No parcel requests
- No matches
- No notifications
- No transaction history

### Error States
- 404 Not Found
- 500 Server Error
- Network error
- Payment failed
- Form validation errors

## Responsive Behavior
- **Desktop**: Full sidebar navigation + header dropdown
- **Tablet**: Collapsible sidebar + header dropdown
- **Mobile**: Bottom navigation for core features + hamburger menu
- Mobile-specific layouts
- Touch-optimized forms
- Swipe gestures for navigation

## Access Control
- **Public Pages**: Marketing pages, authentication flows
- **Role-Based Access**:
  - Traveler-specific: Trips, Add Trip
  - Sender-specific: My Parcels
  - Universal: All other dashboard pages

## Accessibility Features
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators
- ARIA labels

## Feature Flags
- Live chat (coming soon)
- Video verification (planned)
- Express delivery (planned)
- Insurance options (planned)
- Multi-currency support (planned)

## Future Enhancements (Planned)
- `/dashboard/analytics` - Advanced analytics dashboard
- `/dashboard/messages` - In-app messaging system
- `/dashboard/rewards` - Loyalty program
- `/public/how-it-works` - Public landing pages
- `/auth/*` - Authentication flows

---

*Consolidated from FULL_SITEMAP.md and SITEMAP.md - January 24, 2025*