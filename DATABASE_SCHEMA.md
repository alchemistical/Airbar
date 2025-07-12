# Airbar Database Schema Documentation

## Overview
This document provides a comprehensive overview of the database schema for the Airbar crowdshipping platform. The database uses PostgreSQL with Drizzle ORM for type-safe database interactions.

## Database Tables

### 1. Users Table (`users`)
Stores user account information and profile data.

```sql
users (
  id: serial PRIMARY KEY,
  username: varchar(255) UNIQUE NOT NULL,
  password: varchar(255) NOT NULL,
  email: varchar(255),
  phone: varchar(20),
  firstName: varchar(255),
  lastName: varchar(255),
  avatar: text,
  rating: decimal(3,2) DEFAULT 0.00,
  isKYCVerified: boolean DEFAULT false,
  kycVerifiedAt: timestamp,
  role: varchar(20) DEFAULT 'both', -- 'traveler', 'sender', 'both'
  createdAt: timestamp DEFAULT CURRENT_TIMESTAMP,
  updatedAt: timestamp DEFAULT CURRENT_TIMESTAMP
)
```

### 2. Trips Table (`trips`)
Stores traveler trip information for package carrying opportunities.

```sql
trips (
  id: serial PRIMARY KEY,
  userId: integer REFERENCES users(id) NOT NULL,
  fromCity: varchar(255) NOT NULL,
  toCity: varchar(255) NOT NULL,
  fromAddress: text,
  toAddress: text,
  departureDate: date NOT NULL,
  arrivalDate: date NOT NULL,
  transportMode: varchar(50) NOT NULL, -- 'flight', 'car', 'train', 'bus'
  maxWeight: decimal(10,2) NOT NULL,
  availableSpace: varchar(50) NOT NULL, -- 'small', 'medium', 'large'
  pricePerKg: decimal(10,2) NOT NULL,
  currency: varchar(3) DEFAULT 'USD',
  additionalNotes: text,
  status: varchar(50) DEFAULT 'active', -- 'active', 'completed', 'cancelled'
  isVerified: boolean DEFAULT false,
  flightNumber: varchar(50),
  trainNumber: varchar(50),
  carDetails: text,
  createdAt: timestamp DEFAULT CURRENT_TIMESTAMP,
  updatedAt: timestamp DEFAULT CURRENT_TIMESTAMP
)
```

### 3. Parcel Requests Table (`parcel_requests`)
Stores package delivery requests from senders.

```sql
parcel_requests (
  id: serial PRIMARY KEY,
  senderId: integer REFERENCES users(id) NOT NULL,
  tripId: integer REFERENCES trips(id),
  title: varchar(255) NOT NULL,
  description: text NOT NULL,
  fromCity: varchar(255) NOT NULL,
  toCity: varchar(255) NOT NULL,
  weight: decimal(10,2) NOT NULL,
  dimensions: varchar(100),
  category: varchar(50) NOT NULL, -- 'electronics', 'documents', 'clothing', 'food', 'other'
  value: decimal(10,2),
  reward: decimal(10,2) NOT NULL,
  currency: varchar(3) DEFAULT 'USD',
  urgency: varchar(20) DEFAULT 'normal', -- 'urgent', 'normal', 'flexible'
  status: varchar(50) DEFAULT 'pending', -- 'pending', 'matched', 'in_transit', 'delivered', 'cancelled'
  specialInstructions: text,
  pickupFlexibility: varchar(50), -- 'very_flexible', 'somewhat_flexible', 'not_flexible'
  deliveryDeadline: date,
  isFragile: boolean DEFAULT false,
  requiresSignature: boolean DEFAULT false,
  requiresInsurance: boolean DEFAULT false,
  photoUrls: text[], -- Array of photo URLs
  createdAt: timestamp DEFAULT CURRENT_TIMESTAMP,
  updatedAt: timestamp DEFAULT CURRENT_TIMESTAMP
)
```

### 4. Match Requests Table (`match_requests`)
Stores match requests between travelers and senders.

```sql
match_requests (
  id: serial PRIMARY KEY,
  tripId: integer REFERENCES trips(id) NOT NULL,
  senderId: integer REFERENCES users(id) NOT NULL,
  travelerId: integer REFERENCES users(id) NOT NULL,
  parcelRequestId: integer REFERENCES parcel_requests(id),
  status: varchar(50) DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'confirmed', 'cancelled'
  message: text,
  proposedReward: decimal(10,2),
  acceptedAt: timestamp,
  declinedAt: timestamp,
  confirmedAt: timestamp,
  cancelledAt: timestamp,
  cancellationReason: text,
  paymentStatus: varchar(50) DEFAULT 'pending', -- 'pending', 'processing', 'succeeded', 'failed', 'refunded'
  escrowStatus: varchar(50) DEFAULT 'none', -- 'none', 'held', 'released', 'disputed'
  stripePaymentIntentId: varchar(255),
  paidAt: timestamp,
  escrowReleasedAt: timestamp,
  createdAt: timestamp DEFAULT CURRENT_TIMESTAMP,
  updatedAt: timestamp DEFAULT CURRENT_TIMESTAMP
)
```

