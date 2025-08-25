/**
 * Unit tests for AuthContext
 * Tests authentication state management, token refresh, and remember me functionality
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../../../apps/web/src/context/AuthContext';

// Mock the device fingerprinting utilities
jest.mock('../../../apps/web/src/utils/deviceFingerprint', () => ({
  generateDeviceFingerprint: jest.fn(() => 'mock-fingerprint'),
  setRememberMeEnabled: jest.fn(),
  isRememberMeEnabled: jest.fn(() => false),
  isDeviceTrustExpired: jest.fn(() => false),
  clearDeviceTrust: jest.fn(),
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test component that uses auth context
const TestComponent = () => {
  const { user, isAuthenticated, isLoading, login, logout, isRememberMeEnabled } = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">
        {isLoading ? 'Loading' : isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </div>
      <div data-testid="user-info">
        {user ? `${user.email}` : 'No user'}
      </div>
      <div data-testid="remember-me-status">
        {isRememberMeEnabled ? 'Remember Me Enabled' : 'Remember Me Disabled'}
      </div>
      <button 
        data-testid="login-button" 
        onClick={() => login({ email: 'test@example.com', password: 'password' }, true)}
      >
        Login
      </button>
      <button data-testid="logout-button" onClick={() => logout()}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it('should provide initial authentication state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
    expect(screen.getByTestId('remember-me-status')).toHaveTextContent('Remember Me Disabled');
  });

  it('should handle successful login with remember me', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          user: {
            id: 1,
            email: 'test@example.com',
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            avatar: null,
            role: 'USER',
            isKYCVerified: true,
            emailVerified: true,
            twoFactorEnabled: false,
            createdAt: '2024-01-01T00:00:00Z',
          },
          accessToken: 'mock-access-token',
        },
      }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByTestId('login-button');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    expect(screen.getByTestId('user-info')).toHaveTextContent('test@example.com');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', 'mock-access-token');
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password',
          deviceFingerprint: 'mock-fingerprint',
          rememberMe: true,
        }),
      })
    );
  });

  it('should handle login failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: false,
        error: {
          message: 'Invalid credentials',
        },
      }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByTestId('login-button');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });

    expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
  });

  it('should handle logout', async () => {
    // First set up authenticated state
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          user: {
            id: 1,
            email: 'test@example.com',
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            avatar: null,
            role: 'USER',
            isKYCVerified: true,
            emailVerified: true,
            twoFactorEnabled: false,
            createdAt: '2024-01-01T00:00:00Z',
          },
          accessToken: 'mock-access-token',
        },
      }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Login first
    const loginButton = screen.getByTestId('login-button');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    // Mock logout response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    // Now logout
    const logoutButton = screen.getByTestId('logout-button');
    await userEvent.click(logoutButton);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });

    expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
  });

  it('should handle token refresh', async () => {
    // Mock a successful refresh response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          user: {
            id: 1,
            email: 'test@example.com',
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            avatar: null,
            role: 'USER',
            isKYCVerified: true,
            emailVerified: true,
            twoFactorEnabled: false,
            createdAt: '2024-01-01T00:00:00Z',
          },
          accessToken: 'new-access-token',
        },
      }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial auth check
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).not.toHaveTextContent('Loading');
    });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/auth/refresh',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      })
    );
  });

  it('should handle validation errors', async () => {
    const TestValidationComponent = () => {
      const { login } = useAuth();
      const [error, setError] = React.useState<string | null>(null);
      
      const handleLogin = async () => {
        const result = await login({ email: 'invalid-email', password: '123' });
        if (!result.success) {
          setError(result.error || 'Login failed');
        }
      };
      
      return (
        <div>
          <button data-testid="login-invalid" onClick={handleLogin}>
            Login Invalid
          </button>
          {error && <div data-testid="error">{error}</div>}
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestValidationComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByTestId('login-invalid');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Invalid email address');
    });
  });

  it('should throw error when useAuth is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const TestComponentOutsideProvider = () => {
      useAuth();
      return <div>Should not render</div>;
    };

    expect(() => {
      render(<TestComponentOutsideProvider />);
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleError.mockRestore();
  });
});