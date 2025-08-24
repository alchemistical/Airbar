# Airbar Application Sitemap

*Last Updated: August 24, 2025*

## Overview
This document provides a comprehensive sitemap of the Airbar crowdshipping platform, showing all available pages, their hierarchical structure, and navigation flow.

## Core Application Routes
- `/` - Homepage (Marketing homepage with hero, features, testimonials)
- `/landing` - Quick Start Landing Page (Dashboard links and feature cards)
- `/dashboard` - Main Dashboard
- `/add-trip` - Add Trip Form
- `/send-package` - Send Package Form

## Marketing & Information Pages
- `/how-it-works` - How It Works
- `/marketplace/trips` - Find Travelers
- `/browse-packages` - Browse Packages  
- `/pricing` - Pricing Information
- `/safety` - Safety Guidelines
- `/business` - Business Solutions
- `/about` - About Us
- `/careers` - Careers Page
- `/press` - Press & Media
- `/blog` - Blog
- `/faq` - Frequently Asked Questions
- `/contact` - Contact Us

## Authentication Routes
- `/auth/login` - Sign In Page
- `/auth/register` - Registration Page
- `/auth/forgot-password` - Forgot Password
- `/auth/reset-password` - Reset Password

## User Dashboard Pages
- `/dashboard/matches` - View Matches
- `/dashboard/matches/discovery` - Discover Matches
- `/dashboard/matches/hub` - Matches Hub
- `/dashboard/match-requests` - Match Requests
- `/dashboard/traveler/trips` - My Trips (Traveler)
- `/dashboard/traveler/trips/addtrip` - Add New Trip (6-step form)
- `/dashboard/sender/parcels` - My Parcels (Sender)
- `/dashboard/history` - Transaction History
- `/dashboard/history/traveler` - Traveler History
- `/dashboard/history/sender` - Sender History
- `/dashboard/history/view/:id` - Individual History Record
- `/dashboard/profile` - User Profile
- `/dashboard/wallet` - Wallet & Payments
- `/dashboard/wallet/transactions` - Transaction History
- `/dashboard/wallet/escrow` - Escrow Management
- `/dashboard/wallet/sender` - Sender Wallet View
- `/dashboard/wallet/withdrawals` - Withdrawal History
- `/dashboard/wallet/referrals` - Referral Earnings
- `/dashboard/notifications` - Notifications
- `/dashboard/support` - Support Center
- `/dashboard/tracking` - Package Tracking
- `/dashboard/disputes` - Dispute Management
- `/dashboard/disputes/new` - Create New Dispute
- `/dashboard/disputes/:id` - Dispute Details
- `/dashboard/referrals` - Referral Program

## Transaction & Delivery Pages
- `/checkout` - Payment Checkout
- `/payment/checkout/:matchRequestId` - Stripe Payment Page
- `/tracking` - Package Tracking
- `/match-requests` - Manage Match Requests
- `/match-requests/:id` - Match Request Details
- `/parcel-request/:id` - Individual Parcel Request Details
- `/parcel-requests` - View Parcel Requests
- `/new-delivery` - Create New Delivery

## Marketplace Pages
- `/marketplace/trips/:id` - Trip Detail Page
- `/matches/discovery` - Discover Matches
- `/matches/hub` - Matches Hub

## Legal & Policy Pages
- `/terms` - Terms of Service
- `/privacy` - Privacy Policy  
- `/cookies` - Cookie Policy
- `/safety#prohibited` - Prohibited Items

## Additional Features
- 404 Error Page (catch-all route)
- Language selector (English USD, Français EUR, Español EUR)
- Social media integration (Facebook, Twitter, Instagram)

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