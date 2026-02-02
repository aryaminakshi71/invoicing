import {
  HeadContent,
  Scripts,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "../lib/query";
import { PostHogProvider } from "../components/providers/posthog-provider";
import { ErrorPage, NotFoundPage } from "../components/error";
import { generateOrganizationSchema, generateWebSiteSchema, getInvoicingOrganizationSchema } from "../lib/structured-data";
import { registerServiceWorker } from "../lib/service-worker";
import { useEffect } from "react";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Invoicing Platform - Create, Send & Manage Invoices Online" },
      { name: "description", content: "Modern invoicing platform for creating, sending, and managing invoices. Track payments, automate billing, and streamline your invoicing process." },
      { name: "keywords", content: "invoicing, invoice management, billing software, online invoicing, invoice generator, payment tracking" },
      { property: "og:title", content: "Invoicing Platform - Invoice Management System" },
      { property: "og:description", content: "Create, send, and manage invoices online with our modern invoicing platform." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://api.your-domain.com" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  component: RootDocument,
  errorComponent: ({ error }) => <ErrorPage error={error} />,
  notFoundComponent: () => <NotFoundPage />,
});

function RootDocument() {
  // Register service worker for offline support
  useEffect(() => {
    registerServiceWorker();
  }, []);

  const organizationSchema = generateOrganizationSchema(getInvoicingOrganizationSchema())
  const websiteSchema = generateWebSiteSchema({
    name: 'Invoicing Platform',
    url: import.meta.env.VITE_PUBLIC_SITE_URL || 'https://invoicing.your-domain.com',
    description: 'Comprehensive invoice and billing management platform for businesses.',
  })

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white focus:rounded-br-lg"
        >
          Skip to main content
        </a>
        <PostHogProvider>
          <QueryClientProvider client={queryClient}>
            <main id="main-content">
              <Outlet />
            </main>
            <Toaster position="top-right" />
            {import.meta.env.PROD ? null : <TanStackRouterDevtools />}
            <Scripts />
          </QueryClientProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
