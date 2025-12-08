# PhantomOS Pilot System

A complete guide to running and managing your closed pilot program.

---

## Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Waitlist form | Live | `/waitlist` - collects company info |
| Waitlist API | Live | Stores to Neon PostgreSQL |
| Admin dashboard | Live | `/admin` - review, approve, copy invite links |
| Pilot mode | Active | `PILOT_MODE=true` in env |
| Email invites | Manual | Copy link from admin, email yourself |
| Demo data | Seeded | "Phantom Warriors" gaming IP with $227K revenue |

**You are ready to accept pilot applicants.**

---

## How the Pilot Flow Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        PUBLIC INTERNET                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. DISCOVERY                                                    │
│     Visitor lands on phantomos.com                              │
│     Sees: Landing → Features → Pricing → Roadmap → FAQ          │
│     CTA: "Join the Pilot Program"                               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. WAITLIST (/waitlist)                                        │
│     Collects: Email, Company, Website, Revenue Range, Channel   │
│     Stores: Neon PostgreSQL (status: pending)                   │
│     Shows: "Thank you" confirmation                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. YOUR REVIEW (/admin)                                        │
│     You: Log in with ADMIN_SECRET_KEY                           │
│     See: All submissions with stats                             │
│     Action: Approve or Reject each entry                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. INVITE (Manual for now)                                     │
│     Click "Copy Invite Link" in admin                           │
│     Email the user: "You're in! Here's your link..."            │
│     Link format: /register?email=user@company.com               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. ONBOARDING (/register)                                      │
│     User creates account (email pre-filled from link)           │
│     Sets password, creates publisher org                        │
│     Redirected to /overview                                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. VALUE DELIVERY (Dashboard)                                  │
│     User connects Shopify or imports CSV                        │
│     PhantomOS maps products → characters → revenue              │
│     Fan Intelligence shows "Shadow Knight drives 34% revenue"   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Admin Dashboard Guide

### Accessing Admin

1. Go to `/admin`
2. Enter your `ADMIN_SECRET_KEY` (from `.env.local`)
3. Key is saved in session - you won't need to re-enter until browser closes

### What You'll See

**Stats Cards:**
- Total submissions
- Pending (need your review)
- Approved (invited)
- Converted (registered)
- Rejected

**Entry List:**
- Filter by status (All, Pending, Approved, etc.)
- Company name, email, revenue range
- Submission date
- Action buttons

### Actions

| Action | What It Does |
|--------|--------------|
| **Approve** | Sets status to `approved`, records timestamp |
| **Reject** | Sets status to `rejected` |
| **Copy Invite** | Copies `/register?email=...` to clipboard |

### Workflow Example

1. New submission comes in → status: `pending`
2. You review in `/admin` → click **Approve**
3. Click **Copy Invite Link**
4. Email the user manually with the link
5. User registers → status auto-updates to `converted` (future)

---

## Environment Variables

```env
# Required for pilot mode
PILOT_MODE=true
ADMIN_SECRET_KEY=your-secure-random-string

# Your email(s) that bypass waitlist
ALLOWED_EMAILS=ptengelmann@gmail.com

# Database (already configured)
DATABASE_URL=your-neon-connection-string
```

---

## What's Working Now

### Fully Functional
- [x] Marketing site (Landing, Features, Pricing, Roadmap, FAQ)
- [x] Waitlist collection form
- [x] Admin dashboard with approve/reject
- [x] Copy invite link functionality
- [x] User registration flow
- [x] Dashboard with all core features
- [x] Shopify OAuth integration
- [x] CSV import
- [x] AI-powered Fan Intelligence (Claude)
- [x] AI-assisted asset tagging
- [x] Team invitations
- [x] Demo data ("Phantom Warriors" - $227K, 6 characters, 60 products)

### Manual Steps Required
- [ ] Sending invite emails (you email them manually)
- [ ] Tracking when approved users actually register

---

## What's Next: Recommended Priorities

