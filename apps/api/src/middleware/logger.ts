/**
 * Logger Middleware
 *
 * Creates a request-scoped logger and attaches it to Hono context.
 */

import type { Context, Next } from "hono";
import { createRequestLoggerFromRequest, type Logger } from "@invoicing/logger";

declare module "hono" {
  interface ContextVariableMap {
    logger: Logger;
  }
}

export async function loggerMiddleware(c: Context, next: Next) {
  const requestId = c.get("requestId") || crypto.randomUUID();
  const logger = createRequestLoggerFromRequest(c.req.raw, {
    requestId,
  });
  c.set("logger", logger);
  await next();
}

export type { Logger };
