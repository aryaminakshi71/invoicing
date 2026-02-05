/**
 * Sentry Error Tracking
 *
 * Provides error tracking and performance monitoring.
 * Gracefully degrades if SENTRY_DSN is not configured.
 */

const isCloudflareRuntime =
  typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";
const hasProcessEnv = typeof process !== "undefined" && typeof process.env !== "undefined";
const processEnv = hasProcessEnv ? process.env : undefined;

const isConfigured = !isCloudflareRuntime && !!processEnv?.SENTRY_DSN;
const shouldWarnMissing = processEnv?.NODE_ENV === "production";

if (!isConfigured && shouldWarnMissing && !isCloudflareRuntime) {
  console.warn("SENTRY_DSN not set - Error tracking disabled");
}

type SentryModule = typeof import("@sentry/node");

let sentryModule: SentryModule | null = null;
let sentryPromise: Promise<SentryModule> | null = null;

const loadSentry = async (): Promise<SentryModule> => {
  if (!sentryPromise) {
    sentryPromise = import("@sentry/node");
  }

  sentryModule = await sentryPromise;
  return sentryModule;
};

export function initSentry() {
  if (!isConfigured) return;

  void loadSentry().then((Sentry) => {
    Sentry.init({
      dsn: processEnv?.SENTRY_DSN,
      environment: processEnv?.SENTRY_ENVIRONMENT || processEnv?.NODE_ENV || "development",
      tracesSampleRate: processEnv?.NODE_ENV === "production" ? 0.1 : 1.0,
      profilesSampleRate: processEnv?.NODE_ENV === "production" ? 0.1 : 1.0,
      integrations: [
        Sentry.httpIntegration(),
        Sentry.nativeNodeFetchIntegration(),
      ],
      beforeSend(event) {
        if (processEnv?.NODE_ENV === "development" && !processEnv?.SENTRY_DEBUG) {
          console.log("[Sentry] Would send event:", event.message || event.exception);
          return null;
        }
        return event;
      },
    });
  });
}

export function captureException(
  error: Error | unknown,
  context?: {
    user?: { id: string; email?: string };
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  },
) {
  if (!isConfigured) {
    console.error("[Error]", error);
    return;
  }

  void loadSentry().then((Sentry) => {
    Sentry.withScope((scope) => {
      if (context?.user) scope.setUser(context.user);
      if (context?.tags) {
        Object.entries(context.tags).forEach(([key, value]) => scope.setTag(key, value));
      }
      if (context?.extra) {
        Object.entries(context.extra).forEach(([key, value]) => scope.setExtra(key, value));
      }
      Sentry.captureException(error);
    });
  });
}

export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
  context?: {
    user?: { id: string; email?: string };
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  },
) {
  if (!isConfigured) {
    console.log(`[${level.toUpperCase()}]`, message);
    return;
  }

  void loadSentry().then((Sentry) => {
    Sentry.withScope((scope) => {
      scope.setLevel(level);
      if (context?.user) scope.setUser(context.user);
      if (context?.tags) {
        Object.entries(context.tags).forEach(([key, value]) => scope.setTag(key, value));
      }
      if (context?.extra) {
        Object.entries(context.extra).forEach(([key, value]) => scope.setExtra(key, value));
      }
      Sentry.captureMessage(message);
    });
  });
}

export function setUser(user: { id: string; email?: string; name?: string } | null) {
  if (!isConfigured) return;
  void loadSentry().then((Sentry) => {
    Sentry.setUser(user);
  });
}

export async function flush(timeout = 2000) {
  if (!isConfigured) return;
  const Sentry = await loadSentry();
  await Sentry.flush(timeout);
}

export { sentryModule as Sentry };
