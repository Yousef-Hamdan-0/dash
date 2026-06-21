-- DASH Studio - Supabase Storage migration
-- Safe to re-run.
--
-- Frontend bucket name: media
-- Public website reads image URLs through the anon key / public URL.
-- Dashboard uploads require an authenticated Supabase session.

BEGIN;

-- 1) Ensure the bucket exists and stays public-readable.
--    Writes are still controlled by storage.objects RLS policies below.
INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'media',
  'media',
  true,
  6291456,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif'
  ]
)
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types,
  updated_at = NOW();

-- 2) Replace only the policies owned by this app.
--    Do not ALTER TABLE storage.objects here: Supabase owns and manages this
--    internal table, and RLS is already enabled for Storage.
DROP POLICY IF EXISTS "media_public_select" ON storage.objects;
DROP POLICY IF EXISTS "media_authenticated_insert" ON storage.objects;
DROP POLICY IF EXISTS "media_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "media_authenticated_delete" ON storage.objects;

-- Backward-compatible cleanup for older policy names used by this project.
DROP POLICY IF EXISTS "public_read_media" ON storage.objects;
DROP POLICY IF EXISTS "admin_write_media" ON storage.objects;
DROP POLICY IF EXISTS "admin_update_media" ON storage.objects;
DROP POLICY IF EXISTS "admin_delete_media" ON storage.objects;

-- 3) Public read:
--    Needed for website pages rendered with anon access and public URLs.
CREATE POLICY "media_public_select"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'media');

-- 4) Authenticated write:
--    This is not public write. It requires a valid Supabase Auth session.
--    The current dashboard uploader already calls supabase.auth.getUser()
--    before upload, so unauthenticated browser uploads fail intentionally.
CREATE POLICY "media_authenticated_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

CREATE POLICY "media_authenticated_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');

CREATE POLICY "media_authenticated_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'media');

COMMIT;

-- Verification queries:
-- SELECT id, name, public, file_size_limit, allowed_mime_types
-- FROM storage.buckets
-- WHERE id = 'media';
--
-- SELECT policyname, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE schemaname = 'storage'
--   AND tablename = 'objects'
--   AND policyname LIKE 'media_%'
-- ORDER BY policyname;
