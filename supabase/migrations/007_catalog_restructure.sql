-- ============================================================
-- 007 — Catalog restructure
-- 1. Delete inactive gigs + their packages (catalog cleanup)
-- 2. Trim stray whitespace in slugs/titles (admin-created rows)
-- 3. De-duplicate gig_packages rows (same gig + tier)
-- 4. Free the `tier` column from basic/standard/premium only
-- 5. Add per-package image column (image_url)
-- 6. Add the YouTube Views gig with 5 view packages (1K..100K)
-- 7. New site_settings defaults (services headings, ticker, contact)
-- Safe to re-run.
-- ============================================================

-- ---------- 1. Remove deactivated gigs (cascades to packages) ----------
DELETE FROM gigs WHERE is_active = false;

-- ---------- 2. Trim whitespace left by manual entry ----------
UPDATE gigs SET slug = btrim(slug), title = btrim(title);

-- ---------- 3. De-duplicate packages (keep lowest id per gig+tier) ----------
DELETE FROM gig_packages gp
USING gig_packages gp2
WHERE gp.gig_id = gp2.gig_id
  AND gp.tier = gp2.tier
  AND gp.id > gp2.id;

-- ---------- 4. Allow any tier label (e.g. views-1k, views-5k ...) ----------
DO $$
DECLARE c record;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'gig_packages'::regclass
      AND contype = 'c'
      AND conname LIKE '%tier%'
  LOOP
    EXECUTE format('ALTER TABLE gig_packages DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

-- ---------- 5. Per-package image ----------
ALTER TABLE gig_packages ADD COLUMN IF NOT EXISTS image_url text NOT NULL DEFAULT '';

-- ---------- 6. YouTube Views gig with 5 packages ----------
INSERT INTO gigs (slug, platform, title, short_description, full_description, cover_image_url, starting_price, delivery_days, is_active, sort_order)
VALUES (
  'youtube-views', 'youtube', 'YouTube Views',
  'High-retention YouTube views in ready-made packages — from 1K to 100K, perfect for boosting any video, Short or Reel.',
  E'Boost your videos with high-retention YouTube views that help trigger the algorithm and grow your reach.\n\n• Works on videos, Shorts and Reels\n• Real-looking, high-retention views\n• Gradual, natural-looking delivery\n• No password or channel access required\n\nPick one of the five ready-made view packages below — or order a custom quantity by contacting us on WhatsApp.\n\n(Package images can be updated anytime from the admin panel.)',
  '', 3, 3, true,
  (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM gigs)
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO gig_packages (gig_id, tier, name, price, delivery_days, features, sort_order, image_url)
SELECT g.id, v.tier, v.name, v.price, v.days, v.features::jsonb, v.ord, ''
FROM gigs g
JOIN (VALUES
  ('views-1k',   '1K Views',   3.00,  1, '["1,000 high-retention views","Fast start within hours","Safe & natural delivery","Works on any video or Short"]', 0),
  ('views-5k',   '5K Views',   12.00, 2, '["5,000 high-retention views","Boosts algorithmic reach","Gradual natural delivery","Works on any video or Short"]', 1),
  ('views-10k',  '10K Views',  22.00, 3, '["10,000 high-retention views","Strong algorithm push","Gradual natural delivery","Priority support"]', 2),
  ('views-50k',  '50K Views',  90.00, 5, '["50,000 high-retention views","Maximum reach & social proof","Drip-feed delivery over days","Priority support"]', 3),
  ('views-100k', '100K Views', 160.00, 7, '["100,000 high-retention views","Viral-level visibility","Drip-feed + gradual ramp","Dedicated priority support"]', 4)
) AS v(tier, name, price, days, features, ord)
  ON g.slug = 'youtube-views'
WHERE NOT EXISTS (
  SELECT 1 FROM gig_packages gp WHERE gp.gig_id = g.id AND gp.tier = v.tier
);

-- ---------- 7. New settings defaults ----------
INSERT INTO site_settings (key, value) VALUES
  ('services_title', 'Our Services'),
  ('services_subtitle', 'Professional growth & monetization solutions for every major platform.'),
  ('ticker_enabled', 'true'),
  ('activity_feed', E'Order #1042 Completed – YouTube 5K Views Delivered\nOrder #1041 Completed – YouTube Monetization Support Delivered\nOrder #1040 Completed – YouTube 1K Views Delivered\nNew orders are being processed right now ✅\n500+ orders delivered to creators worldwide'),
  ('contact_email', 'ytgrowthgear2026@gmail.com'),
  ('contact_whatsapp', '+8801761391880'),
  ('service_country', 'Bangladesh')
ON CONFLICT (key) DO NOTHING;
