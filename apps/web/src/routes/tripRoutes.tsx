import React, { lazy } from 'react';
import { Route } from 'wouter';

// Lazy load trip-related components for optimal code splitting
const AddTrip = lazy(() => import('../pages/AddTrip'));
const TravelerTrips = lazy(() => import('../pages/TravelerTrips'));
const MyTrips = lazy(() => import('../pages/MyTrips'));

/**
 * Trip management routes module
 * Contains all trip-related routes with lazy loading
 */
export function TripRoutes() {
  return (
    <>
      {/* Trip creation route - consolidated to single URL */}
      <Route path="/add-trip" component={AddTrip} />
      
      {/* Trip management routes */}
      <Route path="/my-trips" component={MyTrips} />
      <Route path="/dashboard/traveler/trips" component={TravelerTrips} />
    </>
  );
}