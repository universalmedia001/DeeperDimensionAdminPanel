/*
# Core admin tables: profiles, admin settings, website settings, social media

1. New Tables
- `profiles`: admin profile (name, email, role, photo, phone, bio) linked to auth.users
- `admin_settings`: per-admin appearance/preferences (JSONB)
- `website_settings`: single-row public website configuration (title, hero, contact, social, logo, favicon, appearance)
- `social_media`: social platform links for the public website

2. Security
- RLS enabled on all tables.
- profiles: authenticated admin can read/update own row; public can read (name, role, photo, bio) for public display.
- admin_settings: authenticated admin can CRUD own settings only.
- website_settings: public SELECT (public website reads this); authenticated admin can INSERT/UPDATE.
- social_media: public SELECT; authenticated admin can INSERT/UPDATE/DELETE.

3. Notes
- `updated_at` trigger function created once and reused by all tables.
- All tables use UUID primary keys.
- profiles.id references auth.users.id (1:1).
*/

-- Reusable updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Administrator',
  email text NOT NULL,
  role text NOT NULL DEFAULT 'Super Admin',
  photo text DEFAULT '',
  phone text DEFAULT '',
  bio text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- admin_settings (per-user preferences)
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_settings_select_own" ON public.admin_settings;
CREATE POLICY "admin_settings_select_own" ON public.admin_settings FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "admin_settings_insert_own" ON public.admin_settings;
CREATE POLICY "admin_settings_insert_own" ON public.admin_settings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "admin_settings_update_own" ON public.admin_settings;
CREATE POLICY "admin_settings_update_own" ON public.admin_settings FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "admin_settings_delete_own" ON public.admin_settings;
CREATE POLICY "admin_settings_delete_own" ON public.admin_settings FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE UNIQUE INDEX IF NOT EXISTS admin_settings_user_id_idx ON public.admin_settings(user_id);
CREATE TRIGGER admin_settings_set_updated_at BEFORE UPDATE ON public.admin_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- website_settings (single config row, public-readable)
CREATE TABLE IF NOT EXISTS public.website_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'DEEPER DIMENSIONS',
  description text NOT NULL DEFAULT 'Beyond the Ordinary. Into the Supernatural.',
  url text NOT NULL DEFAULT 'https://deeperdimensions.org',
  hero_title text NOT NULL DEFAULT 'Beyond the Ordinary. Into the Supernatural.',
  hero_description text NOT NULL DEFAULT 'Five unforgettable days of worship, teaching, prayer, and encounters with God.',
  primary_button_text text NOT NULL DEFAULT 'Register now',
  secondary_button_text text NOT NULL DEFAULT 'Explore the program',
  contact_email text NOT NULL DEFAULT 'hello@deeperdimensions.org',
  phone text NOT NULL DEFAULT '+234 800 000 0000',
  address text NOT NULL DEFAULT 'The Gathering Hall',
  logo text DEFAULT '',
  favicon text DEFAULT '',
  copyright text NOT NULL DEFAULT '© 2026 DEEPER DIMENSIONS. All rights reserved.',
  appearance jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "website_settings_public_select" ON public.website_settings;
CREATE POLICY "website_settings_public_select" ON public.website_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "website_settings_admin_insert" ON public.website_settings;
CREATE POLICY "website_settings_admin_insert" ON public.website_settings FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "website_settings_admin_update" ON public.website_settings;
CREATE POLICY "website_settings_admin_update" ON public.website_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "website_settings_admin_delete" ON public.website_settings;
CREATE POLICY "website_settings_admin_delete" ON public.website_settings FOR DELETE TO authenticated USING (true);
CREATE TRIGGER website_settings_set_updated_at BEFORE UPDATE ON public.website_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- social_media
CREATE TABLE IF NOT EXISTS public.social_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.social_media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "social_media_public_select" ON public.social_media;
CREATE POLICY "social_media_public_select" ON public.social_media FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "social_media_admin_insert" ON public.social_media;
CREATE POLICY "social_media_admin_insert" ON public.social_media FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "social_media_admin_update" ON public.social_media;
CREATE POLICY "social_media_admin_update" ON public.social_media FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "social_media_admin_delete" ON public.social_media;
CREATE POLICY "social_media_admin_delete" ON public.social_media FOR DELETE TO authenticated USING (true);
CREATE TRIGGER social_media_set_updated_at BEFORE UPDATE ON public.social_media FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
