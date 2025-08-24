import React from 'react'
import { Router, Route } from 'wouter'

// Marketing & Landing Pages
import HomePage from './marketing/HomePage'

// Main Dashboard Pages
import Dashboard from './pages/Dashboard'
import AddTrip from './pages/AddTrip'
import AddTripV2 from './pages/AddTripV2'
import SendPackage from './pages/SendPackage'
import SendPackageV2 from './pages/SendPackageV2'

// User Management Pages
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'

// Trip & Package Management
import MyTrips from './pages/MyTrips'
import TravelerTrips from './pages/TravelerTrips'
import MyParcels from './pages/MyParcels'
import SenderParcels from './pages/SenderParcels'
import BrowsePackages from './pages/BrowsePackages'

// Matching & Discovery
import Matches from './pages/Matches'
import MatchesDiscovery from './pages/MatchesDiscovery'
import MatchesHub from './pages/MatchesHub'
import DashboardMatches from './pages/DashboardMatches'
import MatchRequests from './pages/MatchRequests'
import MatchRequestDetail from './pages/MatchRequestDetail'
import ParcelRequests from './pages/ParcelRequests'
import ParcelRequestDetail from './pages/ParcelRequestDetail'

// Transactions & History
import History from './pages/History'
import HistoryDetail from './pages/HistoryDetail'
import HistorySender from './pages/HistorySender'
import HistoryTraveler from './pages/HistoryTraveler'

// Wallet & Payments
import Wallet from './pages/Wallet'
import WalletTransactions from './pages/WalletTransactions'
import WalletEscrow from './pages/WalletEscrow'
import WalletSender from './pages/WalletSender'
import WalletWithdrawals from './pages/WalletWithdrawals'
import WalletReferrals from './pages/WalletReferrals'
import PaymentCheckout from './pages/PaymentCheckout'
import Checkout from './pages/Checkout'

// Tracking & Delivery
import Tracking from './pages/Tracking'
import NewDelivery from './pages/NewDelivery'

// Disputes & Support
import DisputeList from './pages/DisputeList'
import DisputeDetail from './pages/DisputeDetail'
import DisputeNew from './pages/DisputeNew'
import Support from './pages/Support'

// Marketplace
import MarketplaceTripDetail from './pages/MarketplaceTripDetail'
import Trips from './pages/marketplace/Trips'

// Additional Features
import Referrals from './pages/Referrals'
import TestForms from './pages/TestForms'

// Authentication Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

// Landing V2 Pages
import HomePageNew from './pages/landing-v2/HomePageNew'
import LandingV2 from './pages/landing-v2/LandingV2'

// Marketing Pages  
import About from './marketing/pages/about'
import Blog from './marketing/pages/blog'
import Business from './marketing/pages/business'
import Careers from './marketing/pages/careers'
import Contact from './marketing/pages/contact'
import Cookies from './marketing/pages/cookies'
import FAQ from './marketing/pages/faq'
import HowItWorks from './marketing/pages/how-it-works'
import Press from './marketing/pages/press'
import Pricing from './marketing/pages/pricing'
import Privacy from './marketing/pages/privacy'
import Safety from './marketing/pages/safety'
import Terms from './marketing/pages/terms'
import MarketingIndex from './marketing/pages/index'

// 404 Page
import NotFound from './pages/not-found'

function App() {
  return (
    <Router>
      {/* Marketing & Landing Pages */}
      <Route path="/" component={HomePage} />
      <Route path="/landing" component={LandingV2} />
      <Route path="/home" component={HomePageNew} />
      
      {/* Main Dashboard */}
      <Route path="/dashboard" component={Dashboard} />
      
      {/* Trip Management */}
      <Route path="/add-trip" component={AddTrip} />
      <Route path="/dashboard/traveler/trips/addtrip" component={AddTripV2} />
      <Route path="/dashboard/traveler/trips" component={TravelerTrips} />
      <Route path="/dashboard/my-trips" component={MyTrips} />
      
      {/* Package Management */}
      <Route path="/send-package" component={SendPackage} />
      <Route path="/dashboard/sender/parcels" component={SenderParcels} />
      <Route path="/dashboard/my-parcels" component={MyParcels} />
      <Route path="/browse-packages" component={BrowsePackages} />
      
      {/* Matching System */}
      <Route path="/dashboard/matches" component={DashboardMatches} />
      <Route path="/matches" component={Matches} />
      <Route path="/matches/discovery" component={MatchesDiscovery} />
      <Route path="/dashboard/matches/discovery" component={MatchesDiscovery} />
      <Route path="/dashboard/matches/hub" component={MatchesHub} />
      <Route path="/dashboard/match-requests" component={MatchRequests} />
      <Route path="/match-requests" component={MatchRequests} />
      <Route path="/match-requests/:id" component={MatchRequestDetail} />
      <Route path="/parcel-requests" component={ParcelRequests} />
      <Route path="/parcel-request/:id" component={ParcelRequestDetail} />
      
      {/* History & Transactions */}
      <Route path="/dashboard/history" component={History} />
      <Route path="/dashboard/history/traveler" component={HistoryTraveler} />
      <Route path="/dashboard/history/sender" component={HistorySender} />
      <Route path="/dashboard/history/view/:id" component={HistoryDetail} />
      
      {/* Wallet & Payments */}
      <Route path="/dashboard/wallet" component={Wallet} />
      <Route path="/dashboard/wallet/transactions" component={WalletTransactions} />
      <Route path="/dashboard/wallet/escrow" component={WalletEscrow} />
      <Route path="/dashboard/wallet/sender" component={WalletSender} />
      <Route path="/dashboard/wallet/withdrawals" component={WalletWithdrawals} />
      <Route path="/dashboard/wallet/referrals" component={WalletReferrals} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/payment/checkout/:matchRequestId" component={PaymentCheckout} />
      
      {/* Tracking & Delivery */}
      <Route path="/dashboard/tracking" component={Tracking} />
      <Route path="/tracking" component={Tracking} />
      <Route path="/new-delivery" component={NewDelivery} />
      
      {/* Disputes & Support */}
      <Route path="/dashboard/disputes" component={DisputeList} />
      <Route path="/dashboard/disputes/new" component={DisputeNew} />
      <Route path="/dashboard/disputes/:id" component={DisputeDetail} />
      <Route path="/dashboard/support" component={Support} />
      
      {/* Profile & User Management */}
      <Route path="/dashboard/profile" component={Profile} />
      <Route path="/dashboard/notifications" component={Notifications} />
      <Route path="/dashboard/referrals" component={Referrals} />
      
      {/* Marketplace */}
      <Route path="/marketplace/trips" component={Trips} />
      <Route path="/marketplace/trips/:id" component={MarketplaceTripDetail} />
      
      {/* Authentication */}
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/register" component={RegisterPage} />
      <Route path="/auth/forgot-password" component={ForgotPasswordPage} />
      <Route path="/auth/reset-password" component={ResetPasswordPage} />
      
      {/* Marketing & Information Pages */}
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/safety" component={Safety} />
      <Route path="/business" component={Business} />
      <Route path="/about" component={About} />
      <Route path="/careers" component={Careers} />
      <Route path="/press" component={Press} />
      <Route path="/blog" component={Blog} />
      <Route path="/faq" component={FAQ} />
      <Route path="/contact" component={Contact} />
      
      {/* Legal Pages */}
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/cookies" component={Cookies} />
      
      {/* Development/Testing */}
      <Route path="/test-forms" component={TestForms} />
      
      {/* 404 fallback */}
      <Route component={NotFound} />
    </Router>
  )
}

export default App