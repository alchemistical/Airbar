/**
 * Advanced Virtualization Hook
 * Silicon Valley-grade performance optimization for large lists
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

export interface VirtualizationOptions {
  itemHeight: number | ((index: number) => number);
  containerHeight: number;
  overscan?: number; // Items to render outside viewport
  scrollBehavior?: 'auto' | 'smooth';
  threshold?: number; // Intersection threshold for visibility
}

export interface VirtualizedItem {
  index: number;
  start: number;
  end: number;
  height: number;
}

export interface UseVirtualizationReturn {
  // Visible items
  virtualItems: VirtualizedItem[];
  totalHeight: number;
  
  // Scroll handling
  scrollElementProps: {
    ref: React.RefObject<HTMLDivElement>;
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
    style: React.CSSProperties;
  };
  
  // Item rendering
  getItemProps: (index: number) => {
    key: number;
    style: React.CSSProperties;
    'data-index': number;
  };
  
  // Scroll control
  scrollToIndex: (index: number, behavior?: 'auto' | 'smooth') => void;
  scrollToOffset: (offset: number, behavior?: 'auto' | 'smooth') => void;
  
  // State
  isScrolling: boolean;
  scrollOffset: number;
}

export function useVirtualization(
  itemCount: number,
  options: VirtualizationOptions
): UseVirtualizationReturn {
  const {
    itemHeight,
    containerHeight,
    overscan = 3,
    scrollBehavior = 'auto',
    threshold = 0,
  } = options;

  const scrollElementRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Calculate item positions
  const itemSizeCache = useRef<Map<number, number>>(new Map());
  const itemOffsetCache = useRef<Map<number, number>>(new Map());

  const getItemSize = useCallback((index: number): number => {
    if (typeof itemHeight === 'function') {
      if (!itemSizeCache.current.has(index)) {
        itemSizeCache.current.set(index, itemHeight(index));
      }
      return itemSizeCache.current.get(index)!;
    }
    return itemHeight;
  }, [itemHeight]);

  const getItemOffset = useCallback((index: number): number => {
    if (itemOffsetCache.current.has(index)) {
      return itemOffsetCache.current.get(index)!;
    }

    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += getItemSize(i);
    }

    itemOffsetCache.current.set(index, offset);
    return offset;
  }, [getItemSize]);

  // Calculate total height
  const totalHeight = useMemo(() => {
    if (itemCount === 0) return 0;
    return getItemOffset(itemCount - 1) + getItemSize(itemCount - 1);
  }, [itemCount, getItemOffset, getItemSize]);

  // Find visible range
  const visibleRange = useMemo(() => {
    if (itemCount === 0) {
      return { start: 0, end: 0 };
    }

    const viewportStart = scrollOffset;
    const viewportEnd = scrollOffset + containerHeight;

    // Binary search for start index
    let startIndex = 0;
    let endIndex = itemCount - 1;

    while (startIndex <= endIndex) {
      const midIndex = Math.floor((startIndex + endIndex) / 2);
      const midOffset = getItemOffset(midIndex);

      if (midOffset < viewportStart) {
        startIndex = midIndex + 1;
      } else {
        endIndex = midIndex - 1;
      }
    }

    // Find end index
    let start = Math.max(0, startIndex - overscan);
    let end = start;

    while (end < itemCount) {
      const itemStart = getItemOffset(end);
      if (itemStart >= viewportEnd + (getItemSize(end) * overscan)) {
        break;
      }
      end++;
    }

    end = Math.min(itemCount, end + overscan);

    return { start, end };
  }, [scrollOffset, containerHeight, itemCount, getItemOffset, getItemSize, overscan]);

  // Generate virtual items
  const virtualItems = useMemo(() => {
    const items: VirtualizedItem[] = [];
    
    for (let i = visibleRange.start; i < visibleRange.end; i++) {
      const start = getItemOffset(i);
      const height = getItemSize(i);
      
      items.push({
        index: i,
        start,
        end: start + height,
        height,
      });
    }
    
    return items;
  }, [visibleRange, getItemOffset, getItemSize]);

  // Scroll event handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollOffset(scrollTop);
    setIsScrolling(true);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set isScrolling to false after scrolling stops
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  // Scroll to index
  const scrollToIndex = useCallback(
    (index: number, behavior: 'auto' | 'smooth' = scrollBehavior) => {
      if (!scrollElementRef.current) return;

      const offset = getItemOffset(index);
      scrollElementRef.current.scrollTo({
        top: offset,
        behavior,
      });
    },
    [getItemOffset, scrollBehavior]
  );

  // Scroll to offset
  const scrollToOffset = useCallback(
    (offset: number, behavior: 'auto' | 'smooth' = scrollBehavior) => {
      if (!scrollElementRef.current) return;

      scrollElementRef.current.scrollTo({
        top: offset,
        behavior,
      });
    },
    [scrollBehavior]
  );

  // Get item props
  const getItemProps = useCallback((index: number) => {
    const start = getItemOffset(index);
    const height = getItemSize(index);

    return {
      key: index,
      'data-index': index,
      style: {
        position: 'absolute' as const,
        top: start,
        left: 0,
        right: 0,
        height,
      },
    };
  }, [getItemOffset, getItemSize]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Scroll element props
  const scrollElementProps = useMemo(() => ({
    ref: scrollElementRef,
    onScroll: handleScroll,
    style: {
      height: containerHeight,
      overflow: 'auto' as const,
      position: 'relative' as const,
    },
  }), [handleScroll, containerHeight]);

  return {
    virtualItems,
    totalHeight,
    scrollElementProps,
    getItemProps,
    scrollToIndex,
    scrollToOffset,
    isScrolling,
    scrollOffset,
  };
}

// Hook for infinite loading with virtualization
export function useInfiniteVirtualization<T>({
  items,
  hasNextPage,
  loadNextPage,
  ...virtualizationOptions
}: VirtualizationOptions & {
  items: T[];
  hasNextPage: boolean;
  loadNextPage: () => Promise<void> | void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);

  const virtualization = useVirtualization(items.length, virtualizationOptions);
  
  const { virtualItems, scrollOffset } = virtualization;

  // Load more when near the end
  useEffect(() => {
    if (loadingRef.current || !hasNextPage) return;
    
    const threshold = virtualizationOptions.containerHeight * 2; // Load when 2 screens away
    const isNearEnd = scrollOffset + virtualizationOptions.containerHeight >= 
      virtualization.totalHeight - threshold;
    
    if (isNearEnd) {
      loadingRef.current = true;
      setIsLoading(true);
      
      Promise.resolve(loadNextPage())
        .finally(() => {
          setIsLoading(false);
          loadingRef.current = false;
        });
    }
  }, [scrollOffset, hasNextPage, loadNextPage, virtualization.totalHeight, virtualizationOptions.containerHeight]);

  return {
    ...virtualization,
    items,
    isLoading,
    hasNextPage,
  };
}

// Hook for grid virtualization
export function useGridVirtualization({
  itemCount,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
  gap = 0,
  overscan = 3,
}: {
  itemCount: number;
  itemWidth: number;
  itemHeight: number;
  containerWidth: number;
  containerHeight: number;
  gap?: number;
  overscan?: number;
}) {
  const columnsCount = Math.floor((containerWidth + gap) / (itemWidth + gap));
  const rowsCount = Math.ceil(itemCount / columnsCount);
  
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const viewportStart = scrollTop;
    const viewportEnd = scrollTop + containerHeight;
    
    const startRow = Math.max(0, Math.floor(viewportStart / (itemHeight + gap)) - overscan);
    const endRow = Math.min(
      rowsCount,
      Math.ceil(viewportEnd / (itemHeight + gap)) + overscan
    );
    
    const start = startRow * columnsCount;
    const end = Math.min(itemCount, endRow * columnsCount);
    
    return { start, end, startRow, endRow };
  }, [scrollTop, containerHeight, itemHeight, gap, overscan, rowsCount, columnsCount, itemCount]);

  // Generate virtual items
  const virtualItems = useMemo(() => {
    const items: (VirtualizedItem & { column: number; row: number })[] = [];
    
    for (let i = visibleRange.start; i < visibleRange.end; i++) {
      const row = Math.floor(i / columnsCount);
      const column = i % columnsCount;
      
      const top = row * (itemHeight + gap);
      const left = column * (itemWidth + gap);
      
      items.push({
        index: i,
        start: top,
        end: top + itemHeight,
        height: itemHeight,
        row,
        column,
      });
    }
    
    return items;
  }, [visibleRange, columnsCount, itemHeight, itemWidth, gap]);

  const totalHeight = rowsCount * (itemHeight + gap) - gap;

  // Scroll handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);
    setIsScrolling(true);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  // Get item props for grid
  const getItemProps = useCallback((index: number) => {
    const row = Math.floor(index / columnsCount);
    const column = index % columnsCount;
    
    const top = row * (itemHeight + gap);
    const left = column * (itemWidth + gap);

    return {
      key: index,
      'data-index': index,
      'data-row': row,
      'data-column': column,
      style: {
        position: 'absolute' as const,
        top,
        left,
        width: itemWidth,
        height: itemHeight,
      },
    };
  }, [columnsCount, itemHeight, itemWidth, gap]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    virtualItems,
    totalHeight,
    columnsCount,
    rowsCount,
    scrollElementProps: {
      ref: scrollElementRef,
      onScroll: handleScroll,
      style: {
        height: containerHeight,
        width: containerWidth,
        overflow: 'auto' as const,
        position: 'relative' as const,
      },
    },
    getItemProps,
    isScrolling,
    scrollOffset: scrollTop,
  };
}