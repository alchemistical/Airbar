import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/animated-card';
import { SendPackageErrorBoundary, CheckoutErrorBoundary, DashboardErrorBoundary } from '@/components/ui/contextual-error-boundaries';

// Component that throws errors on command
const ErrorThrower: React.FC<{ errorType: string }> = ({ errorType }) => {
  if (errorType === 'throw') {
    throw new Error('This is a test error to demonstrate contextual error boundaries');
  }
  
  return (
    <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
      <p className="text-green-800">✅ No error thrown - component working normally</p>
    </div>
  );
};

export default function ErrorBoundaryDemo() {
  const [sendPackageError, setSendPackageError] = useState(false);
  const [checkoutError, setCheckoutError] = useState(false);
  const [dashboardError, setDashboardError] = useState(false);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Contextual Error Boundary Demo
          </h1>
          <p className="text-gray-600">
            This page demonstrates our improved error boundaries with context-specific messaging.
            Click the buttons below to trigger errors and see how each context provides appropriate guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Send Package Error Boundary */}
          <AnimatedCard>
            <CardHeader>
              <CardTitle className="text-lg">📦 Send Package Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SendPackageErrorBoundary>
                <ErrorThrower errorType={sendPackageError ? 'throw' : 'normal'} />
              </SendPackageErrorBoundary>
              
              <div className="flex flex-col space-y-2">
                <AnimatedButton
                  onClick={() => setSendPackageError(true)}
                  variant="destructive"
                  size="sm"
                >
                  Trigger Package Error
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => setSendPackageError(false)}
                  variant="outline"
                  size="sm"
                >
                  Reset
                </AnimatedButton>
              </div>
              
              <div className="text-xs text-gray-500">
                <p><strong>Context:</strong> Package form loading issues</p>
                <p><strong>Guidance:</strong> Location services, form validation</p>
              </div>
            </CardContent>
          </AnimatedCard>

          {/* Checkout Error Boundary */}
          <AnimatedCard>
            <CardHeader>
              <CardTitle className="text-lg">💳 Checkout Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CheckoutErrorBoundary>
                <ErrorThrower errorType={checkoutError ? 'throw' : 'normal'} />
              </CheckoutErrorBoundary>
              
              <div className="flex flex-col space-y-2">
                <AnimatedButton
                  onClick={() => setCheckoutError(true)}
                  variant="destructive"
                  size="sm"
                >
                  Trigger Payment Error
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => setCheckoutError(false)}
                  variant="outline"
                  size="sm"
                >
                  Reset
                </AnimatedButton>
              </div>
              
              <div className="text-xs text-gray-500">
                <p><strong>Context:</strong> Payment processing issues</p>
                <p><strong>Guidance:</strong> Payment security, support options</p>
              </div>
            </CardContent>
          </AnimatedCard>

          {/* Dashboard Error Boundary */}
          <AnimatedCard>
            <CardHeader>
              <CardTitle className="text-lg">📊 Dashboard Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DashboardErrorBoundary>
                <ErrorThrower errorType={dashboardError ? 'throw' : 'normal'} />
              </DashboardErrorBoundary>
              
              <div className="flex flex-col space-y-2">
                <AnimatedButton
                  onClick={() => setDashboardError(true)}
                  variant="destructive"
                  size="sm"
                >
                  Trigger Dashboard Error
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => setDashboardError(false)}
                  variant="outline" 
                  size="sm"
                >
                  Reset
                </AnimatedButton>
              </div>
              
              <div className="text-xs text-gray-500">
                <p><strong>Context:</strong> Dashboard data loading</p>
                <p><strong>Guidance:</strong> Login status, offline mode</p>
              </div>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Implementation Summary */}
        <AnimatedCard className="mt-8" variant="premium">
          <CardHeader>
            <CardTitle>🎯 Implementation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">✅ What's Improved</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Context-specific error messages</li>
                  <li>• Relevant troubleshooting suggestions</li>
                  <li>• Appropriate recovery actions</li>
                  <li>• User-friendly language</li>
                  <li>• Visual icons and branding</li>
                  <li>• Development error details</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">📋 Error Contexts</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>Send Package:</strong> Form and location issues</li>
                  <li>• <strong>Checkout:</strong> Payment processing errors</li>
                  <li>• <strong>Dashboard:</strong> Data loading problems</li>
                  <li>• <strong>Auth:</strong> Login and registration issues</li>
                  <li>• <strong>General:</strong> Fallback for other errors</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>
      </div>
    </DashboardLayout>
  );
}