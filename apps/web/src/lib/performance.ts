/**
 * Performance Utilities
 * 
 * Hooks and utilities for optimizing performance.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Lazy load images with intersection observer
 */
export function useLazyLoad<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, isVisible };
}

/**
 * Debounce hook for expensive operations
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle hook for frequent events
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T {
  const lastRan = useRef(Date.now());

  return useCallback(
    ((...args: any[]) => {
      if (Date.now() - lastRan.current >= delay) {
        callback(...args);
        lastRan.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Hook to detect if element is in viewport
 */
export function useInViewport<T extends HTMLElement>(
  threshold: number = 0.1
) {
  const ref = useRef<T>(null);
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return { ref, isInViewport };
}

/**
 * Measure component render performance
 */
export function usePerformanceMetrics(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = performance.now() - startTime.current;

    if (import.meta.env.DEV) {
      console.log(
        `[Performance] ${componentName} rendered ${renderCount.current} times. Last render took ${renderTime.toFixed(2)}ms`
      );
    }

    startTime.current = performance.now();
  });

  return {
    renderCount: renderCount.current,
  };
}

/**
 * Memoize expensive calculations
 */
export function useMemoizedValue<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  const ref = useRef<{ value: T; deps: React.DependencyList }>();

  if (
    !ref.current ||
    deps.some((dep, i) => dep !== ref.current!.deps[i])
  ) {
    ref.current = {
      value: factory(),
      deps,
    };
  }

  return ref.current.value;
}

/**
 * Preload route component for faster navigation
 */
export async function preloadRoute(routePath: string) {
  try {
    // This works with TanStack Router's lazy loading
    const route = await import(`../routes${routePath}.tsx`);
    return route;
  } catch (error) {
    console.warn(`Failed to preload route: ${routePath}`, error);
  }
}

/**
 * Hook for infinite scroll/pagination
 */
export function useInfiniteScroll(
  callback: () => void,
  hasMore: boolean = true
) {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        callback();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [callback, hasMore]);

  return loaderRef;
}

/**
 * Web Vitals reporting
 */
export function reportWebVitals(metric: {
  name: string;
  value: number;
  id: string;
}) {
  if (import.meta.env.DEV) {
    console.log('[Web Vitals]', metric);
  }

  // Send to analytics service
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }
}
