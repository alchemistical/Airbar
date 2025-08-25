import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useToast } from '../ui/toast-provider';
import { LoadingSpinner, ErrorState, EmptyState, DashboardLoadingSkeleton } from '../ui/loading-states';
import { AlertTriangle, Package, RefreshCw } from 'lucide-react';

export const UIShowcase: React.FC = () => {
  const { success, error, warning, info } = useToast();
  const [showLoading, setShowLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);

  const handleToastDemo = (type: 'success' | 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        success('Dashboard data loaded successfully!', 'Success');
        break;
      case 'error':
        error('Failed to connect to API. Please try again.', 'Connection Error');
        break;
      case 'warning':
        warning('Your session will expire in 5 minutes.', 'Session Warning');
        break;
      case 'info':
        info('New features are available in the beta version.', 'Info');
        break;
    }
  };

  const simulateError = () => {
    throw new Error('Demo error for testing error boundaries');
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">UI Polish & Testing Showcase</h1>
        <p className="text-gray-600">Demonstrating production-ready UI components with error handling and loading states.</p>
      </div>

      {/* Toast Notifications */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Toast Notifications</h2>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => handleToastDemo('success')} variant="default">
            Success Toast
          </Button>
          <Button onClick={() => handleToastDemo('error')} variant="destructive">
            Error Toast
          </Button>
          <Button onClick={() => handleToastDemo('warning')} variant="outline">
            Warning Toast
          </Button>
          <Button onClick={() => handleToastDemo('info')} variant="secondary">
            Info Toast
          </Button>
        </div>
      </section>

      {/* Loading States */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Loading States</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={() => setShowLoading(!showLoading)}>
              Toggle Dashboard Loading
            </Button>
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              <span>Small</span>
            </div>
            <div className="flex items-center gap-2">
              <LoadingSpinner size="md" />
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <LoadingSpinner size="lg" />
              <span>Large</span>
            </div>
          </div>
          
          {showLoading && (
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4">Dashboard Loading Skeleton</h3>
              <DashboardLoadingSkeleton />
            </div>
          )}
        </div>
      </section>

      {/* Error States */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Error Handling</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setShowError(!showError)}>
              Toggle Error State
            </Button>
            <Button onClick={simulateError} variant="destructive">
              Trigger Error Boundary
            </Button>
          </div>
          
          {showError && (
            <ErrorState
              error={new Error('Network connection failed')}
              onRetry={() => setShowError(false)}
              title="Failed to load data"
              description="Unable to connect to the server. Please check your internet connection."
            />
          )}
        </div>
      </section>

      {/* Empty States */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Empty States</h2>
        <div className="space-y-4">
          <Button onClick={() => setShowEmpty(!showEmpty)}>
            Toggle Empty State
          </Button>
          
          {showEmpty && (
            <div className="border rounded-lg p-4">
              <EmptyState
                icon={<Package className="h-16 w-16 text-gray-400" />}
                title="No packages found"
                description="You haven't sent any packages yet. Start by creating your first delivery request."
                action={
                  <Button onClick={() => setShowEmpty(false)}>
                    Send Package
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </section>

      {/* API Integration Demo */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">API Integration Status</h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-2 w-2 bg-green-400 rounded-full mt-2"></div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Dashboard API Integration Complete
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>✅ Mock data replaced with dynamic API calls</li>
                  <li>✅ Comprehensive error boundaries implemented</li>
                  <li>✅ Professional loading states active</li>
                  <li>✅ Toast notification system operational</li>
                  <li>✅ Retry mechanisms and fallback data working</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};