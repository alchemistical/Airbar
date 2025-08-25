/**
 * Bundle Optimization Utilities - Silicon Valley Grade
 * Advanced code splitting, preloading, and performance optimization
 * Epic 4: Enhanced Dashboard & Silicon Valley Integration
 */

import React, { Suspense, ComponentType, lazy, LazyExoticComponent } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

/**
 * Enhanced lazy loading with preload capabilities
 */
export interface LazyComponentOptions {
  fallback?: React.ComponentType;
  preload?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

/**
 * Create a lazy component with enhanced loading capabilities
 */
export function createLazyComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
): LazyExoticComponent<T> {
  const LazyComponent = lazy(factory);
  
  // Add preload capability
  if (options.preload) {
    // Preload after a short delay to avoid blocking initial render
    setTimeout(() => {
      factory().catch(() => {
        // Ignore preload errors, component will load when actually needed
      });
    }, options.priority === 'high' ? 100 : options.priority === 'medium' ? 1000 : 3000);
  }
  
  return LazyComponent;
}

/**
 * Enhanced suspense wrapper with better loading states
 */
export interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  error?: React.ComponentType<{ error: Error; retry: () => void }>;
  minDelay?: number;
}

export function SuspenseWrapper({ 
  children, 
  fallback: Fallback = LoadingSpinner,
  minDelay = 200 
}: SuspenseWrapperProps) {
  const [showFallback, setShowFallback] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowFallback(true);
    }, minDelay);
    
    return () => clearTimeout(timer);
  }, [minDelay]);
  
  return (
    <Suspense 
      fallback={
        showFallback ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Fallback />
          </div>
        ) : (
          <div className="min-h-[200px]" />
        )
      }
    >
      {children}
    </Suspense>
  );
}

/**
 * Route-based code splitting with intelligent preloading
 */
export class RoutePreloader {
  private static preloadedRoutes = new Set<string>();
  private static preloadPromises = new Map<string, Promise<any>>();
  
  /**
   * Preload a route component
   */
  static preload(routePath: string, factory: () => Promise<any>) {
    if (this.preloadedRoutes.has(routePath)) {
      return this.preloadPromises.get(routePath);
    }
    
    const promise = factory().catch(() => {
      // Remove from cache on error so it can be retried
      this.preloadedRoutes.delete(routePath);
      this.preloadPromises.delete(routePath);
    });
    
    this.preloadedRoutes.add(routePath);
    this.preloadPromises.set(routePath, promise);
    
    return promise;
  }
  
  /**
   * Preload routes based on user navigation patterns
   */
  static intelligentPreload() {
    const currentPath = window.location.pathname;
    
    // Preload common next routes based on current location
    const preloadMap: Record<string, string[]> = {
      '/': ['/send-package', '/dashboard', '/add-trip'],
      '/dashboard': ['/send-package', '/add-trip', '/matches'],
      '/send-package': ['/dashboard', '/checkout'],
      '/add-trip': ['/dashboard', '/matches'],
      '/matches': ['/dashboard', '/match-requests']
    };
    
    const routesToPreload = preloadMap[currentPath] || [];
    
    routesToPreload.forEach(route => {
      // This would be connected to your actual route factories
      console.log(`Preloading route: ${route}`);
    });
  }
}

/**
 * Component for intersection-based lazy loading
 */
export interface LazyLoadOnScrollProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  fallback?: React.ComponentType;
  once?: boolean;
}

export function LazyLoadOnScroll({ 
  children, 
  threshold = 0.1,
  rootMargin = '50px',
  fallback: Fallback = () => <div className="h-32 bg-gray-100 animate-pulse rounded" />,
  once = true
}: LazyLoadOnScrollProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
          
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);
  
  return (
    <div ref={ref}>
      {(once ? hasLoaded : isVisible) ? children : <Fallback />}
    </div>
  );
}

/**
 * Bundle size tracker for development
 */
export class BundleTracker {
  private static chunks = new Map<string, number>();
  
  static trackChunk(name: string, size: number) {
    this.chunks.set(name, size);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📦 Chunk loaded: ${name} (${(size / 1024).toFixed(2)}KB)`);
      this.logBundleStats();
    }
  }
  
  private static logBundleStats() {
    const totalSize = Array.from(this.chunks.values()).reduce((sum, size) => sum + size, 0);
    const chunkCount = this.chunks.size;
    
    console.log(`📊 Total chunks: ${chunkCount}, Total size: ${(totalSize / 1024).toFixed(2)}KB`);
  }
  
  static getBundleStats() {
    const totalSize = Array.from(this.chunks.values()).reduce((sum, size) => sum + size, 0);
    return {
      chunkCount: this.chunks.size,
      totalSize,
      chunks: Array.from(this.chunks.entries()).map(([name, size]) => ({
        name,
        size,
        sizeKB: (size / 1024).toFixed(2)
      }))
    };
  }
}

/**
 * Performance monitoring for component loading
 */
export function withLoadingPerformance<P extends object>(
  Component: ComponentType<P>,
  componentName: string
) {
  return React.forwardRef<any, P>((props, ref) => {
    React.useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`⚡ Component ${componentName} render time: ${loadTime.toFixed(2)}ms`);
        }
        
        // Track loading performance
        if ('performance' in window && 'measure' in window.performance) {
          try {
            window.performance.measure(
              `component-${componentName}`, 
              `component-${componentName}-start`
            );
          } catch (e) {
            // Ignore measurement errors
          }
        }
      };
    }, []);
    
    return <Component {...props} ref={ref} />;
  });
}

/**
 * Hook for detecting slow connections
 */
export function useConnectionQuality() {
  const [connectionQuality, setConnectionQuality] = React.useState<'slow' | 'fast'>('fast');
  
  React.useEffect(() => {
    // Check connection if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateConnection = () => {
        const effectiveType = connection.effectiveType;
        setConnectionQuality(
          effectiveType === '2g' || effectiveType === 'slow-2g' ? 'slow' : 'fast'
        );
      };
      
      updateConnection();
      connection.addEventListener('change', updateConnection);
      
      return () => connection.removeEventListener('change', updateConnection);
    }
  }, []);
  
  return connectionQuality;
}

/**
 * Smart component that adapts loading strategy based on connection
 */
export interface AdaptiveLoadingProps {
  children: React.ReactNode;
  slowConnectionFallback?: React.ComponentType;
  fastConnectionComponent?: React.ComponentType;
}

export function AdaptiveLoading({ 
  children, 
  slowConnectionFallback: SlowFallback = () => <div>Loading...</div>,
  fastConnectionComponent: FastComponent = ({ children }) => <>{children}</>
}: AdaptiveLoadingProps) {
  const connectionQuality = useConnectionQuality();
  
  if (connectionQuality === 'slow') {
    return <SlowFallback />;
  }
  
  return <FastComponent>{children}</FastComponent>;
}