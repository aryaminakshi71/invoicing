/**
 * Code Splitting Example
 * 
 * Demonstrates lazy loading heavy components for better performance.
 */

import { Loader2 } from 'lucide-react';
import { lazy, Suspense } from 'react';

// Lazy load heavy components
export const InvoiceEditor = lazy(() => import('./InvoiceEditor').catch(() => ({
  default: () => <div>Failed to load invoice editor</div>
})));

export const ReportsDashboard = lazy(() => import('./ReportsDashboard').catch(() => ({
  default: () => <div>Failed to load reports</div>
})));

export const PDFViewer = lazy(() => import('./PDFViewer').catch(() => ({
  default: () => <div>Failed to load PDF viewer</div>
})));

/**
 * Loading fallback component
 */
function LoadingFallback({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[200px]" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
    </div>
  );
}

/**
 * Lazy component wrapper with custom fallback
 */
export function LazyComponent({
  component: Component,
  fallback,
  ...props
}: {
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  fallback?: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <Suspense fallback={fallback || <LoadingFallback />}>
      <Component {...props} />
    </Suspense>
  );
}

/**
 * Example usage in route:
 * 
 * import { LazyComponent, InvoiceEditor } from '@/components/code-splitting';
 * 
 * function InvoicePage() {
 *   return (
 *     <LazyComponent 
 *       component={InvoiceEditor} 
 *       fallback={<LoadingFallback message="Loading invoice editor..." />}
 *       invoiceId={123}
 *     />
 *   );
 * }
 */

// Preload on hover for better UX
export function usePreloadOnHover(importFn: () => Promise<any>) {
  const handleMouseEnter = () => {
    importFn();
  };

  return { onMouseEnter: handleMouseEnter };
}

/**
 * Example: Preload heavy route on link hover
 * 
 * <Link to="/heavy-route" {...usePreloadOnHover(() => import('./HeavyComponent'))}>
 *   Go to Heavy Route
 * </Link>
 */
