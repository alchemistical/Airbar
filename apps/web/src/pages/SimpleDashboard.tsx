import { Link } from "wouter";

export default function SimpleDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📊 Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Welcome to your Airbar dashboard!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              ✈️ My Trips
            </h3>
            <p className="text-gray-600 mb-4">View and manage your travel plans</p>
            <div className="text-3xl font-bold text-blue-600">3</div>
            <p className="text-sm text-gray-500">Active trips</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              📦 My Packages
            </h3>
            <p className="text-gray-600 mb-4">Track your package deliveries</p>
            <div className="text-3xl font-bold text-green-600">7</div>
            <p className="text-sm text-gray-500">Packages sent</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              💰 Earnings
            </h3>
            <p className="text-gray-600 mb-4">Your total earnings</p>
            <div className="text-3xl font-bold text-purple-600">$245</div>
            <p className="text-sm text-gray-500">This month</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              🤝 Matches
            </h3>
            <p className="text-gray-600 mb-4">Package/trip matches</p>
            <div className="text-3xl font-bold text-orange-600">2</div>
            <p className="text-sm text-gray-500">Pending matches</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              ⭐ Rating
            </h3>
            <p className="text-gray-600 mb-4">Your user rating</p>
            <div className="text-3xl font-bold text-yellow-600">4.8</div>
            <p className="text-sm text-gray-500">Out of 5 stars</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              🔔 Notifications
            </h3>
            <p className="text-gray-600 mb-4">Recent updates</p>
            <div className="text-3xl font-bold text-red-600">5</div>
            <p className="text-sm text-gray-500">Unread messages</p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/add-trip">
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  ✈️ Add New Trip
                </button>
              </Link>
              <Link href="/send-package">
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                  📦 Send Package
                </button>
              </Link>
              <button className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                💰 Withdraw Funds
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Package delivered to Miami</span>
                <span className="text-xs text-gray-500 ml-auto">2h ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">New trip match found</span>
                <span className="text-xs text-gray-500 ml-auto">4h ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Payment received - $45</span>
                <span className="text-xs text-gray-500 ml-auto">1d ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <button className="text-blue-600 hover:underline">
              ← Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}