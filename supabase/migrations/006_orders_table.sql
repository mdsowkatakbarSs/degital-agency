-- ============================================================
-- 006 — Create the orders table (was never applied)
-- The original 001_initial_schema.sql was never run on this
-- project, so the orders table does not exist and order
-- submissions fail. This migration is self-contained:
-- includes the gig columns (gig_id, package_tier,
-- package_price) from 003 and the extended payment methods.
-- Safe to re-run (IF NOT EXISTS everywhere).
-- ============================================================

-- ---------- updated_at helper (idempotent) ----------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ---------- orders ----------
CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  service text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  payment_method text NOT NULL CHECK (payment_method IN ('Zelle', 'CashApp', 'PayPal', 'Other')),
  note text,
  screenshot_name text,
  screenshot_data text CHECK (screenshot_data IS NULL OR length(screenshot_data) <= 4200000),
  status text DEFAULT 'new' CHECK (status IN ('new', 'processing', 'completed', 'cancelled')),
  gig_id uuid REFERENCES gigs(id) ON DELETE SET NULL,
  package_tier text,
  package_price numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read" ON orders;
CREATE POLICY "Allow authenticated read" ON orders
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated update" ON orders;
CREATE POLICY "Allow authenticated update" ON orders
  FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow public insert" ON orders;
CREATE POLICY "Allow public insert" ON orders
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ---------- trigger ----------
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ---------- indexes ----------
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_gig_id ON orders(gig_id);
