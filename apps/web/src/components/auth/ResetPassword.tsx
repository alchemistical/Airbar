import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Lock, Check, X } from 'lucide-react';
import { resetPasswordSchema } from '@airbar/shared/schemas';
import type { ResetPasswordInput } from '@airbar/shared/schemas';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';

export function ResetPassword() {
  const [, navigate] = useLocation();
  const { resetPassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<{ newPassword: string }>({
    resolver: zodResolver(resetPasswordSchema.pick({ newPassword: true })),
    defaultValues: {
      newPassword: '',
    },
  });

  const password = watch('newPassword');

  // Extract token from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    setToken(tokenParam);
    
    if (!tokenParam) {
      setError('Invalid or missing reset token');
    }
  }, []);

  const onSubmit = async (data: { newPassword: string }) => {
    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await resetPassword({
        token,
        newPassword: data.newPassword,
      });
      
      if (result.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      } else {
        setError(result.error || 'Password reset failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !error) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Loading...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Password reset successful
          </h3>
          <p className="text-gray-600">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
        </div>

        <div className="text-sm text-gray-600">
          <p>Redirecting to sign in page in 3 seconds...</p>
        </div>

        <Button onClick={() => navigate('/auth/login')} className="w-full">
          Continue to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Reset your password
        </h2>
        <p className="text-gray-600">
          Enter your new password below to reset your Airbar account password.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Reset password form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your new password"
              className="pl-10 pr-10"
              {...register('newPassword')}
              autoComplete="new-password"
              autoFocus
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
          )}

          {/* Password strength indicator */}
          {password && <PasswordStrengthIndicator password={password} />}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !token}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting password...
            </>
          ) : (
            'Reset password'
          )}
        </Button>
      </form>

      {/* Back to login link */}
      <div className="text-center pt-4 border-t border-gray-200">
        <Link
          href="/auth/login"
          className="text-brand-600 hover:text-brand-700 font-semibold"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}

// Password strength indicator component
function PasswordStrengthIndicator({ password }: { password: string }) {
  const requirements = [
    { regex: /.{8,}/, text: 'At least 8 characters' },
    { regex: /[a-z]/, text: 'One lowercase letter' },
    { regex: /[A-Z]/, text: 'One uppercase letter' },
    { regex: /\d/, text: 'One number' },
  ];

  const score = requirements.reduce((acc, req) => acc + (req.regex.test(password) ? 1 : 0), 0);
  const percentage = (score / requirements.length) * 100;

  const getStrengthColor = () => {
    if (percentage <= 25) return 'bg-red-500';
    if (percentage <= 50) return 'bg-yellow-500';
    if (percentage <= 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (percentage <= 25) return 'Weak';
    if (percentage <= 50) return 'Fair';
    if (percentage <= 75) return 'Good';
    return 'Strong';
  };

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600">
          {getStrengthText()}
        </span>
      </div>

      {/* Requirements list */}
      <div className="space-y-1">
        {requirements.map((req, index) => {
          const isValid = req.regex.test(password);
          return (
            <div key={index} className="flex items-center space-x-2 text-xs">
              {isValid ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <X className="h-3 w-3 text-gray-400" />
              )}
              <span className={isValid ? 'text-green-700' : 'text-gray-500'}>
                {req.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResetPassword;