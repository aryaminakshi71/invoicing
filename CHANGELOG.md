# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - February 8, 2026

#### Infrastructure & DevOps
- **CI/CD Pipeline**: Comprehensive GitHub Actions workflow with linting, type checking, unit tests, E2E tests, and security scanning
- **Security Scanning**: Automated dependency scanning, secret detection, CodeQL analysis, and container scanning
- **Database Indexes**: Performance indexes for frequently queried columns (invoices, clients, organizations, sessions)
- **Docker Setup**: Complete Docker Compose configuration with PostgreSQL, Redis, PgAdmin, and Redis Commander
- **Dev Container**: VS Code development container configuration for consistent development environments
- **VS Code Configuration**: Debug configurations, settings, and recommended extensions

#### Developer Experience
- **Development Guide**: Comprehensive DEVELOPMENT.md with setup instructions, commands, and best practices
- **API Documentation**: Detailed API.md with endpoint documentation, examples, and SDK usage
- **Deployment Guide**: Complete DEPLOYMENT.md covering Cloudflare, Vercel, Docker, and AWS deployments
- **Security Policy**: SECURITY.md with vulnerability reporting procedures and security best practices
- **Enhanced Scripts**: Added scripts for security auditing, bundle analysis, Docker management, and more

#### Code Quality & Testing
- **API Unit Tests**: Test suite for API routers, error handling, security headers, and CORS
- **Input Validation**: Comprehensive validation utilities with XSS protection, SQL injection prevention, and sanitization
- **Performance Utilities**: Hooks for lazy loading, debouncing, throttling, infinite scroll, and web vitals reporting
- **Accessibility Utilities**: Screen reader announcements, focus management, keyboard navigation, and skip links
- **Code Splitting**: Examples and utilities for lazy loading heavy components

#### Security Enhancements
- **Security Headers Plugin**: Vite plugin to ensure security headers in all modes (development and production)
- **Enhanced Error Boundary**: Improved error boundary with Sentry integration and better UX
- **Input Sanitization**: Utilities for HTML escaping, SQL input sanitization, and filename sanitization
- **Rate Limiting**: Client-side rate limiter utility
- **CSRF Protection**: Token generation and validation helpers

#### Performance Optimizations
- **Database Indexes**: Composite indexes for common query patterns
- **Lazy Loading**: Image lazy loading utilities and component code splitting
- **Web Vitals**: Performance metrics tracking and reporting
- **Debounce/Throttle**: Performance hooks for expensive operations
- **Bundle Analysis**: Script for analyzing bundle sizes

### Fixed
- **Security Headers**: Fixed missing security headers in E2E test environment
- **Error Boundary**: Enhanced with Sentry integration and better error display

### Changed
- **Package Scripts**: Enhanced with additional utility scripts for development and deployment
- **Documentation**: Reorganized and expanded documentation structure

### Security
- **Automated Security Scanning**: Daily security scans via GitHub Actions
- **Dependency Auditing**: Automated dependency vulnerability checks
- **Secret Detection**: TruffleHog integration for secret scanning
- **License Compliance**: Automated license checking

## [1.0.0] - 2026-02-07

### Added
- Initial release
- Invoice creation and management
- Client management
- User authentication with Better Auth
- OAuth support (Google, GitHub)
- oRPC API with type safety
- PostgreSQL database with Drizzle ORM
- Cloudflare Workers deployment
- TanStack Router for routing
- Tailwind CSS styling
- E2E tests with Playwright
- Unit tests with Vitest

### Infrastructure
- Turbo monorepo setup
- Bun package manager
- Environment validation with Zod
- TypeScript strict mode enabled
- Biome for linting and formatting

## Version History

### Versioning Strategy
- **Major** (1.0.0): Breaking changes or major new features
- **Minor** (1.1.0): New features, backwards compatible
- **Patch** (1.0.1): Bug fixes and minor improvements

### Upgrade Guide

#### From 0.x to 1.x
1. Update dependencies: `bun install`
2. Run database migrations: `bun run db:migrate`
3. Update environment variables (see .env.example)
4. Review breaking changes in BREAKING_CHANGES.md

### Deprecations

None yet.

### Known Issues

- Demo mode bypass needs security audit for production use
- Recurring invoices feature incomplete
- Mobile app not yet available

### Roadmap

#### Q1 2026
- [ ] Recurring invoices completion
- [ ] Advanced reporting and analytics
- [ ] Webhook system implementation
- [ ] Email template customization
- [ ] Bulk operations

#### Q2 2026
- [ ] Mobile app (React Native or PWA)
- [ ] Multi-language support (i18n)
- [ ] Payment provider integrations
- [ ] AI-powered insights
- [ ] Team collaboration features

#### Q3 2026
- [ ] Invoice template marketplace
- [ ] Third-party integrations (Zapier, etc.)
- [ ] Advanced automation workflows
- [ ] White-label Solution
- [ ] API versioning

---

For detailed migration guides and breaking changes, see [MIGRATION.md](MIGRATION.md)
