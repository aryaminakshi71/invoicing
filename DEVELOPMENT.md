# Invoicing Platform - Development Guide

## 🚀 Quick Start

### Prerequisites
- **Bun** 1.3.5 or later
- **Node.js** 20+ (alternative to Bun)
- **PostgreSQL** 16+
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/aryaminakshi71/invoicing.git
cd invoicing

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env

# Configure your .env file with database credentials

# Run database migrations
bun run db:push

# Start development server
bun run dev
```

The application will be available at:
- **Web App**: http://localhost:3004
- **API**: http://localhost:3013

## 📁 Project Structure

```
invoicing/
├── apps/
│   ├── web/              # React frontend with TanStack Router
│   │   ├── src/
│   │   │   ├── routes/   # File-based routing
│   │   │   ├── components/
│   │   │   ├── lib/      # Utilities
│   │   │   └── stores/   # State management
│   │   └── public/
│   └── api/              # Hono API (Cloudflare Workers)
│       └── src/
│           ├── routers/  # API route handlers
│           ├── procedures/ # oRPC procedures
│           └── middleware/
├── packages/
│   ├── auth/             # Authentication (Better Auth)
│   ├── storage/          # Database & Drizzle ORM
│   ├── core/             # Core types & utilities
│   ├── env/              # Environment validation
│   └── logger/           # Structured logging
├── e2e/                  # Playwright E2E tests
└── drizzle/              # Database migrations

```

## 🛠️ Development Commands

### General
```bash
# Start all apps in development mode
bun run dev

# Run web app only (without Cloudflare)
bun run dev:no-cloudflare

# Type checking
bun run typecheck

# Linting
bun run lint
bun run lint:fix

# Formatting
bun run format
bun run format:check
```

### Database
```bash
# Generate migrations from schema changes
bun run db:generate

# Push schema changes to database (dev)
bun run db:push

# Run migrations
bun run db:migrate

# Open Drizzle Studio (database GUI)
bun run db:studio
```

### Testing
```bash
# Run all unit tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage
bun run test:coverage

# Run E2E tests
bun run test:e2e

# Run E2E tests with UI
bun run test:e2e:ui

# Run all tests (unit + integration + E2E)
bun run test:all
```

### Build
```bash
# Build all apps for production
bun run build

# Clean all build artifacts and node_modules
bun run clean
```

## 🏗️ Architecture

### Frontend (apps/web)
- **Framework**: React 18 with TypeScript
- **Router**: TanStack Router (file-based routing)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: TanStack Query for server state
- **Forms**: React Hook Form + Zod validation
- **Auth**: Better Auth client

### Backend (apps/api)
- **Framework**: Hono (lightweight web framework)
- **RPC: oRPC** for type-safe API communication
- **Runtime**: Cloudflare Workers (Node.js compatible)
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Better Auth
- **Caching**: Redis (Upstash)

### Deployment
- **Frontend**: Cloudflare Pages
- **Backend**: Cloudflare Workers
- **Database**: Neon PostgreSQL (or any PostgreSQL)
- **CDN**: Cloudflare

## 🧪 Testing Strategy

### Unit Tests
- Located in `__tests__` directories
- Use Vitest as test runner
- Test individual functions and components

### E2E Tests
- Located in `e2e/` directory
- Use Playwright for browser automation
- Test complete user workflows

### Running Tests Locally
```bash
# Ensure database is running
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16

# Run tests
bun test
bun run test:e2e
```

## 🔐 Environment Variables

### Required
```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/invoicing_db

# Auth
BETTER_AUTH_SECRET=your-secret-minimum-32-characters-long
VITE_PUBLIC_SITE_URL=http://localhost:3004

# Node Environment
NODE_ENV=development
```

### Optional
```env
# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Redis (for caching & rate limiting)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Monitoring
SENTRY_DSN=your-sentry-dsn
DATADOG_API_KEY=your-datadog-key

# Payment Processing
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🐛 Debugging

### VS Code Debugging
Launch configurations are provided in `.vscode/launch.json`:

1. **Debug Web App** - Debug the frontend
2. **Debug API** - Debug the backend
3. **Debug E2E Tests** - Debug Playwright tests
4. **Debug Full Stack** - Debug both apps simultaneously

### Browser DevTools
- React DevTools extension recommended
- TanStack Query DevTools available at `/__devtools`

### Logging
```typescript
import { logger } from '@invoicing/logger';

logger.info('message', { metadata });
logger.error('error', { error });
```

## 📦 Adding Dependencies

```bash
# Add to workspace root
bun add <package>

# Add to specific app/package
cd apps/web && bun add <package>

# Add dev dependency
bun add -d <package>
```

## 🔄 Database Migrations

### Creating a Migration
```bash
# 1. Update schema in packages/storage/src/db/schema/
# 2. Generate migration
bun run db:generate

# 3. Review generated SQL in drizzle/ directory
# 4. Apply migration
bun run db:migrate
```

### Rolling Back
Drizzle doesn't support automatic rollbacks. Manually create a down migration if needed.

## 🎨 Styling Guide

### Tailwind CSS
- Use Tailwind utility classes
- Follow mobile-first responsive design
- Use the configured theme colors

### Components
- Use shadcn/ui components from `components/ui/`
- Customize in `components/ui/` as needed
- Follow accessibility best practices

## 🤝 Contributing

### Workflow
1. Create a feature branch from `main`
2. Make your changes
3. Run tests: `bun test && bun run test:e2e`
4. Ensure linting passes: `bun run lint`
5. Format code: `bun run format`
6. Create a pull request

### Commit Messages
Follow conventional commits:
```
feat: add invoice export feature
fix: resolve authentication issue
docs: update API documentation
test: add unit tests for invoices
chore: update dependencies
```

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3004
kill -9 $(lsof -ti:3004)

# Or use different port
PORT=3005 bun run dev
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Reset database
bun run db:push --force
```

### Module Resolution Errors
```bash
# Clear Bun cache
rm -rf node_modules .turbo
bun install
```

## 📚 Additional Resources

- [TanStack Router Docs](https://tanstack.com/router)
- [Hono Documentation](https://hono.dev/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Better Auth Docs](https://www.better-auth.com/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)

## 🆘 Getting Help

- Check existing issues on GitHub
- Read the docs in `docs/` directory
- Ask in discussions tab
- Contact: [your-email]

---

Happy coding! 🎉
