# PhantomOS

**The Gaming Commerce Operating System**

PhantomOS is a B2B SaaS platform that transforms how gaming publishers monetize their intellectual property. It serves as the central nervous system for gaming merchandise operations, connecting fragmented sales data with AI-powered analytics to unlock the hidden value in gaming IP portfolios.

---

## The Problem

Gaming publishers sit on goldmines of intellectual property—beloved characters, iconic logos, memorable themes—but struggle to understand which assets actually drive merchandise revenue. The data exists, but it's scattered across Shopify stores, Amazon seller accounts, licensing partner spreadsheets, and countless other sources.

Without visibility into what's working, publishers:
- Can't identify which characters or themes resonate with fans
- Miss opportunities to capitalize on trending assets
- Lack data to negotiate better licensing deals
- Make merchandise decisions based on gut feeling, not evidence

## The Solution

PhantomOS connects to every sales channel, normalizes the data, and uses AI to map products back to specific IP assets. For the first time, publishers can answer questions like:

- *"Which character generated the most revenue this quarter?"*
- *"How is our villain performing compared to our hero?"*
- *"What product categories should we expand into?"*

---

## Core Capabilities

### 1. Data Connectors
Unified ingestion from multiple e-commerce platforms:
- **Shopify** - Direct store integration
- **Amazon** - Seller Central & Vendor Central
- **WooCommerce** - WordPress-based stores
- **BigCommerce** - Enterprise e-commerce
- **Custom API** - Proprietary systems

### 2. AI-Powered Asset Tagging
Products are automatically analyzed and mapped to IP assets using Claude AI:
- Natural language understanding of product titles and descriptions
- Image analysis for character/logo recognition
- Confidence scoring for suggested mappings
- Human-in-the-loop verification workflow

### 3. Fan Intelligence Hub
Real-time analytics on IP performance:
- Revenue attribution by character, theme, or logo
- Trend detection across time periods
- Category breakdown analysis
- Comparative asset performance

### 4. AI Insights Engine
Proactive recommendations powered by Claude:
- Growth opportunities ("Character X is trending—expand product line")
- Risk alerts ("Revenue declining for IP Y—investigate")
- Market predictions ("Q4 forecast based on historical patterns")
- Strategic recommendations ("Consider licensing to partner Z")

### 5. Multi-Tenant Security
Enterprise-grade isolation for publisher data:
- Session-based authentication with NextAuth.js
- Publisher-scoped data queries
- Role-based access control (Owner, Admin, Member, Analyst)
- Secure team invitation system

---

## Technical Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16, React 19, TypeScript | Server-side rendering, type safety |
| **Styling** | Tailwind CSS 4 | Utility-first CSS, design system |
| **Database** | Neon PostgreSQL | Serverless Postgres, auto-scaling |
| **ORM** | Drizzle ORM | Type-safe database queries |
| **Authentication** | NextAuth.js | Session management, JWT tokens |
| **AI** | Anthropic Claude API | Insights, tagging, forecasting |
| **Charts** | Recharts | Data visualization |
| **Icons** | Lucide React | Consistent iconography |

### Design Philosophy

PhantomOS follows a **minimalist design system**:
- **Colors**: White backgrounds, black text, gray accents
- **Borders**: Thin 1px borders, no rounded corners
- **Typography**: Clean, professional, data-focused
- **Spacing**: Consistent padding and margins
- **Philosophy**: "Invisible design"—the platform fades away, the data shines

---

## Project Structure

