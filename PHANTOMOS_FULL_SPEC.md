# PhantomOS: Full Product Specification

**Version:** 1.0
**Last Updated:** December 2025
**Status:** Founding Pilot Phase
**Classification:** Internal / Investor Document

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Vision & Mission](#2-vision--mission)
3. [Problem Statement](#3-problem-statement)
4. [Solution Overview](#4-solution-overview)
5. [Target Market](#5-target-market)
6. [Product Features](#6-product-features)
7. [Technical Architecture](#7-technical-architecture)
8. [Database Schema](#8-database-schema)
9. [API Design](#9-api-design)
10. [AI Systems](#10-ai-systems)
11. [Security & Privacy](#11-security--privacy)
12. [Business Model](#12-business-model)
13. [Market Analysis](#13-market-analysis)
14. [Competitive Landscape](#14-competitive-landscape)
15. [Product Roadmap](#15-product-roadmap)
16. [Go-to-Market Strategy](#16-go-to-market-strategy)
17. [Demo & Pilot Setup](#17-demo--pilot-setup)
18. [Metrics & Success Criteria](#18-metrics--success-criteria)
19. [Glossary](#19-glossary)
20. [Appendices](#20-appendices)

---

## 1. Executive Summary

PhantomOS is a B2B SaaS platform that provides **merchandise intelligence for gaming publishers**. It solves a critical blind spot: publishers know their total merchandise revenue, but they don't know which intellectual property assets (characters, themes, logos) actually drive that revenue.

### The Core Insight

Gaming publishers have rich IP portfolios—beloved characters, iconic logos, memorable themes—but no way to understand which assets resonate with fans at the merchandise level. This data exists, but it's fragmented across Shopify stores, Amazon seller accounts, licensing partners, and internal spreadsheets.

### What PhantomOS Does

1. **Aggregates** sales data from multiple channels (Shopify, Amazon, CSV imports)
2. **Maps** products to specific IP assets using AI-assisted tagging
3. **Analyzes** performance to reveal which characters, themes, and logos drive revenue
4. **Delivers** actionable insights through AI-powered recommendations

### Current Status

- **Phase:** Founding Pilot (Free, Limited Access)
- **Core Features:** Live and functional
- **Target:** 10-20 pilot publishers by Q1 2026
- **Revenue Model:** Usage-based SaaS (post-pilot)

### Key Differentiator

PhantomOS is the only platform that provides **IP-level attribution** for gaming merchandise. Generic analytics tools show product-level data; PhantomOS shows character-level data.

---

## 2. Vision & Mission

### Vision

To become the operating system for gaming IP monetization—the platform every gaming publisher uses to understand, optimize, and expand their merchandise business.

### Mission

Empower gaming publishers to make data-driven decisions about their merchandise by providing unprecedented visibility into IP performance.

### Core Beliefs

1. **IP is the asset.** Products come and go, but characters and themes have lasting value.
2. **Data unlocks opportunity.** Publishers can't optimize what they can't measure.
3. **AI amplifies humans.** Technology should surface insights, not replace decision-makers.
4. **Simplicity wins.** Complex data should be presented simply.

### Long-Term Ambition

PhantomOS will expand from analytics to become a full-stack merchandise platform:
- **Intelligence** (current) → Analytics and insights
- **Creation** (future) → AI-powered merchandise design
- **Production** (future) → Order management and fulfillment
- **Distribution** (future) → Direct-to-consumer storefronts

---

## 3. Problem Statement

### The Publisher's Dilemma

Gaming publishers face a fundamental question they cannot answer:

> "Which of our characters should we feature on next season's merchandise?"

This question is unanswerable because:

1. **Data Fragmentation:** Sales data is scattered across 5-10+ platforms
2. **No IP Attribution:** Products aren't tagged to specific characters/themes
3. **Manual Processes:** Any analysis requires extensive spreadsheet work
4. **Reactive Decisions:** By the time trends are identified, they've passed

### Real-World Scenario

Consider a mid-sized gaming publisher with:
- 3 game franchises
- 50+ characters across those games
- 2,000+ SKUs of merchandise
- Sales across Shopify, Amazon, and 4 licensing partners

**Current State:**
- Monthly revenue report: "$450K merchandise revenue"
- No breakdown by character or theme
- Decisions made by "gut feel" and fan requests
- Missed opportunities invisible

**With PhantomOS:**
- "Shadow Knight merchandise: $89K (+34% MoM)"
- "Villain characters outperform heroes 2:1 in apparel"
- "Luna Starfire trending in APAC region"
- "Recommendation: Expand Shadow Knight product line"

### The Cost of the Problem

| Impact Area | Without PhantomOS |
|-------------|-------------------|
| Revenue | Missed opportunities from underinvesting in trending IPs |
| Inventory | Overstock of underperforming character merchandise |
| Licensing | Weak negotiating position without performance data |
| Strategy | Decisions based on assumptions, not evidence |
| Time | 20+ hours/month on manual data aggregation |

---

## 4. Solution Overview

### How PhantomOS Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA INGESTION                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Shopify  │  │  Amazon  │  │   CSV    │  │  Custom  │            │
│  │   OAuth  │  │   API    │  │  Import  │  │   API    │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
│       │             │             │             │                    │
│       └─────────────┴─────────────┴─────────────┘                    │
│                           │                                          │
│                           ▼                                          │
│              ┌────────────────────────┐                             │
│              │   Unified Data Lake    │                             │
│              │   (Products + Sales)   │                             │
│              └───────────┬────────────┘                             │
└──────────────────────────┼──────────────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────────────┐
│                          ▼                                          │
│              ┌────────────────────────┐                             │
│              │   AI TAGGING ENGINE    │                             │
│              │   (Claude AI)          │                             │
│              │                        │                             │
│              │   Product Name ──────► Character                     │
│              │   Description  ──────► Theme                         │
│              │   Category     ──────► Asset Type                    │
│              └───────────┬────────────┘                             │
│                          │                                          │
│                          ▼                                          │
│              ┌────────────────────────┐                             │
│              │   IP ASSET DATABASE    │                             │
│              │                        │                             │
│              │   Game IPs             │                             │
│              │   └── Characters       │                             │
│              │   └── Themes           │                             │
│              │   └── Logos            │                             │
│              └───────────┬────────────┘                             │
└──────────────────────────┼──────────────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────────────┐
│                          ▼                                          │
│              ┌────────────────────────┐                             │
│              │   ANALYTICS ENGINE     │                             │
│              │                        │                             │
│              │   Revenue by Character │                             │
│              │   Trend Detection      │                             │
│              │   Regional Analysis    │                             │
│              │   Category Breakdown   │                             │
│              └───────────┬────────────┘                             │
│                          │                                          │
│                          ▼                                          │
│              ┌────────────────────────┐                             │
│              │   AI INSIGHTS ENGINE   │                             │
│              │   (Claude AI)          │                             │
│              │                        │                             │
│              │   Opportunities        │                             │
│              │   Risk Alerts          │                             │
│              │   Recommendations      │                             │
│              └───────────┬────────────┘                             │
└──────────────────────────┼──────────────────────────────────────────┘
                           │
                           ▼
                ┌────────────────────────┐
                │      DASHBOARD         │
                │                        │
                │   Overview             │
                │   Intelligence Hub     │
                │   Products             │
                │   Connectors           │
                │   Settings             │
                └────────────────────────┘
```

### The PhantomOS Workflow

**Step 1: Connect Data Sources**
- OAuth integration with Shopify
- CSV import for any platform
- (Future: Amazon, WooCommerce, BigCommerce)

**Step 2: Define IP Assets**
- Create Game IPs (franchises)
- Add IP Assets (characters, themes, logos)
- Set metadata (type, popularity, tags)

**Step 3: Map Products to Assets**
- AI suggests mappings based on product names/descriptions
- Human reviews and confirms suggestions
- Products linked to one or more IP assets

**Step 4: Analyze Performance**
- Revenue attributed to each IP asset
- Trends identified over time
- Regional and category breakdowns

**Step 5: Act on Insights**
- AI generates actionable recommendations
- Opportunities and risks surfaced
- Data exported for stakeholder reports

---

## 5. Target Market

### Primary Segment: Mid-Size Gaming Publishers

**Profile:**
- 1-10 game franchises
- $100K - $10M annual merchandise revenue
- 500 - 10,000 SKUs
- Selling via owned stores + marketplaces
- 1-5 people managing merchandise

**Pain Points:**
- No visibility into character-level performance
- Manual data aggregation across platforms
- Decisions made reactively
- Limited resources for custom analytics

**Examples:**
- Indie studios with viral hits
- AA publishers with established franchises
- Game studios licensing IP to merchandise partners

### Secondary Segment: Large Gaming Publishers

**Profile:**
- 10+ game franchises
- $10M+ annual merchandise revenue
- 10,000+ SKUs
- Complex licensing relationships
- Dedicated merchandise teams

**Pain Points:**
- Fragmented data across many partners
- Need for character-level attribution at scale
- Licensing negotiation leverage
- Cross-franchise opportunity identification

### Tertiary Segment: Licensing Partners

**Profile:**
- Manufacture merchandise for multiple publishers
- Need to report performance back to IP owners
- Want data to inform design decisions

### Total Addressable Market

| Segment | Companies | Avg. Revenue | TAM |
|---------|-----------|--------------|-----|
| Large Publishers | ~50 | $50K/year | $2.5M |
| Mid-Size Publishers | ~300 | $12K/year | $3.6M |
| Small Publishers | ~500 | $3K/year | $1.5M |
| Licensing Partners | ~200 | $6K/year | $1.2M |
| **Total** | **~1,050** | - | **$8.8M** |

This represents the software market. The underlying merchandise market is $500M+ (licensed gaming merchandise) to $55B (broader gaming merchandise including unlicensed).

---

## 6. Product Features

### 6.1 Dashboard Overview

The central command center for merchandise performance.

**Key Metrics:**
- Total Revenue (with growth %)
- Total Orders (with growth %)
- Average Order Value (with growth %)
- Product Count
- Connected Sources

**Visualizations:**
- Revenue Trend Chart (12-month view)
- Category Breakdown (pie chart with drill-down)
- Asset Performance (bar chart by character)
- Recent Orders (table with details)

**Actions:**
- Export Report (CSV download)
- Quick navigation to detailed views

### 6.2 Fan Intelligence Hub

AI-powered insights engine that surfaces opportunities and risks.

**Insight Types:**
| Type | Description | Example |
|------|-------------|---------|
| Opportunity | Growth potential identified | "Shadow Knight trending +40% - expand product line" |
| Warning | Declining performance | "Luna merchandise down 15% in NA region" |
| Trend | Pattern detected | "Villain characters consistently outperform heroes" |
| Recommendation | Strategic suggestion | "Consider holiday bundle with top 3 characters" |

**AI Capabilities:**
- Analyzes sales data, product mix, and tagging progress
- Generates 3-5 actionable insights per analysis
- Confidence scoring (0-100%)
- Expandable recommendations with specific action items

**Interaction Model:**
- Click insight to expand recommendations
- Quick action buttons to navigate to relevant pages
- Refresh to regenerate analysis

### 6.3 Asset Tagging

The workbench for mapping products to IP assets.

**Product Management:**
- Import products via Shopify sync or CSV
- View all products with status indicators
- Search and filter by name, SKU, category, status

**Tagging Workflow:**
1. Select product from list
2. View AI-suggested asset mappings
3. Accept, reject, or modify suggestions
4. Confirm mapping (links product to 1+ assets)

**Batch Operations:**
- Auto-tag all unmapped products
- AI processes up to 50 products per batch
- Results shown with success/failure counts

**Status Tracking:**
| Status | Description |
|--------|-------------|
| Unmapped | No assets linked |
| Suggested | AI has suggested mappings |
| Confirmed | Human verified mapping |
| Skipped | Marked as no IP content |

### 6.4 Data Connectors

Integration hub for sales data sources.

**Available Connectors:**

| Connector | Status | Method |
|-----------|--------|--------|
| Shopify | Live | OAuth 2.0 |
| CSV Import | Live | File Upload |
| Amazon | Q1 2026 | API |
| WooCommerce | Q1 2026 | API |
| BigCommerce | 2026 | API |

**Shopify Integration:**
- OAuth flow (no credentials stored)
- Read-only access to products and orders
- Manual sync trigger
- Automatic product/order import

**CSV Import:**
- Products: name, sku, description, category, price, vendor, tags
- Sales: product_name/sku, quantity, revenue, date, region, channel
- Validation and error reporting
- Template downloads available

**Connector Management:**
- View sync status and last sync time
- Manual sync trigger
- Settings and disconnect options
- Stats per connector

### 6.5 Settings

Account and organization management.

**Profile:**
- User name and email
- Avatar (placeholder)
- Job title

**Organization:**
- Publisher name
- Website
- Subscription tier

**Team Management:**
- View current team members
- Role-based permissions:
  - **Owner:** Full access, billing, delete org
  - **Admin:** Manage team, connectors, settings
  - **Member:** View analytics, manage products
  - **Analyst:** View-only access
- Invite system with secure tokens
- Pending invitation management

### 6.6 Marketing Site

Public-facing website for lead generation.

**Pages:**
- **Landing Page:** Value proposition, social proof, CTA
- **Features:** Detailed feature breakdown
- **FAQ:** Comprehensive Q&A (replaces pricing during pilot)
- **Roadmap:** What's live, coming soon, future vision
- **Waitlist:** Pilot program signup form

**Waitlist Capture:**
- Email (required)
- Company name
- Company website
- Revenue range
- Primary sales channel

### 6.7 Admin Dashboard

Internal tool for managing pilot program.

**Access:** Protected by ADMIN_SECRET_KEY

**Capabilities:**
- View all waitlist submissions
- Stats: total, pending, approved, rejected, converted
- Filter by status
- Approve/reject entries
- Copy invite links for approved users

---

## 7. Technical Architecture

### 7.1 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Next.js 16 | Server components, API routes, optimal DX |
| **Runtime** | React 19 | Latest features, concurrent rendering |
| **Language** | TypeScript | Type safety, better tooling |
| **Styling** | Tailwind CSS 4 | Utility-first, rapid development |
| **Database** | Neon PostgreSQL | Serverless, auto-scaling, branching |
| **ORM** | Drizzle ORM | Type-safe queries, migrations |
| **Auth** | NextAuth.js | Session management, multiple providers |
| **AI** | Anthropic Claude | Best-in-class reasoning, structured output |
| **Charts** | Recharts | React-native, customizable |
| **Icons** | Lucide React | Comprehensive, consistent |
| **Hosting** | Vercel | Edge functions, preview deployments |

### 7.2 Application Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Next.js App Router                        │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│   │
│  │  │  Marketing  │ │  Dashboard  │ │         Admin           ││   │
│  │  │   Pages     │ │   Pages     │ │         Pages           ││   │
│  │  │ (public)    │ │ (protected) │ │     (key-protected)     ││   │
│  │  └─────────────┘ └─────────────┘ └─────────────────────────┘│   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 │ HTTPS
                                 │
┌────────────────────────────────┼────────────────────────────────────┐
│                           SERVER                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    API Routes (/api/*)                       │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────────┐ │   │
│  │  │  Auth     │ │ Dashboard │ │ Products  │ │ Connectors  │ │   │
│  │  │  Routes   │ │  Routes   │ │  Routes   │ │   Routes    │ │   │
│  │  └───────────┘ └───────────┘ └───────────┘ └─────────────┘ │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐                 │   │
│  │  │    AI     │ │ Settings  │ │ Waitlist  │                 │   │
│  │  │  Routes   │ │  Routes   │ │  Routes   │                 │   │
│  │  └───────────┘ └───────────┘ └───────────┘                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                 │                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Middleware                                │   │
│  │  • Route protection (auth check)                             │   │
│  │  • Pilot mode redirects                                      │   │
│  │  • Session validation                                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
          ▼                      ▼                      ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Neon Database  │  │   Anthropic API  │  │   Shopify API    │
│   (PostgreSQL)   │  │   (Claude)       │  │   (OAuth)        │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

### 7.3 Directory Structure

```
phantomos/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth group (login, register, invite)
│   │   ├── (dashboard)/              # Dashboard group (protected)
│   │   │   ├── overview/             # Main dashboard
│   │   │   ├── intelligence/         # Fan Intelligence Hub
│   │   │   ├── products/             # Asset tagging
│   │   │   ├── connectors/           # Data sources
│   │   │   ├── settings/             # Account settings
│   │   │   └── layout.tsx            # Dashboard shell with sidebar
│   │   ├── (marketing)/              # Marketing site (public)
│   │   │   ├── features/             # Feature pages
│   │   │   ├── faq/                  # FAQ page
│   │   │   ├── roadmap/              # Product roadmap
│   │   │   ├── waitlist/             # Pilot signup
│   │   │   └── layout.tsx            # Marketing layout with navbar
│   │   ├── admin/                    # Admin dashboard
│   │   └── api/                      # API routes
│   │       ├── ai/                   # AI endpoints
│   │       ├── auth/                 # NextAuth handlers
│   │       ├── connectors/           # Connector management
│   │       ├── dashboard/            # Dashboard stats
│   │       ├── products/             # Product CRUD
│   │       ├── sales/                # Sales import
│   │       ├── settings/             # Settings endpoints
│   │       └── waitlist/             # Waitlist API
│   ├── components/
│   │   ├── charts/                   # Data visualizations
│   │   ├── dashboard/                # Dashboard components
│   │   ├── marketing/                # Marketing components
│   │   ├── providers/                # Context providers
│   │   └── ui/                       # Base UI components
│   └── lib/
│       ├── auth/                     # Auth configuration
│       ├── db/                       # Database client + schema
│       ├── ai/                       # AI client
│       └── utils/                    # Utilities
├── scripts/                          # CLI scripts
│   └── seed-demo-data.ts             # Demo data generator
├── public/                           # Static assets
├── middleware.ts                     # Route middleware
└── drizzle.config.ts                 # Database config
```

### 7.4 Authentication Flow

```
┌──────────┐     ┌───────────────┐     ┌──────────────┐
│  Client  │────▶│   NextAuth    │────▶│   Database   │
│          │     │  Credentials  │     │  (users)     │
└──────────┘     └───────────────┘     └──────────────┘
     │                   │
     │                   ▼
     │          ┌───────────────┐
     │          │  JWT Session  │
     │          │  (encrypted)  │
     │          └───────────────┘
     │                   │
     ▼                   ▼
┌────────────────────────────────────┐
│         Protected API              │
│  • Extract session from cookie     │
│  • Validate user & publisherId     │
│  • Scope all queries to publisher  │
└────────────────────────────────────┘
```

**Session Contents:**
```typescript
{
  user: {
    id: string;          // User UUID
    email: string;       // User email
    name: string;        // Display name
    publisherId: string; // Tenant ID (critical for data isolation)
    role: string;        // owner | admin | member | analyst
  }
}
```

### 7.5 Multi-Tenancy Model

PhantomOS uses a **shared database with tenant scoping**:

- All tables include `publisherId` foreign key
- Every query filters by `publisherId` from session
- No cross-tenant data access possible
- Demo mode uses a special `demo-publisher-id`

```typescript
// Every API query follows this pattern:
const products = await db
  .select()
  .from(products)
  .where(eq(products.publisherId, session.user.publisherId));
```

---

## 8. Database Schema

### 8.1 Entity Relationship Diagram

```
                                 ┌─────────────────┐
                                 │   publishers    │
                                 │─────────────────│
                                 │ id (PK)         │
                                 │ name            │
                                 │ slug            │
                                 │ subscriptionTier│
                                 └────────┬────────┘
                                          │
           ┌──────────────────────────────┼──────────────────────────────┐
           │                              │                              │
           ▼                              ▼                              ▼
┌─────────────────┐            ┌─────────────────┐            ┌─────────────────┐
│     users       │            │    game_ips     │            │   connectors    │
│─────────────────│            │─────────────────│            │─────────────────│
│ id (PK)         │            │ id (PK)         │            │ id (PK)         │
│ publisherId (FK)│            │ publisherId (FK)│            │ publisherId (FK)│
│ email           │            │ name            │            │ type            │
│ name            │            │ slug            │            │ name            │
│ role            │            │ genre           │            │ status          │
│ passwordHash    │            │ platforms       │            │ config          │
└─────────────────┘            └────────┬────────┘            └────────┬────────┘
                                        │                              │
                                        ▼                              │
                               ┌─────────────────┐                     │
                               │   ip_assets     │                     │
                               │─────────────────│                     │
                               │ id (PK)         │                     │
                               │ gameIpId (FK)   │                     │
                               │ name            │                     │
                               │ assetType       │                     │
                               │ description     │                     │
                               │ popularity      │                     │
                               │ tags            │                     │
                               └────────┬────────┘                     │
                                        │                              │
                                        │         ┌────────────────────┘
                                        │         │
                                        ▼         ▼
                               ┌─────────────────────────┐
                               │       products          │
                               │─────────────────────────│
                               │ id (PK)                 │
                               │ publisherId (FK)        │
                               │ gameIpId (FK)           │
                               │ connectorId (FK)        │
                               │ name                    │
                               │ sku                     │
                               │ category                │
                               │ price                   │
                               │ mappingStatus           │
                               │ totalRevenue            │
                               └───────────┬─────────────┘
                                           │
                        ┌──────────────────┼──────────────────┐
                        │                  │                  │
                        ▼                  ▼                  ▼
             ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
             │ product_assets  │ │     sales       │ │  ai_insights    │
             │─────────────────│ │─────────────────│ │─────────────────│
             │ productId (FK)  │ │ id (PK)         │ │ id (PK)         │
             │ assetId (FK)    │ │ publisherId (FK)│ │ publisherId (FK)│
             │ isPrimary       │ │ productId (FK)  │ │ type            │
             └─────────────────┘ │ connectorId (FK)│ │ title           │
                                 │ quantity        │ │ description     │
                                 │ revenue         │ │ confidence      │
                                 │ region          │ │ data            │
                                 │ orderDate       │ └─────────────────┘
                                 └─────────────────┘
```

### 8.2 Table Definitions

#### publishers
Multi-tenant root entity.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Display name |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-safe identifier |
| logo | TEXT | | Logo URL |
| website | TEXT | | Company website |
| subscriptionTier | ENUM | DEFAULT 'starter' | starter, growth, enterprise |
| settings | JSONB | DEFAULT '{}' | Custom configuration |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation time |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Last update |

#### users
Team members within a publisher.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| publisherId | UUID | FK → publishers.id | Tenant reference |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| name | VARCHAR(255) | | Display name |
| passwordHash | TEXT | | Hashed password |
| role | VARCHAR(50) | DEFAULT 'member' | owner, admin, member, analyst |
| avatar | TEXT | | Avatar URL |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation time |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Last update |

#### game_ips
Game franchises owned by a publisher.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| publisherId | UUID | FK → publishers.id | Tenant reference |
| name | VARCHAR(255) | NOT NULL | Game title |
| slug | VARCHAR(255) | NOT NULL | URL-safe identifier |
| description | TEXT | | Game description |
| genre | VARCHAR(100) | | Primary genre |
| releaseDate | DATE | | Initial release |
| platforms | JSONB | DEFAULT '[]' | Array of platforms |
| logoUrl | TEXT | | Game logo |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation time |

#### ip_assets
Individual assets within a game (characters, themes, logos).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| gameIpId | UUID | FK → game_ips.id | Parent game |
| name | VARCHAR(255) | NOT NULL | Asset name |
| assetType | ENUM | NOT NULL | character, logo, theme, scene, item, other |
| description | TEXT | | Asset description |
| popularity | INTEGER | DEFAULT 50 | Popularity score (0-100) |
| imageUrl | TEXT | | Reference image |
| tags | JSONB | DEFAULT '[]' | Searchable tags |
| metadata | JSONB | DEFAULT '{}' | Additional data |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation time |

#### connectors
Data source integrations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| publisherId | UUID | FK → publishers.id | Tenant reference |
| type | ENUM | NOT NULL | shopify, amazon, woocommerce, bigcommerce, custom |
| name | VARCHAR(255) | NOT NULL | Display name |
| status | VARCHAR(50) | DEFAULT 'pending' | pending, connected, error, disconnected |
| config | JSONB | DEFAULT '{}' | Connection config (non-sensitive) |
| credentials | JSONB | | Encrypted credentials |
| lastSyncAt | TIMESTAMP | | Last successful sync |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation time |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Last update |

#### products
Merchandise items from connected sources.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| publisherId | UUID | FK → publishers.id | Tenant reference |
| connectorId | UUID | FK → connectors.id | Source connector |
| gameIpId | UUID | FK → game_ips.id | Associated game (optional) |
| externalId | VARCHAR(255) | | ID from source system |
| name | VARCHAR(500) | NOT NULL | Product title |
| description | TEXT | | Product description |
| sku | VARCHAR(255) | | Stock keeping unit |
| category | ENUM | | apparel, collectibles, accessories, home, digital, other |
| price | DECIMAL(10,2) | | Current price |
| vendor | VARCHAR(255) | | Vendor/manufacturer |
| imageUrl | TEXT | | Product image |
| tags | JSONB | DEFAULT '[]' | Product tags |
| mappingStatus | ENUM | DEFAULT 'unmapped' | unmapped, suggested, confirmed, skipped |
| aiSuggestedAssets | JSONB | | AI mapping suggestions |
| totalRevenue | DECIMAL(12,2) | DEFAULT 0 | Cached total revenue |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation time |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Last update |

#### product_assets
Many-to-many link between products and IP assets.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| productId | UUID | FK → products.id | Product reference |
| assetId | UUID | FK → ip_assets.id | Asset reference |
| isPrimary | BOOLEAN | DEFAULT false | Primary asset flag |
| confidence | DECIMAL(3,2) | | AI confidence (0.00-1.00) |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation time |

#### sales
Individual sale transactions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| publisherId | UUID | FK → publishers.id | Tenant reference |
| productId | UUID | FK → products.id | Product sold |
| connectorId | UUID | FK → connectors.id | Source connector |
| externalOrderId | VARCHAR(255) | | Order ID from source |
| quantity | INTEGER | NOT NULL | Units sold |
| revenue | DECIMAL(12,2) | NOT NULL | Total revenue |
| cost | DECIMAL(12,2) | | Cost of goods |
| region | VARCHAR(100) | | Geographic region |
| channel | VARCHAR(100) | | Sales channel |
| orderDate | TIMESTAMP | NOT NULL | Transaction date |
| metadata | JSONB | DEFAULT '{}' | Additional data |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation time |

#### invitations
Pending team member invitations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| publisherId | UUID | FK → publishers.id | Tenant reference |
| email | VARCHAR(255) | NOT NULL | Invitee email |
| name | VARCHAR(255) | | Invitee name |
| role | ENUM | DEFAULT 'member' | admin, member, analyst |
| token | VARCHAR(256) | UNIQUE, NOT NULL | Secure invite token |
| status | ENUM | DEFAULT 'pending' | pending, accepted, expired, revoked |
| invitedBy | UUID | FK → users.id | Inviter reference |
| expiresAt | TIMESTAMP | NOT NULL | Token expiration |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation time |

#### waitlist
Pilot program signups.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Contact email |
| companyName | VARCHAR(255) | | Company name |
| companyWebsite | TEXT | | Company website |
| revenueRange | VARCHAR(100) | | Revenue bracket |
| primaryChannel | VARCHAR(100) | | Primary sales channel |
| notes | TEXT | | Internal notes |
| status | ENUM | DEFAULT 'pending' | pending, approved, rejected, converted |
| approvedAt | TIMESTAMP | | Approval time |
| approvedBy | VARCHAR(255) | | Approver identifier |
| inviteToken | VARCHAR(256) | | Generated invite token |
| createdAt | TIMESTAMP | DEFAULT NOW() | Submission time |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Last update |

#### ai_insights
AI-generated recommendations (cached).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| publisherId | UUID | FK → publishers.id | Tenant reference |
| type | VARCHAR(100) | NOT NULL | Insight category |
| title | VARCHAR(500) | NOT NULL | Headline |
| description | TEXT | | Detailed explanation |
| confidence | DECIMAL(3,2) | | AI confidence |
| data | JSONB | DEFAULT '{}' | Structured data |
| recommendations | JSONB | DEFAULT '[]' | Action items |
| expiresAt | TIMESTAMP | | Cache expiration |
| createdAt | TIMESTAMP | DEFAULT NOW() | Generation time |

---

## 9. API Design

### 9.1 API Conventions

**Base URL:** `/api`

**Authentication:**
- All endpoints (except public) require valid session
- Session extracted from HTTP-only cookie
- `publisherId` scopes all queries

**Response Format:**
```typescript
// Success
{
  data: T,
  meta?: { ... }
}

// Error
{
  error: string,
  details?: { ... }
}
```

**HTTP Status Codes:**
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

### 9.2 Endpoint Reference

#### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signin` | Initiate login |
| POST | `/api/auth/signout` | End session |
| GET | `/api/auth/session` | Get current session |

#### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Dashboard metrics + charts |

**Response:**
```typescript
{
  hasData: boolean;
  stats: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    productCount: number;
    revenueGrowth: number;
    ordersGrowth: number;
  };
  revenueData: Array<{ date: string; revenue: number }>;
  categoryData: Array<{ name: string; value: number; percentage: number }>;
  assetData: Array<{ name: string; revenue: number; growth: number }>;
  recentOrders: Array<{ id: string; product: string; amount: number; date: string }>;
}
```

#### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products with stats |
| POST | `/api/products/import` | Import from CSV |
| POST | `/api/products/auto-tag` | Batch AI tagging |
| GET | `/api/products/[id]/assets` | Get product's linked assets |
| POST | `/api/products/[id]/assets` | Link/unlink assets |

#### Connectors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/connectors` | List connectors |
| POST | `/api/connectors/shopify/auth` | Start Shopify OAuth |
| GET | `/api/connectors/shopify/callback` | OAuth callback |
| POST | `/api/connectors/shopify/sync/products` | Sync products |
| POST | `/api/connectors/shopify/sync/orders` | Sync orders |
| DELETE | `/api/connectors/[id]` | Disconnect connector |

#### AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/insights` | Generate AI insights |
| POST | `/api/ai/tagging` | Get tagging suggestions |

**Insights Request:**
```typescript
{ type: 'general' | 'assets' | 'products' }
```

**Insights Response:**
```typescript
{
  insights: Array<{
    title: string;
    description: string;
    confidence: number;
    recommendations: string[];
  }>;
}
```

#### Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings/team` | List team members |
| POST | `/api/settings/invite` | Create invitation |
| GET | `/api/settings/invite/validate` | Validate invite token |
| POST | `/api/settings/invite/validate` | Redeem invitation |

#### Waitlist (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/waitlist` | Submit signup (public) |
| GET | `/api/waitlist?key=SECRET` | List entries (admin) |
| POST | `/api/waitlist/update` | Update entry status |

---

## 10. AI Systems

### 10.1 AI Architecture

PhantomOS uses Anthropic's Claude API for two primary functions:

1. **Product Tagging** - Mapping products to IP assets
2. **Insight Generation** - Analyzing data for opportunities/risks

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AI PIPELINE                                  │
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │   Context    │───▶│   Claude     │───▶│   Structured         │  │
│  │   Assembly   │    │   API Call   │    │   Output Parsing     │  │
│  └──────────────┘    └──────────────┘    └──────────────────────┘  │
│         │                                           │               │
│         │                                           │               │
│         ▼                                           ▼               │
│  ┌──────────────┐                        ┌──────────────────────┐  │
│  │ • Products   │                        │ • Asset Suggestions  │  │
│  │ • Sales Data │                        │ • Insights           │  │
│  │ • IP Assets  │                        │ • Recommendations    │  │
│  │ • History    │                        │ • Confidence Scores  │  │
│  └──────────────┘                        └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 10.2 Product Tagging System

**Purpose:** Suggest which IP assets a product features based on its name and description.

**Input:**
```typescript
{
  product: {
    name: "Shadow Knight Premium T-Shirt",
    description: "High-quality cotton tee featuring the iconic Shadow Knight",
    category: "apparel",
    tags: ["character", "villain"]
  },
  availableAssets: [
    { id: "...", name: "Shadow Knight", type: "character" },
    { id: "...", name: "Luna Starfire", type: "character" },
    { id: "...", name: "Phantom Warriors Logo", type: "logo" }
  ]
}
```

**Prompt Structure:**
```
You are an IP asset mapping assistant for gaming merchandise.

Given a product and available IP assets, identify which assets the product features.

Product: {name}
Description: {description}
Category: {category}

Available Assets:
{formatted list of assets}

Return JSON array of matches with confidence scores (0-1).
```

**Output:**
```typescript
{
  suggestions: [
    { assetId: "...", assetName: "Shadow Knight", confidence: 0.95 },
    { assetId: "...", assetName: "Phantom Warriors Logo", confidence: 0.60 }
  ]
}
```

**Batch Processing:**
- Up to 50 products per API call
- Products formatted as numbered list
- Response parsed and matched back to products

### 10.3 Insight Generation System

**Purpose:** Analyze sales data and generate actionable insights.

**Input Context:**
```typescript
{
  stats: {
    totalRevenue: number,
    totalProducts: number,
    mappedProducts: number,
    // ...
  },
  topAssets: Array<{ name, revenue, growth }>,
  topProducts: Array<{ name, revenue, mappingStatus }>,
  recentTrends: Array<{ period, revenue, change }>
}
```

**Prompt Structure:**
```
You are an AI analyst for gaming merchandise intelligence.

Analyze the following data and provide 3-5 actionable insights:

{formatted context}

Return insights as JSON array with:
- title: Brief headline
- description: Detailed explanation
- confidence: 0-1 score
- recommendations: Array of specific actions

Focus on:
- Growth opportunities
- Risk warnings
- Trend patterns
- Strategic recommendations
```

**Output:**
```typescript
{
  insights: [
    {
      title: "Shadow Knight Merchandise Trending",
      description: "Shadow Knight products show 34% growth over the past month...",
      confidence: 0.87,
      recommendations: [
        "Expand Shadow Knight product line with new apparel",
        "Consider premium collectible launch for Q1",
        "Test APAC region for Shadow Knight expansion"
      ]
    },
    // ... more insights
  ]
}
```

### 10.4 AI Model Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Model | claude-sonnet-4-20250514 | Balance of capability and cost |
| Temperature | 0.3 | Lower for consistent structured output |
| Max Tokens | 4096 | Sufficient for insight generation |

### 10.5 Future AI Capabilities

**Q1 2026:**
- Image analysis for product photos
- Character recognition in merchandise images
- Logo detection and matching

**2026+:**
- Predictive analytics (revenue forecasting)
- Automated trend reports
- AI-generated merchandise concepts

---

## 11. Security & Privacy

### 11.1 Authentication Security

**Password Handling:**
- bcrypt hashing with salt rounds = 12
- Passwords never stored in plain text
- Minimum password requirements enforced

**Session Security:**
- JWT tokens with encrypted payload
- HTTP-only cookies (not accessible to JavaScript)
- Secure flag in production (HTTPS only)
- Session expiration: 30 days

**Invitation Tokens:**
- 32 bytes of cryptographically secure random data
- Single-use (invalidated on redemption)
- 7-day expiration
- Publisher-scoped validation

### 11.2 Data Isolation

**Multi-Tenant Security:**
- All queries filtered by `publisherId`
- No cross-tenant data leakage possible
- Publisher ID extracted from verified session

**API Security:**
- All protected routes verify session
- Admin routes require separate secret key
- Rate limiting on sensitive endpoints

### 11.3 Third-Party Integrations

**Shopify:**
- OAuth 2.0 (no credentials stored)
- Read-only access to products/orders
- Token refresh handled automatically

**Anthropic:**
- API key stored in environment variables
- No customer data retained by AI provider
- Requests use HTTPS exclusively

### 11.4 Data Privacy

**What We Store:**
- Business data (products, sales, assets)
- Account data (email, name, role)
- Usage data (login times, feature usage)

**What We Don't Store:**
- Payment information (future: handled by Stripe)
- Raw Shopify credentials
- Customer PII from orders (only aggregate data)

**Data Retention:**
- Active accounts: Indefinite
- Deleted accounts: 30-day grace period
- Waitlist data: Until converted or 1 year

### 11.5 Compliance Considerations

**Current:**
- HTTPS everywhere
- Secure password handling
- Session-based authentication

**Future (as needed):**
- GDPR compliance (data export, deletion)
- SOC 2 certification
- CCPA compliance

---

## 12. Business Model

### 12.1 Current Phase: Founding Pilot

**Duration:** Q4 2025 - Q1 2026

**Terms:**
- Free access for pilot members
- Limited to ~20 publishers
- Direct support and feedback channel
- Shape product roadmap

**Goals:**
- Validate product-market fit
- Collect testimonials and case studies
- Refine features based on real usage
- Build reference customers

### 12.2 Post-Pilot Pricing (Planned)

**Model:** Usage-based SaaS with tiers

| Tier | Monthly Price | Included | Overage |
|------|---------------|----------|---------|
| **Starter** | Free | 500 products, 1 connector, 1 user | N/A |
| **Growth** | $199/month | 5,000 products, 3 connectors, 5 users | $0.02/product |
| **Business** | $499/month | 25,000 products, unlimited connectors, 15 users | $0.01/product |
| **Enterprise** | Custom | Unlimited, custom integrations, SLA | Negotiated |

**Founder Discount:**
- Pilot members receive 50% discount for life
- Locked in when transitioning to paid

### 12.3 Revenue Projections

**Assumptions:**
- 10 pilot conversions at Growth tier
- 20 new customers in 2026
- 10% month-over-month growth

**Year 1 (Post-Pilot):**
| Quarter | Customers | MRR | ARR |
|---------|-----------|-----|-----|
| Q2 2026 | 10 | $2,000 | $24,000 |
| Q3 2026 | 15 | $3,000 | $36,000 |
| Q4 2026 | 22 | $4,500 | $54,000 |

### 12.4 Unit Economics (Target)

| Metric | Target |
|--------|--------|
| CAC | < $500 |
| LTV | > $5,000 |
| LTV:CAC | > 10:1 |
| Gross Margin | > 80% |
| Churn | < 3% monthly |

---

## 13. Market Analysis

### 13.1 Gaming Merchandise Market

**Total Market Size:**
- Global gaming merchandise: ~$55.7 billion (2025)
- Licensed gaming merchandise: ~$500 million (2025)
- Growing at 8-10% annually

**Market Drivers:**
- Esports growth and mainstream acceptance
- Nostalgia for classic gaming franchises
- Direct-to-consumer channels
- Influencer and streamer merchandise

### 13.2 Software Market

**PhantomOS TAM (Software):**
- ~650 gaming publishers worldwide with merchandise
- Average software spend: $10,000-50,000/year on analytics
- **TAM:** $6.5M - $32.5M

**SAM (Serviceable):**
- ~300 publishers actively selling merchandise
- Match our target profile
- **SAM:** $3M - $15M

**SOM (Obtainable):**
- Year 1 target: 30 customers
- Average deal: $3,000/year
- **SOM:** $90,000 ARR

### 13.3 Industry Trends

**Favorable:**
1. Gaming IP expanding to movies, TV, merchandise
2. Publishers investing in D2C channels
3. Data-driven decision making becoming standard
4. AI tools becoming expected

**Challenges:**
1. Long sales cycles with enterprise publishers
2. Existing BI tools "good enough" for some
3. Economic uncertainty affecting discretionary spend
4. Data integration complexity

---

## 14. Competitive Landscape

### 14.1 Direct Competitors

**None identified** with gaming-specific IP attribution.

### 14.2 Adjacent Solutions

| Category | Examples | Gap |
|----------|----------|-----|
| E-commerce Analytics | Shopify Analytics, Triple Whale | No IP attribution |
| Business Intelligence | Tableau, Looker | Requires custom setup |
| Merchandise Platforms | Printful, Teespring | Focus on production, not analytics |
| Gaming Analytics | Newzoo, SuperData | Focus on games, not merchandise |

### 14.3 Competitive Advantages

1. **Specialization:** Built specifically for gaming merchandise
2. **IP Attribution:** Core feature that others lack
3. **AI-Native:** Claude integration for insights and tagging
4. **Ease of Use:** No setup required, immediate value
5. **First Mover:** Establishing category leadership

### 14.4 Defensibility

**Short-term:**
- Product execution and customer relationships
- Feature velocity and responsiveness

**Long-term:**
- Data network effects (more usage = better AI)
- Industry expertise and reputation
- Integration ecosystem
- Switching costs (historical data)

---

## 15. Product Roadmap

### 15.1 What's Live (December 2025)

| Feature | Status | Description |
|---------|--------|-------------|
| Dashboard Overview | Live | Revenue metrics, charts, export |
| Fan Intelligence Hub | Live | AI-powered insights |
| Asset Tagging | Live | Product-to-IP mapping |
| Shopify Connector | Live | OAuth integration |
| CSV Import | Live | Products and sales |
| Team Management | Live | Invitations, roles |
| Marketing Site | Live | Landing, FAQ, roadmap |
| Waitlist System | Live | Pilot signup |
| Admin Dashboard | Live | Waitlist management |

### 15.2 Coming Q1 2026

| Feature | Priority | Description |
|---------|----------|-------------|
| Amazon Connector | High | Seller Central integration |
| AI Image Recognition | High | Product photo analysis |
| Advanced Filtering | Medium | Complex product queries |
| WooCommerce Connector | Medium | WordPress integration |
| Email Notifications | Medium | Alerts and digests |

### 15.3 2026 Horizon

| Feature | Category | Description |
|---------|----------|-------------|
| Merch Studio | Creation | AI-generated merchandise concepts |
| Print-on-Demand | Production | Integrated fulfillment |
| Creator Partnerships | Distribution | Influencer collaboration tools |
| Custom Storefronts | Distribution | Branded D2C sites |
| Predictive Analytics | Intelligence | Revenue forecasting |
| API Platform | Integration | Developer API access |

### 15.4 Long-Term Vision

**Phase 1 (Current):** Intelligence
- Know what's selling
- Understand IP performance

**Phase 2:** Creation
- Design merchandise with AI
- Rapid prototyping

**Phase 3:** Production
- Order management
- Fulfillment integration

**Phase 4:** Distribution
- D2C storefronts
- Channel optimization

---

## 16. Go-to-Market Strategy

### 16.1 Pilot Phase (Now)

**Strategy:** Hand-select founding customers

**Tactics:**
- LinkedIn outreach to merchandise managers
- Gaming industry conferences
- Warm introductions from advisors
- Content marketing (blog, Twitter)

**Target:** 10-20 publishers

### 16.2 Post-Pilot Launch

**Strategy:** Product-led growth with sales assist

**Tactics:**
1. Free tier for small publishers
2. Content marketing and SEO
3. Case studies from pilot customers
4. Industry newsletter sponsorships
5. Targeted LinkedIn ads

### 16.3 Enterprise Sales

**Strategy:** Relationship-driven sales

**Tactics:**
1. Reference customers from pilot
2. ROI calculator and business case
3. Custom demo environments
4. Pilot programs before commitment

### 16.4 Partnerships

**Potential Partners:**
- Shopify (app marketplace)
- Merchandise manufacturers
- Gaming industry associations
- E-commerce agencies

---

## 17. Demo & Pilot Setup

### 17.1 Demo Environment

**Account:** ptengelmann@gmail.com

**Demo Data (Seeded):**
- Game IP: Phantom Warriors
- 6 Characters: Shadow Knight, Luna Starfire, Iron Fang, The Architect, Pixel, Crimson Guard
- 60 Products: Apparel, collectibles, accessories, home
- 1,917 Sales Records: June - November 2025
- Total Revenue: ~$227,000

**Demo Flow:**
1. **Overview:** Show revenue metrics, charts
2. **Intelligence Hub:** Generate AI insights
3. **Products:** Show tagging interface
4. **Connectors:** Show Shopify integration

### 17.2 Pilot Onboarding

**Step 1:** Application Review (24-48 hours)
- Review waitlist submission
- Verify gaming publisher status
- Approve in admin dashboard

**Step 2:** Account Creation
- Send invite link
- User creates account
- Associate with publisher

**Step 3:** Data Connection
- Connect Shopify OR
- Import CSV files
- Initial product sync

**Step 4:** Asset Setup
- Create Game IPs
- Define IP Assets (characters, etc.)
- Import existing taxonomy if available

**Step 5:** Tagging
- Review AI suggestions
- Confirm mappings
- Track progress

**Step 6:** Insights
- Generate first analysis
- Review AI recommendations
- Export initial report

### 17.3 Running the Seed Script

```bash
# Ensure DATABASE_URL is set
npx tsx scripts/seed-demo-data.ts
```

Creates:
- 1 Demo connector (CSV type)
- 1 Game IP (Phantom Warriors)
- 6 IP Assets (characters)
- 60 Products
- ~1,900 Sales records

---

## 18. Metrics & Success Criteria

### 18.1 Pilot Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Pilot Signups | 50 | Waitlist submissions |
| Pilot Activations | 20 | Connected data source |
| Weekly Active Users | 10 | Dashboard visits |
| Products Tagged | 1,000 | Confirmed mappings |
| NPS Score | > 40 | Post-pilot survey |

### 18.2 Product Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| Activation Rate | % signups who connect data | > 60% |
| Tagging Completion | % products tagged | > 50% |
| AI Accuracy | % AI suggestions accepted | > 70% |
| Feature Adoption | % using Intelligence Hub | > 80% |
| Retention | Monthly active / Total | > 70% |

### 18.3 Business Metrics (Post-Pilot)

| Metric | Year 1 Target |
|--------|---------------|
| ARR | $50,000 |
| Customers | 25 |
| MRR Growth | 10% MoM |
| Churn | < 5% monthly |
| CAC | < $500 |

---

## 19. Glossary

| Term | Definition |
|------|------------|
| **IP (Intellectual Property)** | Creative assets owned by a publisher (characters, logos, themes) |
| **IP Asset** | Individual element of IP (e.g., a specific character) |
| **Game IP** | A game franchise (e.g., "Phantom Warriors") |
| **Publisher** | Gaming company that owns IP and sells merchandise |
| **Mapping** | Linking a product to one or more IP assets |
| **Tagging** | The process of mapping products to assets |
| **Connector** | Integration with an external data source |
| **Insight** | AI-generated observation or recommendation |
| **Fan Intelligence** | Understanding of fan preferences via purchase behavior |
| **SKU** | Stock Keeping Unit - unique product identifier |
| **Revenue Attribution** | Assigning revenue to specific IP assets |
| **Multi-tenant** | Single application serving multiple isolated customers |
| **Pilot** | Early access program for founding customers |

---

## 20. Appendices

### Appendix A: Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Authentication
NEXTAUTH_SECRET=random-32-char-string
NEXTAUTH_URL=https://app.phantomos.com

# AI
ANTHROPIC_API_KEY=sk-ant-api03-...

# Shopify
SHOPIFY_API_KEY=your-api-key
SHOPIFY_API_SECRET=your-api-secret

# Application
NEXT_PUBLIC_APP_NAME=PhantomOS
NEXT_PUBLIC_APP_URL=https://app.phantomos.com
DEMO_MODE=false

# Pilot Mode
PILOT_MODE=true
ALLOWED_EMAILS=admin@company.com
ADMIN_SECRET_KEY=secure-random-key
```

### Appendix B: Deployment Checklist

**Vercel Deployment:**
1. Connect GitHub repository
2. Configure environment variables
3. Set production domain
4. Enable automatic deployments

**Database Setup:**
1. Create Neon project
2. Copy connection string
3. Run `npx drizzle-kit push`
4. Verify tables created

**Domain Configuration:**
1. Add custom domain in Vercel
2. Configure DNS records
3. Enable HTTPS
4. Update NEXTAUTH_URL

### Appendix C: Support Contacts

- **Technical Issues:** engineering@phantomos.com
- **Pilot Program:** pilot@phantomos.com
- **General Inquiries:** hello@phantomos.com

---

**Document Version History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Founding Team | Initial specification |

---

*This document is confidential and intended for internal use and authorized investors only.*
