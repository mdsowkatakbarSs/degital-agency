-- ============================================================
-- Site control system: site_settings (key-value) + announcements
-- Lets admin manage site content from /admin, no SQL needed.
-- ============================================================

-- ---------- announcements (offers / ads / posts) ----------
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'offer', 'promo', 'urgent')),
  link_url text,
  link_label text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active announcements" ON announcements;
CREATE POLICY "Public read active announcements" ON announcements
  FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated manage announcements" ON announcements;
CREATE POLICY "Authenticated manage announcements" ON announcements
  FOR ALL TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_announcements_sort ON announcements(sort_order);

-- ---------- site_settings (key-value store for site content) ----------
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site_settings" ON site_settings;
CREATE POLICY "Public read site_settings" ON site_settings
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated manage site_settings" ON site_settings;
CREATE POLICY "Authenticated manage site_settings" ON site_settings
  FOR ALL TO authenticated USING (true);

-- ---------- seed default settings ----------
INSERT INTO site_settings (key, value) VALUES
  ('announcement_enabled', 'true'),
  ('hero_badge', 'Welcome To Our Platform'),
  ('hero_title', 'Grow Faster. Reach Further. Monetize Smarter.'),
  ('hero_subtitle', 'Your Trusted Partner For Social Media Growth & Monetization Services'),
  ('hero_description', 'We provide professional solutions to help creators, influencers, businesses & brands grow their online presence across the world''s leading social media platforms.'),
  ('stats_platforms', '4'),
  ('stats_services', '6+'),
  ('stats_safe', '100%'),
  ('stats_support', '24/7'),
  ('footer_tagline', 'Grow Faster. Reach Further. Monetize Smarter.')
ON CONFLICT (key) DO NOTHING;
