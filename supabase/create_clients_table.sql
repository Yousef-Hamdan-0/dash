-- Run this file once in Supabase SQL Editor.
-- It creates the private clients table used by /api/contact.

CREATE TABLE IF NOT EXISTS clients (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  service     TEXT NOT NULL,
  message     TEXT NOT NULL,
  request_description TEXT,
  request_type TEXT,
  source      TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'services')),
  status      TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  seen_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS request_description TEXT,
  ADD COLUMN IF NOT EXISTS request_type TEXT,
  ADD COLUMN IF NOT EXISTS seen_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS clients_created_at_idx ON clients (created_at DESC);
CREATE INDEX IF NOT EXISTS clients_status_idx ON clients (status);
CREATE INDEX IF NOT EXISTS clients_seen_at_idx ON clients (seen_at) WHERE seen_at IS NULL;
CREATE INDEX IF NOT EXISTS clients_name_idx ON clients (name);
CREATE INDEX IF NOT EXISTS clients_phone_idx ON clients (phone);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_clients" ON clients;
CREATE POLICY "public_insert_clients" ON clients
  FOR INSERT TO anon
  WITH CHECK (
    char_length(name) BETWEEN 2 AND 120
    AND char_length(email) BETWEEN 3 AND 254
    AND position('@' IN email) > 1
    AND char_length(service) BETWEEN 1 AND 160
    AND char_length(message) BETWEEN 1 AND 3000
    AND char_length(phone) BETWEEN 5 AND 40
    AND source IN ('website', 'services')
    AND status = 'new'
    AND seen_at IS NULL
  );

DROP POLICY IF EXISTS "admin_all_clients" ON clients;
CREATE POLICY "admin_all_clients" ON clients
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
