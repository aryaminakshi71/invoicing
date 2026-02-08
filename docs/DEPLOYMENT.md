# Invoicing Platform - Deployment Guide

## Deployment Options

### Option 1: Cloudflare (Recommended)

#### Prerequisites
- Cloudflare account
- Wrangler CLI installed: `bun add -g wrangler`
- Cloudflare API token

#### Database Setup (Neon)
1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy connection string

#### Deploy API (Cloudflare Workers)

```bash
cd apps/api

# Login to Cloudflare
wrangler login

# Create KV namespace for sessions
wrangler kv:namespace create "AUTH_KV"
wrangler kv:namespace create "AUTH_KV" --preview

# Create Hyperdrive for database
wrangler hyperdrive create invoicing-db --connection-string="postgresql://..."

# Update wrangler.jsonc with IDs

# Set secrets
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put GITHUB_CLIENT_SECRET

# Deploy
wrangler deploy
```

#### Deploy Web (Cloudflare Pages)

```bash
cd apps/web

# Build
bun run build

# Deploy
wrangler pages deploy dist

# Or connect your GitHub repo to Cloudflare Pages dashboard for automatic deployments
```

#### Custom Domain
1. Go to Cloudflare Pages dashboard
2. Add custom domain
3. Update DNS records as instructed

### Option 2: Vercel

#### Deploy API
```bash
cd apps/api

# Install Vercel CLI
bun add -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

#### Deploy Web
```bash
cd apps/web
vercel --prod
```

### Option 3: Docker

#### Build Images
```bash
# Build API
docker build -t invoicing-api -f apps/api/Dockerfile .

# Build Web
docker build -t invoicing-web -f apps/web/Dockerfile .
```

#### Create Dockerfiles

**apps/api/Dockerfile:**
```dockerfile
FROM oven/bun:1 as builder
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/api ./apps/api
COPY packages ./packages
RUN bun install --frozen-lockfile
RUN cd apps/api && bun run build

FROM oven/bun:1-slim
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3013
CMD ["bun", "dist/index.js"]
```

**apps/web/Dockerfile:**
```dockerfile
FROM oven/bun:1 as builder
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/web ./apps/web
COPY packages ./packages
RUN bun install --frozen-lockfile
RUN cd apps/web && bun run build

FROM nginx:alpine
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Run with Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Option 4: AWS

#### Deploy with AWS CDK
```bash
cd infrastructure/aws
bunx cdk deploy
```

## Environment Variables

### Production Environment Variables

#### API (.env)
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/invoicing_prod

# Auth
BETTER_AUTH_SECRET=your-production-secret-min-32-chars
VITE_PUBLIC_SITE_URL=https://yourdomain.com

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Redis
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
DATADOG_API_KEY=your-datadog-key

# Node
NODE_ENV=production
```

## Database Migrations

### Run Migrations
```bash
# Production migration
DATABASE_URL="postgresql://..." bun run db:migrate
```

### Backup Before Migration
```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore if needed
psql $DATABASE_URL < backup-20260208.sql
```

## SSL/TLS Setup

### Cloudflare Pages
- Automatic SSL with Cloudflare's Universal SSL
- Enable "Always Use HTTPS" in SSL/TLS settings

### Custom SSL
```bash
# Let's Encrypt with Certbot
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## CDN Configuration

### Cloudflare CDN
1. Enable "Auto Minify" for JS, CSS, HTML
2. Enable "Brotli" compression
3. Set browser cache TTL
4. Configure page rules for static assets

### Cache-Control Headers
```typescript
// In your server configuration
headers.set('Cache-Control', 'public, max-age=31536000, immutable');
```

## Monitoring Setup

### Sentry
```bash
# Install Sentry CLI
curl -sL https://sentry.io/get-cli/ | bash

# Create release
sentry-cli releases new $RELEASE_VERSION
sentry-cli releases set-commits $RELEASE_VERSION --auto
sentry-cli releases finalize $RELEASE_VERSION
```

### Datadog
```typescript
// Already configured in apps/api/src/lib/datadog.ts
import { initDatadog } from './lib/datadog';
initDatadog();
```

## Health Checks

### API Health Endpoint
```bash
curl https://api.yourdomain.com/api/health
```

### Uptime Monitoring
Set up monitors in:
- Uptime Robot
- Pingdom
- Datadog Synthetics
- Better Uptime

## Load Balancing

### Cloudflare Load Balancer
1. Create origin pools
2. Configure health checks
3. Set up geographic steering
4. Enable session affinity if needed

## Backup Strategy

### Database Backups
```bash
# Automated daily backups
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz

# Retain backups for 30 days
find /backups -name "db-*.sql.gz" -mtime +30 -delete
```

### Application Backups
- Code: GitHub repository
- Configurations: Version controlled
- Media files: S3/R2 bucket with versioning

## Rollback Procedure

### Code Rollback
```bash
# Cloudflare Pages
wrangler pages deployment list
wrangler pages deployment retry <deployment-id>

# Or use Cloudflare dashboard to promote previous deployment
```

### Database Rollback
```bash
# Restore from backup
psql $DATABASE_URL < backup-20260207.sql

# Run down migration if available
bun run migrate:rollback
```

## Performance Optimization

### Enable Caching
```typescript
// API response caching
if (cache.has(key)) {
  return cache.get(key);
}
const result = await fetchData();
cache.set(key, result, { ex: 3600 }); // 1 hour
```

### Database Optimization
```sql
-- Add indexes (already in migration)
-- Enable query plan analysis
EXPLAIN ANALYZE SELECT * FROM invoices WHERE status = 'paid';

-- Vacuum regularly
VACUUM ANALYZE;
```

### CDN for Static Assets
- Images → Cloudflare Images or R2 + CDN
- JavaScript/CSS → Bundled and minified
- Fonts → Served from CDN

## Security Checklist

- [ ] SSL/TLS enabled
- [ ] Security headers configured
- [ ] CORS policies set
- [ ] Rate limiting enabled
- [ ] Database credentials rotated
- [ ] API keys secured
- [ ] WAF enabled (Cloudflare)
- [ ] DDoS protection enabled
- [ ] Monitoring alerts configured
- [ ] Backup verification scheduled
- [ ] Access logs enabled
- [ ] Error tracking configured

## Cost Optimization

### Cloudflare
- Use Workers KV for sessions (10GB free)
- Optimize database queries to reduce Hyperdrive usage
- Use R2 for file storage (10GB free)
- Enable caching to reduce compute time

### Database
- Use connection pooling
- Clean up old sessions regularly
- Archive old invoices
- Optimize indexes

## Troubleshooting

### Common Issues

**502 Bad Gateway**
- Check API health endpoint
- Verify database connection
- Check Cloudflare Workers logs

**Slow Response Times**
- Check database query performance
- Verify CDN caching
- Check for memory leaks

**Database Connection Errors**
- Verify connection string
- Check firewall rules
- Ensure database is running

## Support

For deployment support:
- Documentation: https://docs.yourdomain.com
- Discord: https://discord.gg/yourdomain
- Email: devops@yourdomain.com

---

Last updated: February 8, 2026
