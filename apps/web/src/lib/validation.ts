/**
 * Input Validation Utilities
 * 
 * Comprehensive input validation and sanitization functions.
 */

import { z } from 'zod';

/**
 * Sanitize HTML input to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/&lt;script&gt;/gi, '') // Remove encoded script tags
    .trim();
}

/**
 * Sanitize for display in HTML
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => map[char] || char);
}

/**
 * Validate email format
 */
export const emailSchema = z.string().email('Invalid email address');

export function isValidEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

/**
 * Validate password strength
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const result = passwordSchema.safeParse(password);
  if (result.success) {
    return { valid: true, errors: [] };
  }
  return {
    valid: false,
    errors: result.error.errors.map((e) => e.message),
  };
}

/**
 * Validate URL format
 */
export const urlSchema = z.string().url('Invalid URL format');

export function isValidUrl(url: string): boolean {
  return urlSchema.safeParse(url).success;
}

/**
 * Sanitize filename for safe file system operations
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255);
}

/**
 * Validate phone number (international format)
 */
export const phoneSchema = z.string().regex(
  /^\+?[1-9]\d{1,14}$/,
  'Invalid phone number format'
);

export function isValidPhone(phone: string): boolean {
  return phoneSchema.safeParse(phone).success;
}

/**
 * Validate invoice number format
 */
export function validateInvoiceNumber(invoiceNumber: string): boolean {
  // Format: INV-YYYY-NNNN (e.g., INV-2026-0001)
  const pattern = /^INV-\d{4}-\d{4}$/;
  return pattern.test(invoiceNumber);
}

/**
 * Validate amount/price (positive number with max 2 decimals)
 */
export const amountSchema = z
  .number()
  .positive('Amount must be positive')
  .max(999999999.99, 'Amount too large')
  .refine((val) => {
    const decimals = val.toString().split('.')[1];
    return !decimals || decimals.length <= 2;
  }, 'Amount can have maximum 2 decimal places');

export function isValidAmount(amount: number): boolean {
  return amountSchema.safeParse(amount).success;
}

/**
 * Validate tax rate (0-100%)
 */
export const taxRateSchema = z
  .number()
  .min(0, 'Tax rate cannot be negative')
  .max(100, 'Tax rate cannot exceed 100%');

/**
 * Sanitize SQL-like input (basic protection)
 */
export function sanitizeSqlInput(input: string): string {
  const sqlKeywords = [
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE',
    'ALTER', 'EXEC', 'EXECUTE', 'UNION', '--', ';', '/*', '*/'
  ];
  
  let sanitized = input;
  for (const keyword of sqlKeywords) {
    const regex = new RegExp(keyword, 'gi');
    sanitized = sanitized.replace(regex, '');
  }
  
  return sanitized.trim();
}

/**
 * Validate date is not in the past
 */
export function validateFutureDate(date: Date): boolean {
  return date > new Date();
}

/**
 * Validate date range
 */
export function validateDateRange(startDate: Date, endDate: Date): boolean {
  return startDate < endDate;
}

/**
 * Rate limiting check (client-side)
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  check(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Filter out old attempts
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false; // Rate limited
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true; // Allowed
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

/**
 * CSRF token validation helper
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate content length
 */
export function validateContentLength(
  content: string,
  maxLength: number = 10000
): { valid: boolean; message?: string } {
  if (content.length > maxLength) {
    return {
      valid: false,
      message: `Content exceeds maximum length of ${maxLength} characters`,
    };
  }
  return { valid: true };
}
