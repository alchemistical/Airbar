import React from 'react';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from './button';
import { Alert, AlertDescription } from './alert';
import { Skeleton } from './skeleton';

// Generic loading spinner
export const LoadingSpinner: React.FC<{ 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string; 
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
};

// Full screen loading
export const FullScreenLoading: React.FC<{ message?: string }> = ({ 
  message = "Loading..." 
}) => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="lg" className="text-blue-600 mb-4" />
      <p className="text-lg font-medium text-gray-900">{message}</p>
    </div>
  </div>
);

// Dashboard loading skeleton
export const DashboardLoadingSkeleton: React.FC = () => (
  <div className="space-y-8">
    {/* Header skeleton */}
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>

    {/* Stats skeleton */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
        </div>
      ))}
    </div>

    {/* Content skeleton */}
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-8">
        {/* Main content skeleton */}
        <div className="bg-white p-6 rounded-lg border">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar skeleton */}
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg border">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-8 ml-auto" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Error state component with retry
export const ErrorState: React.FC<{
  error?: Error | null;
  onRetry?: () => void;
  title?: string;
  description?: string;
}> = ({ 
  error, 
  onRetry, 
  title = "Something went wrong", 
  description = "We encountered an error loading this data." 
}) => (
  <Alert className="border-red-200 bg-red-50">
    <AlertCircle className="h-4 w-4 text-red-600" />
    <AlertDescription>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-red-800">{title}</h4>
          <p className="text-sm text-red-600 mt-1">{description}</p>
          {error && process.env.NODE_ENV === 'development' && (
            <details className="mt-2">
              <summary className="text-xs cursor-pointer">Error details</summary>
              <pre className="text-xs mt-1 bg-red-100 p-2 rounded overflow-auto max-h-20">
                {error.message}
              </pre>
            </details>
          )}
        </div>
        {onRetry && (
          <Button 
            onClick={onRetry} 
            size="sm" 
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Retry
          </Button>
        )}
      </div>
    </AlertDescription>
  </Alert>
);

// Empty state component
export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <div className="text-center py-12">
    {icon && <div className="flex justify-center mb-4">{icon}</div>}
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-gray-500 mb-6">{description}</p>
    )}
    {action}
  </div>
);

// Query state wrapper
export const QueryStateWrapper: React.FC<{
  isLoading: boolean;
  error: Error | null;
  data: any;
  onRetry?: () => void;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  children: React.ReactNode;
}> = ({
  isLoading,
  error,
  data,
  onRetry,
  loadingComponent,
  errorComponent,
  emptyComponent,
  children
}) => {
  if (isLoading) {
    return <>{loadingComponent || <DashboardLoadingSkeleton />}</>;
  }

  if (error) {
    return <>{errorComponent || <ErrorState error={error} onRetry={onRetry} />}</>;
  }

  if (!data && emptyComponent) {
    return <>{emptyComponent}</>;
  }

  return <>{children}</>;
};