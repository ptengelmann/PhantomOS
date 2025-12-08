# PhantomOS Pilot System

This document explains the waitlist/pilot system and how to work with it during development.

## Overview

The pilot system allows you to:
1. Collect waitlist signups from the public marketing site
2. Manually review and approve applicants
3. Continue developing the dashboard without exposing it publicly
4. Control who can access the app

## How It Works

```
Public Visitor
      │
      ▼
┌─────────────────┐
│  Landing Page   │
│  (/waitlist)    │
└────────┬────────┘
         │ Submits form
         ▼
┌─────────────────┐
│  Waitlist DB    │
│  (pending)      │
└────────┬────────┘
         │ You review
         ▼
┌─────────────────┐
│  You approve    │──────► Send invite email manually
│  (or reject)    │        (for now)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  User registers │
│  with /register │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Full dashboard │
│  access         │
└─────────────────┘
```

## Environment Variables

Add these to your `.env.local` and production environment:

```env
# Enable pilot mode (waitlist required for signup)
PILOT_MODE=true

# Comma-separated list of emails that can always access the dashboard
# Add your email and any testers here
ALLOWED_EMAILS=your@email.com,tester@email.com

# Secret key for accessing admin endpoints (generate a random string)
ADMIN_SECRET_KEY=your-random-secret-key-here
```

## Files Created/Modified

### New Files

| File | Purpose |
|------|---------|
| `src/app/(marketing)/waitlist/page.tsx` | Public waitlist signup form |
| `src/app/api/waitlist/route.ts` | API to save/list waitlist entries |
| `src/lib/db/schema.ts` | Added `waitlist` table |
| `src/lib/pilot.ts` | Helper utilities for pilot mode |

### Modified Files

| File | Changes |
|------|---------|
| `middleware.ts` | Redirects `/register` to `/waitlist` in pilot mode |
| `src/app/(marketing)/page.tsx` | CTAs point to `/waitlist` |

## Database Schema

The waitlist table stores:

```sql
waitlist:
  - id (uuid)
  - email (unique)
  - company_name
  - company_website
  - revenue_range (Under $100K, $100K-$500K, etc.)
  - primary_channel (Shopify, Amazon, etc.)
  - notes (for your internal use)
  - status (pending, approved, rejected, converted)
  - approved_at
  - approved_by
  - invite_token
  - created_at
  - updated_at
```

## How to Use During Development

### 1. Working on the Dashboard

You can still access the dashboard normally:

1. Make sure your email is in `ALLOWED_EMAILS`
2. Go to `/login` and sign in with your account
3. You have full access to `/overview`, `/products`, etc.

The waitlist only affects NEW signups, not existing users.

### 2. Viewing Waitlist Entries

To see who's signed up:

```bash
# Via API (replace YOUR_SECRET with your ADMIN_SECRET_KEY)
curl "https://your-domain.com/api/waitlist?key=YOUR_SECRET"
```

Or query the database directly:

```sql
SELECT * FROM waitlist ORDER BY created_at DESC;
```

### 3. Approving a User

For now, this is manual:

1. Find their entry in the waitlist
2. Send them an email saying they're approved
3. Give them the `/register` URL (or use the invite system at `/settings`)
4. They create their account normally

**Future improvement**: Add an admin panel to approve with one click and auto-send invite emails.

### 4. Switching Between Modes

**Pilot Mode (waitlist):**
```env
PILOT_MODE=true
```
- `/register` redirects to `/waitlist`
- Landing page CTAs go to `/waitlist`
- Only approved/existing users can access dashboard

**Open Mode (public signup):**
```env
PILOT_MODE=false
```
- `/register` works normally
- Anyone can sign up
- Landing page CTAs go to `/register`

To switch, also update the constants in `src/app/(marketing)/page.tsx`:
```typescript
const SIGNUP_URL = '/register';  // or '/waitlist'
const SIGNUP_CTA = 'Start Free Pilot';  // or 'Join the Pilot Program'
```

## Deployment Checklist

### For Vercel (or similar)

1. Add environment variables in dashboard:
   - `PILOT_MODE=true`
   - `ALLOWED_EMAILS=your@email.com`
   - `ADMIN_SECRET_KEY=random-string`

2. Run database migration to create waitlist table:
   ```bash
   npx drizzle-kit push
   ```

3. Deploy

### Testing the Flow

1. Visit your production URL
2. Click "Join the Pilot Program"
3. Fill out the waitlist form
4. Check the database/API for the entry
5. Manually approve and send invite
6. User registers and accesses dashboard

## Security Notes

- The waitlist API POST is public (anyone can submit)
- The waitlist API GET requires `ADMIN_SECRET_KEY`
- Dashboard routes require authentication
- `ALLOWED_EMAILS` bypasses any additional pilot restrictions

## Future Improvements

- [ ] Admin panel to view/approve waitlist entries
- [ ] Automatic invite emails when approved
- [ ] Waitlist position/count display
- [ ] Referral tracking
- [ ] Integration with email service (Resend, SendGrid)

---

Last updated: December 2025
