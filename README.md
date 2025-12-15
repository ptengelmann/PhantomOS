# PhantomOS

**The Operating System for Gaming Merchandise**

PhantomOS is an AI-powered merchandise intelligence platform for gaming publishers. Connect your sales data, map products to IP assets with AI assistance, and unlock insights into what fans actually want.

---

## The Problem

Gaming publishers sell merchandise featuring their IP but operate blind:
- Sales data scattered across Shopify, Amazon, licensing partners
- No visibility into which characters/themes drive revenue
- Can't answer: *"Which character sold best this quarter?"*

## The Solution

PhantomOS aggregates, maps, and analyzes merchandise data:

1. **Connect** - Shopify OAuth, CSV import (Amazon, WooCommerce coming)
2. **Map** - AI-assisted product tagging to characters, themes, logos
3. **Analyze** - Revenue by IP asset, trend detection, demand forecasting

**Our moat:** The IP Asset Graph - a proprietary database of product-to-character mappings that doesn't exist anywhere else. See `COMPETITIVE_MOAT.md` for details.

---

## Live Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Revenue metrics, growth trends, category breakdown, asset performance charts |
| **Fan Intelligence Hub** | AI-powered insights with history tracking - mark recommendations as actioned, view past analyses |
| **Asset Tagging** | Map products to game IPs and characters with AI suggestions |
| **Data Connectors** | Shopify OAuth, CSV import for products and sales |
| **Settings** | Account management, team invites with secure tokens |
| **Pilot Waitlist** | Gated access system for controlled launch |
| **Role-Based Access** | Owner/Admin can edit; Member/Analyst are read-only |
| **Analytics Tracking** | Posthog integration for user behavior insights |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Database | Neon PostgreSQL (serverless) |
| ORM | Drizzle ORM |
| Auth | NextAuth.js v4 (credentials, JWT) |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| Analytics | Posthog (EU region) |
| Charts | Recharts |
| Icons | Lucide React |

---

## Quick Start

```bash
# Clone and install
git clone https://github.com/ptengelmann/PhantomOS.git
cd phantomos
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Push database schema
npx drizzle-kit push

# Run development server
npm run dev
```

### Demo Data (Optional)

Seed with fictional "Phantom Warriors" game data:

```bash
DATABASE_URL="your-connection-string" npx tsx scripts/seed-demo-data.ts
```

Creates: 1 Game IP, 6 characters, 60 products, 6 months of sales (~$227K revenue)

### Generate Analytics Snapshots

Populate analytics_snapshots and ai_insights tables:

```bash
DATABASE_URL="your-connection-string" npx tsx scripts/generate-analytics.ts --insights
```

---

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Auth
NEXTAUTH_SECRET=random-32-char-string
NEXTAUTH_URL=http://localhost:3000

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Analytics (Posthog)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com  # or https://us.i.posthog.com

# Shopify OAuth
SHOPIFY_API_KEY=your-shopify-api-key
SHOPIFY_API_SECRET=your-shopify-api-secret

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Pilot Mode (optional)
PILOT_MODE=true
ALLOWED_EMAILS=dev@example.com
ADMIN_SECRET_KEY=your-admin-secret
```

---

## Project Structure

```
phantomos/
├── src/
│   ├── app/
│   │   ├── (marketing)/      # Public: landing, features, FAQ, roadmap, waitlist
│   │   ├── (dashboard)/      # Protected: overview, intelligence, products, connectors, settings
│   │   ├── admin/            # Waitlist management
│   │   └── api/              # REST endpoints
│   ├── components/
│   │   ├── ui/               # Button, Card, Input, Badge, Table, Select
│   │   ├── charts/           # RevenueChart, AssetPerformanceChart, CategoryBreakdown
│   │   ├── dashboard/        # Sidebar, Header, StatsCard, ConnectorWizard
│   │   ├── marketing/        # Navbar, Footer
│   │   └── providers/        # SessionProvider, AnalyticsProvider
│   └── lib/
│       ├── db/schema.ts      # Drizzle schema (12 tables)
│       ├── ai/index.ts       # Claude AI integration
│       ├── auth/index.ts     # NextAuth config
│       ├── analytics/        # Posthog integration
│       └── utils/index.ts    # Helpers
├── scripts/                   # Database scripts
├── middleware.ts              # Route protection
└── drizzle.config.ts         # ORM config
```

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `users` | Auth accounts, linked to publisher |
| `publishers` | Multi-tenant organizations |
| `connectors` | Data sources (Shopify, CSV, etc.) |
| `game_ips` | Game franchises |
| `ip_assets` | Characters, logos, themes within games |
| `products` | Merchandise items |
| `product_assets` | Many-to-many: products ↔ IP assets |
| `sales` | Order/revenue records |
| `analytics_snapshots` | Pre-computed daily/weekly/monthly metrics |
| `ai_insights` | Persisted AI-generated recommendations |
| `waitlist` | Pilot program applications |
| `invitations` | Registration tokens for approved users |

See `ARCHITECTURE.md` for complete schema details.

---

## API Endpoints

### Dashboard & Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Revenue, orders, top assets |
| GET | `/api/products` | Product list with filters |
| POST | `/api/products` | Create/import products |
| GET | `/api/connectors` | List connected sources |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ai/insights` | Retrieve stored insights |
| POST | `/api/ai/insights` | Generate & persist Claude insights |
| PATCH | `/api/ai/insights` | Mark insight as read |
| POST | `/api/ai/tagging` | AI product tag suggestions |
| POST | `/api/ai/forecast` | Revenue forecasting |

