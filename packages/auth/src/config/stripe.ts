/**
 * Better Auth Stripe Plugin Configuration
 *
 * Organization-scoped subscription management with Stripe.
 * Pattern adapted from Fanbeam/Samva.
 */

import { stripe as stripePlugin, type Subscription } from "@better-auth/stripe";
import type { Database } from "@invoicing/storage";
import Stripe from "stripe";

export interface StripeConfig {
  /** Stripe SDK client */
  stripeClient: Stripe;
  /** Stripe webhook secret */
  webhookSecret: string;
  /** Database instance */
  db: Database;
  /** App identifier for multi-app webhook routing (optional) */
  appId?: string;
}

/**
 * Create Better Auth Stripe plugin configuration
 */
export function createStripePlugin(config: StripeConfig) {
  const { stripeClient, webhookSecret, db, appId = "invoicing" } = config;

  return stripePlugin({
    stripeClient,
    stripeWebhookSecret: webhookSecret,
    createCustomerOnSignUp: false,

    subscription: {
      enabled: true,

      // Required: Provide plans array
      plans: async () => {
        // Return empty array for now - can be populated from database later
        return [];
      },

      // Stamp app_id on all Stripe objects for webhook routing
      getCheckoutSessionParams: async () => ({
        params: {
          metadata: { app_id: appId },
          subscription_data: { metadata: { app_id: appId } },
        },
      }),

      // Owners and admins can manage organization subscription
      authorizeReference: async ({ user, referenceId }) => {
        // TODO: Implement authorization check based on your member table structure
        // const member = await db.query.members.findFirst({
        //   where: and(
        //     eq(members.organizationId, referenceId),
        //     eq(members.userId, user.id)
        //   ),
        // });
        // return member?.role === "owner" || member?.role === "admin";
        return true; // Placeholder
      },

      // Handle subscription lifecycle events
      onSubscriptionComplete: async ({ subscription }) => {
        console.log(
          `[Stripe] Subscription completed for org ${subscription.referenceId}, plan: ${subscription.plan}`
        );
      },

      onSubscriptionUpdate: async ({ subscription }) => {
        console.log(
          `[Stripe] Subscription updated for org ${subscription.referenceId}, status: ${subscription.status}`
        );
      },

      onSubscriptionCancel: async ({ subscription }) => {
        console.log(
          `[Stripe] Subscription canceled for org ${subscription.referenceId}`
        );
      },
    },

    // Handle custom Stripe events
    onEvent: async (event) => {
      console.log(`[Stripe] Webhook event: ${event.type}`);

      // Ensure customer has app_id metadata for webhook routing
      if (event.type === "customer.created") {
        const customer = event.data.object as Stripe.Customer;
        if (!customer.metadata?.app_id) {
          await stripeClient.customers.update(customer.id, {
            metadata: { app_id: appId },
          });
        }
        return;
      }

      // Handle payment events
      if (event.type === "invoice.payment_failed") {
        const invoice = event.data.object as Stripe.Invoice & {
          subscription?: string | Stripe.Subscription;
        };
        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id;
        console.log(
          `[Stripe] Payment failed for invoice ${invoice.id}, subscription: ${subscriptionId}`
        );
        // TODO: Send payment failed notification email
      }
    },
  });
}

/**
 * Create Stripe SDK client
 */
export function createStripeClient(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    apiVersion: "2025-08-27.basil",
    typescript: true,
  });
}
