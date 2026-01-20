/**
 * App Router
 *
 * Composed router with all domain routers.
 * Split into separate files to avoid TypeScript TS7056 limits.
 */

import { healthRouter } from "./health";
import { invoicesRouter } from "./invoices";
import { clientsRouter } from "./clients";

export const appRouter = {
  health: healthRouter,
  invoices: invoicesRouter,
  clients: clientsRouter,
};

export type AppRouter = typeof appRouter;
