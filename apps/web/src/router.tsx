import type { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { queryClient } from "./lib/query";
import { routeTree } from "./routeTree.gen";

export function createRouter(queryClient: QueryClient) {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    context: {
      queryClient,
    },
  });
}

// TanStack Start expects getRouter export
export function getRouter() {
  return createRouter(queryClient);
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
