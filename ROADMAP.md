# PhantomOS Roadmap

This document outlines the planned features and enhancements for PhantomOS.

---

## Current Phase: MVP Complete + Pilot Active

The core platform is fully functional and in active pilot testing. Last updated: December 2025.

### Core Features (Complete)

| Feature | Status | Description |
|---------|--------|-------------|
| **Fan Intelligence Hub** | Complete | AI-powered insights dashboard with real-time recommendations |
| **AI Asset Tagging** | Complete | Claude-powered auto-tagging maps products to IP assets |
| **Revenue Analytics** | Complete | Track revenue by character, franchise, and product category |
| **Shopify Integration** | Complete | OAuth connection with auto-sync of products and orders |
| **CSV Import** | Complete | Universal import for any data source |
| **Dashboard** | Complete | Real-time analytics with chart controls and date filtering |
| **Team Management** | Complete | Invite team members with role assignments |
| **RBAC** | Complete | Role-based access control (owner/admin = write, member/analyst = read-only) |
| **Pilot System** | Complete | Waitlist with admin approval and token-based invitations |

### Marketing & SEO (Complete)

| Feature | Status | Description |
|---------|--------|-------------|
| **Landing Page** | Complete | Hero section with dashboard preview |
| **How It Works** | Complete | Step-by-step guide explaining the platform |
| **Features Pages** | Complete | Individual pages for Intelligence, Tagging, Analytics, Connectors |
| **About/Careers** | Complete | Company information pages |
| **SEO Optimization** | Complete | Sitemap, robots.txt, page metadata |
| **Responsive Design** | Complete | Mobile-friendly with floating navbar |

### Security (Complete)

| Feature | Status | Description |
|---------|--------|-------------|
| **Authentication** | Complete | NextAuth.js with JWT sessions |
| **Password Security** | Complete | bcrypt hashing for all passwords |
| **RBAC Enforcement** | Complete | Write operations protected by role checks |
| **Demo Mode Isolation** | Complete | RBAC enforced even when demo mode enabled |
| **Tenant Isolation** | Complete | All queries scoped to publisher ID |

---

## Phase 2: Merch Studio

**AI-Powered Merchandise Design Tools**

Transform how publishers create merchandise by leveraging AI to generate designs, mockups, and product variations.

### Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **AI Design Generator** | Generate merchandise designs from IP assets using AI image generation | High |
| **Template Library** | Pre-built templates for apparel, posters, accessories | High |
| **Mockup Previews** | See designs on product mockups (t-shirts, mugs, etc.) | High |
| **Character Variations** | Generate different poses/styles of existing characters | Medium |
| **Style Transfer** | Apply art styles (chibi, realistic, pixel art) to assets | Medium |
| **Batch Generation** | Create multiple design variations at once | Medium |
| **Design Versioning** | Track design iterations and approvals | Low |

### User Flow
1. Select IP asset (character, logo, theme)
2. Choose product type (t-shirt, poster, sticker)
3. AI generates design options
4. User refines and approves
5. Export production-ready files

---

## Phase 3: Production

**Order Management & Fulfillment Orchestration**

Connect to print-on-demand and manufacturing partners to streamline production.

### Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **Print-on-Demand Integration** | Connect to Printful, Printify, Gooten | High |
| **Order Routing** | Automatically route orders to optimal fulfillment partner | High |
| **Production Tracking** | Track order status from design to delivery | High |
| **Quality Control** | Review system for production samples | Medium |
| **Inventory Management** | Track stock levels for warehoused items | Medium |
| **Cost Calculator** | Estimate production costs and margins | Medium |
| **Bulk Orders** | Handle large quantity manufacturing runs | Low |

### Integrations
- **Printful** - Global print-on-demand
- **Printify** - Multi-supplier network
- **Gooten** - Enterprise fulfillment
- **Pietra** - Premium manufacturing
- **Custom API** - Direct factory connections

---

## Phase 4: Storefront

**Direct-to-Consumer E-Commerce**

Enable publishers to sell directly to fans without needing external platforms.

### Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **Hosted Storefronts** | Publisher-branded stores on phantom.store/{publisher} | High |
| **Custom Domains** | Connect publisher's own domain | High |
| **Product Catalog** | Sync products from Merch Studio | High |
| **Shopping Cart** | Full e-commerce checkout experience | High |
| **Payment Processing** | Stripe integration for payments | High |
| **Order Management** | Track and manage customer orders | High |
| **Customer Accounts** | Fan accounts with order history | Medium |
| **Wishlist & Favorites** | Save products for later | Medium |
| **Reviews & Ratings** | Customer feedback on products | Medium |
| **Promotions** | Discount codes, flash sales | Medium |
| **Pre-Orders** | Accept orders before launch | Low |
| **Limited Editions** | Scarcity and edition numbering | Low |

### Store Themes
- Minimalist (default)
- Gaming Dark Mode
- Collector's Edition
- Custom (enterprise)

---

## Phase 5: Creators

**Influencer & Creator Partnership Platform**

Enable publishers to work with content creators for merchandise collaborations.

### Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **Creator Marketplace** | Discover and connect with gaming creators | High |
| **Collaboration Tools** | Manage creator partnerships and approvals | High |
| **Revenue Sharing** | Automated royalty tracking and payouts | High |
| **Creator Storefronts** | Branded stores for creator merchandise | High |
| **Affiliate Program** | Track referrals and commissions | Medium |
| **Campaign Management** | Coordinate product launches with creators | Medium |
| **Performance Analytics** | Track creator-driven sales | Medium |
| **Contract Management** | Digital agreements and terms | Low |

### Creator Types
- **Streamers** - Twitch, YouTube Gaming
- **Content Creators** - YouTube, TikTok
- **Esports Athletes** - Professional players
- **Community Artists** - Fan artists and designers
- **Cosplayers** - Costume creators

---

## Phase 6: Additional Connectors

**Expand Data Source Integrations**

Connect to more e-commerce platforms and data sources.

### E-Commerce Platforms

| Connector | Status | Priority |
|-----------|--------|----------|
| Shopify | Complete | - |
| CSV Import | Complete | - |
| Amazon Seller Central | Planned | High |
| Amazon Vendor Central | Planned | High |
| WooCommerce | Planned | Medium |
| BigCommerce | Planned | Medium |
| Etsy | Planned | Medium |
| eBay | Planned | Low |
| Walmart Marketplace | Planned | Low |

### Licensing Partners

| Connector | Description | Priority |
|-----------|-------------|----------|
| **Licensing Portal** | Connect to major licensees | High |
| **Royalty Reports** | Import royalty statements | Medium |
| **Partner Dashboard** | Shared analytics with partners | Medium |

### Marketing & Analytics

| Connector | Description | Priority |
|-----------|-------------|----------|
| **Google Analytics** | Import traffic and conversion data | Medium |
| **Meta Ads** | Facebook/Instagram ad performance | Medium |
| **Google Ads** | Search and display ad metrics | Low |
| **Social Media** | Twitter, TikTok, Instagram metrics | Low |

---

## Phase 7: Advanced AI

**Next-Generation AI Capabilities**

Enhance AI features for deeper insights and automation.

### Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **Image Recognition** | Automatically identify assets in product images | High |
| **Natural Language Queries** | "Which character sold best in Q4?" | High |
| **Predictive Analytics** | Forecast demand and revenue | High |
| **Anomaly Detection** | Alert on unusual patterns | Medium |
| **Sentiment Analysis** | Analyze fan reception from reviews/social | Medium |
| **Automated Tagging** | Zero-touch product categorization | Medium |
| **Trend Prediction** | Identify emerging asset popularity | Low |

---

## Phase 8: Enterprise

**Enterprise-Grade Features**

Features for large publishers and studios.

### Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **SSO Integration** | SAML/OIDC single sign-on | High |
| **Audit Logging** | Complete activity history | High |
| **Custom Reporting** | Build custom dashboards and reports | High |
| **API Access** | Full REST API for integrations | Medium |
| **White Label** | Custom branding for the platform | Medium |
| **Multi-Region** | Data residency options (US, EU, APAC) | Medium |
| **SLA Guarantees** | Uptime and support commitments | Low |
| **Dedicated Support** | Named account manager | Low |

---

## Timeline (Tentative)

| Phase | Target | Status |
|-------|--------|--------|
| MVP | Q4 2024 | **Complete** |
| Pilot Launch | Q1 2025 | **Active** |
| Merch Studio | Q2 2025 | Planning |
| Production | Q2-Q3 2025 | Planning |
| Storefront | Q3 2025 | Planning |
| Creators | Q4 2025 | Planning |
| Additional Connectors | Ongoing | In Progress |
| Advanced AI | Q4 2025 - Q1 2026 | Planning |
| Enterprise | 2026 | Planning |

---

## Recent Updates

### December 2025
- Made Settings page fully functional:
  - Profile: name and avatar changes now save to database
  - Avatar upload with file picker and base64 storage
  - Organization: name and website changes save to database
  - Proper loading states, success/error feedback
  - RBAC enforced (only owner/admin can edit org settings)
- Redesigned Updates page with interactive features:
  - Expandable cards (click to see details)
  - Search functionality
  - Year and category filters
  - Category badges (Feature, Fix, Security, etc.)
- Added How It Works page with step-by-step user flow
- Fixed demo mode bypassing real data throughout the app:
  - Settings profile/organization APIs now return real user data for logged-in users
  - All write endpoints check session before demo mode
  - Demo data only shown for anonymous/unauthenticated access
- Fixed RBAC bypass in demo mode - role checks now enforced for all logged-in users
- Added write protection to all tagging and mapping routes
- Updated hero CTA to link to How It Works page
- Added How It Works to navbar navigation

### November 2025
- Added Role-Based Access Control (RBAC) system
- Implemented team invitation system with role assignment
- Added user management with owner/admin/member/analyst roles
- Protected all write endpoints with role-based authorization

### October 2025
- Redesigned marketing pages with minimal black/white aesthetic
- Added floating pill navbar with mega menu
- Implemented SEO: sitemap, robots.txt, page metadata
- Created feature-specific landing pages

---

## Feedback

This roadmap is shaped by user feedback. To request features or reprioritize items, contact the PhantomOS team.

---

*Building the future of gaming merchandise, one feature at a time.*
