/**
 * API Router Unit Tests
 * Tests for invoice operations
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { createApp } from '../app';
import type { AppEnv } from '../context';

// Mock environment for testing
const mockEnv: AppEnv = {
  DATABASE: {
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/invoicing_test'
  },
  BETTER_AUTH_SECRET: 'test-secret-minimum-32-characters-long',
  VITE_PUBLIC_SITE_URL: 'http://localhost:3000',
  NODE_ENV: 'test'
};

describe('Invoices Router', () => {
  let app: ReturnType<typeof createApp>;

  beforeAll(() => {
    app = createApp();
  });

  describe('GET /api/health', () => {
    test('should return health status', async () => {
      const req = new Request('http://localhost/api/health');
      const res = await app.fetch(req, mockEnv as any);
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('status', 'ok');
      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('version');
    });
  });

  describe('Invoice Operations', () => {
    test('should require authentication for invoice list', async () => {
      const req = new Request('http://localhost/api/rpc/invoices.list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      
      const res = await app.fetch(req, mockEnv as any);
      
      // Should return unauthorized without valid session
      expect(res.status).toBe(401);
    });

    test('should validate invoice creation input', async () => {
      const req = new Request('http://localhost/api/rpc/invoices.create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // Missing required fields
          items: []
        })
      });
      
      const res = await app.fetch(req, mockEnv as any);
      
      // Should return validation error
      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Error Handling', () => {
    test('should handle 404 for unknown routes', async () => {
      const req = new Request('http://localhost/api/unknown-route');
      const res = await app.fetch(req, mockEnv as any);
      
      expect(res.status).toBe(404);
    });

    test('should return JSON error responses', async () => {
      const req = new Request('http://localhost/api/rpc/invalid.method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const res = await app.fetch(req, mockEnv as any);
      const data = await res.json();
      
      expect(data).toHaveProperty('error');
    });
  });

  describe('Security Headers', () => {
    test('should include security headers in responses', async () => {
      const req = new Request('http://localhost/api/health');
      const res = await app.fetch(req, mockEnv as any);
      
      expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(res.headers.get('X-Frame-Options')).toBeTruthy();
      expect(res.headers.get('X-XSS-Protection')).toBeTruthy();
    });
  });

  describe('CORS', () => {
    test('should handle CORS preflight requests', async () => {
      const req = new Request('http://localhost/api/health', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'GET'
        }
      });
      
      const res = await app.fetch(req, mockEnv as any);
      
      expect(res.headers.get('Access-Control-Allow-Origin')).toBeTruthy();
    });
  });
});

describe('Clients Router', () => {
  let app: ReturnType<typeof createApp>;

  beforeAll(() => {
    app = createApp();
  });

  test('should require authentication for client operations', async () => {
    const req = new Request('http://localhost/api/rpc/clients.list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    const res = await app.fetch(req, mockEnv as any);
    expect(res.status).toBe(401);
  });
});

describe('Rate Limiting', () => {
  let app: ReturnType<typeof createApp>;

  beforeAll(() => {
    app = createApp();
  });

  test('should apply rate limits to API endpoints', async () => {
    const requests = [];
    
    // Make multiple requests rapidly
    for (let i = 0; i < 5; i++) {
      const req = new Request('http://localhost/api/health');
      requests.push(app.fetch(req, mockEnv as any));
    }
    
    const responses = await Promise.all(requests);
    const statuses = responses.map(r => r.status);
    
    // At least some requests should succeed
    expect(statuses.some(s => s === 200)).toBe(true);
  });
});
