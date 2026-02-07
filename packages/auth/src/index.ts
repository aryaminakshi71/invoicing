/**
 * Better Auth Server Configuration
 *
 * Full-featured authentication for Cloudflare Workers with:
 * - OAuth providers (Google, GitHub)
 * - Organization/team support
 * - Stripe billing (optional)
 * - API key authentication
 *
 * Pattern adapted from Fanbeam/Samva.
 */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization, apiKey, openAPI } from "better-auth/plugins";
import type { Database } from "@invoicing/storage";
import type { KVNamespace } from "@cloudflare/workers-types";
import { createKVStorage } from "./kv-storage";
import { createStripePlugin, createStripeClient } from "./config/stripe";

export interface AuthConfig {
  /** Database instance from @invoicing/storage */
  db: Database;
  /** Cloudflare KV namespace for session storage */
  kv: KVNamespace;
  /** Better Auth secret (32+ characters) */
  secret: string;
  /** Base URL for the app (e.g., https://example.com) */
  baseURL: string;
  /** Drizzle schema object for the adapter */
  schema?: Record<string, unknown>;
  /** OAuth provider credentials */
  oauth?: {
    google?: {
      clientId: string;
      clientSecret: string;
    };
    github?: {
      clientId: string;
      clientSecret: string;
    };
  };
  /** Stripe billing configuration (optional) */
  stripe?: {
    secretKey: string;
    webhookSecret: string;
  };
  /** Trusted origins for CORS */
  trustedOrigins?: string[];
}

/**
 * Create a Better Auth instance configured for Cloudflare Workers
 */
export function createAuth(config: AuthConfig) {
  const { db, kv, secret, baseURL, oauth, stripe, schema, trustedOrigins = [] } = config;

  // Build plugins array
  const plugins: any[] = [
    // Organization/team support
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 3, // Free tier limit
      sendInvitationEmail: async ({ email, organization, inviter }) => {
        // TODO: Implement email sending
        console.log(`Invitation to ${email} for org ${organization.name} from ${inviter.user.name}`);
      },
    }),

    // API key authentication
    apiKey({
      enableMetadata: true,
      apiKeyHeaders: "x-api-key",
    }),

    // OpenAPI documentation
    openAPI(),
  ];

  // Add Stripe plugin if configured
  if (stripe?.secretKey && stripe?.webhookSecret) {
    const stripeClient = createStripeClient(stripe.secretKey);
    plugins.push(
      createStripePlugin({
        stripeClient,
        webhookSecret: stripe.webhookSecret,
        db,
      })
    );
  }

  // Determine if we're in local development (no HTTPS)
  const isLocalDev = baseURL.startsWith("http://localhost") || baseURL.startsWith("http://127.0.0.1");

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      usePlural: false,
      ...(schema ? { schema } : {}),
    }),
    // Only use KV secondary storage when available (not in local dev without Cloudflare)
    ...(kv ? { secondaryStorage: createKVStorage(kv) } : {}),
    secret,
    baseURL,
    basePath: "/api/auth",

    // Session configuration
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24 * 7, // 7 days
      cookieCache: { enabled: true, maxAge: 300 }, // 5 min edge cache
    },

    // Email/password enabled
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // Can be enabled in production
    },

    // OAuth providers
    socialProviders: {
      ...(oauth?.google && {
        google: {
          clientId: oauth.google.clientId,
          clientSecret: oauth.google.clientSecret,
        },
      }),
      ...(oauth?.github && {
        github: {
          clientId: oauth.github.clientId,
          clientSecret: oauth.github.clientSecret,
        },
      }),
    },

    // Account linking for OAuth
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ["google", "github"],
        allowDifferentEmails: false,
        allowUnlinkingAll: false,
      },
    },

    // Plugins
    plugins,

    // Advanced settings
    advanced: {
      useSecureCookies: !isLocalDev, // Disable secure cookies for http://localhost
      cookiePrefix: "invoicing",
      database: {
        generateId: () => crypto.randomUUID(),
      },
    },

    // Trusted origins
    trustedOrigins: [baseURL, ...trustedOrigins],
  });
}

export type Auth = ReturnType<typeof createAuth>;

// Re-export client utilities
export { authClient, useSession, signIn, signUp, signOut } from "./client";
export type { Session, User } from "./client";
