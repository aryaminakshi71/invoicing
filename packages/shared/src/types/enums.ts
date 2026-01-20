/**
 * Shared enums for Invoicing application
 */

export enum InvoiceStatus {
  DRAFT = "draft",
  SENT = "sent",
  PAID = "paid",
  OVERDUE = "overdue",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  BANK_TRANSFER = "bank_transfer",
  CASH = "cash",
  CHECK = "check",
  PAYPAL = "paypal",
  STRIPE = "stripe",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}
