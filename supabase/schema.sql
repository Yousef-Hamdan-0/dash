-- ============================================================
-- DASH Studio — Supabase Database Schema
-- Run this in the Supabase SQL Editor to set up your database.
-- ============================================================

-- ─── Tables ──────────────────────────────────────────────────────────────────

-- Site settings (single row — singleton pattern)
CREATE TABLE IF NOT EXISTS site_settings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name       TEXT NOT NULL DEFAULT 'DASH Studio',
  logo_url        TEXT,
  contact_email   TEXT,
  from_email      TEXT DEFAULT 'onboarding@resend.dev',
  team_phone      TEXT,
  instagram       TEXT,
  twitter         TEXT,
  linkedin        TEXT,
  behance         TEXT,
  seo_title       TEXT DEFAULT 'DASH Studio',
  seo_description TEXT DEFAULT 'Creative studio — Branding, Web, Motion, Systems, Games.',
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Client enquiries submitted through the public website
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

CREATE INDEX IF NOT EXISTS clients_created_at_idx ON clients (created_at DESC);
CREATE INDEX IF NOT EXISTS clients_status_idx ON clients (status);
CREATE INDEX IF NOT EXISTS clients_seen_at_idx ON clients (seen_at) WHERE seen_at IS NULL;
CREATE INDEX IF NOT EXISTS clients_name_idx ON clients (name);
CREATE INDEX IF NOT EXISTS clients_phone_idx ON clients (phone);

-- Projects (portfolio)
CREATE TABLE IF NOT EXISTS projects (
  id          TEXT PRIMARY KEY,
  category    TEXT NOT NULL CHECK (category IN ('branding','web','motion','systems','games')),
  year        TEXT NOT NULL,
  featured    BOOLEAN NOT NULL DEFAULT false,
  color_class TEXT NOT NULL CHECK (color_class IN ('brand','web','motion','systems','games')),
  title_en    TEXT NOT NULL,
  title_ar    TEXT,
  desc_en     TEXT,
  desc_ar     TEXT,
  image_url   TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initials    TEXT NOT NULL,
  name        TEXT NOT NULL,
  name_ar     TEXT,
  role        TEXT NOT NULL,
  role_ar     TEXT,
  badge       TEXT NOT NULL,
  image_url   TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_en    TEXT NOT NULL,
  quote_ar    TEXT,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Public experience timeline, managed from the dashboard
CREATE TABLE IF NOT EXISTS journey_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year           INTEGER NOT NULL,
  title          TEXT NOT NULL,
  description    TEXT,
  chips          TEXT[] DEFAULT '{}',
  sort_order     INTEGER DEFAULT 0,
  is_active      BOOLEAN DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS journey_items_active_sort_idx
  ON journey_items (is_active, year, sort_order);

-- Announcement and achievement cards shown in the home hero
CREATE TABLE IF NOT EXISTS home_announcements (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  description    TEXT,
  image_url      TEXT,
  button_text    TEXT,
  button_url     TEXT,
  sort_order     INTEGER DEFAULT 0,
  is_active      BOOLEAN DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS home_announcements_active_sort_idx
  ON home_announcements (is_active, sort_order);

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members   ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials   ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients        ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_announcements ENABLE ROW LEVEL SECURITY;

-- Public can read (website)
DROP POLICY IF EXISTS "public_select_settings" ON site_settings;
DROP POLICY IF EXISTS "public_select_projects" ON projects;
DROP POLICY IF EXISTS "public_select_team_members" ON team_members;
DROP POLICY IF EXISTS "public_select_testimonials" ON testimonials;
DROP POLICY IF EXISTS "public_select_journey" ON journey_items;
DROP POLICY IF EXISTS "public_select_announcements" ON home_announcements;
CREATE POLICY "public_select_settings"      ON site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_select_projects"      ON projects       FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_select_team_members"  ON team_members   FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_select_testimonials"  ON testimonials   FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_select_journey"       ON journey_items  FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "public_select_announcements" ON home_announcements FOR SELECT TO anon, authenticated USING (is_active = true);

-- Visitors may submit an enquiry, but cannot read client records.
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

-- Authenticated (admin) can mutate
DROP POLICY IF EXISTS "admin_all_settings" ON site_settings;
DROP POLICY IF EXISTS "admin_all_projects" ON projects;
DROP POLICY IF EXISTS "admin_all_team" ON team_members;
DROP POLICY IF EXISTS "admin_all_testimonials" ON testimonials;
DROP POLICY IF EXISTS "admin_all_clients" ON clients;
DROP POLICY IF EXISTS "admin_all_journey" ON journey_items;
DROP POLICY IF EXISTS "admin_all_announcements" ON home_announcements;
CREATE POLICY "admin_all_settings"     ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_projects"     ON projects       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_team"         ON team_members   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_testimonials" ON testimonials   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_clients"      ON clients        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_journey"      ON journey_items  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_announcements" ON home_announcements FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Shared updated_at trigger for dashboard-managed content
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS journey_items_updated_at ON journey_items;
CREATE TRIGGER journey_items_updated_at
  BEFORE UPDATE ON journey_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS home_announcements_updated_at ON home_announcements;
CREATE TRIGGER home_announcements_updated_at
  BEFORE UPDATE ON home_announcements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── Supabase Storage ────────────────────────────────────────────────────────
-- Run in Storage > Buckets after creating the bucket named "media":
--
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
--
-- CREATE POLICY "public_read_media" ON storage.objects
--   FOR SELECT TO anon, authenticated USING (bucket_id = 'media');
--
-- CREATE POLICY "admin_write_media" ON storage.objects
--   FOR ALL TO authenticated USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

-- ─── Initial Data ────────────────────────────────────────────────────────────

-- Default site settings (insert once)
INSERT INTO site_settings (site_name, seo_title, seo_description)
VALUES ('DASH Studio', 'DASH Studio', 'Creative studio — Branding, Web, Motion, Systems, Games.')
ON CONFLICT DO NOTHING;

-- Projects, team members, and testimonials are intentionally not seeded.
-- Add real content through /dashboard so production never starts with demo data.
