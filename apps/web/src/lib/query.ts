import { QueryClient } from "@tanstack/react-query";

/**
 * Query client singleton
 * Used by TanStack Router for SSR data loading
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});
