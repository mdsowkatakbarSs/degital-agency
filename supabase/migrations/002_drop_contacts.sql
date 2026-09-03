-- ============================================================
-- Drop unused contacts table (safe — skips if already gone)
-- ============================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'contacts'
  ) THEN
    DROP POLICY IF EXISTS "Allow authenticated read" ON contacts;
    DROP POLICY IF EXISTS "Allow authenticated update" ON contacts;
    DROP POLICY IF EXISTS "Allow public insert" ON contacts;

    DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;

    DROP INDEX IF EXISTS idx_contacts_status;
    DROP INDEX IF EXISTS idx_contacts_created_at;
    DROP INDEX IF EXISTS idx_contacts_email;

    DROP TABLE IF EXISTS contacts;

    RAISE NOTICE 'contacts table dropped successfully';
  ELSE
    RAISE NOTICE 'contacts table does not exist — nothing to drop';
  END IF;
END $$;
