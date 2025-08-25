/**
 * Unit tests for device fingerprinting utilities
 * Tests device identification and remember me functionality
 */

import {
  generateDeviceFingerprint,
  storeDeviceFingerprint,
  getStoredDeviceFingerprint,
  isDeviceTrusted,
  clearDeviceTrust,
  setRememberMeEnabled,
  isRememberMeEnabled,
  getDeviceRegistrationDate,
  isDeviceTrustExpired,
} from '../../../apps/web/src/utils/deviceFingerprint';

// Mock browser APIs
const mockNavigator = {
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  language: 'en-US',
  platform: 'MacIntel',
  cookieEnabled: true,
};

const mockScreen = {
  width: 1920,
  height: 1080,
};

const mockIntl = {
  DateTimeFormat: () => ({
    resolvedOptions: () => ({ timeZone: 'America/New_York' }),
  }),
};

Object.defineProperty(global, 'navigator', {
  value: mockNavigator,
  writable: true,
});

Object.defineProperty(global, 'screen', {
  value: mockScreen,
  writable: true,
});

Object.defineProperty(global, 'Intl', {
  value: mockIntl,
  writable: true,
});

Object.defineProperty(global, 'btoa', {
  value: (str: string) => Buffer.from(str).toString('base64'),
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('deviceFingerprint utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  describe('generateDeviceFingerprint', () => {
    it('should generate a consistent fingerprint', () => {
      const fingerprint1 = generateDeviceFingerprint();
      const fingerprint2 = generateDeviceFingerprint();

      expect(fingerprint1).toBe(fingerprint2);
      expect(fingerprint1).toHaveLength(32);
      expect(fingerprint1).toMatch(/^[a-zA-Z0-9]+$/);
    });

    it('should generate different fingerprints for different environments', () => {
      const fingerprint1 = generateDeviceFingerprint();

      // Change a property
      (global.navigator as any).userAgent = 'Different User Agent';
      const fingerprint2 = generateDeviceFingerprint();

      expect(fingerprint1).not.toBe(fingerprint2);

      // Restore original
      (global.navigator as any).userAgent = mockNavigator.userAgent;
    });

    it('should handle errors gracefully with fallback', () => {
      // Mock JSON.stringify to throw
      const originalStringify = JSON.stringify;
      JSON.stringify = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });

      const fingerprint = generateDeviceFingerprint();

      expect(fingerprint).toMatch(/^fallback_/);
      expect(fingerprint.length).toBeGreaterThan(10);

      // Restore
      JSON.stringify = originalStringify;
    });
  });

  describe('storeDeviceFingerprint', () => {
    it('should store fingerprint and timestamp', () => {
      const testFingerprint = 'test-fingerprint-123';
      
      storeDeviceFingerprint(testFingerprint);

      expect(localStorageMock.setItem).toHaveBeenCalledWith('device_fingerprint', testFingerprint);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'device_registered_at',
        expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
      );
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      expect(() => storeDeviceFingerprint('test')).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to store device fingerprint:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('getStoredDeviceFingerprint', () => {
    it('should retrieve stored fingerprint', () => {
      localStorageMock.getItem.mockReturnValue('stored-fingerprint');

      const result = getStoredDeviceFingerprint();

      expect(result).toBe('stored-fingerprint');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('device_fingerprint');
    });

    it('should return null if not stored', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getStoredDeviceFingerprint();

      expect(result).toBeNull();
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = getStoredDeviceFingerprint();

      expect(result).toBeNull();
    });
  });

  describe('isDeviceTrusted', () => {
    it('should return true for matching fingerprints', () => {
      const fingerprint = generateDeviceFingerprint();
      localStorageMock.getItem.mockReturnValue(fingerprint);

      const result = isDeviceTrusted();

      expect(result).toBe(true);
    });

    it('should return false for non-matching fingerprints', () => {
      localStorageMock.getItem.mockReturnValue('different-fingerprint');

      const result = isDeviceTrusted();

      expect(result).toBe(false);
    });

    it('should return false if no stored fingerprint', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = isDeviceTrusted();

      expect(result).toBe(false);
    });
  });

  describe('clearDeviceTrust', () => {
    it('should remove all trust-related data', () => {
      clearDeviceTrust();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('device_fingerprint');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('device_registered_at');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('remember_me_enabled');
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      expect(() => clearDeviceTrust()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('setRememberMeEnabled', () => {
    it('should enable remember me and store fingerprint', () => {
      setRememberMeEnabled(true);

      expect(localStorageMock.setItem).toHaveBeenCalledWith('device_fingerprint', expect.any(String));
      expect(localStorageMock.setItem).toHaveBeenCalledWith('device_registered_at', expect.any(String));
      expect(localStorageMock.setItem).toHaveBeenCalledWith('remember_me_enabled', 'true');
    });

    it('should disable remember me and clear trust', () => {
      setRememberMeEnabled(false);

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('device_fingerprint');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('device_registered_at');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('remember_me_enabled');
    });
  });

  describe('isRememberMeEnabled', () => {
    it('should return true when enabled and device is trusted', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'remember_me_enabled') return 'true';
        if (key === 'device_fingerprint') return generateDeviceFingerprint();
        return null;
      });

      const result = isRememberMeEnabled();

      expect(result).toBe(true);
    });

    it('should return false when not enabled', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'remember_me_enabled') return 'false';
        return null;
      });

      const result = isRememberMeEnabled();

      expect(result).toBe(false);
    });

    it('should return false when device is not trusted', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'remember_me_enabled') return 'true';
        if (key === 'device_fingerprint') return 'different-fingerprint';
        return null;
      });

      const result = isRememberMeEnabled();

      expect(result).toBe(false);
    });
  });

  describe('getDeviceRegistrationDate', () => {
    it('should return valid date when stored', () => {
      const testDate = new Date('2024-01-01T12:00:00.000Z');
      localStorageMock.getItem.mockReturnValue(testDate.toISOString());

      const result = getDeviceRegistrationDate();

      expect(result).toEqual(testDate);
    });

    it('should return null when not stored', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getDeviceRegistrationDate();

      expect(result).toBeNull();
    });

    it('should handle invalid date strings', () => {
      localStorageMock.getItem.mockReturnValue('invalid-date');

      const result = getDeviceRegistrationDate();

      expect(result).toBeInstanceOf(Date);
      expect(isNaN(result!.getTime())).toBe(true);
    });
  });

  describe('isDeviceTrustExpired', () => {
    it('should return false for recent registration', () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 15); // 15 days ago
      
      localStorageMock.getItem.mockReturnValue(recentDate.toISOString());

      const result = isDeviceTrustExpired();

      expect(result).toBe(false);
    });

    it('should return true for old registration', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 35); // 35 days ago
      
      localStorageMock.getItem.mockReturnValue(oldDate.toISOString());

      const result = isDeviceTrustExpired();

      expect(result).toBe(true);
    });

    it('should return true when no registration date', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = isDeviceTrustExpired();

      expect(result).toBe(true);
    });

    it('should handle exactly 30 days', () => {
      const exactDate = new Date();
      exactDate.setDate(exactDate.getDate() - 30); // Exactly 30 days ago
      
      localStorageMock.getItem.mockReturnValue(exactDate.toISOString());

      const result = isDeviceTrustExpired();

      expect(result).toBe(false);
    });
  });
});