### Connectors
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/connectors/shopify/auth` | Initiate OAuth |
| GET | `/api/connectors/shopify/callback` | OAuth callback |
| POST | `/api/connectors/shopify/sync/products` | Sync products |
| POST | `/api/connectors/shopify/sync/orders` | Sync orders |

### Waitlist (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/waitlist` | Submit application |
| GET | `/api/waitlist/admin` | List entries (requires key) |
| POST | `/api/waitlist/approve` | Approve application |
| POST | `/api/waitlist/reject` | Reject application |

---

## Design System

Monochromatic minimalism:

| Element | Style |
|---------|-------|
| Colors | `#0a0a0a` (black), `#737373` (gray), `#e5e5e5` (border), `#fafafa` (bg) |
| Borders | 1px solid, no border-radius |
| Typography | Geist font, uppercase tracking-wide labels |
| Philosophy | Data-first, invisible design |

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (port 3000) |
| `npm run build` | Production build |
| `npx drizzle-kit push` | Push schema to database |
| `npx drizzle-kit studio` | Open Drizzle Studio |
| `npx tsx scripts/seed-demo-data.ts` | Seed demo data |
| `npx tsx scripts/generate-analytics.ts` | Generate analytics snapshots |

---

## User Management

Scripts for managing users and companies (run with `DATABASE_URL` env var):

```bash
# Create demo user (read-only access to demo data)
npx tsx scripts/create-demo-user.ts email@example.com Password123 "User Name"

# Create new company (fresh account, no demo data)
npx tsx scripts/create-company.ts "Company Name" admin@company.com Password123 "Admin Name"

# Reset user password
npx tsx scripts/reset-password.ts email@example.com NewPassword123

# Check user account details
npx tsx scripts/check-user.ts email@example.com
```

### User Roles

| Role | Access Level |
|------|--------------|
| `owner` | Full access - edit, delete, invite, manage |
| `admin` | Full access - edit, delete, invite |
| `member` | Read-only - view data only |
| `analyst` | Read-only - view data only |

---

## Documentation

| File | Purpose |
|------|---------|
| `README.md` | This file - quick start guide |
| `ARCHITECTURE.md` | Technical architecture details |
| `ROADMAP.md` | Product roadmap and priorities |
| `COMPETITIVE_MOAT.md` | Defensibility and moat strategy |
| `INVESTOR_READINESS_CHECKLIST.md` | Launch readiness tracking |

---

## Roadmap

**Current Focus:** Intelligence Platform (Phase 1)
- Grow the IP Asset Graph
- Improve AI tagging accuracy
- Expand pilot program

**Future Vision (Post-PMF):**
- Advanced AI (image recognition, NL queries)
- Additional connectors (Amazon, WooCommerce)
- Enterprise features (SSO, audit logging)

See `ROADMAP.md` for full details.

---

## License

Proprietary - All rights reserved.

---

*Built for gaming publishers who know their IP is their most valuable asset.*
