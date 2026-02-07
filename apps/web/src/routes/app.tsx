import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authClient } from "@/stores/auth-store";

export const Route = createFileRoute("/app")({
  beforeLoad: async () => {
    // Skip auth check on server — cookies aren't available during SSR
    if (typeof window === "undefined") {
      return;
    }

    // Allow demo mode to bypass auth
    if (localStorage.getItem("demo_mode") === "true") {
      return;
    }

    try {
      const session = await authClient.getSession();
      if (!session?.data?.user) {
        throw redirect({ to: "/login" });
      }

      // Ensure organization slug is set in localStorage
      // (needed for oRPC x-organization-slug header)
      if (!localStorage.getItem("organization_slug")) {
        try {
          const orgs = await authClient.organization.list();
          if (orgs.data && orgs.data.length > 0) {
            const activeOrg = orgs.data[0];
            await authClient.organization.setActive({
              organizationId: activeOrg.id,
            });
            localStorage.setItem("organization_slug", activeOrg.slug ?? activeOrg.id);
          }
        } catch (orgError) {
          console.warn("Failed to fetch organizations in guard:", orgError);
        }
      }
    } catch (error) {
      // If it's already a TanStack redirect, re-throw it
      if (error && typeof error === "object" && "to" in error) {
        throw error;
      }
      // If API is unavailable, redirect to login
      throw redirect({ to: "/login" });
    }
  },
  component: () => <Outlet />,
});
