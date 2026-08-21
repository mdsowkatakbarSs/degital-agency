# Digital Agency & Social Exchange

★ Social media growth & monetization services — YouTube, Facebook, Instagram & TikTok.
Grow Faster. Reach Further. Monetize Smarter.

**Stack:** Next.js 15.5 · TypeScript · Tailwind CSS v4 · shadcn/ui (radix-nova) · Supabase · Vercel

## Quick Start

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Production build:

```bash
pnpm build      # also generates sitemap.xml + robots.txt via next-sitemap
pnpm start
```

## Environment Variables

`.env.local` holds the project credentials (already configured locally — do not commit):

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xsroeglldbfkyajtpkdc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SECRET_KEY=<service role key>
```

On Vercel, add the same variables in Project → Settings → Environment Variables and set
`NEXT_PUBLIC_SITE_URL` to the production domain.

## Database Setup (one time)

The app needs two tables (`orders`, `contacts`). Apply the schema in
**Supabase Dashboard → SQL Editor → New query → paste → Run** using:

```
supabase/migrations/001_initial_schema.sql
```

It creates both tables, RLS policies (public insert / authenticated read+update),
`updated_at` triggers and indexes. Until this runs, `/api/order` responds with a
clear "database not set up" message.

Then create an admin user: **Dashboard → Authentication → Users → Add User**
(email + password) to sign in at `/login`.

## Deploy (auto-deploy via GitHub)

```bash
git remote add origin https://github.com/mdsowkatakbarSs/degital-agency.git
git push -u origin main
```

Vercel picks up pushes to `main` automatically once the project is imported
(https://vercel.com/new → import `degital-agency` → add env vars → deploy).

## Features

- **Hero** — brand headline "Grow Faster. Reach Further. Monetize Smarter."
- **Services** — all 16 services grouped by platform (YouTube 5, Facebook 5,
  Instagram 3, TikTok 3) with brand-colored icons
- **Why Choose Us** — trust features
- **Order Form** — Select Service (grouped dropdown), Qnty, Pay By
  (PayPal/Other), payment Screen Shot upload (image only, ≤3MB, client-side
  preview), optional note, Submit → saved to Supabase `orders`
- **Admin Dashboard** (`/admin`, login-protected) — order stats cards, orders
  table with status management (new / processing / completed / cancelled) and
  screenshot viewer dialog (screenshots stored as data URLs in the DB; fetch on demand)
- Dark/light theme toggle, Framer Motion animations, full SEO metadata + sitemap

## Structure

```
src/
  app/            # layout, home page, /login, /admin, /api/order
  sections/       # hero, services, why-us, order
  components/     # navbar, footer, section-wrapper, stats-cards, orders-table, ui/
  lib/
    constants.ts  # site config, service groups, payment methods, statuses
    supabase/     # browser/server/middleware clients
  middleware.ts   # session refresh + /admin route protection
supabase/
  migrations/     # 001_initial_schema.sql (orders + contacts)
```

## Notes

- Tailwind v4 CSS-first theming in `src/app/globals.css` (tokens/animations from
  the original spec preserved).
- `lucide-react` pinned to `0.545.0` (v1 removed brand icons).
- Screenshots are stored base64-encoded in the `orders.screenshot_data` text
  column (capped ~3MB). If volume grows, switch to Supabase Storage buckets.
