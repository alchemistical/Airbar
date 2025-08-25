import React, { Suspense, lazy } from 'react'
import { Router, Route, useLocation, Link } from 'wouter'
import ErrorBoundary from './components/ui/error-boundary'
import { ToastProvider } from './components/ui/toast-provider'

// Lazy load components for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AddTripV2 = lazy(() => import('./pages/AddTripV2'))
const SendPackageV2 = lazy(() => import('./pages/SendPackageV2'))
const HomePageNew = lazy(() => import('./pages/landing-v2/HomePageNew'))
const LandingV2 = lazy(() => import('./pages/landing-v2/LandingV2'))

// Main user journeys - lazy loaded
const Matches = lazy(() => import('./pages/Matches'))
const DashboardMatches = lazy(() => import('./pages/DashboardMatches'))
const MatchesDiscovery = lazy(() => import('./pages/MatchesDiscovery'))
const MatchRequests = lazy(() => import('./pages/MatchRequests'))
const ParcelRequests = lazy(() => import('./pages/ParcelRequests'))
const ParcelRequestDetail = lazy(() => import('./pages/ParcelRequestDetail'))
const Tracking = lazy(() => import('./pages/Tracking'))
const BrowsePackages = lazy(() => import('./pages/BrowsePackages'))
const MyTrips = lazy(() => import('./pages/MyTrips'))
const MyParcels = lazy(() => import('./pages/MyParcels'))
const SenderParcels = lazy(() => import('./pages/SenderParcels'))
const TravelerTrips = lazy(() => import('./pages/TravelerTrips'))
const Support = lazy(() => import('./pages/Support'))

// Additional key pages - lazy loaded
const Referrals = lazy(() => import('./pages/Referrals'))
const Checkout = lazy(() => import('./pages/Checkout'))
const PaymentCheckout = lazy(() => import('./pages/PaymentCheckout'))
const MatchesHub = lazy(() => import('./pages/MatchesHub'))
const MatchDetail = lazy(() => import('./pages/MatchDetail'))
const MatchRequestDetail = lazy(() => import('./pages/MatchRequestDetail'))
const DisputeList = lazy(() => import('./pages/DisputeList'))
const DisputeDetail = lazy(() => import('./pages/DisputeDetail'))
const WalletTransactions = lazy(() => import('./pages/WalletTransactions'))
const WalletEscrow = lazy(() => import('./pages/WalletEscrow'))

// Marketplace - lazy loaded
const MarketplaceTrips = lazy(() => import('./pages/marketplace/Trips'))
const MarketplaceTripDetail = lazy(() => import('./pages/MarketplaceTripDetail'))

// User management - lazy loaded
const Profile = lazy(() => import('./pages/Profile'))
const Wallet = lazy(() => import('./pages/Wallet'))
const History = lazy(() => import('./pages/History'))
const Notifications = lazy(() => import('./pages/Notifications'))

// Auth pages - lazy loaded
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'))

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)

function App() {
  return (
    <ToastProvider>
      <ErrorBoundary showReload={true}>
        <Suspense fallback={<LoadingSpinner />}>
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

        {/* Routes - All lazy loaded for better performance */}
        <Route path="/" component={HomePageNew} />
        <Route path="/landing" component={LandingV2} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/add-trip" component={AddTripV2} />
        <Route path="/dashboard/add-trip" component={AddTripV2} />
        <Route path="/dashboard/traveler/trips/addtrip" component={AddTripV2} />
        <Route path="/send-package" component={SendPackageV2} />
        
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
        </Suspense>
      </ErrorBoundary>
    </ToastProvider>
  )
}


export default App