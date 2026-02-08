/**
 * Vite Plugin for Security Headers
 * 
 * Adds security headers to responses in development mode.
 * In production with Cloudflare Workers, server.ts handles these headers.
 */
import type { Plugin } from 'vite';

export function securityHeadersPlugin(): Plugin {
  return {
    name: 'security-headers',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Set comprehensive security headers
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader(
          'Strict-Transport-Security',
          'max-age=31536000; includeSubDomains; preload'
        );
        res.setHeader(
          'Content-Security-Policy',
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
        );
        res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
        
        next();
      });
    },
  };
}
