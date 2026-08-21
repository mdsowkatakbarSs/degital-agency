-- ============================================================
-- Digital Agency & Social Exchange — initial schema
-- Paste this whole file into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ---------- contacts (general inquiries) ----------
CREATE TABLE IF NOT EXISTS contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  company text,
  platform text,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read" ON contacts;
CREATE POLICY "Allow authenticated read" ON contacts
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated update" ON contacts;
CREATE POLICY "Allow authenticated update" ON contacts
  FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow public insert" ON contacts;
CREATE POLICY "Allow public insert" ON contacts
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ---------- orders (service order form with payment screenshot) ----------
CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  service text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  payment_method text NOT NULL CHECK (payment_method IN ('PayPal', 'Other')),
  note text,
  screenshot_name text,
  screenshot_data text CHECK (screenshot_data IS NULL OR length(screenshot_data) <= 4200000),
  status text DEFAULT 'new' CHECK (status IN ('new', 'processing', 'completed', 'cancelled')),
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

-- ---------- updated_at trigger ----------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ---------- indexes ----------
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
