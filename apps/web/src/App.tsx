import React from 'react'
import { Router, Route, useLocation, Link } from 'wouter'

// Import your existing pages
import Dashboard from './pages/Dashboard'
import AddTrip from './pages/AddTrip'
import AddTripV2 from './pages/AddTripV2'
import SendPackage from './pages/SendPackage'
import HomePage from './marketing/HomePage'

// Main user journeys
import Matches from './pages/Matches'
import DashboardMatches from './pages/DashboardMatches'
import MatchesDiscovery from './pages/MatchesDiscovery'
import MatchRequests from './pages/MatchRequests'
import ParcelRequests from './pages/ParcelRequests'
import ParcelRequestDetail from './pages/ParcelRequestDetail'
import Tracking from './pages/Tracking'
import BrowsePackages from './pages/BrowsePackages'
import MyTrips from './pages/MyTrips'
import MyParcels from './pages/MyParcels'
import SenderParcels from './pages/SenderParcels'
import TravelerTrips from './pages/TravelerTrips'
import Support from './pages/Support'

// Additional key pages
import Referrals from './pages/Referrals'
import Checkout from './pages/Checkout'
import PaymentCheckout from './pages/PaymentCheckout'
import MatchesHub from './pages/MatchesHub'
import MatchDetail from './pages/MatchDetail'
import MatchRequestDetail from './pages/MatchRequestDetail'
import DisputeList from './pages/DisputeList'
import DisputeDetail from './pages/DisputeDetail'
import WalletTransactions from './pages/WalletTransactions'
import WalletEscrow from './pages/WalletEscrow'

// Marketplace
import MarketplaceTrips from './pages/marketplace/Trips'
import MarketplaceTripDetail from './pages/MarketplaceTripDetail'

// User management
import Profile from './pages/Profile'
import Wallet from './pages/Wallet'
import History from './pages/History'
import Notifications from './pages/Notifications'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Airbar
              </Link>
              <div className="flex space-x-4">
                <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
                <Link href="/add-trip" className="text-gray-600 hover:text-blue-600">Add Trip</Link>
                <Link href="/send-package" className="text-gray-600 hover:text-blue-600">Send Package</Link>
                <Link href="/landing" className="text-gray-600 hover:text-blue-600">Quick Start</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Route path="/" component={HomePage} />
        <Route path="/landing" component={LandingPage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/add-trip" component={AddTrip} />
        <Route path="/add-trip-v2" component={AddTripV2} />
        <Route path="/dashboard/add-trip" component={AddTripV2} />
        <Route path="/dashboard/traveler/trips/addtrip" component={AddTripV2} />
        <Route path="/send-package" component={SendPackage} />
        
        {/* Main User Journeys */}
        <Route path="/matches" component={Matches} />
        <Route path="/dashboard/matches" component={DashboardMatches} />
        <Route path="/matches/discovery" component={MatchesDiscovery} />
        <Route path="/match-requests" component={MatchRequests} />
        <Route path="/parcel-requests" component={ParcelRequests} />
        <Route path="/dashboard/parcel-requests" component={ParcelRequests} />
        <Route path="/parcel-request/:id" component={ParcelRequestDetail} />
        <Route path="/tracking" component={Tracking} />
        <Route path="/browse-packages" component={BrowsePackages} />
        <Route path="/my-trips" component={MyTrips} />
        <Route path="/dashboard/traveler/trips" component={TravelerTrips} />
        <Route path="/my-parcels" component={MyParcels} />
        <Route path="/dashboard/sender/parcels" component={SenderParcels} />
        <Route path="/support" component={Support} />
        <Route path="/dashboard/support" component={Support} />
        
        {/* Match Details */}
        <Route path="/matches/hub" component={MatchesHub} />
        <Route path="/dashboard/matches/hub" component={MatchesHub} />
        <Route path="/match/:id" component={MatchDetail} />
        <Route path="/match-request/:id" component={MatchRequestDetail} />
        
        {/* Payment & Checkout */}
        <Route path="/checkout" component={Checkout} />
        <Route path="/payment/checkout/:id" component={PaymentCheckout} />
        
        {/* Disputes */}
        <Route path="/disputes" component={DisputeList} />
        <Route path="/dashboard/disputes" component={DisputeList} />
        <Route path="/dispute/:id" component={DisputeDetail} />
        
        {/* Wallet Details */}
        <Route path="/dashboard/wallet/transactions" component={WalletTransactions} />
        <Route path="/dashboard/wallet/escrow" component={WalletEscrow} />
        
        {/* Referrals */}
        <Route path="/referrals" component={Referrals} />
        <Route path="/dashboard/referrals" component={Referrals} />
        
        {/* Marketplace */}
        <Route path="/marketplace/trips" component={MarketplaceTrips} />
        <Route path="/browse-trips" component={MarketplaceTrips} />
        <Route path="/marketplace/trips/:id" component={MarketplaceTripDetail} />
        
        {/* User Management */}
        <Route path="/profile" component={Profile} />
        <Route path="/dashboard/profile" component={Profile} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/dashboard/wallet" component={Wallet} />
        <Route path="/history" component={History} />
        <Route path="/dashboard/history" component={History} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/dashboard/notifications" component={Notifications} />
        
        {/* Auth */}
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/forgot-password" component={ForgotPasswordPage} />
        <Route path="/reset-password" component={ResetPasswordPage} />
        <Route path="/auth/login" component={LoginPage} />
        <Route path="/auth/register" component={RegisterPage} />
        <Route path="/auth/forgot-password" component={ForgotPasswordPage} />
        <Route path="/auth/reset-password" component={ResetPasswordPage} />
        
        {/* 404 fallback */}
        <Route>
          {() => (
            <div className="container mx-auto px-4 py-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
              <Link href="/" className="text-blue-600 hover:underline">Go Home</Link>
            </div>
          )}
        </Route>
      </div>
    </Router>
  )
}

// Landing page component
function LandingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🚀 Welcome to Airbar
        </h1>
        <p className="text-lg text-gray-600">
          Your crowdshipping platform is ready!
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2">📊 Dashboard</h3>
          <p className="text-gray-600 mb-4">View your trips, packages, and earnings</p>
          <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors inline-block">
            Go to Dashboard
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2">✈️ Add Trip</h3>
          <p className="text-gray-600 mb-4">Post your travel plans to carry packages</p>
          <Link href="/add-trip" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors inline-block">
            Add Trip
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2">📦 Send Package</h3>
          <p className="text-gray-600 mb-4">Find travelers to deliver your packages</p>
          <Link href="/send-package" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors inline-block">
            Send Package
          </Link>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-gray-500">
          Status: Frontend ✅ | Backend ✅ | Database ✅
        </p>
        <div className="mt-4">
          <Link href="/home" className="text-blue-600 hover:underline">
            View Full Marketing Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

export default App