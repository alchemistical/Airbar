/**
 * Optimized React Query Hook
 * Advanced caching, prefetching, and performance optimizations
 */

import { useQuery, useInfiniteQuery, useQueryClient, type UseQueryOptions, type UseInfiniteQueryOptions } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Enhanced query options
interface OptimizedQueryOptions<TData, TError = Error> extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {
  // Core options
  queryKey: unknown[];
  queryFn: () => Promise<TData>;
  
  // Performance options
  prefetchOnMount?: boolean;
  prefetchOnWindowFocus?: boolean;
  backgroundRefetch?: boolean;
  optimisticUpdates?: boolean;
  
  // Caching strategy
  cacheTime?: number;
  staleTime?: number;
  maxAge?: number;
  
  // Error handling
  retryOnMount?: boolean;
  retryDelay?: (attemptIndex: number) => number;
  
  // Advanced features
  deduplicate?: boolean;
  keepPreviousData?: boolean;
  suspense?: boolean;
}

// Infinite query options
interface OptimizedInfiniteQueryOptions<TData, TError = Error, TPageParam = unknown> 
  extends Omit<UseInfiniteQueryOptions<TData, TError, TData, TPageParam>, 'queryKey' | 'queryFn'> {
  queryKey: unknown[];
  queryFn: (context: { pageParam: TPageParam }) => Promise<TData>;
  
  // Virtualization support
  estimatedItemSize?: number;
  overscan?: number;
  
  // Auto-loading
  autoLoad?: boolean;
  loadingThreshold?: number;
}

// Performance monitoring
interface QueryMetrics {
  fetchTime: number;
  cacheHit: boolean;
  retryCount: number;
  backgroundFetch: boolean;
}

// Cache strategies
type CacheStrategy = 
  | 'cache-first'    // Use cache, fallback to network
  | 'network-first'  // Use network, fallback to cache
  | 'cache-only'     // Only use cache
  | 'network-only'   // Only use network
  | 'stale-while-revalidate'; // Return stale data while fetching fresh

// Optimized query hook
export function useOptimizedQuery<TData, TError = Error>(
  options: OptimizedQueryOptions<TData, TError>
) {
  const queryClient = useQueryClient();
  const metricsRef = useRef<QueryMetrics>({
    fetchTime: 0,
    cacheHit: false,
    retryCount: 0,
    backgroundFetch: false,
  });

  const {
    queryKey,
    queryFn,
    prefetchOnMount = false,
    prefetchOnWindowFocus = false,
    backgroundRefetch = true,
    optimisticUpdates = false,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 0,
    maxAge,
    retryOnMount = true,
    retryDelay = (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    deduplicate = true,
    keepPreviousData = false,
    suspense = false,
    ...queryOptions
  } = options;

  // Enhanced query function with metrics
  const enhancedQueryFn = useCallback(async () => {
    const startTime = performance.now();
    
    try {
      // Check if data is in cache
      const cachedData = queryClient.getQueryData(queryKey);
      const cacheHit = cachedData !== undefined;
      
      metricsRef.current.cacheHit = cacheHit;
      
      const data = await queryFn();
      
      const fetchTime = performance.now() - startTime;
      metricsRef.current.fetchTime = fetchTime;
      
      // Track performance
      if (typeof gtag !== 'undefined') {
        gtag('event', 'query_performance', {
          query_key: JSON.stringify(queryKey),
          fetch_time: fetchTime,
          cache_hit: cacheHit,
        });
      }
      
      return data;
    } catch (error) {
      metricsRef.current.retryCount++;
      throw error;
    }
  }, [queryFn, queryKey, queryClient]);

  // Base query configuration
  const queryConfig = useMemo(() => ({
    queryKey,
    queryFn: enhancedQueryFn,
    cacheTime,
    staleTime,
    retry: retryOnMount ? 3 : false,
    retryDelay,
    refetchOnWindowFocus: prefetchOnWindowFocus,
    refetchInBackground: backgroundRefetch,
    keepPreviousData,
    suspense,
    ...queryOptions,
  }), [
    queryKey,
    enhancedQueryFn,
    cacheTime,
    staleTime,
    retryOnMount,
    retryDelay,
    prefetchOnWindowFocus,
    backgroundRefetch,
    keepPreviousData,
    suspense,
    queryOptions,
  ]);

  const query = useQuery(queryConfig);

  // Prefetch on mount if enabled
  useEffect(() => {
    if (prefetchOnMount && !query.data) {
      queryClient.prefetchQuery(queryConfig);
    }
  }, [prefetchOnMount, queryConfig, queryClient, query.data]);

  // Handle max age
  useEffect(() => {
    if (!maxAge || !query.data) return;

    const timer = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey });
    }, maxAge);

    return () => clearTimeout(timer);
  }, [maxAge, query.data, queryClient, queryKey]);

  // Optimistic updates helper
  const updateOptimistically = useCallback(
    <T>(updater: (oldData: TData | undefined) => T) => {
      if (!optimisticUpdates) return;
      
      queryClient.setQueryData(queryKey, updater);
    },
    [optimisticUpdates, queryClient, queryKey]
  );

  // Prefetch related queries
  const prefetchRelated = useCallback(
    (relatedQueries: Array<{ queryKey: unknown[]; queryFn: () => Promise<any> }>) => {
      relatedQueries.forEach(({ queryKey: relatedKey, queryFn: relatedFn }) => {
        queryClient.prefetchQuery({ queryKey: relatedKey, queryFn: relatedFn });
      });
    },
    [queryClient]
  );

  return {
    ...query,
    metrics: metricsRef.current,
    updateOptimistically,
    prefetchRelated,
    
    // Advanced helpers
    invalidate: () => queryClient.invalidateQueries({ queryKey }),
    reset: () => queryClient.resetQueries({ queryKey }),
    remove: () => queryClient.removeQueries({ queryKey }),
  };
}

