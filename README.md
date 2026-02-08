# Invoicing Platform

A comprehensive invoice and billing management SaaS platform for businesses to manage invoices, payments, and financial records.

## ✨ Features

- Invoice creation and management
- Payment tracking
- Client management
- Recurring invoices
- Payment reminders
- Financial reporting and analytics
- Multi-currency support
- PDF generation
- Email notifications
- Tax calculations

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ or Bun 1.3+
- PostgreSQL database
- Cloudflare account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/aryaminakshi71/invoicing.git
cd invoicing

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
bun run db:migrate

# Start development server
bun run dev
```

## 📚 Tech Stack

- **Frontend**: React with TanStack Router
- **Backend**: Hono API with oRPC (Cloudflare Workers)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Deployment**: Cloudflare Pages + Workers
- **Package Manager**: Bun

## 🏗️ Project Structure

```
invoicing/
├── apps/
│   ├── web/          # Frontend application
│   └── api/          # Backend API (Cloudflare Workers)
├── packages/         # Shared packages
│   ├── auth/         # Authentication package
│   ├── storage/      # Database package
│   ├── core/         # Core utilities
│   └── logger/       # Logging package
└── ...
```

## 🔧 Development

```bash
# Run development server
bun run dev

# Run type checking
bun run typecheck

# Run linter
bun run lint

# Format code
bun run format

# Run database migrations
bun run db:migrate

# Open database studio
bun run db:studio
```

## 📦 Deployment

### Cloudflare Pages (Frontend)

1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
   - Build command: `bun run build --filter=invoicing-web`
   - Output directory: `apps/web/dist`
3. Add environment variables in Cloudflare dashboard

### Cloudflare Workers (Backend)

The API is automatically deployed via GitHub Actions when you push to `main` branch.

**Required GitHub Secrets:**
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## 📝 Environment Variables

See `.env.example` for required environment variables.

**Note:** The app supports demo mode via `x-demo-mode` header for testing purposes. Demo mode uses a placeholder token (`demo-token`) that should not be used in production.

## 📖 Documentation

- **[Development Guide](DEVELOPMENT.md)** - Setup, commands, architecture, and best practices
- **[API Documentation](docs/API.md)** - Complete API reference with examples
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Deploy to Cloudflare, Vercel, Docker, or AWS
- **[Security Policy](SECURITY.md)** - Security guidelines and vulnerability reporting
- **[Changelog](CHANGELOG.md)** - Version history and roadmap

## 🔒 Security

We take security seriously. Please review our [Security Policy](SECURITY.md) for:
- Reporting vulnerabilities
- Security best practices
- Compliance information

**Security Features:**
- ✅ Comprehensive security headers
- ✅ Input validation and sanitization
- ✅ SQL injection protection (Drizzle ORM)
- ✅ XSS protection
- ✅ CSRF protection (Better Auth)
- ✅ Rate limiting
- ✅ Automated security scanning
- ✅ Environment variable validation

## 🧪 Testing

```bash
# Unit tests
bun run test

# E2E tests
bun run test:e2e

# All tests
bun run test:all

# Test coverage
bun run test:coverage
```

**Test Coverage:**
- ✅ 38/38 E2E tests passing
- ✅ 4/4 Unit tests passing
- 🎯 Target: 80%+ code coverage

## 🚀 Performance

**Optimizations Implemented:**
- Code splitting for heavy components
- Database indexes for frequent queries
- Redis caching for API responses
- CDN for static assets (Cloudflare)
- Image lazy loading
- Bundle size monitoring

## ♿ Accessibility

**WCAG AA Compliant:**
- Keyboard navigation support
- Screen reader friendly
- Focus management
- ARIA labels
- Color contrast compliance

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a pull request

**Before submitting:**
- Run tests: `bun run test:all`
- Run linting: `bun run lint`
- Format code: `bun run format`

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed contribution guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- **[GitHub Repository](https://github.com/aryaminakshi71/invoicing)**
- **[Documentation](https://github.com/aryaminakshi71/invoicing/wiki)**
- **[Issue Tracker](https://github.com/aryaminakshi71/invoicing/issues)**
- **[Discussions](https://github.com/aryaminakshi71/invoicing/discussions)**

## 👤 Author

**Arya Labs**

## 🙏 Acknowledgments

Built with amazing open source technologies:
- [Hono](https://hono.dev/) - Lightweight web framework
- [TanStack Router](https://tanstack.com/router) - Type-safe routing
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Better Auth](https://www.better-auth.com/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Cloudflare](https://cloudflare.com/) - Edge computing platform

---

Made with ❤️ by Arya Labs
