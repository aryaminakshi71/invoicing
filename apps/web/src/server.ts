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
    if (!headers.has("x-frame-options")) {
      headers.set("x-frame-options", "SAMEORIGIN");
    }
    if (!headers.has("x-content-type-options")) {
      headers.set("x-content-type-options", "nosniff");
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
