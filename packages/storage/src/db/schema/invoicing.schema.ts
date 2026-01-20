import { pgTable, uuid, varchar, text, numeric, boolean, timestamp, integer, index } from 'drizzle-orm/pg-core';
import { user, organization } from './auth.schema.js';

/**
 * Invoicing-Specific Schema
 * Only tables used by the Invoicing application
 */

// Invoices table - Invoicing specific
export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }), // Better Auth organization ID
  invoiceNumber: varchar('invoice_number', { length: 100 }).notNull().unique(),
  customerId: uuid('customer_id').notNull(),
  customerName: varchar('customer_name', { length: 255 }),
  customerEmail: varchar('customer_email', { length: 255 }),
  customerAddress: text('customer_address'),
  status: varchar('status', { length: 50 }).default('draft').notNull(), // 'draft', 'sent', 'paid', 'overdue', 'cancelled'
  subtotal: numeric('subtotal', { precision: 15, scale: 2 }).default('0').notNull(),
  tax: numeric('tax', { precision: 15, scale: 2 }).default('0').notNull(),
  discount: numeric('discount', { precision: 15, scale: 2 }).default('0').notNull(),
  total: numeric('total', { precision: 15, scale: 2 }).default('0').notNull(),
  currency: varchar('currency', { length: 10 }).default('USD').notNull(),
  issueDate: timestamp('issue_date').defaultNow().notNull(),
  dueDate: timestamp('due_date'),
  paidDate: timestamp('paid_date'),
  notes: text('notes'),
  terms: text('terms'),
  createdBy: text('created_by').notNull().references(() => user.id), // Better Auth user ID
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index('idx_invoices_organization_id').on(table.organizationId),
  customerIdIdx: index('idx_invoices_customer_id').on(table.customerId),
  invoiceNumberIdx: index('idx_invoices_invoice_number').on(table.invoiceNumber),
  statusIdx: index('idx_invoices_status').on(table.status),
  dueDateIdx: index('idx_invoices_due_date').on(table.dueDate),
}));

// Invoice items table - Invoicing specific
export const invoiceItems = pgTable('invoice_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceId: uuid('invoice_id').notNull(),
  description: text('description').notNull(),
  quantity: numeric('quantity', { precision: 10, scale: 2 }).default('1').notNull(),
  unitPrice: numeric('unit_price', { precision: 15, scale: 2 }).notNull(),
  taxRate: numeric('tax_rate', { precision: 5, scale: 2 }).default('0'),
  lineTotal: numeric('line_total', { precision: 15, scale: 2 }).notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  invoiceIdIdx: index('idx_invoice_items_invoice_id').on(table.invoiceId),
}));

// Payments table - Invoicing specific
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }), // Better Auth organization ID
  invoiceId: uuid('invoice_id').notNull(),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('USD').notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }), // 'credit_card', 'bank_transfer', 'cash', 'check', 'paypal', etc.
  paymentDate: timestamp('payment_date').defaultNow().notNull(),
  referenceNumber: varchar('reference_number', { length: 255 }),
  notes: text('notes'),
  status: varchar('status', { length: 50 }).default('completed'), // 'pending', 'completed', 'failed', 'refunded'
  processedBy: text('processed_by').references(() => user.id, { onDelete: 'set null' }), // Better Auth user ID
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index('idx_payments_organization_id').on(table.organizationId),
  invoiceIdIdx: index('idx_payments_invoice_id').on(table.invoiceId),
  paymentDateIdx: index('idx_payments_payment_date').on(table.paymentDate),
  statusIdx: index('idx_payments_status').on(table.status),
}));

// Clients/Customers table - Invoicing specific
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }), // Better Auth organization ID
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  country: varchar('country', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),
  taxId: varchar('tax_id', { length: 100 }),
  paymentTerms: varchar('payment_terms', { length: 50 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index('idx_clients_organization_id').on(table.organizationId),
  emailIdx: index('idx_clients_email').on(table.email),
  isActiveIdx: index('idx_clients_is_active').on(table.isActive),
}));

// Type exports
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type NewInvoiceItem = typeof invoiceItems.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