### 5. Earnings Table (`earnings`)
Tracks financial transactions and earnings for travelers.

```sql
earnings (
  id: serial PRIMARY KEY,
  userId: integer REFERENCES users(id) NOT NULL,
  matchRequestId: integer REFERENCES match_requests(id),
  type: varchar(50) NOT NULL, -- 'delivery', 'bonus', 'referral', 'adjustment'
  amount: decimal(10,2) NOT NULL,
  currency: varchar(3) DEFAULT 'USD',
  status: varchar(50) DEFAULT 'pending', -- 'pending', 'available', 'withdrawn', 'cancelled'
  description: text,
  withdrawalMethod: varchar(50), -- 'bank_transfer', 'paypal', 'stripe'
  withdrawalDetails: jsonb,
  withdrawnAt: timestamp,
  availableAt: timestamp,
  createdAt: timestamp DEFAULT CURRENT_TIMESTAMP
)
```

### 6. Notifications Table (`notifications`)
Stores user notifications and alerts.

```sql
notifications (
  id: serial PRIMARY KEY,
  userId: integer REFERENCES users(id) NOT NULL,
  type: varchar(50) NOT NULL, -- 'match_request', 'payment', 'delivery', 'message', 'system'
  title: varchar(255) NOT NULL,
  message: text NOT NULL,
  isRead: boolean DEFAULT false,
  readAt: timestamp,
  actionUrl: varchar(255),
  metadata: jsonb, -- Additional data specific to notification type
  priority: varchar(20) DEFAULT 'normal', -- 'high', 'normal', 'low'
  expiresAt: timestamp,
  createdAt: timestamp DEFAULT CURRENT_TIMESTAMP
)
```

### 7. Disputes Table (`disputes`)
Handles dispute resolution between users.

```sql
disputes (
  id: serial PRIMARY KEY,
  matchRequestId: integer REFERENCES match_requests(id) NOT NULL,
  reporterId: integer REFERENCES users(id) NOT NULL,
  respondentId: integer REFERENCES users(id) NOT NULL,
  status: varchar(50) DEFAULT 'open', -- 'open', 'waiting', 'review', 'offer', 'resolved', 'escalated', 'closed'
  reason: varchar(100) NOT NULL, -- 'non_delivery', 'damaged_item', 'wrong_item', 'late_delivery', 'payment_issue', 'other'
  description: text NOT NULL,
  preferredOutcome: text,
  evidence: jsonb[], -- Array of evidence objects with URLs and metadata
  timeline: jsonb[], -- Array of timeline entries
  resolution: text,
  resolutionOfferedAt: timestamp,
  resolutionAcceptedAt: timestamp,
  escalatedAt: timestamp,
  closedAt: timestamp,
  firstReplyDue: timestamp,
  resolutionDue: timestamp,
  adminNotes: text,
  createdAt: timestamp DEFAULT CURRENT_TIMESTAMP,
  updatedAt: timestamp DEFAULT CURRENT_TIMESTAMP
)
```

## Indexes

### Performance Indexes
```sql
-- User lookups
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Trip searches
CREATE INDEX idx_trips_user_id ON trips(userId);
CREATE INDEX idx_trips_cities ON trips(fromCity, toCity);
CREATE INDEX idx_trips_departure ON trips(departureDate);
CREATE INDEX idx_trips_status ON trips(status);

-- Parcel request searches
CREATE INDEX idx_parcel_requests_sender ON parcel_requests(senderId);
CREATE INDEX idx_parcel_requests_trip ON parcel_requests(tripId);
CREATE INDEX idx_parcel_requests_cities ON parcel_requests(fromCity, toCity);
CREATE INDEX idx_parcel_requests_status ON parcel_requests(status);

-- Match request lookups
CREATE INDEX idx_match_requests_trip ON match_requests(tripId);
CREATE INDEX idx_match_requests_sender ON match_requests(senderId);
CREATE INDEX idx_match_requests_traveler ON match_requests(travelerId);
CREATE INDEX idx_match_requests_status ON match_requests(status);
CREATE INDEX idx_match_requests_payment ON match_requests(paymentStatus);

-- Earnings queries
CREATE INDEX idx_earnings_user ON earnings(userId);
CREATE INDEX idx_earnings_status ON earnings(status);
CREATE INDEX idx_earnings_created ON earnings(createdAt);

-- Notification queries
CREATE INDEX idx_notifications_user ON notifications(userId);
CREATE INDEX idx_notifications_read ON notifications(userId, isRead);
CREATE INDEX idx_notifications_created ON notifications(createdAt);

-- Dispute lookups
CREATE INDEX idx_disputes_match ON disputes(matchRequestId);
CREATE INDEX idx_disputes_reporter ON disputes(reporterId);
CREATE INDEX idx_disputes_respondent ON disputes(respondentId);
CREATE INDEX idx_disputes_status ON disputes(status);
```

