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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/aryaminakshi71/invoicing)
- [Documentation](https://github.com/aryaminakshi71/invoicing/wiki)

## 👤 Author

Arya Labs

---

Made with ❤️ by Arya Labs
