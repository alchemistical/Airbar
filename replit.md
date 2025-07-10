# replit.md

## Overview

This is a full-stack web application for a package delivery marketplace called "Airbar". The application allows users to post trips and offer to carry packages for others, creating a peer-to-peer delivery network. It's built with a modern tech stack featuring React, Express, and PostgreSQL.

**Current Status (January 10, 2025):**
- ✅ Main Dashboard completed with full UI/UX implementation
- ✅ Working backend with sample data
- ✅ Responsive design following Airbar style guide
- ✅ All dashboard components functional (metrics, trips, earnings, requests, notifications)
- ✅ Enhanced Trip Management Section with search and filtering
- ✅ Multi-step Trip Creation Form (5 comprehensive steps)
- ✅ Advanced form validation and progress tracking
- ✅ Professional UI/UX following detailed Airbar specifications

## User Preferences

Preferred communication style: Simple, everyday language.

## Roadmap & Next Features

Based on user requirements, the following pages and features are planned:

### Dashboard Extensions
- `/dashboard/traveler/trips` - Trip management with table/list view
- `/dashboard/traveler/trips/addtrip` - Multi-step trip creation form
- `/dashboard/traveler/parcel-requests` - Incoming delivery requests
- `/dashboard/traveler/earnings` - Earnings dashboard and payouts
- `/dashboard/traveler/history` - Past trips & deliveries
- `/dashboard/traveler/reviews` - Ratings and feedback
- `/dashboard/sender/*` - Sender-specific dashboard pages
- `/dashboard/referrals` - Referral system
- `/dashboard/settings/notifications` - Notification preferences
- `/dashboard/profile` - KYC verification and profile management

### Core Features
- `/find-travelers` - Search trips by destination and date
- `/browse-parcels` - Browse delivery requests
- `/send-package` - Multi-step parcel submission form
- `/add-trip` - Trip creation form
- `/matches` - Match suggestions between parcels and trips
- `/tracking` - Real-time parcel tracking

### Design Principles Applied
- 12-column grid system (1140px max width)
- Left navigation always visible on desktop
- Card-based modular components
- Trust signals (KYC badges, ratings)
- Step-by-step flows for complex forms
- Responsive design patterns

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with organized route handlers
- **Development**: Hot reload with Vite integration in development mode

### Database Layer
- **Database**: PostgreSQL (configured for use with Neon Database)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Schema**: Centralized schema definitions in shared directory
- **Validation**: Zod for runtime type validation

## Key Components

### Database Schema
The application has five main entities:
- **Users**: Authentication and profile information with KYC verification
- **Trips**: Travel plans posted by users willing to carry packages
- **Parcel Requests**: Package delivery requests from senders
- **Earnings**: Financial tracking for completed deliveries
- **Notifications**: User communication system

### API Endpoints
Dashboard-focused API with endpoints for:
- `/api/dashboard/metrics/:userId` - User dashboard statistics
- `/api/dashboard/trips/:userId` - Upcoming trips for a user
- `/api/dashboard/parcel-requests/:userId` - Package requests
- `/api/dashboard/earnings/:userId` - Financial data
- `/api/dashboard/notifications/:userId` - User notifications

### UI Components
- **Dashboard Layout**: Sidebar navigation with responsive design
- **Metric Cards**: Statistical overview widgets
- **Data Tables**: Trip and parcel request listings
- **Charts**: Earnings visualization using Recharts
- **shadcn/ui**: Complete component library for consistent UI

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack Query
2. **Server Processing**: Express routes handle requests and interact with storage layer
3. **Data Storage**: Currently uses in-memory storage (MemStorage class) as a placeholder
4. **Response**: JSON data returned to client and cached by React Query
5. **UI Updates**: Components automatically re-render when data changes

## External Dependencies

### Key Libraries
- **@neondatabase/serverless**: PostgreSQL connection for production
- **@radix-ui/***: Headless UI components for accessibility
- **drizzle-orm**: Type-safe database interactions
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **recharts**: Data visualization
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle Kit handles schema migrations

### Environment Setup
- Development uses `tsx` for TypeScript execution
- Production serves built files from Express
- Database URL required via `DATABASE_URL` environment variable
- Configured for Replit deployment with cartographer integration

### File Structure
```
├── client/          # React frontend
├── server/          # Express backend  
├── shared/          # Shared types and schemas
├── migrations/      # Database migrations
└── dist/           # Production build output
```

The application follows a monorepo structure with clear separation between client, server, and shared code, making it easy to develop and deploy as a cohesive unit.