```
phantomos/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication routes
│   │   │   ├── invite/               # Team invitation acceptance
│   │   │   └── login/                # User login
│   │   ├── (dashboard)/              # Protected dashboard routes
│   │   │   ├── connectors/           # Data source management
│   │   │   ├── intelligence/         # Fan Intelligence Hub
│   │   │   ├── overview/             # Dashboard home
│   │   │   ├── products/             # Product & asset mapping
│   │   │   ├── settings/             # Account & team settings
│   │   │   └── layout.tsx            # Dashboard shell
│   │   ├── api/                      # API Routes
│   │   │   ├── ai/                   # AI endpoints
│   │   │   │   ├── forecast/         # Revenue forecasting
│   │   │   │   ├── insights/         # AI recommendations
│   │   │   │   └── tagging/          # Product-to-asset mapping
│   │   │   ├── analytics/            # Analytics endpoints
│   │   │   │   ├── assets/           # Asset performance
│   │   │   │   └── route.ts          # General analytics
│   │   │   ├── auth/                 # NextAuth handlers
│   │   │   ├── products/             # Product management
│   │   │   │   ├── import/           # CSV/API import
│   │   │   │   └── mapping/          # Asset mapping CRUD
│   │   │   └── settings/             # Settings endpoints
│   │   │       └── invite/           # Team invitations
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing redirect
│   │
│   ├── components/                   # React components
│   │   ├── charts/                   # Data visualizations
│   │   │   ├── asset-performance-chart.tsx
│   │   │   ├── category-breakdown.tsx
│   │   │   └── revenue-chart.tsx
│   │   ├── dashboard/                # Dashboard UI
│   │   │   ├── connector-wizard.tsx  # Multi-step connector setup
│   │   │   ├── header.tsx            # Page headers
│   │   │   ├── sidebar.tsx           # Navigation sidebar
│   │   │   └── stats-card.tsx        # Metric cards
│   │   ├── providers/                # Context providers
│   │   │   └── session-provider.tsx  # Auth session context
│   │   └── ui/                       # Base UI components
│   │       ├── badge.tsx             # Status badges
│   │       ├── button.tsx            # Button variants
│   │       ├── card.tsx              # Card containers
│   │       ├── input.tsx             # Form inputs
│   │       ├── select.tsx            # Dropdown selects
│   │       └── table.tsx             # Data tables
│   │
│   ├── lib/                          # Core libraries
│   │   ├── ai/                       # AI integration
│   │   │   └── index.ts              # Claude API client
│   │   ├── auth/                     # Authentication
│   │   │   └── index.ts              # NextAuth config
│   │   ├── db/                       # Database
│   │   │   ├── index.ts              # Drizzle client
│   │   │   └── schema.ts             # Database schema
│   │   ├── demo-data.ts              # Demo mode data
│   │   └── utils/                    # Utilities
│   │       └── index.ts              # Helper functions
│   │
│   └── types/                        # TypeScript types
│       └── index.ts                  # Shared type definitions
│
├── public/                           # Static assets
│   └── logo.png                      # PhantomOS logo
│
├── drizzle.config.ts                 # Drizzle ORM config
├── middleware.ts                     # Route protection
├── next.config.ts                    # Next.js config
├── tailwind.config.ts                # Tailwind config
├── tsconfig.json                     # TypeScript config
└── package.json                      # Dependencies
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   Publishers    │───┬───│     Users       │       │   Invitations   │
│─────────────────│   │   │─────────────────│       │─────────────────│
│ id              │   │   │ id              │       │ id              │
│ name            │   │   │ publisherId ────┼───────│ publisherId     │
│ slug            │   │   │ email           │       │ email           │
│ subscriptionTier│   │   │ name            │       │ token           │
│ settings        │   │   │ role            │       │ role            │
└────────┬────────┘   │   └─────────────────┘       │ status          │
         │            │                              │ expiresAt       │
         │            └──────────────────────────────┴─────────────────┘
         │
         ├─────────────────────────────────────────────────────────────┐
         │                                                             │
    ┌────┴────────────┐       ┌─────────────────┐       ┌─────────────┴───┐
    │    Game IPs     │───────│    IP Assets    │       │   Connectors    │
    │─────────────────│       │─────────────────│       │─────────────────│
    │ id              │       │ id              │       │ id              │
    │ publisherId     │       │ gameIpId        │       │ publisherId     │
    │ name            │       │ name            │       │ type            │
    │ genre           │       │ assetType       │       │ credentials     │
    │ platforms       │       │ popularity      │       │ lastSyncAt      │
    └────────┬────────┘       └────────┬────────┘       └────────┬────────┘
             │                         │                         │
             │                         │                         │
    ┌────────┴────────────────────────┴─────────────────────────┴────────┐
    │                              Products                               │
    │─────────────────────────────────────────────────────────────────────│
    │ id            │ publisherId    │ gameIpId      │ connectorId        │
    │ name          │ category       │ price         │ sku                │
    │ mappingStatus │ aiSuggestedAssets              │ totalRevenue       │
    └────────────────────────────────┬────────────────────────────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
    ┌─────────┴─────────┐  ┌─────────┴─────────┐  ┌─────────┴─────────┐
    │   Product Assets  │  │      Sales        │  │   AI Insights     │
    │───────────────────│  │───────────────────│  │───────────────────│
    │ productId         │  │ productId         │  │ publisherId       │
    │ assetId           │  │ quantity          │  │ type              │
    │ isPrimary         │  │ revenue           │  │ title             │
    └───────────────────┘  │ region            │  │ confidence        │
                           │ orderDate         │  │ data              │
                           └───────────────────┘  └───────────────────┘
```

