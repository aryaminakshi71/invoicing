/**
 * oRPC Client Setup
 *
 * Creates a type-safe client for calling the API.
 * Uses @orpc/tanstack-query for React Query integration.
 */

import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { RouterClient } from "@orpc/server";
import type { AppRouter } from "@invoicing/api/router";

/**
 * Create the oRPC fetch link
 */
const link = new RPCLink({
  url: "/api/rpc",
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: "include",
    }),
  headers: () => {
    const headers: Record<string, string> = {};
    
    // Add demo mode header
    const isDemo = typeof window !== "undefined" && localStorage.getItem("demo_mode") === "true";
    headers["x-demo-mode"] = isDemo ? "true" : "false";

    return headers;
  },
});

/**
 * Type-safe oRPC client
 */
export const api: RouterClient<AppRouter> = createORPCClient(link);

/**
 * TanStack Query integration for oRPC
 * Provides queryOptions/mutationOptions utilities
 *
 * Usage:
 * ```tsx
 * import { useQuery, useMutation } from "@tanstack/react-query";
 *
 * const { data, isLoading } = useQuery(orpc.dashboard.metrics.queryOptions());
 * const createInvoice = useMutation(orpc.invoices.create.mutationOptions());
 * ```
 */
export const orpc = createTanstackQueryUtils(api);
