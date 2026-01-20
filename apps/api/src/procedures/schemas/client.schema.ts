/**
 * Output schemas for client procedures
 */

import { z } from "zod";

export const clientOutputSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string(),
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  postalCode: z.string().nullable(),
  taxId: z.string().nullable(),
  notes: z.string().nullable(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const clientListOutputSchema = z.object({
  data: z.array(clientOutputSchema),
  pagination: paginationSchema,
});

export const clientOutputSchemaSingle = clientOutputSchema;