// Optimized infinite query hook
export function useOptimizedInfiniteQuery<TData, TError = Error, TPageParam = unknown>(
  options: OptimizedInfiniteQueryOptions<TData, TError, TPageParam>
) {
  const {
    queryKey,
    queryFn,
    getNextPageParam,
    estimatedItemSize = 50,
    overscan = 5,
    autoLoad = false,
    loadingThreshold = 300,
    ...queryOptions
  } = options;

  const query = useInfiniteQuery({
    queryKey,
    queryFn,
    getNextPageParam,
    ...queryOptions,
  });

  // Auto-loading with intersection observer
  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: `${loadingThreshold}px`,
  });

  // Auto-load next page when approaching end
  useEffect(() => {
    if (
      autoLoad &&
      isIntersecting &&
      query.hasNextPage &&
      !query.isFetchingNextPage
    ) {
      query.fetchNextPage();
    }
  }, [autoLoad, isIntersecting, query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  // Flatten pages for virtualization
  const allItems = useMemo(() => {
    return query.data?.pages.flatMap((page: any) => 
      Array.isArray(page) ? page : page.items || []
    ) || [];
  }, [query.data?.pages]);

  return {
    ...query,
    allItems,
    loadMoreRef,
    
    // Virtualization helpers
    estimatedItemSize,
    totalCount: allItems.length,
    
    // Performance helpers
    prefetchNextPage: () => {
      if (query.hasNextPage && !query.isFetchingNextPage) {
        query.fetchNextPage();
      }
    },
  };
}

// Cache management hook
export function useCacheManager() {
  const queryClient = useQueryClient();

  const clearCache = useCallback(
    (queryKey?: unknown[]) => {
      if (queryKey) {
        queryClient.removeQueries({ queryKey });
      } else {
        queryClient.clear();
      }
    },
    [queryClient]
  );

  const getCacheSize = useCallback(() => {
    const cache = queryClient.getQueryCache();
    return cache.getAll().length;
  }, [queryClient]);

  const optimizeCache = useCallback(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    
    // Remove stale queries
    const staleQueries = queries.filter(query => {
      const timeSinceLastFetch = Date.now() - (query.state.dataUpdatedAt || 0);
      return timeSinceLastFetch > 10 * 60 * 1000; // 10 minutes
    });
    
    staleQueries.forEach(query => {
      queryClient.removeQueries({ queryKey: query.queryKey });
    });
    
    return {
      removed: staleQueries.length,
      remaining: queries.length - staleQueries.length,
    };
  }, [queryClient]);

  const warmupCache = useCallback(
    async (queries: Array<{ queryKey: unknown[]; queryFn: () => Promise<any> }>) => {
      const promises = queries.map(({ queryKey, queryFn }) =>
        queryClient.prefetchQuery({ queryKey, queryFn })
      );
      
      await Promise.allSettled(promises);
    },
    [queryClient]
  );

  return {
    clearCache,
    getCacheSize,
    optimizeCache,
    warmupCache,
  };
}

// Query performance monitor
export function useQueryPerformance() {
  const [metrics, setMetrics] = useState<{
    totalQueries: number;
    cacheHitRate: number;
    averageFetchTime: number;
    slowQueries: Array<{ queryKey: unknown[]; fetchTime: number }>;
  }>({
    totalQueries: 0,
    cacheHitRate: 0,
    averageFetchTime: 0,
    slowQueries: [],
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    
    let totalQueries = 0;
    let cacheHits = 0;
    let totalFetchTime = 0;
    let fetchCount = 0;
    const slowQueries: Array<{ queryKey: unknown[]; fetchTime: number }> = [];

    queries.forEach(query => {
      totalQueries++;
      
      // Simulate cache hit detection
      const timeSinceLastFetch = Date.now() - (query.state.dataUpdatedAt || 0);
      if (timeSinceLastFetch < 1000) {
        cacheHits++;
      }
      
      // Track fetch times (would need custom implementation in real usage)
      const estimatedFetchTime = Math.random() * 1000; // Placeholder
      totalFetchTime += estimatedFetchTime;
      fetchCount++;
      
      if (estimatedFetchTime > 2000) {
        slowQueries.push({
          queryKey: query.queryKey,
          fetchTime: estimatedFetchTime,
        });
      }
    });

    setMetrics({
      totalQueries,
      cacheHitRate: totalQueries > 0 ? (cacheHits / totalQueries) * 100 : 0,
      averageFetchTime: fetchCount > 0 ? totalFetchTime / fetchCount : 0,
      slowQueries,
    });
  }, [queryClient]);

  return metrics;
}

// Intersection observer hook for auto-loading
function useIntersectionObserver({
  threshold = 0,
  rootMargin = '0px',
}: {
  threshold?: number;
  rootMargin?: string;
}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return {
    ref: targetRef,
    isIntersecting,
  };
}