-- Create contacts table for lead capture
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

-- Enable RLS on contacts
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users (admins) can read contacts
CREATE POLICY "Allow authenticated read" ON contacts
  FOR SELECT TO authenticated USING (true);

-- Policy: Only authenticated users (admins) can update contacts
CREATE POLICY "Allow authenticated update" ON contacts
  FOR UPDATE TO authenticated USING (true);

-- Policy: Anyone can insert (lead capture form)
CREATE POLICY "Allow public insert" ON contacts
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX idx_contacts_email ON contacts(email);