### Table Definitions

#### `publishers`
Multi-tenant root entity representing gaming studios/publishers.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Publisher display name |
| slug | VARCHAR(255) | URL-safe identifier |
| logo | TEXT | Logo image URL |
| website | TEXT | Publisher website |
| subscriptionTier | ENUM | starter, growth, enterprise |
| settings | JSONB | Custom configuration |

#### `users`
Team members within a publisher organization.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| publisherId | UUID | FK to publishers |
| email | VARCHAR(255) | Unique email address |
| name | VARCHAR(255) | Display name |
| role | VARCHAR(50) | owner, admin, member, analyst |

#### `game_ips`
Individual game franchises owned by a publisher.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| publisherId | UUID | FK to publishers |
| name | VARCHAR(255) | Game title |
| slug | VARCHAR(255) | URL-safe identifier |
| genre | VARCHAR(100) | Game genre |
| platforms | JSONB | Array of platforms |

#### `ip_assets`
Individual assets within a game IP (characters, logos, themes).

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| gameIpId | UUID | FK to game_ips |
| name | VARCHAR(255) | Asset name |
| assetType | ENUM | character, logo, scene, item, theme, other |
| popularity | INTEGER | Popularity score |
| tags | JSONB | Searchable tags |

#### `connectors`
Data source integrations (Shopify, Amazon, etc.).

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| publisherId | UUID | FK to publishers |
| type | ENUM | shopify, amazon, woocommerce, bigcommerce, custom |
| credentials | JSONB | Encrypted auth credentials |
| lastSyncAt | TIMESTAMP | Last successful sync |
| status | VARCHAR(50) | pending, active, error |

#### `products`
Merchandise items ingested from connectors.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| publisherId | UUID | FK to publishers |
| gameIpId | UUID | FK to game_ips (optional) |
| connectorId | UUID | FK to connectors |
| name | VARCHAR(500) | Product title |
| category | ENUM | apparel, collectibles, accessories, home, digital, other |
| mappingStatus | ENUM | unmapped, suggested, confirmed, skipped |
| aiSuggestedAssets | JSONB | AI mapping suggestions |
| totalRevenue | DECIMAL | Cached revenue for sorting |

#### `product_assets`
Many-to-many link between products and IP assets.

| Column | Type | Description |
|--------|------|-------------|
| productId | UUID | FK to products |
| assetId | UUID | FK to ip_assets |
| isPrimary | BOOLEAN | Primary asset flag |

#### `sales`
Individual sale transactions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| publisherId | UUID | FK to publishers |
| productId | UUID | FK to products |
| quantity | INTEGER | Units sold |
| revenue | DECIMAL | Total revenue |
| region | VARCHAR(100) | Geographic region |
| orderDate | TIMESTAMP | Transaction date |

#### `invitations`
Pending team member invitations.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| token | VARCHAR(256) | Secure invite token |
| email | VARCHAR(255) | Invitee email |
| role | ENUM | admin, member, analyst |
| status | ENUM | pending, accepted, expired, revoked |
| expiresAt | TIMESTAMP | Token expiration |