## Relationships

### User Relationships
- **Users → Trips**: One-to-Many (A user can create multiple trips)
- **Users → Parcel Requests**: One-to-Many (A user can create multiple parcel requests)
- **Users → Match Requests**: One-to-Many (as both sender and traveler)
- **Users → Earnings**: One-to-Many (A user can have multiple earnings)
- **Users → Notifications**: One-to-Many (A user can receive multiple notifications)
- **Users → Disputes**: One-to-Many (as both reporter and respondent)

### Trip Relationships
- **Trips → User**: Many-to-One (Each trip belongs to one traveler)
- **Trips → Parcel Requests**: One-to-Many (A trip can have multiple parcel requests)
- **Trips → Match Requests**: One-to-Many (A trip can have multiple match requests)

### Match Request Relationships
- **Match Requests → Trip**: Many-to-One
- **Match Requests → Sender User**: Many-to-One
- **Match Requests → Traveler User**: Many-to-One
- **Match Requests → Parcel Request**: Many-to-One (optional)
- **Match Requests → Earnings**: One-to-Many
- **Match Requests → Disputes**: One-to-One

## Enums and Constants

### User Roles
- `traveler`: User only carries packages
- `sender`: User only sends packages
- `both`: User can both send and carry packages (default)

### Trip Status
- `active`: Trip is available for matching
- `completed`: Trip has been completed
- `cancelled`: Trip has been cancelled

### Parcel Request Status
- `pending`: Awaiting match with traveler
- `matched`: Matched with a traveler
- `in_transit`: Package is being transported
- `delivered`: Package has been delivered
- `cancelled`: Request has been cancelled

### Match Request Status
- `pending`: Awaiting traveler response
- `accepted`: Traveler accepted the request
- `declined`: Traveler declined the request
- `confirmed`: Payment confirmed, match is active
- `cancelled`: Match has been cancelled

### Payment Status
- `pending`: Payment not initiated
- `processing`: Payment is being processed
- `succeeded`: Payment successful
- `failed`: Payment failed
- `refunded`: Payment has been refunded

### Escrow Status
- `none`: No escrow involved
- `held`: Funds held in escrow
- `released`: Funds released from escrow
- `disputed`: Escrow is under dispute

### Dispute Status
- `open`: Dispute newly created
- `waiting`: Waiting for response
- `review`: Under review
- `offer`: Resolution offered
- `resolved`: Dispute resolved
- `escalated`: Escalated to admin
- `closed`: Dispute closed

## Data Types

### JSON/JSONB Fields

#### Notification Metadata
```json
{
  "relatedId": "123",
  "relatedType": "match_request",
  "additionalInfo": {}
}
```

#### Dispute Evidence
```json
{
  "url": "https://storage.example.com/evidence.jpg",
  "type": "photo",
  "uploadedAt": "2025-01-12T10:00:00Z",
  "description": "Package condition photo"
}
```

#### Dispute Timeline Entry
```json
{
  "timestamp": "2025-01-12T10:00:00Z",
  "actor": "John Doe",
  "actorRole": "sender",
  "type": "dispute_created",
  "message": "Dispute opened",
  "payload": {}
}
```

## Security Considerations

1. **Password Storage**: Passwords are hashed using bcrypt before storage
2. **Sensitive Data**: Payment details are stored with Stripe, only references are kept
3. **PII Protection**: Personal information is encrypted at rest
4. **Access Control**: Row-level security policies should be implemented
5. **Audit Trail**: All financial transactions maintain complete audit trails

## Migration Strategy

1. Use Drizzle Kit for schema migrations: `npm run db:push`
2. Never manually write SQL migrations
3. Test migrations in staging before production
4. Maintain backward compatibility during deployments
5. Use transaction blocks for complex migrations

## Performance Considerations

1. **Pagination**: Implement cursor-based pagination for large datasets
2. **Caching**: Cache frequently accessed data (user profiles, ratings)
3. **Query Optimization**: Use appropriate indexes and avoid N+1 queries
4. **Archival**: Move old completed records to archive tables
5. **Monitoring**: Track slow queries and optimize as needed