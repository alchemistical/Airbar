# Route Map Analysis

## Current State (Simple Status Page)
**File**: `apps/web/src/App.tsx` (current)
- **Structure**: Single static page
- **Content**: "Monorepo migration successful!" status message
- **Routing**: None

## Last Known Good (LKG) - Working Router Structure
**File**: `apps/web/src/App.tsx` (commit 6eed84b)
**Date**: 2025-08-24  
**Library**: Wouter (`Router`, `Route`, `Link`)

### Core Routes (LKG)
```
/ → HomePage (marketing/HomePage.tsx)
/landing → LandingPage (inline component)
/dashboard → Dashboard (pages/Dashboard.tsx) 
/add-trip → AddTrip (pages/AddTrip.tsx)
/send-package → SendPackage (pages/SendPackage.tsx)
404 → Inline 404 component
```

### Navigation Structure (LKG)
- **Header Nav**: Home | Dashboard | Add Trip | Send Package | Quick Start
- **Landing Page Cards**: 
  - Dashboard → `/dashboard`
  - Add Trip → `/add-trip` 
  - Send Package → `/send-package`

## Available Page Components (50 total)
### Core Dashboard Pages
- `Dashboard.tsx` - Main dashboard with DashboardLayout
- `AddTrip.tsx`, `AddTripV2.tsx` - Trip creation
- `SendPackage.tsx`, `SendPackageV2.tsx` - Package sending

### User Management  
- `Profile.tsx`, `Notifications.tsx`
- `auth/LoginPage.tsx`, `RegisterPage.tsx`, `ForgotPasswordPage.tsx`

### Package & Trip Management
- `MyTrips.tsx`, `TravelerTrips.tsx`
- `MyParcels.tsx`, `SenderParcels.tsx`, `BrowsePackages.tsx`
- `Tracking.tsx`, `NewDelivery.tsx`

### Matching System
- `Matches.tsx`, `DashboardMatches.tsx`, `MatchesHub.tsx`
- `MatchRequests.tsx`, `MatchRequestDetail.tsx`
- `ParcelRequests.tsx`, `ParcelRequestDetail.tsx`

### Financial
- `Wallet.tsx`, `WalletTransactions.tsx`, `WalletEscrow.tsx`
- `Checkout.tsx`, `PaymentCheckout.tsx`
- `Referrals.tsx`, `WalletReferrals.tsx`

### Support & Disputes
- `Support.tsx`, `DisputeList.tsx`, `DisputeDetail.tsx`, `DisputeNew.tsx`
- `History.tsx`, `HistoryDetail.tsx`, `HistorySender.tsx`, `HistoryTraveler.tsx`

### Marketing & Landing
- `marketing/HomePage.tsx` - Full marketing homepage
- `landing-v2/HomePageNew.tsx`, `landing-v2/LandingV2.tsx` - Alternative landing pages
- `marketplace/Trips.tsx`, `MarketplaceTripDetail.tsx`

### Utility
- `not-found.tsx`, `TestForms.tsx`

## Key Dependencies
- **Router**: Wouter (`wouter` package)
- **UI Framework**: Custom UI components (`@/components/ui/*`)
- **Layout**: `DashboardLayout` for dashboard pages
- **State**: React Query (`@tanstack/react-query`)
- **Icons**: Lucide React (`lucide-react`)