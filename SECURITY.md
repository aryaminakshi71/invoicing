# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Invoicing Platform seriously. If you have discovered a security vulnerability, please report it to us as described below.

### Where to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **security@yourdomain.com**

### What to Include

Please include the following information in your report:

- Type of vulnerability
- Full path of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability
- Suggested fix (if any)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Released**: Within 30 days (varies by severity)

### Disclosure Policy

- We will acknowledge receipt of your vulnerability report
- We will confirm the vulnerability and determine its impact
- We will release a fix as soon as possible
- We will publicly disclose the vulnerability after a fix is available
- We will credit you for the discovery (unless you prefer to remain anonymous)

## Security Best Practices

### For Users

1. **Keep Updated**: Always use the latest version
2. **Environment Variables**: Never commit `.env` files
3. **Strong Passwords**: Use minimum 12 characters with mixed case, numbers, and symbols
4. **2FA**: Enable two-factor authentication when available
5. **Review Access**: Regularly review user permissions and access logs

### For Developers

1. **Dependencies**: Regularly update dependencies for security patches
   ```bash
   bun update
   ```

2. **Security Scanning**: Run security scans before deploying
   ```bash
   bun audit
   ```

3. **Environment Variables**: Use proper environment variable validation
   ```typescript
   import { env } from '@invoicing/env/server';
   // All env vars are validated with Zod
   ```

4. **Input Validation**: Always validate and sanitize user input
   ```typescript
   import { sanitizeHtml, validateEmail } from '@/lib/validation';
   ```

5. **SQL Injection**: Use parameterized queries (Drizzle ORM handles this)
   ```typescript
   // ✅ Good - parameterized
   await db.select().from(invoices).where(eq(invoices.id, invoiceId));
   
   // ❌ Bad - raw SQL without params
   await db.execute(`SELECT * FROM invoices WHERE id = ${invoiceId}`);
   ```

6. **XSS Protection**: Escape user-generated content
   ```typescript
   import { escapeHtml } from '@/lib/validation';
   const safe = escapeHtml(userInput);
   ```

7. **CSRF Protection**: CSRF tokens are handled by Better Auth

8. **Rate Limiting**: Implement rate limiting on sensitive endpoints (already configured)

9. **Security Headers**: Comprehensive security headers are set automatically
   - X-Frame-Options
   - X-Content-Type-Options
   - X-XSS-Protection
   - Strict-Transport-Security
   - Content-Security-Policy
   - Permissions-Policy

10. **Authentication**: Use Better Auth for all authentication flows

## Known Security Considerations

### Database Access

- Database credentials should never be exposed to the client
- All database operations go through the API layer
- Row-level security enforced via organization checks

### File Uploads

- File uploads are validated for type and size
- Files are scanned for malware (recommended)
- Uploaded files are stored in isolated buckets

### API Authentication

- Session cookies are httpOnly and secure
- API keys should be rotated regularly
- Implement proper CORS policies

### Cloudflare Workers

- Workers run in an isolated environment
- Secrets are stored in Cloudflare's secure vault
- No access to underlying infrastructure

## Security Checklist for Production

### Before Deployment

- [ ] All environment variables properly configured
- [ ] Database backups automated
- [ ] SSL/TLS certificates installed
- [ ] Rate limiting configured
- [ ] Monitoring and logging enabled
- [ ] Error tracking setup (Sentry)
- [ ] Security headers verified
- [ ] CORS policies reviewed
- [ ] Input validation comprehensive
- [ ] Authentication flows tested
- [ ] Authorization checks in place
- [ ] SQL injection protection verified
- [ ] XSS protection tested
- [ ] CSRF protection enabled
- [ ] Secure session management
- [ ] Password policies enforced
- [ ] API documentation up to date
- [ ] Third-party dependencies audited
- [ ] Penetration testing completed
- [ ] Incident response plan documented

### Regular Maintenance

- [ ] Weekly dependency updates
- [ ] Monthly security audits
- [ ] Quarterly penetration testing
- [ ] Regular access reviews
- [ ] Log analysis and monitoring
- [ ] Backup verification
- [ ] Certificate renewal
- [ ] API key rotation

## Vulnerability Management

### Severity Levels

| Level    | Description | Response Time |
|----------|-------------|---------------|
| Critical | Immediate threat, active exploitation possible | 24 hours |
| High     | Significant risk, should be patched quickly | 7 days |
| Medium   | Moderate risk, normal patch cycle | 30 days |
| Low      | Minor risk, can be addressed in regular updates | 90 days |

### Security Updates

Security updates are released as patch versions (e.g., 1.0.1) and are documented in:
- GitHub Security Advisories
- Release notes
- Email notifications to registered users

## Security Tools

### Recommended Tools

- **Dependency Scanning**: `bun audit`, Snyk, Dependabot
- **Code Analysis**: SonarQube, CodeQL
- **Secret Scanning**: GitGuardian, TruffleHog
- **Penetration Testing**: OWASP ZAP, Burp Suite
- **Monitoring**: Sentry, Datadog

### CI/CD Security

Our CI pipeline includes:
- Dependency vulnerability scanning
- Static code analysis
- Secret detection
- Container scanning
- E2E security tests

## Compliance

This project follows:
- OWASP Top 10 security guidelines
- CWE/SANS Top 25 most dangerous software errors
- GDPR requirements for data protection
- SOC 2 Type II compliance (in progress)

## Security Champions

- **Security Lead**: [Name] - security@yourdomain.com
- **DevSecOps**: [Name] - devsecops@yourdomain.com

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Security Headers](https://securityheaders.com/)

## Hall of Fame

We recognize security researchers who have responsibly disclosed vulnerabilities:

<!-- List of security researchers will be added here -->

---

Thank you for helping keep Invoicing Platform and our users safe!

**Last Updated**: February 8, 2026
