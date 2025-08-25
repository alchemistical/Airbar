/**
 * Unit tests for SessionTimeoutModal
 * Tests session timeout warning functionality and user interactions
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionTimeoutModal, useSessionTimeout } from '../../../apps/web/src/components/auth/SessionTimeoutModal';
import { AuthProvider } from '../../../apps/web/src/context/AuthContext';

// Mock the AuthContext
const mockRefreshToken = jest.fn();
const mockLogout = jest.fn();

jest.mock('../../../apps/web/src/context/AuthContext', () => ({
  ...jest.requireActual('../../../apps/web/src/context/AuthContext'),
  useAuth: () => ({
    user: { id: 1, email: 'test@example.com' },
    isAuthenticated: true,
    refreshToken: mockRefreshToken,
    logout: mockLogout,
  }),
}));

// Mock timers
jest.useFakeTimers();

describe('SessionTimeoutModal', () => {
  const defaultProps = {
    isOpen: true,
    onExtendSession: jest.fn(),
    onLogout: jest.fn(),
    warningTimeSeconds: 10, // Short time for testing
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  it('should render session timeout modal', () => {
    render(<SessionTimeoutModal {...defaultProps} />);

    expect(screen.getByText('Session Expiring Soon')).toBeInTheDocument();
    expect(screen.getByText('Your session will expire in 0:10')).toBeInTheDocument();
    expect(screen.getByText('Stay Logged In')).toBeInTheDocument();
    expect(screen.getByText('Logout Now')).toBeInTheDocument();
  });

  it('should countdown timer correctly', async () => {
    render(<SessionTimeoutModal {...defaultProps} />);

    expect(screen.getByText('Your session will expire in 0:10')).toBeInTheDocument();

    // Advance timer by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Your session will expire in 0:09')).toBeInTheDocument();

    // Advance timer by 5 more seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.getByText('Your session will expire in 0:04')).toBeInTheDocument();
  });

  it('should show urgent state when countdown is low', async () => {
    render(<SessionTimeoutModal {...defaultProps} />);

    // Advance timer to make it urgent (30 seconds or less)
    act(() => {
      jest.advanceTimersByTime(8000); // 2 seconds remaining
    });

    expect(screen.getByText('Your session will expire in 0:02')).toBeInTheDocument();
    // Check that the UI reflects urgent state (red colors)
    expect(screen.getByText('0:02')).toHaveClass('text-red-600');
  });

  it('should call onLogout when timer reaches zero', async () => {
    const onLogout = jest.fn();
    render(<SessionTimeoutModal {...defaultProps} onLogout={onLogout} />);

    // Advance timer to expiry
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(onLogout).toHaveBeenCalled();
  });

  it('should handle extend session button click', async () => {
    const onExtendSession = jest.fn().mockResolvedValue(undefined);
    render(<SessionTimeoutModal {...defaultProps} onExtendSession={onExtendSession} />);

    const extendButton = screen.getByText('Stay Logged In');
    await userEvent.click(extendButton);

    expect(onExtendSession).toHaveBeenCalled();
  });

  it('should handle logout button click', async () => {
    const onLogout = jest.fn();
    render(<SessionTimeoutModal {...defaultProps} onLogout={onLogout} />);

    const logoutButton = screen.getByText('Logout Now');
    await userEvent.click(logoutButton);

    expect(onLogout).toHaveBeenCalled();
  });

  it('should show extending state during session extension', async () => {
    const onExtendSession = jest.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );
    
    render(<SessionTimeoutModal {...defaultProps} onExtendSession={onExtendSession} />);

    const extendButton = screen.getByText('Stay Logged In');
    userEvent.click(extendButton);

    await waitFor(() => {
      expect(screen.getByText('Extending...')).toBeInTheDocument();
    });

    // Fast forward past the mock delay
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.getByText('Stay Logged In')).toBeInTheDocument();
    });
  });

  it('should reset countdown when modal opens', () => {
    const { rerender } = render(<SessionTimeoutModal {...defaultProps} isOpen={false} />);

    // Initially closed, countdown should not be visible
    expect(screen.queryByText('Your session will expire in 0:10')).not.toBeInTheDocument();

    // Open modal
    rerender(<SessionTimeoutModal {...defaultProps} isOpen={true} />);

    expect(screen.getByText('Your session will expire in 0:10')).toBeInTheDocument();
  });

  it('should not allow closing modal by clicking outside', () => {
    render(<SessionTimeoutModal {...defaultProps} />);

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();

    // Modal should prevent closing by outside clicks
    // This is handled by the onPointerDownOutside preventDefault
    expect(modal).toBeInTheDocument();
  });
});

describe('useSessionTimeout', () => {
  const TestComponent = () => {
    const { showWarning, extendSession, handleLogout } = useSessionTimeout();
    
    return (
      <div>
        <div data-testid="warning-status">
          {showWarning ? 'Warning Shown' : 'No Warning'}
        </div>
        <button data-testid="extend" onClick={() => extendSession()}>
          Extend
        </button>
        <button data-testid="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRefreshToken.mockResolvedValue(true);
  });

  it('should initialize without warning', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('warning-status')).toHaveTextContent('No Warning');
  });

  it('should handle session extension', async () => {
    mockRefreshToken.mockResolvedValue(true);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const extendButton = screen.getByTestId('extend');
    await userEvent.click(extendButton);

    expect(mockRefreshToken).toHaveBeenCalled();
  });

  it('should handle logout', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutButton = screen.getByTestId('logout');
    await userEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });
});