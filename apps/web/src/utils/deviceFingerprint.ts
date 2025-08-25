/**
 * Device fingerprinting utility for trusted device detection
 * Creates a unique identifier for the current browser/device combination
 */

interface DeviceInfo {
  userAgent: string;
  language: string;
  platform: string;
  screenResolution: string;
  timezone: string;
  cookieEnabled: boolean;
  localStorage: boolean;
}

/**
 * Generate a device fingerprint hash
 * Uses non-intrusive browser information to create a unique identifier
 */
export function generateDeviceFingerprint(): string {
  try {
    const deviceInfo: DeviceInfo = {
      userAgent: navigator.userAgent || '',
      language: navigator.language || '',
      platform: navigator.platform || '',
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      cookieEnabled: navigator.cookieEnabled,
      localStorage: typeof Storage !== 'undefined',
    };

    // Create a hash of the device info
    const deviceString = JSON.stringify(deviceInfo);
    return btoa(deviceString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  } catch (error) {
    console.warn('Failed to generate device fingerprint:', error);
    // Fallback to timestamp-based ID if fingerprinting fails
    return `fallback_${Date.now().toString(36)}`;
  }
}

/**
 * Store device fingerprint in localStorage
 */
export function storeDeviceFingerprint(fingerprint: string): void {
  try {
    localStorage.setItem('device_fingerprint', fingerprint);
    localStorage.setItem('device_registered_at', new Date().toISOString());
  } catch (error) {
    console.warn('Failed to store device fingerprint:', error);
  }
}

/**
 * Get stored device fingerprint
 */
export function getStoredDeviceFingerprint(): string | null {
  try {
    return localStorage.getItem('device_fingerprint');
  } catch (error) {
    return null;
  }
}

/**
 * Check if current device matches stored fingerprint
 */
export function isDeviceTrusted(): boolean {
  const stored = getStoredDeviceFingerprint();
  if (!stored) return false;

  const current = generateDeviceFingerprint();
  return stored === current;
}

/**
 * Clear device trust data
 */
export function clearDeviceTrust(): void {
  try {
    localStorage.removeItem('device_fingerprint');
    localStorage.removeItem('device_registered_at');
    localStorage.removeItem('remember_me_enabled');
  } catch (error) {
    console.warn('Failed to clear device trust data:', error);
  }
}

/**
 * Set remember me preference
 */
export function setRememberMeEnabled(enabled: boolean): void {
  try {
    if (enabled) {
      const fingerprint = generateDeviceFingerprint();
      storeDeviceFingerprint(fingerprint);
      localStorage.setItem('remember_me_enabled', 'true');
    } else {
      clearDeviceTrust();
    }
  } catch (error) {
    console.warn('Failed to set remember me preference:', error);
  }
}

/**
 * Check if remember me is enabled for this device
 */
export function isRememberMeEnabled(): boolean {
  try {
    const enabled = localStorage.getItem('remember_me_enabled') === 'true';
    return enabled && isDeviceTrusted();
  } catch (error) {
    return false;
  }
}

/**
 * Get device registration date
 */
export function getDeviceRegistrationDate(): Date | null {
  try {
    const dateString = localStorage.getItem('device_registered_at');
    return dateString ? new Date(dateString) : null;
  } catch (error) {
    return null;
  }
}

/**
 * Check if device trust has expired (after 30 days)
 */
export function isDeviceTrustExpired(): boolean {
  const registrationDate = getDeviceRegistrationDate();
  if (!registrationDate) return true;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return registrationDate < thirtyDaysAgo;
}