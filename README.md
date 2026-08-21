# ViralScale — Digital Agency Website

Premium social media growth agency website (Facebook, TikTok, YouTube, Instagram).

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

Copy `.env.example` to `.env.local` and fill in your Supabase project values (Dashboard → Project Settings → API):

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SECRET_KEY=your-service-role-key
```

> Without real Supabase credentials the public site works fully; the contact form insert and admin login will fail gracefully until credentials are set.

## Database Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Apply the schema — either run the SQL in `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor, or:
   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```
3. Create an admin user: Dashboard → Authentication → Users → **Add User**.
4. Auth URL config: Dashboard → Authentication → URL Configuration → set Site URL to your deployed domain.

## Deploy

```bash
git remote add origin https://github.com/YOUR_USERNAME/viralscale.git
git push -u origin main
```

Then import the repo on [Vercel](https://vercel.com), add all `.env.local` variables in Project → Settings → Environment Variables (set `NEXT_PUBLIC_SITE_URL` to the production URL), and deploy.

Before launch:
- Add a 1200×630 OG image at `public/og-image.jpg`.
- Replace favicon at `src/app/favicon.ico` if desired.

## Structure

```
src/
  app/            # layout, home page, /login, /admin, /api/contact
  sections/       # hero, platforms, services, pricing, testimonials, contact
  components/     # navbar, footer, section-wrapper, stats-cards, contacts-table, ui/
  lib/
    constants.ts  # site config, platforms, services, pricing, testimonials
    supabase/     # browser/server/middleware clients
  middleware.ts   # session refresh + /admin route protection
supabase/
  migrations/     # contacts table + RLS policies + indexes
```

## Notes on Implementation

- Tailwind v4 CSS-first theming is used (`src/app/globals.css`) instead of a v3-style `tailwind.config.ts`; all design tokens, platform colors (`facebook`, `tiktok`, `youtube`, `instagram`, …), and custom animations (`float`, `pulse-glow`, `gradient-shift`) from the original spec are preserved.
- `lucide-react` is pinned to `0.545.0` (last 0.x line) because v1 removed brand icons used by this design.
- The migration omits `alter table auth.users enable row level security;` (fails on hosted Supabase and is unnecessary — RLS is already enabled there).
- Dark mode is the default theme; light mode toggles via the navbar button.
