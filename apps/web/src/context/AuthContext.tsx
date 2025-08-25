import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { registerSchema, loginSchema } from '@airbar/shared/schemas';
import type { RegisterSchema, LoginSchema } from '@airbar/shared/schemas';
import {
  generateDeviceFingerprint,
  setRememberMeEnabled,
  isRememberMeEnabled,
  isDeviceTrustExpired,
  clearDeviceTrust,
} from '../utils/deviceFingerprint';

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycStatus: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  profile?: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    bio?: string;
    phoneNumber?: string;
  } | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginSchema, rememberMe?: boolean) => Promise<{ success: boolean; needsOTP?: boolean; error?: string }>;
  register: (data: RegisterSchema) => Promise<{ success: boolean; needsEmailVerification?: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (data: { email: string }) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (data: { token: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (code: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  refreshToken: () => Promise<boolean>;
  checkAuth: () => Promise<void>;
  isRememberMeEnabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = 'http://localhost:3001/api/auth';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rememberMeEnabled, setRememberMeEnabledState] = useState(false);

  const isAuthenticated = !!user;

  // Initialize remember me state
  useEffect(() => {
    const enabled = isRememberMeEnabled() && !isDeviceTrustExpired();
    setRememberMeEnabledState(enabled);
    if (isDeviceTrustExpired()) {
      clearDeviceTrust();
    }
  }, []);

  // API helper function
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include', // Include cookies for refresh token
    });

    const data = await response.json();

    // Handle token refresh if access token is expired
    if (response.status === 401 && data.error?.code === 'INVALID_TOKEN' && token) {
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        // Retry the original request with new token
        const newToken = localStorage.getItem('accessToken');
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...(newToken && { Authorization: `Bearer ${newToken}` }),
            ...options.headers,
          },
          credentials: 'include',
        });
        return retryResponse.json();
      }
    }

    return data;
  };

  // Register function
  const register = async (data: RegisterSchema) => {
    try {
      const validation = registerSchema.safeParse(data);
      if (!validation.success) {
        return {
          success: false,
          error: validation.error.issues[0]?.message || 'Validation failed',
        };
      }

      const response = await apiCall('/register', {
        method: 'POST',
        body: JSON.stringify(validation.data),
      });

      if (response.success) {
        setUser(response.data.user);
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
        }
        return {
          success: true,
          needsEmailVerification: response.data.needsEmailVerification,
        };
      }

      return {
        success: false,
        error: response.error?.message || 'Registration failed',
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  };

  // Login function
  const login = async (data: LoginSchema, rememberMe = false) => {
    try {
      const validation = loginSchema.safeParse(data);
      if (!validation.success) {
        return {
          success: false,
          error: validation.error.issues[0]?.message || 'Validation failed',
        };
      }

      // Include device fingerprint if remember me is enabled
      const requestBody = {
        ...validation.data,
        ...(rememberMe && { deviceFingerprint: generateDeviceFingerprint() }),
        rememberMe,
      };

      const response = await apiCall('/login', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      if (response.success) {
        if (response.data.needsOTP) {
          return {
            success: true,
            needsOTP: true,
          };
        }

        setUser(response.data.user);
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
        }
        
        // Handle remember me functionality
        if (rememberMe) {
          setRememberMeEnabled(true);
          setRememberMeEnabledState(true);
        }
        
        return { success: true };
      }

      return {
        success: false,
        error: response.error?.message || 'Login failed',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiCall('/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
      clearDeviceTrust();
      setRememberMeEnabledState(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (data: { email: string }) => {
    try {

      const response = await apiCall('/forgot-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      return {
        success: response.success,
        error: response.success ? undefined : response.error?.message || 'Failed to send reset email',
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  };

  // Reset password function
  const resetPassword = async (data: { token: string; password: string }) => {
    try {
      const response = await apiCall('/reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      return {
        success: response.success,
        error: response.success ? undefined : response.error?.message || 'Password reset failed',
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  };

  // Verify OTP function
  const verifyOTP = async (code: string, email?: string) => {
    try {
      const response = await apiCall('/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ code, email }),
      });

      if (response.success && response.data.user) {
        setUser(response.data.user);
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
        }
      }

      return {
        success: response.success,
        error: response.success ? undefined : response.error?.message || 'OTP verification failed',
      };
    } catch (error) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data.user);
        localStorage.setItem('accessToken', data.data.accessToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  // Check authentication status
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        // Try to refresh token if no access token
        const refreshSuccess = await refreshToken();
        if (!refreshSuccess) {
          setIsLoading(false);
          return;
        }
      }

      // Get current user
      const response = await apiCall('/me');
      
      if (response.success) {
        setUser(response.data.user);
      } else {
        // Try to refresh token
        const refreshSuccess = await refreshToken();
        if (!refreshSuccess) {
          localStorage.removeItem('accessToken');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('accessToken');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize authentication on mount
  useEffect(() => {
    // For development: set a mock user to avoid authentication barriers
    if (import.meta.env.MODE === 'development') {
      setUser({
        id: 'dev-user-1',
        email: 'dev@airbar.com',
        username: 'devuser',
        firstName: 'Dev',
        lastName: 'User',
        isActive: true,
        emailVerified: true,
        phoneVerified: true,
        kycStatus: 'APPROVED',
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profile: {
          firstName: 'Dev',
          lastName: 'User',
          avatarUrl: 'https://via.placeholder.com/150',
          bio: 'Development user for testing',
          phoneNumber: '+1234567890',
        }
      });
      setIsLoading(false);
    } else {
      checkAuth();
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyOTP,
    refreshToken,
    checkAuth,
    isRememberMeEnabled: rememberMeEnabled,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;