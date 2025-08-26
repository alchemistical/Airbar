import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft, Package, CreditCard, User, MapPin } from 'lucide-react';
import { AnimatedButton } from './animated-button';
import { AnimatedCard, CardContent, CardHeader, CardTitle } from './animated-card';

interface ErrorInfo {
  title: string;
  description: string;
  icon: React.ReactNode;
  suggestions: string[];
  actions: {
    label: string;
    action: () => void;
    variant?: 'default' | 'outline' | 'destructive';
  }[];
}

interface ContextualErrorBoundaryProps {
  children: ReactNode;
  context: 'send-package' | 'checkout' | 'dashboard' | 'auth' | 'general';
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ContextualErrorBoundary extends Component<ContextualErrorBoundaryProps, State> {
  constructor(props: ContextualErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`${this.props.context} Error Boundary caught an error:`, error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  getErrorInfo(): ErrorInfo {
    const { context } = this.props;
    const { error } = this.state;

    switch (context) {
      case 'send-package':
        return {
          title: 'Package Form Error',
          description: 'We encountered an issue while loading the package submission form. This might be due to missing location data or form validation issues.',
          icon: <Package className="h-12 w-12 text-blue-500" />,
          suggestions: [
            'Check your internet connection',
            'Try refreshing the page',
            'Ensure location services are enabled',
            'Clear your browser cache'
          ],
          actions: [
            {
              label: 'Try Again',
              action: () => this.handleRetry(),
              variant: 'default'
            },
            {
              label: 'Go to Dashboard',
              action: () => window.location.href = '/dashboard',
              variant: 'outline'
            }
          ]
        };

      case 'checkout':
        return {
          title: 'Payment Processing Error',
          description: 'There was an issue loading the secure checkout page. Your payment information is safe and has not been processed.',
          icon: <CreditCard className="h-12 w-12 text-green-500" />,
          suggestions: [
            'Payment processing requires a stable connection',
            'Ensure JavaScript is enabled in your browser',
            'Try using a different payment method',
            'Contact support if the issue persists'
          ],
          actions: [
            {
              label: 'Retry Payment',
              action: () => this.handleRetry(),
              variant: 'default'
            },
            {
              label: 'Back to Matches',
              action: () => window.location.href = '/matches',
              variant: 'outline'
            },
            {
              label: 'Contact Support',
              action: () => window.location.href = '/support',
              variant: 'outline'
            }
          ]
        };

      case 'dashboard':
        return {
          title: 'Dashboard Loading Error',
          description: 'Unable to load your dashboard data. This could be due to a temporary server issue or connectivity problem.',
          icon: <User className="h-12 w-12 text-purple-500" />,
          suggestions: [
            'Dashboard data may be temporarily unavailable',
            'Try refreshing to reload your data',
            'Check if you\'re still logged in',
            'Some features may work in offline mode'
          ],
          actions: [
            {
              label: 'Refresh Dashboard',
              action: () => this.handleRetry(),
              variant: 'default'
            },
            {
              label: 'Go to Profile',
              action: () => window.location.href = '/profile',
              variant: 'outline'
            }
          ]
        };

      case 'auth':
        return {
          title: 'Authentication Error',
          description: 'There was an issue with the login or registration process. Your account security is our priority.',
          icon: <User className="h-12 w-12 text-red-500" />,
          suggestions: [
            'Verify your email and password',
            'Check if Caps Lock is enabled',
            'Try resetting your password',
            'Clear browser cookies and try again'
          ],
          actions: [
            {
              label: 'Try Again',
              action: () => this.handleRetry(),
              variant: 'default'
            },
            {
              label: 'Reset Password',
              action: () => window.location.href = '/auth/forgot-password',
              variant: 'outline'
            },
            {
              label: 'Go Home',
              action: () => window.location.href = '/',
              variant: 'outline'
            }
          ]
        };

      default:
        return {
          title: 'Something went wrong',
          description: 'We encountered an unexpected error. Our team has been notified and is working to fix this issue.',
          icon: <AlertTriangle className="h-12 w-12 text-orange-500" />,
          suggestions: [
            'Try refreshing the page',
            'Check your internet connection',
            'Try again in a few minutes',
            'Contact support if the problem persists'
          ],
          actions: [
            {
              label: 'Refresh Page',
              action: () => window.location.reload(),
              variant: 'default'
            },
            {
              label: 'Go Home',
              action: () => window.location.href = '/',
              variant: 'outline'
            }
          ]
        };
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const errorInfo = this.getErrorInfo();

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
          <div className="max-w-lg w-full">
            <AnimatedCard variant="interactive" className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {errorInfo.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {errorInfo.title}
                </CardTitle>
                <p className="text-gray-600 leading-relaxed">
                  {errorInfo.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Suggestions */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3 text-sm">💡 Quick fixes to try:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {errorInfo.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-3">
                  {errorInfo.actions.map((action, index) => (
                    <AnimatedButton
                      key={index}
                      onClick={action.action}
                      variant={action.variant || 'default'}
                      className="w-full"
                    >
                      {action.label}
                    </AnimatedButton>
                  ))}
                </div>

                {/* Error details for development */}
                {import.meta.env.DEV && this.state.error && (
                  <details className="text-left bg-gray-100 rounded-lg p-4">
                    <summary className="font-medium cursor-pointer text-gray-700 text-sm">
                      🔧 Developer Info
                    </summary>
                    <div className="mt-3 text-xs">
                      <div className="font-medium text-gray-900 mb-1">Error:</div>
                      <div className="text-red-600 mb-3">{this.state.error.message}</div>
                      
                      <div className="font-medium text-gray-900 mb-1">Stack:</div>
                      <pre className="text-gray-600 text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </details>
                )}
              </CardContent>
            </AnimatedCard>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Convenience wrappers for specific contexts
export const SendPackageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ContextualErrorBoundary context="send-package">
    {children}
  </ContextualErrorBoundary>
);

export const CheckoutErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ContextualErrorBoundary context="checkout">
    {children}
  </ContextualErrorBoundary>
);

export const DashboardErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ContextualErrorBoundary context="dashboard">
    {children}
  </ContextualErrorBoundary>
);

export const AuthErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ContextualErrorBoundary context="auth">
    {children}
  </ContextualErrorBoundary>
);