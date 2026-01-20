/**
 * Output schemas for invoice procedures
 */

import { z } from "zod";

export const invoiceItemOutputSchema = z.object({
  id: z.string().uuid(),
  invoiceId: z.string().uuid(),
  description: z.string(),
  quantity: z.string(),
  unitPrice: z.string(),
  taxRate: z.string().nullable(),
  lineTotal: z.string(),
  sortOrder: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const invoiceOutputSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string(),
  invoiceNumber: z.string(),
  customerId: z.string().uuid(),
  customerName: z.string().nullable(),
  customerEmail: z.string().nullable(),
  customerAddress: z.string().nullable(),
  status: z.string(),
  subtotal: z.string(),
  tax: z.string(),
  discount: z.string(),
  total: z.string(),
  currency: z.string(),
  issueDate: z.date(),
  dueDate: z.date().nullable(),
  paidDate: z.date().nullable(),
  notes: z.string().nullable(),
  terms: z.string().nullable(),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const invoiceWithItemsOutputSchema = invoiceOutputSchema.extend({
  items: z.array(invoiceItemOutputSchema).optional(),
});

export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const invoiceListOutputSchema = z.object({
  data: z.array(invoiceOutputSchema),
  pagination: paginationSchema,
});
