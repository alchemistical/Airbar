/**
 * PWA (Progressive Web App) Hook
 * Silicon Valley-grade PWA functionality with advanced features
 */

import { useState, useEffect, useCallback } from 'react';

// Service Worker registration
interface ServiceWorkerRegistration {
  installing: ServiceWorker | null;
  waiting: ServiceWorker | null;
  active: ServiceWorker | null;
  scope: string;
  update: () => Promise<void>;
  unregister: () => Promise<boolean>;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
}

// Install prompt event interface
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// PWA hook return type
interface UsePWAReturn {
  // Installation
  canInstall: boolean;
  isInstalled: boolean;
  installApp: () => Promise<void>;
  
  // Service Worker
  isOnline: boolean;
  swRegistration: ServiceWorkerRegistration | null;
  hasUpdate: boolean;
  updateApp: () => Promise<void>;
  
  // Share API
  canShare: boolean;
  shareContent: (data: ShareData) => Promise<void>;
  
  // Permissions
  notificationPermission: NotificationPermission;
  requestNotifications: () => Promise<NotificationPermission>;
  
  // App state
  isStandalone: boolean;
  displayMode: 'browser' | 'standalone' | 'minimal-ui' | 'fullscreen';
}

declare global {
  interface Window {
    BeforeInstallPromptEvent: BeforeInstallPromptEvent;
  }
}

export function usePWA(): UsePWAReturn {
  // Installation state
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  
  // Service Worker state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swRegistration, setSWRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [hasUpdate, setHasUpdate] = useState(false);
  
  // Share API state
  const [canShare] = useState(!!navigator.share);
  
  // Notification state
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  
  // App display mode detection
  const [displayMode, setDisplayMode] = useState<'browser' | 'standalone' | 'minimal-ui' | 'fullscreen'>('browser');
  const [isStandalone, setIsStandalone] = useState(false);

  // Detect display mode
  useEffect(() => {
    const detectDisplayMode = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setDisplayMode('standalone');
        setIsStandalone(true);
        setIsInstalled(true);
      } else if (window.matchMedia('(display-mode: minimal-ui)').matches) {
        setDisplayMode('minimal-ui');
      } else if (window.matchMedia('(display-mode: fullscreen)').matches) {
        setDisplayMode('fullscreen');
      } else {
        setDisplayMode('browser');
      }
    };

    detectDisplayMode();
    
    // Listen for display mode changes
    const mediaQueries = [
      '(display-mode: standalone)',
      '(display-mode: minimal-ui)', 
      '(display-mode: fullscreen)'
    ];
    
    const listeners = mediaQueries.map(query => {
      const mq = window.matchMedia(query);
      const listener = () => detectDisplayMode();
      mq.addEventListener('change', listener);
      return { mq, listener };
    });
    
    return () => {
      listeners.forEach(({ mq, listener }) => {
        mq.removeEventListener('change', listener);
      });
    };
  }, []);

  // Online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Install prompt handling
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setInstallPrompt(null);
      
      // Track installation
      if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_install', {
          method: 'browser_prompt'
        });
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Service Worker registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          setSWRegistration(registration as unknown as ServiceWorkerRegistration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setHasUpdate(true);
                }
              });
            }
          });
          
          // Check for waiting service worker
          if (registration.waiting) {
            setHasUpdate(true);
          }
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  // Install app function
  const installApp = useCallback(async () => {
    if (!installPrompt) return;
    
    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setCanInstall(false);
        
        // Track successful installation
        if (typeof gtag !== 'undefined') {
          gtag('event', 'pwa_install_accepted');
        }
      } else {
        // Track installation dismissal
        if (typeof gtag !== 'undefined') {
          gtag('event', 'pwa_install_dismissed');
        }
      }
      
      setInstallPrompt(null);
    } catch (error) {
      console.error('App installation failed:', error);
    }
  }, [installPrompt]);

  // Update app function
  const updateApp = useCallback(async () => {
    if (!swRegistration || !swRegistration.waiting) return;
    
    try {
      // Send message to waiting service worker to skip waiting
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload page to activate new service worker
      window.location.reload();
    } catch (error) {
      console.error('App update failed:', error);
    }
  }, [swRegistration]);

  // Share content function
  const shareContent = useCallback(async (data: ShareData) => {
    if (!navigator.share) {
      throw new Error('Web Share API not supported');
    }
    
    try {
      await navigator.share(data);
      
      // Track share events
      if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
          method: 'web_share_api',
          content_type: data.title || 'unknown'
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Share failed:', error);
      }
      throw error;
    }
  }, []);

  // Request notification permissions
  const requestNotifications = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      return 'denied';
    }
    
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      // Track permission request
      if (typeof gtag !== 'undefined') {
        gtag('event', 'notification_permission', {
          result: permission
        });
      }
      
      return permission;
    } catch (error) {
      console.error('Notification permission request failed:', error);
      return 'denied';
    }
  }, []);

  return {
    // Installation
    canInstall,
    isInstalled,
    installApp,
    
    // Service Worker
    isOnline,
    swRegistration,
    hasUpdate,
    updateApp,
    
    // Share API
    canShare,
    shareContent,
    
    // Permissions
    notificationPermission,
    requestNotifications,
    
    // App state
    isStandalone,
    displayMode,
  };
}

// Hook for offline storage
export function useOfflineStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setStoredValue = useCallback((newValue: T | ((prev: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Failed to store value:', error);
    }
  }, [key, value]);

  return [value, setStoredValue] as const;
}

// Hook for app shortcuts
export function useAppShortcuts() {
  const createShortcut = useCallback((action: string, data?: any) => {
    if ('shortcuts' in navigator) {
      // Future API - not yet implemented in browsers
      console.log('Creating shortcut:', action, data);
    }
  }, []);

  return { createShortcut };
}

// Hook for badge API
export function useBadge() {
  const [badgeCount, setBadgeCount] = useState(0);

  const updateBadge = useCallback((count: number) => {
    setBadgeCount(count);
    
    if ('setAppBadge' in navigator) {
      if (count > 0) {
        (navigator as any).setAppBadge(count);
      } else {
        (navigator as any).clearAppBadge();
      }
    }
  }, []);

  const clearBadge = useCallback(() => {
    setBadgeCount(0);
    if ('clearAppBadge' in navigator) {
      (navigator as any).clearAppBadge();
    }
  }, []);

  return {
    badgeCount,
    updateBadge,
    clearBadge,
  };
}