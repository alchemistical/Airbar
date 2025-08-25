import React, { Suspense, lazy } from 'react'
import { Router, Route, useLocation, Link } from 'wouter'
import ErrorBoundary from './components/ui/error-boundary'
import { ToastProvider } from './components/ui/toast-provider'
import { AuthProvider } from './context/AuthContext'
import { AuthRoutes } from './routes/authRoutes'
import { TripRoutes } from './routes/tripRoutes'
import { MarketplaceRoutes } from './routes/marketplaceRoutes'
import { DashboardRoutes } from './routes/dashboardRoutes'
import { SessionTimeoutModal, useSessionTimeout } from './components/auth/SessionTimeoutModal'

// Core pages not handled by route modules  
const SendPackageV2 = lazy(() => import('./pages/SendPackageV2'))
const HomePageNew = lazy(() => import('./pages/landing-v2/HomePageNew'))
const LandingV2 = lazy(() => import('./pages/landing-v2/LandingV2'))

// Main user journeys - lazy loaded
const Matches = lazy(() => import('./pages/Matches'))
const MatchesDiscovery = lazy(() => import('./pages/MatchesDiscovery'))
const MatchRequests = lazy(() => import('./pages/MatchRequests'))
const ParcelRequests = lazy(() => import('./pages/ParcelRequests'))
const ParcelRequestDetail = lazy(() => import('./pages/ParcelRequestDetail'))
const Tracking = lazy(() => import('./pages/Tracking'))
const MyParcels = lazy(() => import('./pages/MyParcels'))
const SenderParcels = lazy(() => import('./pages/SenderParcels'))

// Additional key pages - lazy loaded
const Checkout = lazy(() => import('./pages/Checkout'))
const PaymentCheckout = lazy(() => import('./pages/PaymentCheckout'))
const MatchesHub = lazy(() => import('./pages/MatchesHub'))
const MatchDetail = lazy(() => import('./pages/MatchDetail'))
const MatchRequestDetail = lazy(() => import('./pages/MatchRequestDetail'))
const DisputeList = lazy(() => import('./pages/DisputeList'))
const DisputeDetail = lazy(() => import('./pages/DisputeDetail'))

// Route modules handle: Auth, Trips, Marketplace, Dashboard components

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)

// Inner app component that uses session timeout hook
const AppContent = () => {
  const { showWarning, extendSession, handleLogout } = useSessionTimeout();

  return (
    <>
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

        {/* Core Routes */}
        <Route path="/" component={HomePageNew} />
        <Route path="/landing" component={LandingV2} />
        <Route path="/send-package" component={SendPackageV2} />
        
        {/* Feature Route Modules */}
        <DashboardRoutes />
        <TripRoutes />
        <MarketplaceRoutes />
        <AuthRoutes />
        
        {/* Remaining Routes Not Yet Modularized */}
        <Route path="/matches" component={Matches} />
        <Route path="/matches/discovery" component={MatchesDiscovery} />
        <Route path="/match-requests" component={MatchRequests} />
        <Route path="/parcel-requests" component={ParcelRequests} />
        <Route path="/dashboard/parcel-requests" component={ParcelRequests} />
        <Route path="/parcel-request/:id" component={ParcelRequestDetail} />
        <Route path="/tracking" component={Tracking} />
        <Route path="/my-parcels" component={MyParcels} />
        <Route path="/dashboard/sender/parcels" component={SenderParcels} />
        
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

      {/* Session Timeout Modal */}
      <SessionTimeoutModal
        isOpen={showWarning}
        onExtendSession={extendSession}
        onLogout={handleLogout}
        warningTimeSeconds={120}
      />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  )
}


export default App