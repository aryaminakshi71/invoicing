import handler from "@tanstack/react-start/server-entry";
import { api } from "@invoicing/api/app";
import type { getRouter } from "./router";
import type { Env } from "@invoicing/env/cloudflare";

export interface CloudflareRequestContext {
  cloudflare: {
    env: Env;
    ctx: ExecutionContext;
  };
}

declare module "@tanstack/react-start" {
  interface Register {
    ssr: true;
    router: ReturnType<typeof getRouter>;
    server: {
      requestContext: CloudflareRequestContext;
    };
  }
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api")) {
      return api.fetch(request, env as any, ctx);
    }

    const response = await handler.fetch(request, {
      context: {
        cloudflare: { env, ctx },
      },
    } as Parameters<typeof handler.fetch>[1]);

    const headers = new Headers(response.headers);
    
    // Set comprehensive security headers
    headers.set("X-Frame-Options", "SAMEORIGIN");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-XSS-Protection", "1; mode=block");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
    headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
    );
    headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
