# PhantomOS

**Merchandise Intelligence Platform for Gaming Publishers**

PhantomOS helps gaming publishers understand which IP assets (characters, themes, logos) drive their merchandise revenue. Connect your sales data, tag products with AI assistance, and unlock actionable insights about fan demand.

---

## What It Does

Gaming publishers sell merchandise featuring their IP but lack visibility into which characters or themes actually drive revenue. Sales data is scattered across Shopify stores, Amazon accounts, and licensing partners.

PhantomOS solves this by:
1. **Aggregating** sales data from multiple channels
2. **Mapping** products to specific IP assets (characters, logos, themes)
3. **Analyzing** performance to reveal which IPs resonate with fans

For the first time, publishers can answer: *"Which character generated the most revenue this quarter?"*

---

## Live Features

### Dashboard Overview
- Revenue metrics with growth indicators
- Revenue trend charts (monthly view)
- Category breakdown visualization
- Recent orders table
- Export to CSV

### Fan Intelligence Hub
- AI-powered insights using Claude
- Opportunity detection ("Shadow Knight trending +40%")
- Risk alerts ("Villain merch declining")
- Actionable recommendations
- Confidence scoring

### Asset Tagging
- Product list with mapping status
- AI-assisted tagging suggestions
- Batch auto-tag functionality
- Game IP and character management
- Progress tracking (mapped vs unmapped)

### Data Connectors
- **Shopify OAuth** - Full OAuth integration
- **CSV Import** - Products and sales data
- Sync status tracking
- Disconnect/reconnect capability

### Team Management
- Invite team members via secure tokens
- Role-based access (Owner, Admin, Member, Analyst)
- Pending invitation management

### Marketing Site
- Landing page with value proposition
- Features overview
- FAQ page (replaces pricing)
- Roadmap page
- Waitlist/pilot signup

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Database | Neon PostgreSQL (serverless) |
| ORM | Drizzle ORM |
| Auth | NextAuth.js |
| AI | Anthropic Claude API |
| Charts | Recharts |

---

## Project Structure

```
phantomos/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login, registration, invites
│   │   ├── (dashboard)/         # Protected dashboard pages
│   │   │   ├── overview/        # Main dashboard
│   │   │   ├── intelligence/    # Fan Intelligence Hub
│   │   │   ├── products/        # Asset tagging
│   │   │   ├── connectors/      # Data sources
│   │   │   └── settings/        # Account settings
│   │   ├── (marketing)/         # Public marketing site
│   │   │   ├── features/        # Feature pages
│   │   │   ├── faq/             # FAQ page
│   │   │   ├── roadmap/         # Product roadmap
│   │   │   └── waitlist/        # Pilot signup
│   │   └── api/                 # API routes
│   │       ├── ai/              # AI endpoints
│   │       ├── connectors/      # Connector management
│   │       ├── dashboard/       # Dashboard stats
│   │       ├── products/        # Product CRUD
│   │       ├── sales/           # Sales import
│   │       └── waitlist/        # Waitlist API
│   ├── components/
│   │   ├── charts/              # Data visualizations
│   │   ├── dashboard/           # Dashboard UI
│   │   ├── marketing/           # Marketing site components
│   │   └── ui/                  # Base UI components
│   └── lib/
│       ├── auth/                # NextAuth config
│       ├── db/                  # Drizzle + schema
│       └── pilot.ts             # Pilot mode utilities
├── scripts/
│   └── seed-demo-data.ts        # Demo data generator
├── public/
│   └── logos/                   # Connector logos
└── middleware.ts                # Route protection
```

---

## Database Schema

### Core Tables

| Table | Purpose |
|-------|---------|
| `publishers` | Multi-tenant organizations |
| `users` | Team members |
| `game_ips` | Game franchises |
| `ip_assets` | Characters, logos, themes |
| `connectors` | Data source integrations |
| `products` | Merchandise items |
| `product_assets` | Product-to-asset mapping |
| `sales` | Transaction records |
| `ai_insights` | AI-generated recommendations |
| `invitations` | Pending team invites |
| `waitlist` | Pilot program signups |

---

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Shopify OAuth
SHOPIFY_API_KEY=...
SHOPIFY_API_SECRET=...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEMO_MODE=true

# Pilot Mode
PILOT_MODE=true
ALLOWED_EMAILS=your@email.com
ADMIN_SECRET_KEY=random-secret
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL (or Neon account)
- Anthropic API key

### Setup

```bash
# Clone
git clone https://github.com/ptengelmann/PhantomOS.git
cd phantomos

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local with your credentials

# Database
npx drizzle-kit push

# Development
npm run dev
```

### Demo Data (Optional)

Seed the database with fictional "Phantom Warriors" game data:

```bash
npx tsx scripts/seed-demo-data.ts
```

This creates:
- 1 Game IP with 6 characters
- 60 products mapped to characters
- 6 months of sales data (~$227K revenue)

---

## Pilot Mode

The waitlist system controls access during the pilot phase:

- `PILOT_MODE=true` redirects `/register` to `/waitlist`
- `ALLOWED_EMAILS` bypasses restrictions for developers
- Landing page CTAs point to waitlist
- Approved users can register normally

See `PILOT_SYSTEM.md` for detailed documentation.

---

## API Endpoints

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Dashboard metrics |
| GET | `/api/connectors` | List connectors |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/insights` | Generate AI insights |
| POST | `/api/ai/tagging` | Product tagging suggestions |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products |
| POST | `/api/products/import` | Import from CSV |
| POST | `/api/products/auto-tag` | Batch AI tagging |
| GET | `/api/products/[id]/assets` | Get product assets |
| POST | `/api/products/[id]/assets` | Link assets |

### Connectors
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/connectors/shopify/auth` | Start OAuth |
| POST | `/api/connectors/shopify/sync/products` | Sync products |
| POST | `/api/connectors/shopify/sync/orders` | Sync orders |
| DELETE | `/api/connectors/[id]` | Disconnect |

### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings/team` | List team members |
| POST | `/api/settings/invite` | Create invitation |

### Waitlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/waitlist` | Submit signup |
| GET | `/api/waitlist?key=SECRET` | List entries (admin) |

---

## Roadmap

### Live Now
- Dashboard with revenue analytics
- Fan Intelligence Hub with AI insights
- AI-assisted asset tagging
- Shopify OAuth + CSV import

### Coming Q1 2026
- Amazon Seller Central connector
- AI image recognition for products
- Advanced filtering and search
- WooCommerce connector

### Future (2026+)
- Merch Studio (AI design tools)
- Print-on-demand integration
- Creator partnerships
- Custom storefronts

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npx drizzle-kit push` | Push schema to DB |
| `npx tsx scripts/seed-demo-data.ts` | Seed demo data |

---

## Design System

PhantomOS uses a minimalist design language:
- **Colors**: White backgrounds, black text, gray accents
- **Borders**: 1px borders, no border-radius
- **Typography**: Clean, data-focused
- **Philosophy**: "Invisible design" - the data is the focus

---

## License

Proprietary - All rights reserved.

---

## Contact

For pilot program inquiries: hello@phantomos.com

---

*Built for gaming publishers who know their IP is their most valuable asset.*
