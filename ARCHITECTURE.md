# PhantomOS Architecture

Complete technical documentation for the PhantomOS platform.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Database Schema](#database-schema)
3. [Authentication Flow](#authentication-flow)
4. [AI Integration](#ai-integration)
5. [Connector System](#connector-system)
6. [Route Architecture](#route-architecture)
7. [Component Library](#component-library)
8. [Middleware & Security](#middleware--security)
9. [Design System](#design-system)

---

## System Overview

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js App Router                        │
├─────────────────────────────────────────────────────────────────┤
│  (marketing)        │  (dashboard)         │  api/              │
│  ├── /              │  ├── /overview       │  ├── /ai/*         │
│  ├── /features      │  ├── /intelligence   │  ├── /products/*   │
│  ├── /faq           │  ├── /products       │  ├── /connectors/* │
│  ├── /roadmap       │  ├── /connectors     │  ├── /dashboard/*  │
│  └── /waitlist      │  └── /settings       │  └── /waitlist/*   │
├─────────────────────────────────────────────────────────────────┤
│                     Middleware (Auth + Pilot Mode)               │
├─────────────────────────────────────────────────────────────────┤
│  NextAuth.js    │    Anthropic Claude    │    Shopify OAuth     │
├─────────────────────────────────────────────────────────────────┤
│                     Drizzle ORM + Neon PostgreSQL                │
└─────────────────────────────────────────────────────────────────┘
```

### Multi-Tenant Model

PhantomOS is multi-tenant by publisher:
- Each user belongs to one publisher
- All data (products, sales, connectors) scoped to publisher
- Users can invite teammates to their publisher
---

## Database Schema

### Entity Relationship

```
publishers (1) ────── (*) users
     │
     ├──── (*) connectors
     │           │
     │           └──── (*) products ────── (*) product_assets ──── (*) ip_assets
     │                       │                                           │
     │                       └──── (*) sales                             │
     │                                                                   │
     └──── (*) game_ips ──────────────────────────────────────── (1) ───┘

waitlist_entries (standalone)
invite_tokens (standalone, references publishers)
```

### Table Definitions

#### publishers
Primary organization entity for multi-tenancy.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `name` | varchar(255) | Company/studio name |
| `slug` | varchar(100) | URL-safe identifier (unique) |
| `logoUrl` | text | Logo image URL |
| `createdAt` | timestamp | Creation time |
| `updatedAt` | timestamp | Last update |

#### users
Authentication and team membership.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `publisherId` | uuid | FK to publishers |
| `email` | varchar(255) | Login email (unique) |
| `name` | varchar(255) | Display name |
| `passwordHash` | text | bcrypt hash |
| `role` | enum | `owner`, `admin`, `member`, `analyst` |
| `createdAt` | timestamp | Creation time |

#### connectors
Data source integrations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `publisherId` | uuid | FK to publishers |
| `type` | enum | `shopify`, `amazon`, `woocommerce`, `bigcommerce`, `csv`, `custom` |
| `name` | varchar(255) | Display name |
| `status` | enum | `connected`, `disconnected`, `error`, `syncing` |
| `config` | jsonb | Encrypted credentials and settings |
| `lastSyncAt` | timestamp | Last successful sync |
| `createdAt` | timestamp | Creation time |

**Config structure (Shopify):**
```json
{
  "shop": "store.myshopify.com",
  "accessToken": "shpat_xxx",
  "scope": "read_products,read_orders"
}
```

#### game_ips
Game franchises/titles.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `publisherId` | uuid | FK to publishers |
| `name` | varchar(255) | Game title |
| `slug` | varchar(100) | URL-safe identifier |
| `description` | text | Game description |
| `genre` | varchar(100) | Game genre |
| `platforms` | text[] | Platform array |
| `logoUrl` | text | Game logo |
| `createdAt` | timestamp | Creation time |

#### ip_assets
Characters, logos, themes within games.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `gameIpId` | uuid | FK to game_ips |
| `name` | varchar(255) | Asset name |
| `assetType` | enum | `character`, `logo`, `theme`, `item`, `location`, `faction` |
| `description` | text | Asset description |
| `imageUrl` | text | Reference image |
| `popularity` | integer | 0-100 popularity score |
| `tags` | text[] | Searchable tags |
| `createdAt` | timestamp | Creation time |

#### products
Merchandise items.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `publisherId` | uuid | FK to publishers |
| `connectorId` | uuid | FK to connectors (source) |
| `gameIpId` | uuid | FK to game_ips (optional) |
| `externalId` | varchar(255) | ID in source system |
| `name` | varchar(255) | Product name |
| `description` | text | Product description |
| `sku` | varchar(100) | Stock keeping unit |
| `category` | enum | `apparel`, `collectibles`, `accessories`, `home`, `digital`, `other` |
| `price` | decimal(10,2) | Unit price |
| `imageUrl` | text | Product image |
| `totalRevenue` | decimal(12,2) | Cached revenue total |
| `mappingStatus` | enum | `unmapped`, `pending`, `confirmed`, `rejected` |
| `tags` | text[] | Product tags |
| `createdAt` | timestamp | Creation time |
| `updatedAt` | timestamp | Last update |

**Unique constraint:** `(publisherId, connectorId, externalId)`

#### product_assets
Junction table: products to IP assets (many-to-many).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `productId` | uuid | FK to products |
| `assetId` | uuid | FK to ip_assets |
| `isPrimary` | boolean | Primary asset for this product |
| `confidence` | decimal(3,2) | AI confidence score (0.00-1.00) |
| `source` | enum | `manual`, `ai_suggested`, `ai_confirmed` |
| `createdAt` | timestamp | Creation time |

**Unique constraint:** `(productId, assetId)`

#### sales
Transaction records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `publisherId` | uuid | FK to publishers |
| `productId` | uuid | FK to products |
| `connectorId` | uuid | FK to connectors (source) |
| `externalOrderId` | varchar(255) | Order ID in source system |
| `quantity` | integer | Units sold |
| `revenue` | decimal(10,2) | Total revenue |
| `orderDate` | timestamp | Order date |
| `region` | varchar(100) | Geographic region |
| `channel` | varchar(100) | Sales channel |
| `createdAt` | timestamp | Creation time |

#### waitlist_entries
Pilot program applications.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `email` | varchar(255) | Applicant email (unique) |
| `companyName` | varchar(255) | Company name |
| `companyWebsite` | text | Website URL |
| `revenueRange` | varchar(50) | Annual revenue bracket |
| `primaryChannel` | varchar(50) | Main sales channel |
| `status` | enum | `pending`, `approved`, `rejected`, `converted` |
| `inviteToken` | varchar(64) | Generated invite token |
| `createdAt` | timestamp | Submission time |
| `approvedAt` | timestamp | Approval time |

#### invite_tokens
Registration tokens for approved users and team invites.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `publisherId` | uuid | FK to publishers (null for waitlist) |
| `token` | varchar(64) | Secure random token (unique) |
| `email` | varchar(255) | Target email (optional) |
| `role` | enum | Assigned role on registration |
| `usedAt` | timestamp | When token was used |
| `expiresAt` | timestamp | Token expiration |
| `createdAt` | timestamp | Creation time |

#### audit_logs
Compliance audit trail for all sensitive operations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `publisherId` | uuid | FK to publishers (nullable for system events) |
| `userId` | uuid | FK to users (nullable for anonymous events) |
| `action` | varchar(100) | Action type (e.g., `product.tagged`, `connector.synced`) |
| `resourceType` | varchar(50) | Resource type (product, connector, insight, etc.) |
| `resourceId` | uuid | ID of affected resource |
| `resourceName` | varchar(255) | Human-readable resource name |
| `metadata` | jsonb | Additional context (changes, parameters) |
| `ipAddress` | varchar(45) | Client IP address |
| `userAgent` | text | Client user agent |
| `status` | varchar(20) | `success`, `failed`, `blocked` |
| `createdAt` | timestamp | Event timestamp |

**Indexed columns:** `publisherId`, `userId`, `action`, `createdAt`

---

## Authentication Flow

### Registration (Waitlist Path)

```
1. User submits /waitlist form
   └── POST /api/waitlist
       └── Insert waitlist_entries (status: pending)

2. Admin approves at /admin
   └── POST /api/waitlist/approve
       └── Generate invite_token (36 chars)
       └── Update status: approved
       └── Admin copies link manually

3. User visits /register/{token}
   └── GET /api/auth/register (validate token)
   └── POST /api/auth/register
       └── Create publisher
       └── Create user (role: owner)
       └── Mark token used
       └── Update waitlist status: converted

4. User redirected to /overview
```

### Login Flow

```
1. User visits /login
2. POST /api/auth/callback/credentials
   └── Verify email exists
   └── Compare bcrypt hash
   └── Create JWT session
3. Redirect to /overview
```

### Session Management

NextAuth.js with JWT strategy:
- Token contains: userId, publisherId, email, role
- Session extended on each request
- Middleware validates on protected routes

---

## AI Integration

### Claude API Usage

**Model:** `claude-sonnet-4-20250514`
**Max tokens:** 4096

### AI Insights (`/api/ai/insights`)

Generates strategic recommendations from sales data.

**Input:** Publisher's products, sales, asset mappings
**Output:** Array of typed insights

```typescript
interface Insight {
  type: 'opportunity' | 'warning' | 'trend' | 'recommendation';
  title: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
  metrics?: {
    value: string;
    change?: string;
    period?: string;
  };
}
```

**System Prompt Structure:**
```
You are a gaming merchandise analytics expert. Analyze the following data
and provide actionable insights for a gaming publisher.

Products: [list with categories, prices, asset mappings]
Sales: [aggregated by product, region, time period]
Assets: [characters with popularity scores]

Provide 4-6 insights in JSON format...
```

### AI Tagging (`/api/ai/tagging`)

Suggests character/IP mappings for products.

**Input:** Product names, existing IP assets
**Output:** Suggestions with confidence scores

```typescript
interface TagSuggestion {
  productId: string;
  assetId: string;
  assetName: string;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
}
```

**Example:**
- Product: "Shadow Knight Premium Hoodie"
- Suggestion: Shadow Knight (confidence: high)
- Reasoning: "Product name contains exact character name"

### AI Forecasting (`/api/ai/forecast`)

Predicts revenue trends.

**Input:** Historical sales by month
**Output:** Next month prediction with breakdown by asset

---

## Connector System

### Shopify OAuth Flow

```
1. User clicks "Connect Shopify"
   └── Enters store URL (mystore.myshopify.com)

2. POST /api/connectors/shopify/auth
   └── Validate store URL
   └── Generate OAuth URL with scopes:
       - read_products
       - read_orders
       - read_customers
   └── Redirect to Shopify

3. User authorizes on Shopify

4. GET /api/connectors/shopify/callback
   └── Exchange code for access_token
   └── Create connector record
   └── Store encrypted credentials
   └── Redirect to /connectors

5. Sync operations:
   └── POST /api/connectors/shopify/sync/products
   └── POST /api/connectors/shopify/sync/orders
```

### CSV Import

Products CSV template:
```csv
name,sku,category,price,description
Shadow Knight T-Shirt,SK-001,apparel,29.99,Official t-shirt
```

Sales CSV template:
```csv
product_sku,quantity,revenue,order_date,region
SK-001,5,149.95,2025-06-15,North America
```

### Connector Status States

| Status | Description |
|--------|-------------|
| `connected` | Active and syncing |
| `disconnected` | Manually disconnected |
| `error` | Auth failed or API error |
| `syncing` | Currently importing data |

---

## Route Architecture

### Route Groups

**`(marketing)`** - Public marketing site
- No auth required
- Shared layout: MarketingNavbar + MarketingFooter
- Pages: /, /features, /faq, /roadmap, /waitlist, /how-it-works, /updates, /pricing, /about, /contact

**`(dashboard)`** - Protected application
- Auth required (middleware)
- Shared layout: Sidebar + content area (pl-64)
- Pages: /overview, /intelligence, /products, /connectors, /settings

**`admin`** - Waitlist management
- Separate from dashboard (no sidebar)
- Protected by ADMIN_SECRET_KEY or session

### API Route Organization

```
/api
├── auth/
│   ├── [...nextauth]/route.ts  # NextAuth handlers
│   └── register/route.ts       # Custom registration
├── ai/
│   ├── insights/route.ts       # Claude insights
│   ├── tagging/route.ts        # Product tagging
│   └── forecast/route.ts       # Revenue forecast
├── connectors/
│   ├── route.ts                # List connectors
│   ├── [id]/route.ts           # CRUD operations
│   └── shopify/
│       ├── auth/route.ts       # OAuth initiation
│       ├── callback/route.ts   # OAuth callback
│       └── sync/
│           ├── products/route.ts
│           └── orders/route.ts
├── dashboard/
│   └── stats/route.ts          # Dashboard metrics
├── products/
│   ├── route.ts                # List/create
│   ├── [id]/route.ts           # CRUD
│   ├── by-category/route.ts    # Filter by category
│   └── mapping/route.ts        # Asset mapping
├── sales/
│   └── route.ts                # Import sales
└── waitlist/
    ├── route.ts                # Submit application
    ├── admin/route.ts          # List entries
    ├── approve/route.ts        # Approve entry
    └── reject/route.ts         # Reject entry
```

---

## Component Library

### UI Components (`src/components/ui/`)

| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | variant, size, loading, disabled | Primary action button |
| `Card` | hover, children | Container with border |
| `CardHeader/Title/Description/Content/Footer` | - | Card subcomponents |
| `Input` | label, error, type | Form text input |
| `Select` | label, error, options | Dropdown select |
| `Badge` | variant | Status indicator |
| `Table` | - | Data table with Header/Body/Row/Head/Cell |

**Button Variants:**
- `default`: Black bg, white text
- `outline`: Transparent, black border
- `ghost`: Transparent, no border
- `link`: Text only, underline on hover

**Badge Variants:**
- `default`: Gray bg
- `success`: Green bg
- `warning`: Yellow bg
- `error`: Red bg
- `outline`: Transparent, black border

### Dashboard Components (`src/components/dashboard/`)

| Component | Description |
|-----------|-------------|
| `Sidebar` | Collapsible left navigation with user section, persists state to localStorage |
| `Header` | Page title, search, notifications, keyboard shortcuts help, action button |
| `StatsCard` | Metric display with trend indicator |
| `ConnectorWizard` | 4-step connection flow modal |

### Chart Components (`src/components/charts/`)

| Component | Description |
|-----------|-------------|
| `RevenueChart` | Line chart for revenue over time |
| `AssetPerformanceChart` | Horizontal bar chart by IP asset |
| `CategoryBreakdown` | Expandable category list with progress bars |

### Marketing Components (`src/components/marketing/`)

| Component | Description |
|-----------|-------------|
| `MarketingNavbar` | Fixed top nav with features dropdown |
| `MarketingFooter` | Full footer with link columns |

---

## Middleware & Security

### Route Protection (`middleware.ts`)

```typescript
// Public routes (no auth)
const marketingRoutes = [
  '/',
  '/features',
  '/pricing',
  '/roadmap',
  '/waitlist',
  '/contact',
  '/about',
  '/careers',
  '/faq',
  '/privacy',
  '/terms',
  '/security'
];

// Auth routes (accessible when logged out)
const authRoutes = ['/login', '/register', '/forgot-password', '/invite'];

// Everything else requires authentication
```

### Pilot Mode

When `PILOT_MODE=true`:
- `/register` redirects to `/waitlist`
- `ALLOWED_EMAILS` list bypasses restrictions
- Only approved waitlist entries can register

### Role-Based Access Control (RBAC)

PhantomOS implements role-based permissions to control who can modify data.

**User Roles:**

| Role | View Data | Edit/Delete | Invite Users | Manage Publisher |
|------|-----------|-------------|--------------|------------------|
| `owner` | Yes | Yes | Yes | Yes |
| `admin` | Yes | Yes | Yes | No |
| `member` | Yes | No (403) | No | No |
| `analyst` | Yes | No (403) | No | No |

**Protected Write Endpoints:**

All POST/PUT/DELETE operations on these routes require `owner` or `admin` role:

- `/api/products/import` - CSV product import
- `/api/products/mapping` - Asset mapping (confirm/skip)
- `/api/products/[id]/assets` - Add/remove product assets
- `/api/connectors/[id]` - Delete connectors
- `/api/connectors/shopify/auth` - Initiate Shopify OAuth
- `/api/connectors/shopify/sync/*` - Sync products/orders
- `/api/assets` - Create IP assets
- `/api/sales/import` - CSV sales import

**Implementation:**

```typescript
// src/lib/auth/index.ts
const WRITE_ROLES = ['owner', 'admin'];

export function canWrite(role: string): boolean {
  return WRITE_ROLES.includes(role);
}

// Usage in API routes:
if (!canWrite(session.user.role)) {
  return NextResponse.json({ error: 'Write access required' }, { status: 403 });
}
```

### Demo Mode (Session-First Pattern)

When `DEMO_MODE=true`, APIs follow a session-first pattern:

```typescript
// Correct pattern - check session FIRST
const session = await getServerSession();

if (session?.user?.id) {
  // User is logged in - use REAL data, enforce RBAC
  if (!canWrite(session.user.role)) {
    return NextResponse.json({ error: 'Write access required' }, { status: 403 });
  }
  // Process with real user data
} else if (isDemoMode()) {
  // No session - fall back to demo data for anonymous access
}
```

This ensures:
- Logged-in users always see their real data
- RBAC is always enforced for authenticated users
- Demo mode only applies to anonymous/unauthenticated access

### Security Measures

1. **Password Hashing:** bcrypt with 12 salt rounds
2. **Session:** JWT with HttpOnly cookies (30-day expiration)
3. **CSRF:** Built into NextAuth
4. **Input Validation:** Zod schemas on API routes
5. **SQL Injection:** Prevented by Drizzle ORM parameterized queries
6. **Connector Credentials:** AES-256-GCM encrypted (see below)
7. **Role-Based Access:** Write operations require owner/admin role
8. **Publisher Scoping:** All data queries filtered by publisherId from session
9. **Demo Mode Isolation:** Session checked before demo fallback to prevent data leakage
10. **Rate Limiting:** Upstash Redis-based rate limiting on all endpoints (see below)
11. **Audit Logging:** All sensitive operations logged for compliance (see below)

### Rate Limiting (`src/lib/rate-limit/`)

Upstash Redis-based rate limiting with tiered limits:

| Tier | Limit | Window | Use Case |
|------|-------|--------|----------|
| `ai` | 5 requests | 1 minute | AI endpoints (expensive) |
| `write` | 20 requests | 1 minute | POST/PUT/DELETE operations |
| `read` | 60 requests | 1 minute | GET operations |
| `auth` | 5 requests | 5 minutes | Login/registration |
| `public` | 3 requests | 1 minute | Waitlist, contact forms |

**Implementation:**
```typescript
import { rateLimit } from '@/lib/rate-limit';

// In API route
const rateLimitResponse = await rateLimit('ai');
if (rateLimitResponse) return rateLimitResponse;
```

### Credential Encryption (`src/lib/crypto/`)

AES-256-GCM encryption for connector credentials (Shopify tokens, API keys).

```typescript
import { encryptCredentials, decryptCredentials } from '@/lib/crypto';

// Encrypt before storing
const encrypted = encryptCredentials({ accessToken: 'shpat_xxx', shop: 'store.myshopify.com' });

// Decrypt when reading
const credentials = decryptCredentials<ShopifyCredentials>(connector.config);
```

**Environment:** Requires `ENCRYPTION_KEY` (32-byte hex string)

### Audit Logging (`src/lib/audit/`)

Comprehensive audit trail for compliance:

```typescript
import { audit } from '@/lib/audit';

// Log product tagging
await audit.productTagged(session, productId, productName, ['Shadow Knight', 'Luna']);

// Log connector sync
await audit.connectorSynced(session, connectorId, 'Shopify Store', 150);

// Log AI insights generation
await audit.insightsGenerated(session, batchId, 5);
```

**Tracked Actions:**
- `product.created`, `product.updated`, `product.deleted`, `product.tagged`
- `connector.created`, `connector.synced`, `connector.deleted`
- `insight.generated`, `insight.actioned`
- `user.invited`, `user.role_changed`
- `waitlist.submitted`, `waitlist.approved`

---

## Design System

### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Black | `#0a0a0a` | Primary text, buttons, active states |
| Dark Gray | `#262626` | Button hover |
| Gray | `#737373` | Secondary text, labels |
| Light Gray | `#a3a3a3` | Placeholders, muted text |
| Border | `#e5e5e5` | All borders and dividers |
| Background | `#fafafa` | Dashboard bg, hover states |
| Off-white | `#f5f5f5` | Card backgrounds, badges |
| White | `#ffffff` | Primary backgrounds |

### Typography

**Font Family:** Geist (Sans + Mono from Vercel)

**Patterns:**
- Page titles: `text-4xl font-bold tracking-tight`
- Section labels: `text-xs uppercase tracking-wider text-[#737373]`
- Body text: `text-sm text-[#737373]`
- Data values: `text-2xl font-semibold tracking-tight`

### Spacing & Layout

- No border-radius (sharp corners throughout)
- Border width: 1px
- Card padding: `p-6`
- Grid gaps: `gap-4` or `gap-6`
- Sidebar width: `w-64` (256px)
- Max content width: `max-w-7xl`

### Component Patterns

**Cards:**
```jsx
<Card className="border-[#e5e5e5]">
  <CardContent className="pt-6 pb-6">
    {/* content */}
  </CardContent>
</Card>
```

**Section Headers:**
```jsx
<div className="mb-2">
  <div className="inline-block px-3 py-1 bg-[#f5f5f5] border border-[#e5e5e5] text-xs font-medium text-[#737373] tracking-wide">
    SECTION LABEL
  </div>
</div>
<h1 className="text-4xl font-bold text-[#0a0a0a] mb-3 tracking-tight">
  Title <span className="italic font-light">Accent</span>
</h1>
```

**Empty States:**
```jsx
<div className="py-24 text-center">
  <Icon className="w-12 h-12 mx-auto mb-4 text-[#e5e5e5]" />
  <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">No data yet</h3>
  <p className="text-[#737373] mb-6">Description text here</p>
  <Button>Action</Button>
</div>
```

---

## Scripts

### Demo Data

#### seed-demo-data.ts

Creates fictional "Phantom Warriors" demo data:
- 1 Game IP with 6 characters (Shadow Knight, Luna Starfire, Iron Fang, The Architect, Pixel, Crimson Guard)
- 60+ products across categories
- 6 months of sales with realistic patterns:
  - Regional distribution (NA 45%, EU 30%, APAC 20%, LATAM 5%)
  - Seasonal multipliers (June-November holiday ramp)
  - Character popularity affecting volume

**Usage:**
```bash
npx tsx scripts/seed-demo-data.ts
```

### User Management

#### create-demo-user.ts

Creates a read-only user account under the demo publisher (for demos/presentations).

```bash
npx tsx scripts/create-demo-user.ts <email> <password> [name]
# Example:
npx tsx scripts/create-demo-user.ts demo@example.com Password123 "Demo User"
```
- Role: `member` (read-only access)
- Shares data with demo publisher

#### create-company.ts

Creates a new publisher with fresh account (no demo data) for real customers.

```bash
npx tsx scripts/create-company.ts <company-name> <email> <password> [user-name]
# Example:
npx tsx scripts/create-company.ts "Riot Games" admin@riot.com Password123 "John Smith"
```
- Creates new publisher
- User becomes `owner` with full access
- Empty dashboard until they connect data

#### reset-password.ts

Resets password for an existing user.

```bash
npx tsx scripts/reset-password.ts <email> <new-password>
```

#### check-user.ts

Verifies user exists and displays account details (for debugging).

```bash
npx tsx scripts/check-user.ts <email>
```

### Other Scripts

| Script | Purpose |
|--------|---------|
| `check-auth-data.ts` | Debug auth/session issues |
| `check-constraints.ts` | Verify DB constraints |
| `test-invite-flow.ts` | Test invitation system |
| `sync-shopify-products.ts` | Manual Shopify sync |

---

## Performance Considerations

1. **Database:** Neon serverless PostgreSQL with connection pooling
2. **Caching:** Product revenue totals cached in `totalRevenue` column
3. **Pagination:** All list endpoints support limit/offset
4. **AI Calls:** Rate-limited, results can be cached
5. **Images:** Next.js Image component with optimization

---

*Last updated: December 2025*
