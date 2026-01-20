import { createORPCClient } from "@orpc/client";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { useQuery as useTanStackQuery, useMutation as useTanStackMutation, useQueryClient as useTanStackQueryClient } from "@tanstack/react-query";
import type { AppRouter } from "@invoicing/api/router";

/**
 * oRPC client for making type-safe API calls
 */
const baseURL = import.meta.env.VITE_PUBLIC_SITE_URL || "http://localhost:5173";

// @ts-expect-error - oRPC type system has limitations with nested router structures
// The runtime behavior is correct, but TypeScript can't infer the nested client type
export const orpcClient = createORPCClient<AppRouter>({
  baseURL,
  prefix: "/api/rpc",
  headers: () => {
    const headers: Record<string, string> = {};
    
    // Add demo mode header
    const isDemo = typeof window !== "undefined" && localStorage.getItem("demo_mode") === "true";
    headers["x-demo-mode"] = isDemo ? "true" : "false";

    return headers;
  },
});

/**
 * TanStack Query integration for oRPC
 * Provides query/mutation options
 */
// @ts-expect-error - Same type limitation as above
export const orpc = createTanstackQueryUtils(orpcClient);

/**
 * Compatibility hooks for existing route components
 * Wraps the new oRPC API to match the expected hook interface
 */
export function useQuery<T = any>(options: { procedure: string; input?: any }) {
  // Parse procedure path (e.g., "tickets.list" -> ["tickets", "list"])
  const [router, ...procedure] = options.procedure.split(".");
  
  // Navigate to the procedure in the router
  let procedureRef: any = orpc;
  for (const part of [router, ...procedure]) {
    procedureRef = procedureRef?.[part];
  }
  
  if (!procedureRef?.queryOptions) {
    throw new Error(`Procedure ${options.procedure} not found or does not support queries`);
  }
  
  return useTanStackQuery(procedureRef.queryOptions(options.input || {}));
}

export function useMutation<T = any>(options: { procedure: string }) {
  // Parse procedure path
  const [router, ...procedure] = options.procedure.split(".");
  
  // Navigate to the procedure in the router
  let procedureRef: any = orpc;
  for (const part of [router, ...procedure]) {
    procedureRef = procedureRef?.[part];
  }
  
  if (!procedureRef?.mutationOptions) {
    throw new Error(`Procedure ${options.procedure} not found or does not support mutations`);
  }
  
  return useTanStackMutation(procedureRef.mutationOptions());
}

export const useQueryClient = useTanStackQueryClient;
