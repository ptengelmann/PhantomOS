# PhantomOS: Functional Specification

**Version:** 1.0
**Last Updated:** December 2025
**Purpose:** Detailed functional requirements for implementation
**Audience:** Engineers, Product Designers, QA

---

## Table of Contents

1. [Document Overview](#1-document-overview)
2. [Global Behaviors](#2-global-behaviors)
3. [Authentication System](#3-authentication-system)
4. [Marketing Site](#4-marketing-site)
5. [Dashboard Overview](#5-dashboard-overview)
6. [Fan Intelligence Hub](#6-fan-intelligence-hub)
7. [Products & Asset Tagging](#7-products--asset-tagging)
8. [Data Connectors](#8-data-connectors)
9. [Settings](#9-settings)
10. [Admin Dashboard](#10-admin-dashboard)
11. [API Specifications](#11-api-specifications)
12. [Error Handling](#12-error-handling)
13. [Performance Requirements](#13-performance-requirements)

---

## 1. Document Overview

### 1.1 Purpose

This document describes the exact functional behavior of PhantomOS at the UX, workflow, and system-interaction level. It serves as the authoritative reference for:

- **Engineers:** Implementing features without ambiguity
- **Designers:** Understanding interaction requirements
- **QA:** Writing test cases and acceptance criteria

### 1.2 Conventions

| Convention | Meaning |
|------------|---------|
| `MUST` | Required behavior, no exceptions |
| `SHOULD` | Recommended behavior, exceptions allowed with justification |
| `MAY` | Optional behavior |
| `[Component]` | Reference to a UI component |
| `{variable}` | Dynamic value |
| `→` | Navigation or state transition |

### 1.3 Related Documents

- `PHANTOMOS_FULL_SPEC.md` - Product specification
- `README.md` - Technical setup guide
- `PILOT_SYSTEM.md` - Pilot mode documentation

---

## 2. Global Behaviors

### 2.1 Page Layout Structure

**Marketing Pages** (`/`, `/features/*`, `/faq`, `/roadmap`, `/waitlist`)
```
┌─────────────────────────────────────────────────────────────┐
│                    [MarketingNavbar]                        │
│  Logo | Features ▼ | FAQ | Roadmap | Sign in | Join Waitlist│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                      [Page Content]                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    [MarketingFooter]                        │
└─────────────────────────────────────────────────────────────┘
```

**Dashboard Pages** (`/overview`, `/intelligence`, `/products`, `/connectors`, `/settings`)
```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar]  │                [Header]                        │
│            │  Title | Description | Action Button           │
│  Logo      ├────────────────────────────────────────────────┤
│            │                                                │
│  Nav Items │              [Page Content]                    │
│  - Overview│                                                │
│  - Intel   │                                                │
│  - Products│                                                │
│  - Connect │                                                │
│  - Settings│                                                │
│            │                                                │
│  Sign Out  │                                                │
└────────────┴────────────────────────────────────────────────┘
```

### 2.2 Loading States

**Requirement:** Every page that fetches data MUST show a skeleton loading state.

**Skeleton UI Rules:**
- Use `animate-pulse` class for shimmer effect
- Background color: `bg-[#e5e5e5]` for primary elements
- Background color: `bg-[#f5f5f5]` for secondary elements
- Match approximate dimensions of actual content
- Duration: Show until data fetch completes OR error occurs

**Implementation Pattern:**
```typescript
if (loading) {
  return <SkeletonUI />;
}
if (error) {
  return <ErrorState />;
}
if (!hasData) {
  return <EmptyState />;
}
return <ActualContent />;
```

### 2.3 Empty States

**Requirement:** Every data-dependent view MUST show a meaningful empty state.

**Empty State Components:**
- Icon: Relevant to the missing data type
- Headline: Clear description of what's missing
- Body: Explanation of why and what to do
- CTA: Primary action to resolve the empty state

**Example:**
```
┌─────────────────────────────────────────┐
│              [Package Icon]             │
│                                         │
│          No products yet                │
│                                         │
│  Import your product catalog to start   │
│  tracking merchandise performance.      │
│                                         │
│  [Connect Shopify]  [Import CSV]        │
└─────────────────────────────────────────┘
```

### 2.4 Toast Notifications

**Trigger Conditions:**
- Successful action completion (save, delete, sync)
- Error during action
- Background process completion

**Behavior:**
- Position: Top-right corner, fixed
- Duration: Auto-dismiss after 5 seconds for success, persist for errors
- Actions: Close button (X) on all toasts

**Types:**
| Type | Background | Border | Icon |
|------|------------|--------|------|
| Success | `bg-green-50` | `border-green-200` | Check (green) |
| Error | `bg-red-50` | `border-red-200` | AlertCircle (red) |
| Warning | `bg-yellow-50` | `border-yellow-200` | AlertTriangle (yellow) |
| Info | `bg-blue-50` | `border-blue-200` | Info (blue) |

### 2.5 Navigation

**Sidebar Navigation:**
| Item | Route | Icon | Condition |
|------|-------|------|-----------|
| Overview | `/overview` | LayoutDashboard | Always |
| Intelligence | `/intelligence` | Brain | Always |
| Products | `/products` | Package | Always |
| Connectors | `/connectors` | Plug | Always |
| Settings | `/settings` | Settings | Always |

**Active State:**
- Background: `bg-[#f5f5f5]`
- Text: `text-[#0a0a0a]` with `font-medium`
- Inactive: `text-[#737373]` with hover → `text-[#0a0a0a]`

### 2.6 Responsive Behavior

**Breakpoints:**
| Name | Width | Behavior |
|------|-------|----------|
| Mobile | < 768px | Single column, hamburger menu |
| Tablet | 768-1024px | Collapsed sidebar, 2 columns |
| Desktop | > 1024px | Full sidebar, 3-4 columns |

**Dashboard Minimum Width:** 1024px (show horizontal scroll below this)

---

## 3. Authentication System

### 3.1 Login Page (`/login`)

**URL:** `/login`
**Access:** Public
**Purpose:** Authenticate existing users

#### Layout
```
┌─────────────────────────────────────────┐
│           PhantomOS Logo                │
│                                         │
│       Sign in to your account           │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Email                             │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Password                      👁️  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │          Sign In                  │  │
│  └───────────────────────────────────┘  │
│                                         │
│        Don't have an account?           │
│           Join the waitlist             │
└─────────────────────────────────────────┘
```

#### Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Email | email | Yes | Valid email format |
| Password | password | Yes | Min 1 character |

#### User Flow

1. User enters email
2. User enters password
3. User clicks "Sign In"
4. **IF** credentials valid:
   - Create session
   - Redirect to `/overview`
5. **IF** credentials invalid:
   - Show error: "Invalid email or password"
   - Clear password field
   - Keep email field populated
6. **IF** user not found:
   - Same error as invalid credentials (security)

#### Demo Mode

**Condition:** `DEMO_MODE=true` in environment

**Behavior:**
- Show "Demo Mode" badge
- Skip password validation
- Create demo session with `publisherId = demo-publisher-id`
- Redirect to `/overview`

#### Error States

| Condition | Message | Action |
|-----------|---------|--------|
| Empty email | "Email is required" | Focus email field |
| Invalid email format | "Please enter a valid email" | Focus email field |
| Empty password | "Password is required" | Focus password field |
| Wrong credentials | "Invalid email or password" | Clear password, focus password |
| Network error | "Unable to connect. Please try again." | Enable retry |

### 3.2 Registration Page (`/register`)

**URL:** `/register`
**Access:** Public (but may redirect based on pilot mode)
**Purpose:** Create new user accounts

#### Pilot Mode Behavior

**IF** `PILOT_MODE=true`:
- Redirect `/register` → `/waitlist`
- Exception: If `?email=` query param AND email is in waitlist with status `approved`

#### Layout
```
┌─────────────────────────────────────────┐
│           PhantomOS Logo                │
│                                         │
│       Create your account               │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Full Name                         │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Email                             │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Company Name                      │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Password                      👁️  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │        Create Account             │  │
│  └───────────────────────────────────┘  │
│                                         │
│       Already have an account?          │
│              Sign in                    │
└─────────────────────────────────────────┘
```

#### Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full Name | text | Yes | Min 2 characters |
| Email | email | Yes | Valid email, unique |
| Company Name | text | Yes | Min 2 characters |
| Password | password | Yes | Min 8 characters |

#### User Flow

1. User fills all fields
2. User clicks "Create Account"
3. **Backend Process:**
   - Validate all fields
   - Check email uniqueness
   - Create publisher (if new company)
   - Create user with `role = owner`
   - Hash password with bcrypt
   - Create session
4. **IF** success:
   - Redirect to `/overview`
5. **IF** email exists:
   - Show error: "An account with this email already exists"

### 3.3 Team Invitation Flow (`/invite`)

**URL:** `/invite?token={token}`
**Access:** Public
**Purpose:** Allow invited users to join an existing publisher

#### Step 1: Token Validation

**On Page Load:**
1. Extract `token` from URL query params
2. Call `GET /api/settings/invite/validate?token={token}`
3. **IF** valid:
   - Show registration form with pre-filled data
   - Display: "You've been invited to join {publisherName}"
4. **IF** invalid/expired:
   - Show error state
   - Message: "This invitation has expired or is invalid"
   - CTA: "Request a new invitation"

#### Step 2: Account Creation

**Form Fields:**
| Field | Type | Required | Pre-filled |
|-------|------|----------|------------|
| Email | email | Yes | From invitation (read-only) |
| Name | text | Yes | From invitation (if provided) |
| Password | password | Yes | No |

**On Submit:**
1. Call `POST /api/settings/invite/validate`
2. Backend creates user with invited role
3. Backend marks invitation as `accepted`
4. Create session
5. Redirect to `/overview`

### 3.4 Sign Out

**Trigger:** Click "Sign Out" in sidebar

**Behavior:**
1. Call NextAuth signOut
2. Clear session cookie
3. Redirect to `/login`

---

## 4. Marketing Site

### 4.1 Landing Page (`/`)

**URL:** `/`
**Access:** Public
**Purpose:** Communicate value proposition, drive waitlist signups

#### Sections

**1. Hero Section**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     Know Which Characters Actually Sell                     │
│                                                             │
│  PhantomOS connects your sales data and uses AI to reveal   │
│  which IP assets drive your merchandise revenue.            │
│                                                             │
│  [Join the Pilot Program →]      [See How It Works]         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**2. Problem Statement**
- 3 pain point cards
- Each with icon, headline, description

**3. Solution Overview**
- 3-step process visualization
- Connect → Tag → Analyze

**4. Feature Highlights**
- 4 feature cards with icons
- Links to detailed feature pages

**5. Social Proof**
- Market stats
- Testimonial placeholder

**6. CTA Section**
- Final call to join waitlist
- Benefits of pilot program

#### CTA Behavior

**Primary CTA:** "Join the Pilot Program"
- Links to `/waitlist`

**Secondary CTA:** "See How It Works"
- Scrolls to solution section OR links to `/features`

### 4.2 Features Page (`/features`)

**URL:** `/features`
**Access:** Public
**Purpose:** Detailed feature breakdown

#### Feature Cards

| Feature | Description | Link |
|---------|-------------|------|
| Fan Intelligence Hub | AI-powered insights | `/features/intelligence` |
| Asset Tagging | Map products to IP | `/features/tagging` |
| Revenue Analytics | Track by character | `/features/analytics` |
| Data Connectors | Connect Shopify, CSV | `/features/connectors` |

Each feature page follows structure:
1. Hero with feature name and description
2. Key capabilities (3-4 items)
3. Screenshot/mockup
4. CTA to waitlist

### 4.3 FAQ Page (`/faq`)

**URL:** `/faq`
**Access:** Public
**Purpose:** Answer common questions

#### Structure

**Categories:**
1. General (4 questions)
2. Features & Capabilities (5 questions)
3. Pilot Program (5 questions)
4. Data & Security (4 questions)
5. Team & Support (3 questions)
6. Pricing & Plans (3 questions)

#### Interaction

**Category Selection:**
- Sidebar with category buttons
- Active category: `bg-[#0a0a0a] text-white`
- Click category → Filter questions

**Question Expansion:**
- Click question → Toggle answer visibility
- Chevron rotates 180° when expanded
- Only one question expanded at a time? No, multiple allowed

### 4.4 Roadmap Page (`/roadmap`)

**URL:** `/roadmap`
**Access:** Public
**Purpose:** Show product direction and build confidence

#### Sections

**1. What's Live Now**
- 4 feature cards with green "Live" badges
- Each shows: Icon, Title, Description, Live badge

**2. Coming Soon (Q1 2026)**
- Horizontal timeline format
- 4 items: Amazon, Image Recognition, Filtering, WooCommerce

**3. Future Vision (2026+)**
- 4 items in muted/grayed style
- Merch Studio, Print-on-Demand, Storefronts, Creators

### 4.5 Waitlist Page (`/waitlist`)

**URL:** `/waitlist`
**Access:** Public
**Purpose:** Capture pilot program applications

#### Form Fields

| Field | Type | Required | Options |
|-------|------|----------|---------|
| Work Email | email | Yes | - |
| Company Name | text | No | - |
| Company Website | url | No | - |
| Annual Merch Revenue | select | No | Under $100K, $100K-$500K, $500K-$1M, $1M-$5M, $5M+ |
| Primary Sales Channel | select | No | Shopify, Amazon, WooCommerce, Multiple Channels, Other |

#### User Flow

1. User fills form (at minimum, email)
2. User clicks "Apply for Pilot Access"
3. **IF** email already exists:
   - Show message: "You're already on our waitlist! We'll be in touch soon."
4. **IF** new email:
   - Save to `waitlist` table with status `pending`
   - Show success state with:
     - Confirmation message
     - "What happens next" explanation
     - Position in queue (optional)

#### Success State
```
┌─────────────────────────────────────────┐
│             ✓ You're In!                │
│                                         │
│  Thanks for applying to the PhantomOS   │
│  founding pilot program.                │
│                                         │
│  What happens next:                     │
│  1. We'll review your application       │
│  2. You'll hear from us within 48 hours │
│  3. If accepted, you'll get full access │
│                                         │
│  Questions? hello@phantomos.com         │
└─────────────────────────────────────────┘
```

---

## 5. Dashboard Overview

**URL:** `/overview`
**Access:** Authenticated users only
**Purpose:** Central command center for merchandise performance

### 5.1 Page States

#### Loading State

Show skeleton UI with:
- 4 stat cards (pulsing)
- Revenue chart placeholder (12 bars)
- Category pie chart placeholder
- Asset chart placeholder (6 bars)
- Orders table placeholder (5 rows)

#### Empty State

**Condition:** `hasData === false` (no products or sales)

**Display:**
- Welcome message
- Value proposition
- Two CTAs: "Connect Shopify" and "Import CSV"
- "Getting Started" steps

#### Data State

Full dashboard with real data.

### 5.2 Stats Cards

**Layout:** 4 cards in horizontal row

| Card | Label | Value Format | Growth |
|------|-------|--------------|--------|
| 1 | Total Revenue | `$XXX,XXX` | `+X.X%` or `-X.X%` |
| 2 | Total Orders | `X,XXX` | `+X.X%` or `-X.X%` |
| 3 | Avg Order Value | `$XX.XX` | `+X.X%` or `-X.X%` |
| 4 | Products | `XXX` | Connected sources count |

**Growth Indicator:**
- Positive: Green text, ArrowUpRight icon
- Negative: Red text, ArrowDownRight icon
- Zero: Gray text, no icon

### 5.3 Revenue Chart

**Type:** Line chart (Recharts)
**Data:** Monthly revenue for past 12 months
**X-Axis:** Month abbreviation (Jan, Feb, etc.)
**Y-Axis:** Revenue in dollars

**Interaction:**
- Hover → Tooltip with exact value
- Format: `{month}: $XX,XXX`

### 5.4 Category Breakdown

**Type:** Pie chart with legend
**Data:** Product count by category

**Categories:**
- Apparel
- Collectibles
- Accessories
- Home
- Digital
- Other

**Interaction:**
- Hover segment → Highlight and show percentage
- Legend click → Toggle segment visibility

### 5.5 Asset Performance Chart

**Type:** Horizontal bar chart
**Data:** Top 6 IP assets by revenue
**Bars:** Show asset name, revenue value

**Interaction:**
- Hover → Show full details (revenue, units, growth)
- Click → Navigate to filtered products view (future)

### 5.6 Recent Orders Table

**Columns:**

| Column | Width | Content |
|--------|-------|---------|
| Order ID | 100px | Truncated ID, monospace |
| Product | flex | Product name, truncated |
| Region | 120px | Geographic region |
| Amount | 100px | `$XX.XX` |
| Date | 120px | Relative or formatted date |

**Behavior:**
- Show 10 most recent orders
- Sorted by date descending
- Row hover: Light background highlight

### 5.7 Export Report

**Trigger:** "Export Report" button in header

**Behavior:**
1. Generate CSV with:
   - Summary stats
   - Category breakdown
   - Asset performance
   - Recent orders
2. Download as `phantomos-report-{YYYY-MM-DD}.csv`

---

## 6. Fan Intelligence Hub

**URL:** `/intelligence`
**Access:** Authenticated users only
**Purpose:** AI-powered insights and recommendations

### 6.1 Page States

#### Loading State

Show skeleton UI with:
- 4 stat cards
- AI insights section with 3 placeholder cards
- Quick actions row

**AI Loading Animation:**
- Brain icon with pulse effect
- Progress steps: "Scanning sales patterns" → "Analyzing products" → "Generating insights"
- Text: "AI is analyzing your data..."

#### Empty State

**Condition:** No data connected

**Display:**
- Brain icon
- Headline: "AI Intelligence Awaits"
- Description of what insights will show
- CTAs: "Connect Shopify", "Import CSV"
- "What You'll Get" preview cards

#### Data State (No Insights)

**Condition:** Data exists but insights not yet generated

**Display:**
- Message: "No insights generated yet"
- CTA: "Generate Insights"

#### Data State (With Insights)

Full insights display with real AI-generated content.

### 6.2 Stats Summary

| Card | Label | Value |
|------|-------|-------|
| 1 | Active Insights | Count of current insights |
| 2 | Opportunities | Count where type = opportunity |
| 3 | Alerts | Count where type = warning |
| 4 | AI Confidence | "High" / "Medium" / "Low" |

### 6.3 AI Insights Section

**Header:**
- Title: "AI Insights"
- Subtitle: "Last analyzed: {timestamp}" or "Powered by Claude AI"
- Action: "Refresh" button

**Insight Cards:**

Each insight displays:
```
┌─────────────────────────────────────────────────────────────┐
│ [Icon] {Title}                              [Badge] [Conf%] │
│                                                       [▶]   │
│ {Description text spanning multiple lines if needed}        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Recommended Actions (expanded)                              │
│ 1. First recommendation                                     │
│ 2. Second recommendation                                    │
│ 3. Third recommendation                                     │
│                                                             │
│ [Action Button based on insight type]                       │
└─────────────────────────────────────────────────────────────┘
```

**Insight Types:**

| Type | Icon | Badge Color | Example Action |
|------|------|-------------|----------------|
| Opportunity | Sparkles (green) | Success (green) | "Expand product line" |
| Warning | AlertCircle (amber) | Warning (amber) | "Investigate decline" |
| Trend | TrendingUp (blue) | Outline | "Monitor pattern" |
| Recommendation | Lightbulb (purple) | Default | "Tag Products" |

**Interaction:**
- Click card → Expand/collapse recommendations
- Chevron rotates 90° when expanded
- Action buttons navigate to relevant pages

### 6.4 Refresh Analysis

**Trigger:** Click "Refresh" button

**Process:**
1. Set `refreshing = true`
2. Show loading animation
3. Call `POST /api/ai/insights`
4. **IF** success:
   - Parse response
   - Update insights state
   - Update "Last analyzed" timestamp
5. **IF** error:
   - Show error message
   - Offer "Try Again" button
6. Set `refreshing = false`

**Rate Limiting:**
- Button disabled while refreshing
- Visual feedback: Spinner in button

### 6.5 Quick Actions

**3 cards linking to related pages:**

| Card | Icon | Title | Subtitle | Link |
|------|------|-------|----------|------|
| 1 | Package | Tag Products | Improve AI accuracy | `/products` |
| 2 | Plug | Add More Data | Connect more sources | `/connectors` |
| 3 | TrendingUp | View Analytics | See full dashboard | `/overview` |

---

## 7. Products & Asset Tagging

**URL:** `/products`
**Access:** Authenticated users only
**Purpose:** Manage products and map them to IP assets

### 7.1 Page States

#### Loading State

Skeleton with:
- 4 stat cards
- Search bar
- Table header and 8 row placeholders

#### Empty State

**Condition:** No products in database

**Display:**
- Package icon
- "No products yet"
- CTAs: "Connect Shopify", "Import CSV"

#### Data State

Full product list with filtering and actions.

### 7.2 Stats Row

| Card | Label | Value |
|------|-------|-------|
| 1 | Total Products | Count |
| 2 | Mapped | Count with status confirmed |
| 3 | Unmapped | Count with status unmapped/suggested |
| 4 | Progress | Percentage mapped |

### 7.3 Search and Filters

**Search Bar:**
- Placeholder: "Search products..."
- Searches: name, sku
- Debounce: 300ms

**Status Filter:**
- Dropdown with options: All, Mapped, Unmapped
- "Mapped" includes: `confirmed`
- "Unmapped" includes: `unmapped`, `suggested`

**Actions:**
- "Auto-Tag All" button
- "Import" button (opens import modal)

### 7.4 Product List

**Table Columns:**

| Column | Width | Content |
|--------|-------|---------|
| Image | 48px | Product thumbnail or placeholder |
| Product | flex | Name (bold) + SKU (gray) |
| Category | 100px | Badge with category |
| Revenue | 100px | `$XX,XXX` |
| Status | 100px | Mapping status badge |
| Actions | 80px | "Tag" button |

**Status Badges:**

| Status | Badge Variant | Label |
|--------|---------------|-------|
| unmapped | Outline (gray) | Unmapped |
| suggested | Warning (amber) | Suggested |
| confirmed | Success (green) | Mapped |
| skipped | Default | Skipped |

### 7.5 Tagging Sidebar

**Trigger:** Click "Tag" button on any product

**Sidebar Content:**
```
┌─────────────────────────────────────┐
│ [X]                                 │
│                                     │
│ [Product Image]                     │
│ {Product Name}                      │
│ SKU: {sku}                          │
│ Category: {category}                │
│ Revenue: ${revenue}                 │
│                                     │
├─────────────────────────────────────┤
│ Game IP                             │
│ [Dropdown: Select or Create]        │
│                                     │
├─────────────────────────────────────┤
│ AI Suggestions                      │
│ ┌─────────────────────────────────┐ │
│ │ [✓] Shadow Knight      95%     │ │
│ │ [ ] Luna Starfire      45%     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Or select manually:                 │
│ [Dropdown: Select assets]           │
│                                     │
├─────────────────────────────────────┤
│ [Save Mapping]  [Skip Product]      │
└─────────────────────────────────────┘
```

### 7.6 Tagging Workflow

**Step 1: Select Game IP**
- Dropdown shows existing Game IPs
- Option to "Create New Game IP"
- Creating new opens inline form

**Step 2: Review AI Suggestions**
- If product has `aiSuggestedAssets`:
  - Show checkboxes with asset names and confidence
  - Pre-check high confidence (>70%) suggestions
- If no suggestions:
  - Show "No AI suggestions available"
  - Offer manual selection

**Step 3: Manual Selection (Optional)**
- Multi-select dropdown of all assets in selected Game IP
- Can combine with AI suggestions

**Step 4: Save or Skip**
- "Save Mapping" → Creates `product_assets` records, sets status `confirmed`
- "Skip Product" → Sets status `skipped`

### 7.7 Auto-Tag All

**Trigger:** Click "Auto-Tag All" button

**Confirmation Modal:**
```
┌─────────────────────────────────────────┐
│ Auto-Tag Products                       │
│                                         │
│ This will use AI to automatically       │
│ suggest asset mappings for up to 50     │
│ unmapped products.                      │
│                                         │
│ Products with suggestions will be       │
│ marked for review.                      │
│                                         │
│ [Cancel]              [Start Auto-Tag]  │
└─────────────────────────────────────────┘
```

**Process:**
1. Call `POST /api/products/auto-tag` with `{ limit: 50 }`
2. Show progress indicator
3. On complete:
   - Toast: "Tagged {X} of {Y} products"
   - Refresh product list

### 7.8 CSV Import

**Trigger:** Click "Import" button

**Modal Flow:**

**Step 1: Select Type**
- Toggle: Products / Sales Data
- Download template link for selected type

**Step 2: Upload File**
- Drag-and-drop zone
- Or click to browse
- Accepts `.csv` files only

**Step 3: Processing**
- Show spinner and "Importing..."
- Parse CSV
- Validate rows
- Insert records

**Step 4: Results**
- Success count
- Error details if any
- Unmatched products (for sales import)
- "Import More" or "Close" buttons

---

## 8. Data Connectors

**URL:** `/connectors`
**Access:** Authenticated users only
**Purpose:** Manage data source integrations

### 8.1 Page States

#### Loading State

Skeleton with:
- Aggregation summary card
- 4 connector card placeholders

#### Empty State (No Connectors)

**Condition:** No connectors in database

**Display:**
- Plug icon in aggregation summary
- "No data sources connected"
- Prominent empty state card with CTAs

#### Data State

Connected sources + available connectors.

### 8.2 Aggregation Summary Card

**Content:**
- Icon: Plug
- Label: "Revenue Aggregation Engine"
- Value: "{X} source(s) connected" or "No sources connected"
- Hint (when empty): "Connect a data source or import CSV to get started"

### 8.3 Connected Sources Section

**Visible when:** At least 1 connector exists

**Card per connector:**
```
┌─────────────────────────────────────────────────────────────┐
│ [Platform Logo]  {Connector Name}               [Status]    │
│                  {Platform type}                            │
│                                                             │
│ ─────────────────────────────────────────────────────────── │
│ Last sync: {relative time}              [Sync] [Settings]   │
└─────────────────────────────────────────────────────────────┘
```

**Status Badges:**

| Status | Badge | Icon |
|--------|-------|------|
| connected | Success | Check |
| syncing | Warning | RefreshCw (spinning) |
| error | Error | AlertCircle |
| pending | Default | Clock |

### 8.4 Available Connectors Section

**Cards for each available connector:**

| Connector | Status | Action |
|-----------|--------|--------|
| Shopify | Available | "Connect" button |
| Amazon | Coming Soon | "Notify Me" (disabled) |
| WooCommerce | Coming Soon | "Notify Me" (disabled) |
| BigCommerce | Coming Soon | "Notify Me" (disabled) |

**Connected State:**
- If connector already connected: Show "Connected" badge, disable button

### 8.5 Shopify Connection Wizard

**Trigger:** Click "Connect" on Shopify card

**Step 1: Enter Store URL**
```
┌─────────────────────────────────────────┐
│ Connect Shopify Store                   │
│                                         │
│ Enter your Shopify store URL:           │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ your-store                .myshopify.com │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Cancel]                    [Continue]  │
└─────────────────────────────────────────┘
```

**Step 2: OAuth Redirect**
1. Call `POST /api/connectors/shopify/auth` with store URL
2. Receive Shopify OAuth URL
3. Redirect user to Shopify for authorization

**Step 3: OAuth Callback**
1. Shopify redirects back with authorization code
2. Backend exchanges code for access token
3. Backend creates connector record
4. Redirect to `/connectors` with success message

**Step 4: Initial Sync**
- Prompt to sync products
- "Sync Now" triggers product import

### 8.6 Sync Operation

**Trigger:** Click sync button on connected connector

**Process:**
1. Set connector status to "syncing"
2. Call sync products endpoint
3. Call sync orders endpoint
4. Update `lastSyncAt`
5. Show toast with results

**Results Toast:**
- Success: "Synced {X} products and {Y} orders"
- Partial: "Synced {X} products. Order sync failed: {error}"
- Error: "Sync failed: {error}"

### 8.7 Connector Settings Modal

**Trigger:** Click settings icon on connector card

**Content:**
```
┌─────────────────────────────────────────┐
│ Connector Settings              [X]     │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [Logo]  {Connector Name}            │ │
│ │         {Type}                      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Status: {status}                        │
│ Last Synced: {timestamp}                │
│ Shop URL: {url}                         │
│                                         │
│ [Sync Now]                              │
│                                         │
│ ─────────────────────────────────────── │
│ ⚠️ Danger Zone                          │
│ Disconnecting will remove all synced    │
│ products and sales from this source.    │
│                                         │
│ [Disconnect]                            │
└─────────────────────────────────────────┘
```

### 8.8 Disconnect Connector

**Trigger:** Click "Disconnect" in settings modal

**Confirmation:** None required (danger zone is warning enough)

**Process:**
1. Call `DELETE /api/connectors/{id}`
2. Backend deletes:
   - Sales records from this connector
   - Product-asset mappings for these products
   - Products from this connector
   - Connector record
3. Close modal
4. Refresh connector list
5. Toast: "Connector disconnected"

### 8.9 CSV Import Section

**Always visible at bottom of page**

**Content:**
- Icon: FileSpreadsheet
- Title: "CSV Import"
- Description: Manual import option
- Actions: "Import CSV", "Products Template", "Sales Template"

---

## 9. Settings

**URL:** `/settings`
**Access:** Authenticated users only
**Purpose:** Account and organization management

### 9.1 Layout

**Sidebar Tabs:**
- Profile (default)
- Organization

**Content area changes based on selected tab**

### 9.2 Profile Tab

**Sections:**

**Profile Information Card:**
```
┌─────────────────────────────────────────────────────────────┐
│ Profile Information                                          │
│ Update your personal details                                 │
│                                                             │
│ [Avatar]  [Change Avatar]                                   │
│                                                             │
│ First Name: [__________]    Last Name: [__________]         │
│                                                             │
│ Email: [________________________]                           │
│                                                             │
│ Job Title: [________________________]                       │
│                                                             │
│ [Save Changes]                                              │
└─────────────────────────────────────────────────────────────┘
```

**Save Behavior:**
1. Validate fields
2. Call `POST /api/settings/profile`
3. Toast: "Profile updated"

### 9.3 Organization Tab

**Sections:**

**Organization Details Card:**
```
┌─────────────────────────────────────────────────────────────┐
│ Organization Details                                         │
│ Manage your publisher profile                                │
│                                                             │
│ Organization Name: [________________________]               │
│                                                             │
│ Website: [________________________]                         │
│                                                             │
│ Subscription Plan: [Growth]  Upgrade Plan                   │
│                                                             │
│ [Save Changes]                                              │
└─────────────────────────────────────────────────────────────┘
```

**Team Members Card:**
```
┌─────────────────────────────────────────────────────────────┐
│ Team Members                                                 │
│ Manage who has access to your PhantomOS workspace           │
│                                                             │
│ [Avatar] Pedro Oliveira                        [Owner]      │
│          pedro@example.com                                  │
│                                                             │
│ [Avatar] Sarah Chen                            [Admin]      │
│          sarah@example.com                                  │
│                                                             │
│ ─────────────────────────────────────────────────────────── │
│ Pending Invitations                                         │
│ [Mail] john@example.com        [Member]  Expires in 5 days  │
│                                           [Revoke]          │
│                                                             │
│ [Invite Member]                                             │
└─────────────────────────────────────────────────────────────┘
```

### 9.4 Invite Team Member

**Trigger:** Click "Invite Member" button

**Modal:**
```
┌─────────────────────────────────────────┐
│ Invite Team Member              [X]     │
│                                         │
│ Email Address:                          │
│ [________________________]              │
│                                         │
│ Name (optional):                        │
│ [________________________]              │
│                                         │
│ Role:                                   │
│ [Admin - Full access, can invite ▼]    │
│                                         │
│ [Cancel]              [Send Invitation] │
└─────────────────────────────────────────┘
```

**Role Options:**
- Admin: Full access, can invite others
- Member: Standard access
- Analyst: View-only access

**On Submit:**
1. Validate email format
2. Call `POST /api/settings/invite`
3. **IF** success:
   - Show invite URL
   - "Copy Link" button
4. **IF** error:
   - Show error message

**Success State:**
```
┌─────────────────────────────────────────┐
│ ✓ Invitation Created!                   │
│                                         │
│ Share this link with your team member.  │
│                                         │
│ [https://app.../invite?tok...]  [Copy]  │
│                                         │
│ [Done]                                  │
└─────────────────────────────────────────┘
```

---

## 10. Admin Dashboard

**URL:** `/admin`
**Access:** Anyone with ADMIN_SECRET_KEY
**Purpose:** Manage waitlist submissions for pilot program

### 10.1 Authentication

**On Page Load:**
1. Check sessionStorage for stored key
2. **IF** found:
   - Auto-authenticate
   - Load waitlist data
3. **IF** not found:
   - Show login form

**Login Form:**
```
┌─────────────────────────────────────────┐
│           [Shield Icon]                 │
│                                         │
│         Admin Access                    │
│   Enter your admin secret key           │
│                                         │
│ [________________________] [👁️]         │
│                                         │
│ [Access Admin]                          │
│                                         │
│ (Key is set in ADMIN_SECRET_KEY env)    │
└─────────────────────────────────────────┘
```

**On Submit:**
1. Call `GET /api/waitlist?key={key}`
2. **IF** 200:
   - Store key in sessionStorage
   - Load dashboard
3. **IF** 401:
   - Show error: "Invalid admin key"

### 10.2 Dashboard Layout

**Header:**
- Logo + "PhantomOS Admin"
- "Waitlist Management" subtitle
- Refresh button
- Sign Out button

**Stats Row (5 cards):**
| Card | Label | Color |
|------|-------|-------|
| Total Signups | Count | Gray |
| Pending | Count | Yellow |
| Approved | Count | Green |
| Rejected | Count | Red |
| Converted | Count | Blue |

**Filter Buttons:**
- All, Pending, Approved, Rejected, Converted
- Active filter: `bg-[#0a0a0a] text-white`

**Entry List:**
Cards for each waitlist entry (see below)

### 10.3 Waitlist Entry Card

```
┌─────────────────────────────────────────────────────────────┐
│ john@example.com                          [Pending Badge]   │
│                                                             │
│ [Building] Acme Games     [Globe] acmegames.com            │
│ [$] $100K-$500K           [Shop] Shopify                   │
│                                                             │
│ Submitted Dec 5, 2025 at 2:30 PM                           │
│                                           [Approve] [X]     │
└─────────────────────────────────────────────────────────────┘
```

**For Approved Entries:**
- Replace action buttons with "Copy Invite" button

### 10.4 Approve/Reject Flow

**Approve:**
1. Click "Approve" button
2. Call `POST /api/waitlist/update` with `{ id, status: 'approved', key }`
3. Update local state immediately
4. Show "Copy Invite" button

**Reject:**
1. Click X button
2. Call `POST /api/waitlist/update` with `{ id, status: 'rejected', key }`
3. Update local state immediately

### 10.5 Copy Invite Link

**Format:** `{origin}/register?email={email}`

**On Click:**
1. Copy to clipboard
2. Show "Copied!" feedback for 2 seconds

---

## 11. API Specifications

### 11.1 Authentication Pattern

All protected endpoints MUST:
1. Check for valid session
2. Extract `publisherId` from session
3. Scope all queries to `publisherId`

```typescript
// Standard auth check
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

### 11.2 Response Formats

**Success:**
```json
{
  "data": { ... },
  "meta": { "count": 100, "page": 1 }
}
```

**Error:**
```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

### 11.3 Key Endpoints

#### GET /api/dashboard/stats

**Response:**
```typescript
{
  hasData: boolean;
  stats: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    productCount: number;
    connectedSources: number;
    revenueGrowth: number;
    ordersGrowth: number;
    aovGrowth: number;
  };
  revenueData: Array<{ date: string; revenue: number }>;
  categoryData: Array<{ name: string; value: number; percentage: number }>;
  assetData: Array<{ name: string; revenue: number; units: number; growth: number }>;
  recentOrders: Array<{ id: string; product: string; region: string; amount: number; date: string }>;
}
```

#### POST /api/ai/insights

**Request:**
```typescript
{ type: 'general' | 'assets' | 'products' }
```

**Response:**
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

#### POST /api/products/auto-tag

**Request:**
```typescript
{ limit: number }
```

**Response:**
```typescript
{
  tagged: number;
  total: number;
  errors?: Array<{ productId: string; error: string }>;
}
```

#### POST /api/waitlist/update

**Request:**
```typescript
{
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'converted';
  key: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  entry: WaitlistEntry;
}
```

---

## 12. Error Handling

### 12.1 Client-Side Errors

| Error Type | Display | Recovery |
|------------|---------|----------|
| Network failure | Toast with retry | Retry button |
| Validation error | Inline field error | Fix and resubmit |
| 401 Unauthorized | Redirect to login | Re-authenticate |
| 403 Forbidden | Toast message | Contact admin |
| 404 Not Found | Empty state | Navigate elsewhere |
| 500 Server Error | Toast with retry | Retry or contact support |

### 12.2 Form Validation

**Client-Side (Immediate):**
- Required field check
- Email format validation
- Min/max length checks
- URL format validation

**Server-Side (On Submit):**
- Uniqueness constraints
- Authorization checks
- Business rule validation

### 12.3 API Error Responses

| Status | Meaning | Client Action |
|--------|---------|---------------|
| 400 | Bad Request | Show validation errors |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden | Show permission error |
| 404 | Not Found | Show not found state |
| 409 | Conflict | Show conflict message |
| 500 | Server Error | Show generic error, offer retry |

---

## 13. Performance Requirements

### 13.1 Page Load Times

| Page | Target | Maximum |
|------|--------|---------|
| Marketing pages | < 1s | < 2s |
| Dashboard pages | < 2s | < 4s |
| Data-heavy pages | < 3s | < 5s |

### 13.2 Interaction Response

| Action | Target | Maximum |
|--------|--------|---------|
| Button click feedback | < 50ms | < 100ms |
| Form submission | < 500ms | < 2s |
| Modal open/close | < 100ms | < 200ms |
| Navigation | < 300ms | < 1s |

### 13.3 Data Limits

| Resource | Soft Limit | Hard Limit |
|----------|------------|------------|
| Products per page | 50 | 100 |
| Sales records per query | 1000 | 5000 |
| AI insights per request | 5 | 10 |
| Auto-tag batch size | 50 | 100 |

### 13.4 Caching

| Data | Cache Duration | Invalidation |
|------|----------------|--------------|
| Dashboard stats | 5 minutes | Manual refresh |
| AI insights | 30 minutes | Manual refresh |
| Product list | No cache | On mutation |
| Connector list | No cache | On mutation |

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Founding Team | Initial specification |

---

*This document is the authoritative reference for PhantomOS functional behavior. All implementation decisions should align with this specification.*
