/**
 * Invoices Router
 *
 * Invoice management operations.
 */

import { z } from "zod";
import { orgAuthed, getDb, schema } from "../procedures";
import { trackQuery } from "../lib/db-performance";
import { getOrCache } from "@invoicing/storage/redis";
import { eq, and, desc, count, ilike, or, gte, lte } from "drizzle-orm";
import type { OrgContext } from "../context";

export const invoicesRouter = {
  /**
   * List invoices for the organization
   */
  list: orgAuthed
    .route({
      method: "GET",
      path: "/invoices",
      summary: "List invoices",
      tags: ["Invoices"],
    })
    .input(
      z.object({
        limit: z.number().min(1).max(200).default(50),
        offset: z.number().min(0).default(0),
        status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]).optional(),
        customerId: z.string().uuid().optional(),
        startDate: z.string().date().optional(),
        endDate: z.string().date().optional(),
        search: z.string().optional(),
      })
    )
    .output(
      z.object({
        invoices: z.array(z.any()),
        total: z.number(),
      })
    )
    .handler(async ({ context, input }: { context: OrgContext; input: { limit: number; offset: number; status?: string; customerId?: string; startDate?: string; endDate?: string; search?: string } }) => {
      const db = getDb(context);
      const { limit, offset, status, customerId, startDate, endDate, search } = input;

      // Cache key for list queries
      const cacheKey = `invoices:list:${context.organization.id}:${JSON.stringify(input)}`;

      // Use cache for list queries (5 min TTL)
      return getOrCache(
        cacheKey,
        async () => {
          // Build where conditions
          const conditions = [
            eq(schema.invoices.organizationId, context.organization.id),
          ];

          // Filter by status if provided
          if (status) {
            conditions.push(eq(schema.invoices.status, status));
          }

          // Filter by customer if provided
          if (customerId) {
            conditions.push(eq(schema.invoices.customerId, customerId));
          }

          // Filter by date range if provided
          if (startDate) {
            conditions.push(gte(schema.invoices.issueDate, new Date(startDate)));
          }

          if (endDate) {
            conditions.push(lte(schema.invoices.issueDate, new Date(endDate)));
          }

          // Search filter (invoice number, customer name, customer email)
          if (search) {
            conditions.push(
              or(
                ilike(schema.invoices.invoiceNumber, `%${search}%`),
                ilike(schema.invoices.customerName, `%${search}%`),
                ilike(schema.invoices.customerEmail, `%${search}%`)
              )!
            );
          }

          const whereClause = and(...conditions);

          // Execute queries in parallel for better performance
          const [invoicesResult, countResult] = await Promise.all([
            trackQuery('listInvoices', () =>
              db
                .select()
                .from(schema.invoices)
                .where(whereClause)
                .orderBy(desc(schema.invoices.createdAt))
                .limit(limit)
                .offset(offset)
            ),
            trackQuery('countInvoices', () =>
              db
                .select({ count: count() })
                .from(schema.invoices)
                .where(whereClause)
            ),
          ]);

          return {
            invoices: invoicesResult,
            total: Number(countResult[0]?.count || 0),
          };
        },
        300 // 5 minutes
      );
    }),
};
