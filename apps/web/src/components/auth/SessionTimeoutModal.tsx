import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  onExtendSession: () => void;
  onLogout: () => void;
  warningTimeSeconds: number;
}

export function SessionTimeoutModal({
  isOpen,
  onExtendSession,
  onLogout,
  warningTimeSeconds = 120, // 2 minutes default
}: SessionTimeoutModalProps) {
  const [countdown, setCountdown] = useState(warningTimeSeconds);
  const [isExtending, setIsExtending] = useState(false);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            onLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, countdown, onLogout]);

  // Reset countdown when modal opens
  useEffect(() => {
    if (isOpen) {
      setCountdown(warningTimeSeconds);
    }
  }, [isOpen, warningTimeSeconds]);

  const handleExtendSession = async () => {
    setIsExtending(true);
    try {
      await onExtendSession();
    } finally {
      setIsExtending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressValue = ((warningTimeSeconds - countdown) / warningTimeSeconds) * 100;
  const isUrgent = countdown <= 30;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isUrgent ? 'bg-red-100' : 'bg-amber-100'}`}>
              {isUrgent ? (
                <AlertTriangle className={`h-6 w-6 ${isUrgent ? 'text-red-600' : 'text-amber-600'}`} />
              ) : (
                <Clock className="h-6 w-6 text-amber-600" />
              )}
            </div>
            <div>
              <DialogTitle className={isUrgent ? 'text-red-900' : 'text-amber-900'}>
                Session Expiring Soon
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Your session will expire in {formatTime(countdown)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Time remaining:</span>
              <span className={`font-mono font-medium ${isUrgent ? 'text-red-600' : 'text-amber-600'}`}>
                {formatTime(countdown)}
              </span>
            </div>
            <Progress 
              value={progressValue} 
              className={`w-full ${isUrgent ? 'bg-red-100' : 'bg-amber-100'}`}
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              To protect your account, you'll be automatically logged out when the timer reaches zero. 
              Click "Stay Logged In" to extend your session.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onLogout}
            className="w-full sm:w-auto"
          >
            Logout Now
          </Button>
          <Button
            onClick={handleExtendSession}
            disabled={isExtending}
            className="w-full sm:w-auto"
          >
            {isExtending ? 'Extending...' : 'Stay Logged In'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook for managing session timeout warnings
export function useSessionTimeout() {
  const { user, isAuthenticated, refreshToken, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [warningTimer, setWarningTimer] = useState<number | null>(null);
  const [sessionTimer, setSessionTimer] = useState<number | null>(null);

  const SESSION_DURATION = 55 * 60 * 1000; // 55 minutes (5 min buffer before token expires)
  const WARNING_DURATION = 2 * 60 * 1000; // Show warning 2 minutes before expiry

  const resetTimers = () => {
    if (warningTimer) clearTimeout(warningTimer);
    if (sessionTimer) clearTimeout(sessionTimer);

    if (isAuthenticated) {
      // Set warning timer
      const newWarningTimer = setTimeout(() => {
        setShowWarning(true);
      }, SESSION_DURATION - WARNING_DURATION);

      // Set logout timer
      const newSessionTimer = setTimeout(() => {
        logout();
        setShowWarning(false);
      }, SESSION_DURATION);

      setWarningTimer(newWarningTimer);
      setSessionTimer(newSessionTimer);
    }
  };

  const extendSession = async () => {
    try {
      const success = await refreshToken();
      if (success) {
        setShowWarning(false);
        resetTimers();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to extend session:', error);
      return false;
    }
  };

  const handleLogout = () => {
    setShowWarning(false);
    logout();
  };

  // Initialize timers when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      resetTimers();
    } else {
      // Clean up timers when logged out
      if (warningTimer) clearTimeout(warningTimer);
      if (sessionTimer) clearTimeout(sessionTimer);
      setShowWarning(false);
    }

    return () => {
      if (warningTimer) clearTimeout(warningTimer);
      if (sessionTimer) clearTimeout(sessionTimer);
    };
  }, [isAuthenticated, user]);

  return {
    showWarning,
    extendSession,
    handleLogout,
    resetTimers,
  };
}