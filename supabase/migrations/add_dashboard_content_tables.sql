-- ============================================================
-- DASH Studio — Migration: Add Dashboard Content Tables
-- Run in the Supabase SQL Editor after the base schema.sql
-- ============================================================

-- ─── 1. Journey Items ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.journey_items (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  year        INTEGER     NOT NULL,
  title       TEXT        NOT NULL,
  description TEXT,
  chips       TEXT[]      DEFAULT '{}',
  sort_order  INTEGER     DEFAULT 0,
  is_active   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS journey_items_active_sort_idx
  ON public.journey_items (is_active, year, sort_order);

ALTER TABLE public.journey_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_journey" ON public.journey_items;
CREATE POLICY "public_select_journey"
  ON public.journey_items FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_all_journey" ON public.journey_items;
CREATE POLICY "admin_all_journey"
  ON public.journey_items FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS journey_items_updated_at ON public.journey_items;
CREATE TRIGGER journey_items_updated_at
  BEFORE UPDATE ON public.journey_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── 2. Home Announcements ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.home_announcements (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  description TEXT,
  image_url   TEXT,
  button_text TEXT,
  button_url  TEXT,
  sort_order  INTEGER     DEFAULT 0,
  is_active   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS home_announcements_active_sort_idx
  ON public.home_announcements (is_active, sort_order);

ALTER TABLE public.home_announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_announcements" ON public.home_announcements;
CREATE POLICY "public_select_announcements"
  ON public.home_announcements FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_all_announcements" ON public.home_announcements;
CREATE POLICY "admin_all_announcements"
  ON public.home_announcements FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS home_announcements_updated_at ON public.home_announcements;
CREATE TRIGGER home_announcements_updated_at
  BEFORE UPDATE ON public.home_announcements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── 3. Add team_phone to site_settings ──────────────────────────────────────

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS team_phone TEXT;

-- ─── 3b. Arabic team member content ─────────────────────────────────────────

ALTER TABLE public.team_members
  ADD COLUMN IF NOT EXISTS name_ar TEXT,
  ADD COLUMN IF NOT EXISTS role_ar TEXT;

-- ─── 4. Add seen_at to clients (for notification badge fix) ──────────────────

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS seen_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS clients_seen_at_idx
  ON public.clients (seen_at)
  WHERE seen_at IS NULL;

-- ─── 5. Clients: phone, request_description, request_type (may already exist) ─

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS request_description TEXT,
  ADD COLUMN IF NOT EXISTS request_type        TEXT;

CREATE INDEX IF NOT EXISTS clients_name_idx
  ON public.clients (name);

CREATE INDEX IF NOT EXISTS clients_phone_idx
  ON public.clients (phone);

-- Keep the public insert contract aligned with /api/contact. New rows are always
-- unseen and cannot set admin-only fields through the anonymous API.
DROP POLICY IF EXISTS "public_insert_clients" ON public.clients;
CREATE POLICY "public_insert_clients" ON public.clients
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

-- No demo rows are inserted by this migration. Add real milestones and
-- announcements from the dashboard after running it.

-- Remove the two exact legacy seed rows created by an earlier version of this
-- migration. The equality checks keep real dashboard content untouched.
DELETE FROM public.journey_items
WHERE year = 2026
  AND created_at = updated_at
  AND (
    (title = 'DASH Studio Founded'
      AND description = 'Built from the ground up — a multi-disciplinary studio combining branding, web, motion, systems, and games under one roof.')
    OR
    (title = 'First Client Projects'
      AND description = 'First real client engagements. Proving that quality, speed, and ownership can all exist in the same studio.')
  );