#### `ai_insights`
AI-generated recommendations and alerts.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| publisherId | UUID | FK to publishers |
| type | VARCHAR(100) | Insight category |
| title | VARCHAR(500) | Insight headline |
| description | TEXT | Detailed explanation |
| confidence | DECIMAL | AI confidence score |

---

## API Reference

### Authentication

All API endpoints require authentication via NextAuth.js session or demo mode.

```typescript
// Authentication check pattern
if (isDemoMode()) {
  publisherId = getDemoPublisherId();
} else {
  const session = await getServerSession();
  if (!session?.user?.publisherId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  publisherId = session.user.publisherId;
}
```

### Endpoints

#### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Dashboard metrics (revenue, products, growth) |
| GET | `/api/analytics/assets` | Asset performance data |

#### AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/insights` | Generate AI recommendations |
| POST | `/api/ai/tagging` | AI-powered product-to-asset mapping |
| POST | `/api/ai/forecast` | Revenue forecasting |

#### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/products/import` | Import products from CSV/API |
| GET | `/api/products/mapping` | Get products for mapping |
| POST | `/api/products/mapping` | Save asset mapping |
| POST | `/api/products/mapping/bulk` | Bulk mapping operations |

#### Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/settings/invite` | Create team invitation |
| GET | `/api/settings/invite` | List pending invitations |
| DELETE | `/api/settings/invite` | Revoke invitation |
| GET | `/api/settings/invite/validate` | Validate invite token |
| POST | `/api/settings/invite/validate` | Redeem invitation |

---

## Pages & Features

### Landing Page (`/`)
Redirects authenticated users to dashboard, others to login.

### Login (`/login`)
Authentication page with email/password form. Demo mode bypasses authentication.

### Invite (`/invite?token=xxx`)
Team invitation acceptance flow:
1. Validates token
2. Collects name and password
3. Creates user account
4. Associates with publisher

### Overview (`/overview`)
Dashboard home with:
- Revenue metrics (total, growth, average order)
- Revenue trend chart (12-month view)
- Category breakdown (pie chart)
- Top products table

### Fan Intelligence (`/intelligence`)
AI-powered insights hub:
- Asset performance comparison chart
- AI-generated recommendations
- Trending assets
- Risk alerts
- Growth opportunities

### Products (`/products`)
Asset tagging workbench:
- Product list with mapping status
- AI suggestion interface
- Bulk mapping tools
- Search and filter
- Progress tracking

### Connectors (`/connectors`)
Data source management:
- Connected platforms list
- Multi-step connection wizard
- Sync status and history
- Credential management

### Settings (`/settings`)
Account and organization management:
- **Profile**: User details, avatar
- **Organization**: Publisher info, subscription
- **Team**: Member list, invitations
- **API Keys**: Integration credentials
- **Notifications**: Alert preferences (coming soon)
- **Security**: Password, 2FA (coming soon)
- **Billing**: Subscription management (coming soon)

---

## AI Integration

### Claude API Client

Located at `src/lib/ai/index.ts`, the AI module provides:

```typescript
const ai = new AIClient();

// Generate insights
const insights = await ai.generateInsights(salesData, assetData);

// Suggest asset mappings
const suggestions = await ai.suggestAssetMapping(product, availableAssets);

// Forecast revenue
const forecast = await ai.forecastRevenue(historicalData);
```

### Insight Types

| Type | Description |
|------|-------------|
| `growth_opportunity` | Asset showing positive momentum |
| `risk_alert` | Declining performance warning |
| `trend_detection` | Emerging pattern identified |
| `recommendation` | Strategic suggestion |
| `forecast` | Future performance prediction |

### Tagging Workflow

1. **Ingestion**: Products imported from connectors
2. **AI Analysis**: Claude analyzes product name, description, image
3. **Suggestion**: AI proposes asset mappings with confidence scores
4. **Review**: Human verifies or adjusts suggestions
5. **Confirmation**: Mappings saved to database
6. **Attribution**: Sales attributed to confirmed assets

---

## Security Model

### Authentication Flow

