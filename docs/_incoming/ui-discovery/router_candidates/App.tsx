import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🚀 Airbar Dashboard
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Monorepo migration successful!
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">Frontend</h3>
            <p className="text-sm text-gray-600">React + Vite</p>
            <p className="text-xs text-green-600">✓ Running</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">Backend</h3>
            <p className="text-sm text-gray-600">Express + TypeScript</p>
            <p className="text-xs text-green-600">✓ Running on :3001</p>
          </div>
        </div>
        <div className="mt-8">
          <div className="bg-white p-4 rounded-lg shadow max-w-md mx-auto">
            <h3 className="font-semibold">Database</h3>
            <p className="text-sm text-gray-600">PostgreSQL</p>
            <p className="text-xs text-green-600">✓ Connected</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App