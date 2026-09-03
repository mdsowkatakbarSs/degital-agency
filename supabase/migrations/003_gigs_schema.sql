-- ============================================================
-- Digital Agency & Social Exchange — gigs schema
-- Adds Fiverr-style gig catalog with package tiers
-- Safe to run even if the orders table doesn't exist yet
-- ============================================================

-- ---------- helper function (create if missing) ----------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ---------- gigs (service catalog) ----------
CREATE TABLE IF NOT EXISTS gigs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  platform text NOT NULL,
  title text NOT NULL,
  short_description text NOT NULL,
  full_description text NOT NULL,
  cover_image_url text NOT NULL DEFAULT '',
  starting_price numeric NOT NULL DEFAULT 0,
  delivery_days integer NOT NULL DEFAULT 3,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active gigs" ON gigs;
CREATE POLICY "Public read active gigs" ON gigs
  FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated manage gigs" ON gigs;
CREATE POLICY "Authenticated manage gigs" ON gigs
  FOR ALL TO authenticated USING (true);

-- ---------- gig_packages (tiered pricing per gig) ----------
CREATE TABLE IF NOT EXISTS gig_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id uuid NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
  tier text NOT NULL CHECK (tier IN ('basic', 'standard', 'premium')),
  name text NOT NULL,
  price numeric NOT NULL,
  delivery_days integer NOT NULL,
  features jsonb NOT NULL DEFAULT '[]',
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE gig_packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read gig_packages" ON gig_packages;
CREATE POLICY "Public read gig_packages" ON gig_packages
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated manage gig_packages" ON gig_packages;
CREATE POLICY "Authenticated manage gig_packages" ON gig_packages
  FOR ALL TO authenticated USING (true);

-- ---------- extend orders to reference gig + package ----------
-- Only runs if the orders table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'orders'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'orders' AND column_name = 'gig_id'
    ) THEN
      ALTER TABLE orders ADD COLUMN gig_id uuid REFERENCES gigs(id);
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'orders' AND column_name = 'package_tier'
    ) THEN
      ALTER TABLE orders ADD COLUMN package_tier text;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'orders' AND column_name = 'package_price'
    ) THEN
      ALTER TABLE orders ADD COLUMN package_price numeric;
    END IF;

    RAISE NOTICE 'orders table extended with gig columns';
  ELSE
    RAISE NOTICE 'orders table does not exist — skipping ALTER (run 001_initial_schema.sql first)';
  END IF;
END $$;

-- ---------- updated_at trigger for gigs ----------
DROP TRIGGER IF EXISTS update_gigs_updated_at ON gigs;
CREATE TRIGGER update_gigs_updated_at
  BEFORE UPDATE ON gigs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ---------- indexes ----------
CREATE INDEX IF NOT EXISTS idx_gigs_platform ON gigs(platform);
CREATE INDEX IF NOT EXISTS idx_gigs_slug ON gigs(slug);
CREATE INDEX IF NOT EXISTS idx_gigs_active ON gigs(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_gigs_sort ON gigs(sort_order);
CREATE INDEX IF NOT EXISTS idx_gig_packages_gig_id ON gig_packages(gig_id);

-- orders indexes only if the table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'orders'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_orders_gig_id ON orders(gig_id);
  END IF;
END $$;
