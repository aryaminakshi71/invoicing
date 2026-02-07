import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/" as any)({
  beforeLoad: () => {
    throw redirect({ to: "/app/dashboard" });
  },
});
