-- ============================================================
-- Drop unused contacts table
-- The original plan included a contact-form lead-gen flow.
-- The project evolved to an order-based model and the contacts
-- table is no longer read or written by any application code.
-- ============================================================

DROP POLICY IF EXISTS "Allow authenticated read" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated update" ON contacts;
DROP POLICY IF EXISTS "Allow public insert" ON contacts;

DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;

DROP INDEX IF EXISTS idx_contacts_status;
DROP INDEX IF EXISTS idx_contacts_created_at;
DROP INDEX IF EXISTS idx_contacts_email;

DROP TABLE IF EXISTS contacts;
