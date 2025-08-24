import React, { ReactNode } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Package, Plane, Shield, Users } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backTo?: string;
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  showBackButton = false,
  backTo = '/'
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Left side - Branding and illustration */}
      <div className="hidden lg:flex lg:flex-1 bg-brand-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-700"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 py-12">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">Airbar</span>
            </Link>
          </div>

          {/* Hero content */}
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white mb-4">
              Ship smarter, travel lighter
            </h1>
            <p className="text-xl text-brand-100 mb-8">
              Connect with travelers worldwide and save up to 70% on international shipping
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="text-brand-100">Secure escrow protection</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <span className="text-brand-100">Verified traveler network</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
                  <Plane className="h-4 w-4 text-white" />
                </div>
                <span className="text-brand-100">Real-time tracking</span>
              </div>
            </div>
          </div>

          {/* Floating illustration */}
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2 opacity-20">
            <div className="w-64 h-64 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center">
              <Package className="h-24 w-24 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form content */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center space-x-2">
              <Package className="h-8 w-8 text-brand-600" />
              <span className="text-2xl font-bold text-gray-900">Airbar</span>
            </Link>
          </div>

          {/* Back button */}
          {showBackButton && (
            <div className="mb-6">
              <Link href={backTo} className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form content */}
          <div className="space-y-6">
            {children}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-600">
              <p>
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-brand-600 hover:text-brand-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-brand-600 hover:text-brand-700">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;