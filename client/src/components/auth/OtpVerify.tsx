import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';

interface OtpVerifyProps {
  email: string;
  onSuccess: () => void;
  onBack?: () => void;
  type?: 'login' | 'email_verify' | 'password_reset' | '2fa';
  title?: string;
  subtitle?: string;
}

export function OtpVerify({ 
  email, 
  onSuccess, 
  onBack,
  type = 'login',
  title = 'Enter verification code',
  subtitle = 'We\'ve sent a 6-digit code to your email'
}: OtpVerifyProps) {
  const { verifyOTP } = useAuth();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];
    
    pastedData.split('').forEach((digit, index) => {
      if (index < 6) {
        newCode[index] = digit;
      }
    });
    
    setCode(newCode);

    // Focus last filled input or next empty input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();

    // Auto-submit if code is complete
    if (pastedData.length === 6) {
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (codeString?: string) => {
    const otpCode = codeString || code.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await verifyOTP(otpCode, email);
      
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Invalid verification code');
        // Clear the code on error
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    // Implementation for resending OTP would go here
    setCanResend(false);
    setTimeLeft(600); // Reset to 10 minutes
    setError(null);
    
    // In a real implementation, you would call an API to resend the OTP
    console.log('Resending OTP to:', email);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        )}
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        <p className="text-gray-600">
          {subtitle}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Sent to <strong>{email}</strong>
        </p>
      </div>

      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* OTP Input */}
      <div className="space-y-4">
        <Label className="sr-only">Verification Code</Label>
        <div className="flex justify-center space-x-2" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-semibold border-2 focus:border-brand-600"
              disabled={isLoading}
            />
          ))}
        </div>

        {/* Timer and resend */}
        <div className="text-center text-sm">
          {!canResend ? (
            <p className="text-gray-600">
              Code expires in <span className="font-semibold">{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-600">Didn't receive the code?</p>
              <button
                onClick={handleResend}
                className="text-brand-600 hover:text-brand-700 font-semibold"
                disabled={isLoading}
              >
                Resend code
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Manual submit button (in case auto-submit fails) */}
      <Button
        onClick={() => handleSubmit()}
        className="w-full"
        disabled={isLoading || code.some(digit => digit === '')}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify Code'
        )}
      </Button>

      {/* Help text */}
      <div className="text-center text-sm text-gray-600">
        <p>
          Check your spam folder if you don't see the email.{' '}
          <Link href="/support" className="text-brand-600 hover:text-brand-700">
            Need help?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default OtpVerify;