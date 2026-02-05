/**
 * Datadog APM Integration
 *
 * Provides application performance monitoring with Datadog.
 * Gracefully degrades if DATADOG_API_KEY is not configured.
 */

const isCloudflareRuntime =
  typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";
const hasProcessEnv = typeof process !== "undefined" && typeof process.env !== "undefined";
const processEnv = hasProcessEnv ? process.env : undefined;

const isConfigured = !isCloudflareRuntime && !!processEnv?.DATADOG_API_KEY;
const shouldWarnMissing = processEnv?.NODE_ENV === "production";

if (!isConfigured && shouldWarnMissing && !isCloudflareRuntime) {
  console.warn("DATADOG_API_KEY not set - APM disabled");
}

type Tracer = typeof import("dd-trace");

let tracerModule: Tracer | null = null;
let tracerPromise: Promise<Tracer> | null = null;

const loadTracer = async (): Promise<Tracer> => {
  if (!tracerPromise) {
    tracerPromise = (async () => {
      const resolved = (await import("dd-trace")) as unknown;
      const tracer =
        (resolved as { default?: Tracer }).default ?? (resolved as Tracer);
      return tracer;
    })();
  }

  tracerModule = await tracerPromise;
  return tracerModule;
};

/**
 * Initialize Datadog APM
 * Call this early in your application startup
 */
export function initDatadog() {
  if (!isConfigured) return;

  void loadTracer().then((tracer) => {
    tracer.init({
      service: processEnv?.DATADOG_SERVICE_NAME || "invoicing-api",
      env: processEnv?.DATADOG_ENV || processEnv?.NODE_ENV || "development",
      version: processEnv?.DATADOG_VERSION || "1.0.0",
      logInjection: true,
      runtimeMetrics: true,
      profiling: true,
      appsec: true,
    });

    tracer.use("http", {
      enabled: true,
      blocklist: ["/health", "/metrics"],
    });
    tracer.use("fetch", { enabled: true });
  });
}

/**
 * Create a span for tracing
 */
export function createSpan<T>(
  name: string,
  operation: string,
  callback: () => T | Promise<T>
): T | Promise<T> {
  if (!isConfigured || !tracerModule) {
    return callback();
  }

  return tracerModule.trace(name, { type: operation }, callback);
}

/**
 * Add tags to current span
 */
export function addTags(tags: Record<string, string | number | boolean>): void {
  if (!isConfigured || !tracerModule) return;
  const span = tracerModule.scope().active();
  if (!span) return;
  Object.entries(tags).forEach(([key, value]) => {
    span.setTag(key, value);
  });
}

/**
 * Set error on current span
 */
export function setError(error: Error): void {
  if (!isConfigured || !tracerModule) return;
  const span = tracerModule.scope().active();
  if (!span) return;
  span.setTag("error", error);
}

export { tracerModule as tracer };
