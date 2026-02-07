/**
 * API Application
 *
 * Hono app with oRPC integration for Cloudflare Workers.
 */

import { createDb } from "@invoicing/storage";
import { OpenAPIGenerator } from "@orpc/openapi";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import type { AppEnv, InitialContext } from "./context";
import { createAuthFromEnv } from "./lib/create-auth-from-env";
import { loggerMiddleware } from "./middleware/logger";
import { initSentry } from "./lib/sentry";
import { initDatadog } from "./lib/datadog";
import { rateLimitRedis } from "./middleware/rate-limit-redis";
import { setSecurityHeaders } from "./lib/security";
import { APIError, formatErrorResponse } from "./lib/errors";
import { captureException as sentryCaptureException } from "./lib/sentry";
import { appRouter } from "./routers";

/**
 * Create Hono app with all routes
 */
export function createApp() {
  const app = new Hono<{ Bindings: AppEnv }>();

  // Initialize monitoring
  initSentry();
  initDatadog();

  // Global middleware
  app.use("*", cors({ origin: (origin) => origin, credentials: true }));
  app.use("*", requestId());
  app.use("*", loggerMiddleware);

  // Polyfill Cloudflare env bindings from process.env when running in Node.js
  app.use("*", async (c, next) => {
    if (!c.env?.DATABASE?.connectionString) {
      const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/invoicing_db";
      c.env = {
        ...c.env,
        DATABASE: { connectionString: dbUrl },
        BETTER_AUTH_SECRET: c.env?.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET || "dev-only-secret-change-me-please-32chars",
        VITE_PUBLIC_SITE_URL: c.env?.VITE_PUBLIC_SITE_URL || process.env.VITE_PUBLIC_SITE_URL || "http://localhost:3004",
        NODE_ENV: c.env?.NODE_ENV || process.env.NODE_ENV || "development",
        GOOGLE_CLIENT_ID: c.env?.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: c.env?.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET,
        GITHUB_CLIENT_ID: c.env?.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: c.env?.GITHUB_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET,
        STRIPE_SECRET_KEY: c.env?.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY,
        STRIPE_WEBHOOK_SECRET: c.env?.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET,
      } as AppEnv;
    }
    await next();
  });
  
  // Security headers middleware
  app.use("*", async (c, next) => {
    await next();
    setSecurityHeaders(c.res.headers);
  });

  // Health check (non-RPC) - must be before rate limiting
  app.get("/api/health", (c) => {
    return c.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    });
  });

  // Rate limiting middleware
  app.use("/api/*", rateLimitRedis({ limiterType: "api" }));
  app.use("/api/auth/*", rateLimitRedis({ limiterType: "auth" }));

  // Better Auth handler (includes Stripe webhook at /api/auth/stripe/webhook)
  app.on(["GET", "POST"], "/api/auth/*", async (c) => {
    try {
      // Fallback to process.env when running without Cloudflare Workers
      // c.env may be undefined when not running on Cloudflare (SKIP_CLOUDFLARE=true)
      const envBindings = c.env || {};
      const connectionString =
        envBindings.DATABASE?.connectionString || process.env.DATABASE_URL;

      if (!connectionString) {
        throw new Error(
          "DATABASE connection string not found in environment bindings or process.env.DATABASE_URL",
        );
      }

      console.log("[Auth] Creating DB with connection string:", connectionString.replace(/:[^@]+@/, ':***@'));

      const db = createDb({ connectionString });

      // Create minimal env object with defaults for missing bindings
      const minimalEnv = {
        DATABASE_URL: connectionString,
        NODE_ENV: envBindings.NODE_ENV || process.env.NODE_ENV || "development",
        VITE_PUBLIC_SITE_URL:
          envBindings.VITE_PUBLIC_SITE_URL ||
          process.env.VITE_PUBLIC_SITE_URL ||
          "http://localhost:3004",
        BETTER_AUTH_SECRET:
          envBindings.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET,
        CACHE: envBindings.CACHE,
        BUCKET: envBindings.BUCKET,
        ASSETS: envBindings.ASSETS,
        IMAGES: envBindings.IMAGES,
        AI: envBindings.AI,
        GOOGLE_CLIENT_ID: envBindings.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: envBindings.GOOGLE_CLIENT_SECRET,
        GITHUB_CLIENT_ID: envBindings.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: envBindings.GITHUB_CLIENT_SECRET,
        STRIPE_SECRET_KEY: envBindings.STRIPE_SECRET_KEY,
        STRIPE_WEBHOOK_SECRET: envBindings.STRIPE_WEBHOOK_SECRET,
      };

      console.log("[Auth] Creating auth instance with baseURL:", minimalEnv.VITE_PUBLIC_SITE_URL);

      const auth = createAuthFromEnv(db, minimalEnv as any);
      
      console.log("[Auth] Handling request:", c.req.method, c.req.path);
      
      const response = await auth.handler(c.req.raw);
      
      console.log("[Auth] Response status:", response.status);
      
      return response;
    } catch (error) {
      console.error("[Auth] Error in auth handler:", error);
      return c.json({ error: "Internal authentication error", details: String(error) }, 500);
    }
  });

  // oRPC handler
  const rpcHandler = new RPCHandler(appRouter, {
    interceptors: [
      onError((error: unknown) => {
        console.error("[RPC Error]", error);
        
        // Capture in Sentry
        if (error instanceof Error) {
          sentryCaptureException(error);
        }
        
        // Handle APIError
        if (error instanceof APIError) {
          // APIError will be handled by oRPC's error handling
          return;
        }
      }),
    ],
  });

  app.use("/api/rpc/*", async (c, next) => {
    const initialContext: InitialContext = {
      env: c.env,
      headers: c.req.raw.headers,
      requestId: c.get("requestId") || crypto.randomUUID(),
      logger: c.get("logger"),
    };

    const { matched, response } = await rpcHandler.handle(c.req.raw, {
      prefix: "/api/rpc",
      context: initialContext,
    });

    if (matched && response) {
      return c.newResponse(response.body, response);
    }

    await next();
  });

  // OpenAPI spec
  app.get("/api/openapi.json", async (c) => {
    const generator = new OpenAPIGenerator({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    });

    const spec = await generator.generate(appRouter, {
      info: {
        title: "Invoicing API",
        version: "1.0.0",
        description: "Invoice & billing management platform",
      },
      servers: [{ url: c.env.VITE_PUBLIC_SITE_URL, description: "Current" }],
      security: [{ bearerAuth: [] }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "JWT token from Better Auth",
          },
        },
      },
      tags: [
        { name: "Invoices", description: "Invoice management operations" },
        { name: "System", description: "System endpoints" },
      ],
    });

    return c.json(spec);
  });

  // Scalar API Documentation UI
  app.get("/api/docs", async (c) => {
    try {
      // Dynamic import with error handling for environments where it's not available
      const scalarModule = await import("@scalar/hono-api-reference").catch(() => null);
      if (!scalarModule) {
        return c.json({ error: "API documentation not available" }, 503);
      }
      const { Scalar } = scalarModule;
      return Scalar({
        spec: {
          url: "/api/openapi.json",
        },
        theme: "purple",
      })(c);
    } catch (error) {
      return c.json({ error: "Failed to load API documentation" }, 500);
    }
  });

  return app;
}

// Default app instance
export const api = createApp();
