import React, { lazy } from 'react';
import { Route } from 'wouter';

// Lazy load trip-related components for optimal code splitting
const AddTripV2 = lazy(() => import('../pages/AddTripV2'));
const TravelerTrips = lazy(() => import('../pages/TravelerTrips'));
const MyTrips = lazy(() => import('../pages/MyTrips'));

/**
 * Trip management routes module
 * Contains all trip-related routes with lazy loading
 */
export function TripRoutes() {
  return (
    <>
      {/* Trip creation routes */}
      <Route path="/add-trip" component={AddTripV2} />
      <Route path="/dashboard/add-trip" component={AddTripV2} />
      <Route path="/dashboard/traveler/trips/addtrip" component={AddTripV2} />
      
      {/* Trip management routes */}
      <Route path="/my-trips" component={MyTrips} />
      <Route path="/dashboard/traveler/trips" component={TravelerTrips} />
    </>
  );
}