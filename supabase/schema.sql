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
  source      TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'services')),
  status      TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS clients_created_at_idx ON clients (created_at DESC);
CREATE INDEX IF NOT EXISTS clients_status_idx ON clients (status);

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
  role        TEXT NOT NULL,
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

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members   ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials   ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients        ENABLE ROW LEVEL SECURITY;

-- Public can read (website)
CREATE POLICY "public_select_settings"      ON site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_select_projects"      ON projects       FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_select_team_members"  ON team_members   FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_select_testimonials"  ON testimonials   FOR SELECT TO anon, authenticated USING (true);

-- Visitors may submit an enquiry, but cannot read client records.
CREATE POLICY "public_insert_clients" ON clients
  FOR INSERT TO anon
  WITH CHECK (
    char_length(name) BETWEEN 2 AND 120
    AND char_length(email) BETWEEN 3 AND 254
    AND position('@' IN email) > 1
    AND char_length(service) BETWEEN 1 AND 160
    AND char_length(message) BETWEEN 1 AND 3000
    AND (phone IS NULL OR char_length(phone) BETWEEN 5 AND 40)
    AND (source = 'website' OR phone IS NOT NULL)
    AND status = 'new'
  );

-- Authenticated (admin) can mutate
CREATE POLICY "admin_all_settings"     ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_projects"     ON projects       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_team"         ON team_members   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_testimonials" ON testimonials   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_clients"      ON clients        FOR ALL TO authenticated USING (true) WITH CHECK (true);

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

-- ─── Seed Data ───────────────────────────────────────────────────────────────

-- Default site settings (insert once)
INSERT INTO site_settings (site_name, seo_title, seo_description)
VALUES ('DASH Studio', 'DASH Studio', 'Creative studio — Branding, Web, Motion, Systems, Games.')
ON CONFLICT DO NOTHING;

-- Seed projects (migrated from lib/data/work.ts + messages/en.json)
INSERT INTO projects (id, category, year, featured, color_class, title_en, title_ar, desc_en, desc_ar, sort_order) VALUES
  ('p1',  'branding', '2024', true,  'brand',   'Brand Identity',          'هوية بصرية',             'Full visual identity — logo, guidelines, and brand world.',             'هوية بصرية كاملة — شعار، دليل العلامة، وعالم العلامة التجارية.', 0),
  ('p2',  'web',      '2024', false, 'web',     'Web Application',         'تطبيق ويب',              'Clean, functional design built for real users and real goals.',         'تصميم أنيق وعملي مبني للمستخدمين الحقيقيين والأهداف الحقيقية.', 1),
  ('p3',  'motion',   '2024', false, 'motion',  'Motion Campaign',         'حملة حركية',             'Storytelling in motion — from concept to final cut.',                  'رواية قصصية بالحركة — من الفكرة إلى المنتج النهائي.',             2),
  ('p4',  'systems',  '2024', false, 'systems', 'Clinic System',           'نظام عيادة',             'Custom digital solution that simplified daily clinic operations.',      'حل رقمي مخصص يبسط العمليات اليومية في العيادة.',                  3),
  ('p5',  'games',    '2024', false, 'games',   'Interactive Game',        'لعبة تفاعلية',           'An immersive experience built with creativity and technical precision.','تجربة غامرة مبنية بإبداع ودقة تقنية.',                            4),
  ('p6',  'branding', '2025', false, 'brand',   'Startup Identity',        'هوية ناشئة',             'From zero to a full brand — helping a startup find its voice.',         'من الصفر إلى علامة تجارية كاملة — مساعدة ناشئة في إيجاد صوتها.',  5),
  ('p7',  'web',      '2025', false, 'web',     'E-Commerce Platform',     'منصة تجارة إلكترونية',   'A fully custom storefront built for performance and conversion.',       'متجر مخصص بالكامل للأداء والتحويل.',                               6),
  ('p8',  'motion',   '2025', false, 'motion',  'Brand Film',              'فيلم علامة تجارية',      'A cinematic brand story told in under two minutes.',                   'قصة علامة تجارية سينمائية في أقل من دقيقتين.',                     7),
  ('p9',  'systems',  '2025', false, 'systems', 'Operations Dashboard',    'لوحة تحكم عمليات',       'Real-time ops visibility for a growing business.',                     'رؤية عمليات فورية لعمل في طريق النمو.',                            8),
  ('p10', 'games',    '2025', false, 'games',   'Mobile Game',             'لعبة موبايل',            '2D mobile experience with tight mechanics and sharp visuals.',         'تجربة موبايل ثنائية الأبعاد بميكانيكا محكمة وصور حادة.',           9),
  ('p11', 'branding', '2025', false, 'brand',   'Brand Refresh',           'تجديد علامة تجارية',     'Rethinking and rebuilding a brand that deserved to be seen.',          'إعادة تفكير وبناء علامة تجارية تستحق أن تُرى.',                    10),
  ('p12', 'web',      '2025', false, 'web',     'Portfolio Website',       'موقع معرض أعمال',        'A designer''s portfolio — minimal, fast, and memorable.',              'معرض أعمال مصمم — بسيط وسريع ولا يُنسى.',                         11)
ON CONFLICT (id) DO NOTHING;

-- Seed team members (migrated from lib/data/team.ts)
INSERT INTO team_members (initials, name, role, badge, sort_order) VALUES
  ('T1', 'Team Member',   'Brand Designer',    'Designer', 0),
  ('T2', 'Yousef Hamdan', 'Full-Stack Dev',    'Dev',      1),
  ('T3', 'Team Member',   'Motion Designer',   'Motion',   2),
  ('T4', 'Team Member',   'Systems Engineer',  'Systems',  3),
  ('T5', 'Team Member',   'Game Developer',    'Game Dev', 4),
  ('T6', 'Team Member',   'Creative Director', 'Creative', 5)
ON CONFLICT DO NOTHING;

-- Seed testimonials (migrated from messages/en.json exp.testimonials)
INSERT INTO testimonials (quote_en, quote_ar, author_name, author_role, sort_order) VALUES
  (
    'DASH didn''t just design our clinic system — they thought through every workflow we had. The result actually changed how we operate day to day.',
    'داش لم تصمم نظام العيادة فحسب — بل فكّرت في كل سير عمل لدينا. النتيجة غيّرت فعلاً طريقة عملنا يوماً بيوم.',
    'Ahmad K.', 'Clinic Director', 0
  ),
  (
    'We came to them with a vague idea and left with a brand identity that felt exactly like us. Fast, sharp, and professional from day one.',
    'جئنا إليهم بفكرة مبهمة وغادرنا بهوية علامة تجارية تعبّر عنا تماماً. سريعون وحادون ومحترفون من اليوم الأول.',
    'Sara M.', 'Startup Founder', 1
  ),
  (
    'The motion content they made for our launch campaign stopped people mid-scroll. We saw engagement go up immediately after the videos dropped.',
    'محتوى الحركة الذي صنعوه لحملة إطلاقنا أوقف الناس أثناء التمرير. لاحظنا ارتفاع التفاعل فور نشر الفيديوهات.',
    'Rami H.', 'Marketing Lead', 2
  )
ON CONFLICT DO NOTHING;