### Phase 1: Launch Pilot (You Are Here)

**Goal:** Get 3-5 gaming publishers using PhantomOS with real data.

**Actions:**
1. Deploy to production (Vercel)
2. Share with target publishers
3. Monitor waitlist submissions in `/admin`
4. Manually approve and onboard first users
5. Collect feedback on core value prop

**Success Metrics:**
- 5+ waitlist submissions
- 3+ approved pilot users
- 1+ user connects real Shopify store
- Qualitative feedback on Fan Intelligence insights

### Phase 2: Validate Value

**Goal:** Prove that character-level revenue insights change decisions.

**Actions:**
1. Help pilot users connect their data
2. Ensure AI tagging works on their products
3. Generate Fan Intelligence reports
4. Interview users: "Did this change how you think about merch?"

**Success Metrics:**
- Users say "I didn't know [Character X] drove that much revenue"
- Users take action based on insights (reorder, new design, etc.)
- Users willing to pay or continue using

### Phase 3: Reduce Friction

**Goal:** Make onboarding self-serve.

**Actions:**
1. Add automatic email invites (Resend integration)
2. Auto-update status when user registers
3. Add more connectors (Amazon, WooCommerce)
4. Improve AI tagging accuracy

### Phase 4: Scale

**Goal:** Open to wider audience.

**Actions:**
1. Set `PILOT_MODE=false`
2. Add usage-based billing
3. Build analytics on platform usage
4. Expand connector ecosystem

---

## Testing Your Pilot Flow

### As a New Visitor

1. Open incognito browser
2. Visit your production URL
3. Click through marketing pages
4. Submit waitlist form
5. Verify entry appears in `/admin`

### As an Admin

1. Go to `/admin`
2. Enter your secret key
3. Approve the test entry
4. Copy the invite link
5. Open link in incognito
6. Complete registration
7. Verify access to dashboard

### Demo for Publishers

1. Log in as `ptengelmann@gmail.com`
2. Show Overview: revenue trends, top products
3. Show Fan Intelligence: "Which characters drive revenue?"
4. Show Products: AI tagging, character mapping
5. Show Connectors: Shopify connected + demo data
6. Explain: "This is what you'd see with YOUR data"

---

## Database Reference

### Waitlist Table

```sql
SELECT
  id,
  email,
  company_name,
  revenue_range,
  status,
  created_at
FROM waitlist
ORDER BY created_at DESC;
```

### Status Values

| Status | Meaning |
|--------|---------|
| `pending` | New submission, needs review |
| `approved` | You approved, ready to invite |
| `rejected` | Not a fit for pilot |
| `converted` | User completed registration |

---

## Files Reference

| File | Purpose |
|------|---------|
| `/src/app/(marketing)/waitlist/page.tsx` | Waitlist form UI |
| `/src/app/api/waitlist/route.ts` | GET (list) and POST (submit) |
| `/src/app/api/waitlist/update/route.ts` | POST to change status |
| `/src/app/admin/page.tsx` | Admin dashboard |
| `/src/lib/db/schema.ts` | Waitlist table definition |
| `/middleware.ts` | Redirects /register → /waitlist |

---

## Quick Commands

```bash
# View waitlist via API
curl "https://your-domain.com/api/waitlist?key=YOUR_ADMIN_KEY"

# Run demo seed (if needed)
npx tsx scripts/seed-demo-data.ts

# Update demo data (add vendor/order IDs)
npx tsx scripts/update-demo-data.ts

# Push database changes
npx drizzle-kit push
```

---

## Security Checklist

- [x] Waitlist POST is public (by design)
- [x] Waitlist GET requires ADMIN_SECRET_KEY
- [x] Admin dashboard requires ADMIN_SECRET_KEY
- [x] Dashboard routes require authentication
- [x] ALLOWED_EMAILS bypass pilot restrictions
- [x] No sensitive data exposed in client

---

*Last updated: December 2025*
