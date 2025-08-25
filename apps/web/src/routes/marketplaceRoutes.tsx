import React, { lazy } from 'react';
import { Route } from 'wouter';

// Lazy load marketplace components
const MarketplaceTrips = lazy(() => import('../pages/marketplace/Trips'));
const MarketplaceTripDetail = lazy(() => import('../pages/MarketplaceTripDetail'));
const BrowsePackages = lazy(() => import('../pages/BrowsePackages'));

/**
 * Marketplace routes module
 * Contains all marketplace and browsing routes with lazy loading
 */
export function MarketplaceRoutes() {
  return (
    <>
      {/* Marketplace trip browsing */}
      <Route path="/marketplace/trips" component={MarketplaceTrips} />
      <Route path="/browse-trips" component={MarketplaceTrips} />
      <Route path="/marketplace/trips/:id" component={MarketplaceTripDetail} />
      
      {/* Package browsing */}
      <Route path="/browse-packages" component={BrowsePackages} />
    </>
  );
}