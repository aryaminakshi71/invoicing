/**
 * Invoicing AI Features
 *
 * AI-powered features for Invoicing:
 * - Invoice data extraction from images
 * - Smart categorization
 * - Payment prediction
 * - Fraud detection
 */

import { createAIClient, analyzeText, predictScore } from "./ai";

const ai = createAIClient({ provider: "openai" });

/**
 * Extract invoice data from text/image description
 */
export async function extractInvoiceData(
  invoiceText: string
): Promise<{
  amount?: number;
  date?: string;
  vendor?: string;
  items?: Array<{ description: string; amount: number }>;
}> {
  if (!ai) {
    return {};
  }

  const analysis = await analyzeText(ai, invoiceText, "summary");
  // In production, use vision model for image extraction
  return {
    vendor: analysis.summary,
  };
}

/**
 * Categorize invoice
 */
export async function categorizeInvoice(
  description: string,
  amount: number
): Promise<string[]> {
  if (!ai) {
    return [];
  }

  const context = `Invoice: ${description}, Amount: ${amount}`;
  const analysis = await analyzeText(ai, context, "categories");
  return analysis.categories || [];
}

/**
 * Predict payment likelihood
 */
export async function predictPayment(
  invoiceData: {
    amount: number;
    dueDate: string;
    customerHistory?: string;
  }
): Promise<{ score: number; reasoning: string }> {
  if (!ai) {
    return { score: 50, reasoning: "AI not configured" };
  }

  const context = `Invoice amount: ${invoiceData.amount}, Due: ${invoiceData.dueDate}, History: ${invoiceData.customerHistory || "N/A"}`;
  return await predictScore(ai, context, "success");
}
