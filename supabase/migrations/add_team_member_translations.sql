-- Run once in the Supabase SQL Editor before using the Arabic team fields.
-- Safe to run more than once.

ALTER TABLE public.team_members
  ADD COLUMN IF NOT EXISTS name_ar TEXT,
  ADD COLUMN IF NOT EXISTS role_ar TEXT;

COMMENT ON COLUMN public.team_members.name_ar IS 'Arabic display name; falls back to name when empty.';
COMMENT ON COLUMN public.team_members.role_ar IS 'Arabic role/specialty; falls back to role when empty.';