```
┌──────────┐     ┌───────────┐     ┌──────────────┐
│  Client  │────▶│ NextAuth  │────▶│   Database   │
└──────────┘     └───────────┘     └──────────────┘
     │                 │
     │                 ▼
     │          ┌───────────┐
     │          │    JWT    │
     │          │  Session  │
     │          └───────────┘
     │                 │
     ▼                 ▼
┌──────────────────────────────────┐
│         Protected API            │
│  (publisherId from session)      │
└──────────────────────────────────┘
```

### Role-Based Access Control

| Role | Capabilities |
|------|--------------|
| **Owner** | Full access, billing, delete organization |
| **Admin** | Manage team, connectors, settings |
| **Member** | View analytics, manage products |
| **Analyst** | View-only access to analytics |

### Data Isolation

Every database query is scoped by `publisherId`:

```typescript
const products = await db
  .select()
  .from(products)
  .where(eq(products.publisherId, session.user.publisherId));
```

### Invitation Security

- 32-byte cryptographically secure tokens
- 7-day expiration
- Single-use redemption
- Publisher-scoped validation

---

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host/db

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# AI
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEMO_MODE=true  # Enable demo mode (no auth required)
```

---

## Development

### Prerequisites

- Node.js 18+
- PostgreSQL (or Neon account)
- Anthropic API key

### Setup

```bash
# Clone repository
git clone https://github.com/ptengelmann/PhantomOS.git
cd phantomos

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Push database schema
npx drizzle-kit push

# Seed demo data (optional)
npm run seed

# Start development server
npm run dev
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx drizzle-kit push` | Push schema to database |
| `npx drizzle-kit studio` | Open Drizzle Studio |

---

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Current Status

### What's Working (MVP Complete)

#### Core Platform
- [x] **Dashboard UI** - Minimalist design system with white/black aesthetic
- [x] **Overview Page** - Revenue metrics, growth percentages, trend charts
- [x] **Category Breakdown** - Expandable pie chart with lazy loading
- [x] **Export Report** - CSV download of analytics data

#### Data Connectors
- [x] **Shopify OAuth** - Full OAuth flow with store connection
- [x] **CSV Import** - Bulk product import with validation
- [x] **Connector Management** - Settings modal, sync status, disconnect option

#### Fan Intelligence Hub
- [x] **AI-Powered Insights** - Real analysis of actual product/sales data
- [x] **Interactive Insights** - Expandable recommendations with action buttons
- [x] **Confidence Scores** - AI certainty displayed per insight
- [x] **Product-Aware Analysis** - AI sees products, IP assets, tagging progress

#### Asset Tagging
- [x] **Product List** - Filterable by mapped/unmapped status
- [x] **Game IP Management** - Create and manage game franchises
- [x] **IP Asset Management** - Create characters, logos, themes within games
- [x] **Product-to-Asset Linking** - Map products to multiple IP assets
- [x] **Tagging Progress** - Track mapped vs unmapped products

#### Authentication & Security
- [x] **NextAuth Integration** - Session-based authentication
- [x] **Demo Mode** - Quick access without credentials
- [x] **Sign Out** - Proper session termination
- [x] **Multi-tenant Isolation** - Publisher-scoped data queries

#### Settings
- [x] **Team Members** - Database-driven team list
- [x] **Team Invitations** - Invite system with secure tokens
- [x] **Profile Management** - User details editing

#### UX Polish
- [x] **Skeleton Loading States** - Proper loading UI for all pages
- [x] **Notifications Dropdown** - Header notification panel
- [x] **Error Handling** - Graceful error states throughout

---

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for detailed future plans including:
- **Merch Studio** - AI-powered merchandise design tools
- **Production** - Order management and fulfillment
- **Storefront** - Direct-to-consumer e-commerce
- **Creators** - Influencer and creator partnerships
- **Additional Connectors** - Amazon, WooCommerce, BigCommerce, etc.

---

## License

Proprietary - All rights reserved.

---

## Contact

For pilot program inquiries, contact the PhantomOS team.

---

*Built with precision for gaming publishers who understand that their IP is their most valuable asset.*
