# Invoicing Platform - API Documentation

## Base URL

- **Development**: `http://localhost:3013/api`
- **Production**: `https://api.yourdomain.com/api`

## Authentication

All API requests require authentication via session cookies or bearer token.

### Session-based (Default)
```bash
# Login returns a session cookie
POST /api/auth/signin/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

### Bearer Token (Optional)
```bash
GET /api/rpc/invoices.list
Authorization: Bearer <token>
```

## Core Endpoints

### Health Check

```bash
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-08T10:00:00.000Z",
  "version": "1.0.0"
}
```

## oRPC Endpoints

All oRPC endpoints follow the pattern `/api/rpc/<router>.<procedure>`

### Invoices

#### List Invoices
```bash
POST /api/rpc/invoices.list
Content-Type: application/json

{
  "organizationId": "org_123",
  "status": "draft", // optional: "draft" | "sent" | "paid" | "overdue"
  "limit": 20,
  "offset": 0
}
```

**Response:**
```json
{
  "data": [
    {
      "id": "inv_123",
      "invoiceNumber": "INV-2026-0001",
      "clientId": "client_123",
      "status": "sent",
      "amount": 1500.00,
      "currency": "USD",
      "dueDate": "2026-03-01",
      "items": [...],
      "createdAt": "2026-02-01T10:00:00.000Z"
    }
  ],
  "total": 45
}
```

#### Create Invoice
```bash
POST /api/rpc/invoices.create
Content-Type: application/json

{
  "organizationId": "org_123",
  "clientId": "client_123",
  "items": [
    {
      "description": "Web Development",
      "quantity": 40,
      "rate": 75.00,
      "amount": 3000.00
    }
  ],
  "taxRate": 10,
  "dueDate": "2026-03-15",
  "notes": "Payment terms: Net 30"
}
```

#### Get Invoice
```bash
POST /api/rpc/invoices.get
Content-Type: application/json

{
  "id": "inv_123"
}
```

#### Update Invoice
```bash
POST /api/rpc/invoices.update
Content-Type: application/json

{
  "id": "inv_123",
  "status": "sent",
  "items": [...]
}
```

#### Delete Invoice
```bash
POST /api/rpc/invoices.delete
Content-Type: application/json

{
  "id": "inv_123"
}
```

### Clients

#### List Clients
```bash
POST /api/rpc/clients.list
Content-Type: application/json

{
  "organizationId": "org_123",
  "search": "acme", // optional
  "limit": 20,
  "offset": 0
}
```

#### Create Client
```bash
POST /api/rpc/clients.create
Content-Type: application/json

{
  "organizationId": "org_123",
  "name": "Acme Corp",
  "email": "billing@acme.com",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94105",
    "country": "US"
  }
}
```

### Organizations

#### List Organizations
```bash
POST /api/rpc/organizations.list
```

#### Create Organization
```bash
POST /api/rpc/organizations.create
Content-Type: application/json

{
  "name": "My Company",
  "slug": "my-company"
}
```

## Rate Limiting

- **API Endpoints**: 100 requests per minute
- **Auth Endpoints**: 10 requests per minute

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1644329400
```

**Rate Limit Exceeded Response (429):**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later."
  }
}
```

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} // optional additional context
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

## Webhooks

Configure webhooks to receive real-time updates.

### Available Events
- `invoice.created`
- `invoice.updated`
- `invoice.paid`
- `invoice.overdue`
- `payment.received`
- `client.created`

### Webhook Payload
```json
{
  "event": "invoice.paid",
  "timestamp": "2026-02-08T10:00:00.000Z",
  "data": {
    "id": "inv_123",
    "amount": 1500.00,
    "paidAt": "2026-02-08T09:55:00.000Z"
  }
}
```

### Webhook Signature Verification
```typescript
import crypto from 'crypto';

function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}
```

## Pagination

All list endpoints support pagination:

```json
{
  "limit": 20,      // Number of items per page (max 100)
  "offset": 0,      // Number of items to skip
  "sort": "createdAt", // Field to sort by
  "order": "desc"   // "asc" or "desc"
}
```

## Filtering

Use query parameters for filtering:

```json
{
  "filters": {
    "status": ["draft", "sent"],
    "createdAfter": "2026-01-01",
    "createdBefore": "2026-12-31",
    "minAmount": 100,
    "maxAmount": 10000
  }
}
```

## Search

Full-text search available on certain endpoints:

```json
{
  "search": "acme web development",
  "searchFields": ["clientName", "description", "invoiceNumber"]
}
```

## Export Formats

Some endpoints support data export:

```bash
GET /api/invoices/export?format=csv
GET /api/invoices/export?format=pdf
GET /api/reports/export?format=xlsx
```

## SDK / Client Libraries

### TypeScript/JavaScript
```typescript
import { createClient } from '@invoicing/api-client';

const client = createClient({
  baseUrl: 'https://api.yourdomain.com',
  apiKey: 'your-api-key'
});

const invoices = await client.invoices.list({
  organizationId: 'org_123',
  status: 'sent'
});
```

### cURL Examples

```bash
# Create an invoice
curl -X POST http://localhost:3013/api/rpc/invoices.create \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your-session-cookie" \
  -d '{
    "organizationId": "org_123",
    "clientId": "client_123",
    "items": [
      {
        "description": "Consulting",
        "quantity": 10,
        "rate": 100,
        "amount": 1000
      }
    ],
    "dueDate": "2026-03-15"
  }'
```

## OpenAPI Specification

Full OpenAPI specification available at:
```
GET /api/documentation
```

## Support

- **Documentation**: https://docs.yourdomain.com
- **Status Page**: https://status.yourdomain.com
- **Support Email**: support@yourdomain.com

---

Last updated: February 8, 2026
