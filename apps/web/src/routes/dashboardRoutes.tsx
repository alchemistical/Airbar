import React, { lazy } from 'react';
import { Route } from 'wouter';

// Lazy load dashboard components
const Dashboard = lazy(() => import('../pages/Dashboard'));
const DashboardMatches = lazy(() => import('../pages/DashboardMatches'));
const Profile = lazy(() => import('../pages/Profile'));
const Wallet = lazy(() => import('../pages/Wallet'));
const WalletTransactions = lazy(() => import('../pages/WalletTransactions'));
const WalletEscrow = lazy(() => import('../pages/WalletEscrow'));
const History = lazy(() => import('../pages/History'));
const Notifications = lazy(() => import('../pages/Notifications'));
const Support = lazy(() => import('../pages/Support'));
const Referrals = lazy(() => import('../pages/Referrals'));

// Traveler and Sender specific components
const TravelerTrips = lazy(() => import('../pages/TravelerTrips'));
const SenderParcels = lazy(() => import('../pages/SenderParcels'));

/**
 * Dashboard routes module
 * Contains all dashboard and user management routes with lazy loading
 */
export function DashboardRoutes() {
  return (
    <>
      {/* Main dashboard */}
      <Route path="/dashboard" component={Dashboard} />
      
      {/* Dashboard matches */}
      <Route path="/dashboard/matches" component={DashboardMatches} />
      
      {/* Traveler and Sender dashboards */}
      <Route path="/dashboard/traveler" component={TravelerTrips} />
      <Route path="/dashboard/sender" component={SenderParcels} />
      
      {/* User profile and settings */}
      <Route path="/profile" component={Profile} />
      <Route path="/dashboard/profile" component={Profile} />
      
      {/* Wallet and transactions */}
      <Route path="/wallet" component={Wallet} />
      <Route path="/dashboard/wallet" component={Wallet} />
      <Route path="/dashboard/wallet/transactions" component={WalletTransactions} />
      <Route path="/dashboard/wallet/escrow" component={WalletEscrow} />
      
      {/* History */}
      <Route path="/history" component={History} />
      <Route path="/dashboard/history" component={History} />
      
      {/* Notifications */}
      <Route path="/notifications" component={Notifications} />
      <Route path="/dashboard/notifications" component={Notifications} />
      
      {/* Support */}
      <Route path="/support" component={Support} />
      <Route path="/dashboard/support" component={Support} />
      
      {/* Referrals */}
      <Route path="/referrals" component={Referrals} />
      <Route path="/dashboard/referrals" component={Referrals} />
    </>
  );
}