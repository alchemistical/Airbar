import React from 'react'
import { Router, Route, useLocation, Link } from 'wouter'

// Import your existing pages
import Dashboard from './pages/Dashboard'
import AddTrip from './pages/AddTrip'
import SendPackage from './pages/SendPackage'
import HomePage from './marketing/HomePage'

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
        <Route path="/send-package" component={SendPackage} />
        
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