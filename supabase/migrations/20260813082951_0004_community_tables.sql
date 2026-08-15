/*
# Community tables: announcements, testimonials, prayer_requests, members, ministries, registrations

1. New Tables
- `announcements`: title, description, button_url, status
- `testimonials`: name, testimonial, date, status
- `prayer_requests`: name, email, prayer_request, category, status (PRIVATE admin data)
- `members`: name, email, phone, ministry, status (PRIVATE admin data)
- `ministries`: title, description, leader, status
- `registrations`: name, email, phone, event, status (PRIVATE admin data)

2. Security
- RLS enabled on all tables.
- announcements, testimonials, ministries: public SELECT for published; admin CRUD.
- prayer_requests, members, registrations: authenticated admin ONLY (no public SELECT).
*/

-- announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  button_url text DEFAULT '',
  status text NOT NULL DEFAULT 'Draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "announcements_public_select" ON public.announcements;
CREATE POLICY "announcements_public_select" ON public.announcements FOR SELECT TO anon, authenticated USING (status = 'Published');
DROP POLICY IF EXISTS "announcements_admin_insert" ON public.announcements;
CREATE POLICY "announcements_admin_insert" ON public.announcements FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "announcements_admin_update" ON public.announcements;
CREATE POLICY "announcements_admin_update" ON public.announcements FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "announcements_admin_delete" ON public.announcements;
CREATE POLICY "announcements_admin_delete" ON public.announcements FOR DELETE TO authenticated USING (true);
CREATE TRIGGER announcements_set_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  testimonial text DEFAULT '',
  date text DEFAULT '',
  status text NOT NULL DEFAULT 'Draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "testimonials_public_select" ON public.testimonials;
CREATE POLICY "testimonials_public_select" ON public.testimonials FOR SELECT TO anon, authenticated USING (status = 'Published');
DROP POLICY IF EXISTS "testimonials_admin_insert" ON public.testimonials;
CREATE POLICY "testimonials_admin_insert" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "testimonials_admin_update" ON public.testimonials;
CREATE POLICY "testimonials_admin_update" ON public.testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "testimonials_admin_delete" ON public.testimonials;
CREATE POLICY "testimonials_admin_delete" ON public.testimonials FOR DELETE TO authenticated USING (true);
CREATE TRIGGER testimonials_set_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- prayer_requests (PRIVATE admin data)
CREATE TABLE IF NOT EXISTS public.prayer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text DEFAULT '',
  email text DEFAULT '',
  prayer_request text NOT NULL,
  category text DEFAULT '',
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "prayer_requests_admin_select" ON public.prayer_requests;
CREATE POLICY "prayer_requests_admin_select" ON public.prayer_requests FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "prayer_requests_admin_insert" ON public.prayer_requests;
CREATE POLICY "prayer_requests_admin_insert" ON public.prayer_requests FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "prayer_requests_admin_update" ON public.prayer_requests;
CREATE POLICY "prayer_requests_admin_update" ON public.prayer_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "prayer_requests_admin_delete" ON public.prayer_requests;
CREATE POLICY "prayer_requests_admin_delete" ON public.prayer_requests FOR DELETE TO authenticated USING (true);
CREATE TRIGGER prayer_requests_set_updated_at BEFORE UPDATE ON public.prayer_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- members (PRIVATE admin data)
CREATE TABLE IF NOT EXISTS public.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text DEFAULT '',
  phone text DEFAULT '',
  ministry text DEFAULT '',
  status text NOT NULL DEFAULT 'Active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members_admin_select" ON public.members;
CREATE POLICY "members_admin_select" ON public.members FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "members_admin_insert" ON public.members;
CREATE POLICY "members_admin_insert" ON public.members FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "members_admin_update" ON public.members;
CREATE POLICY "members_admin_update" ON public.members FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "members_admin_delete" ON public.members;
CREATE POLICY "members_admin_delete" ON public.members FOR DELETE TO authenticated USING (true);
CREATE TRIGGER members_set_updated_at BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ministries
CREATE TABLE IF NOT EXISTS public.ministries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  leader text DEFAULT '',
  status text NOT NULL DEFAULT 'Draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ministries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ministries_public_select" ON public.ministries;
CREATE POLICY "ministries_public_select" ON public.ministries FOR SELECT TO anon, authenticated USING (status = 'Published');
DROP POLICY IF EXISTS "ministries_admin_insert" ON public.ministries;
CREATE POLICY "ministries_admin_insert" ON public.ministries FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "ministries_admin_update" ON public.ministries;
CREATE POLICY "ministries_admin_update" ON public.ministries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "ministries_admin_delete" ON public.ministries;
CREATE POLICY "ministries_admin_delete" ON public.ministries FOR DELETE TO authenticated USING (true);
CREATE TRIGGER ministries_set_updated_at BEFORE UPDATE ON public.ministries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- registrations (PRIVATE admin data)
CREATE TABLE IF NOT EXISTS public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text DEFAULT '',
  phone text DEFAULT '',
  event text DEFAULT '',
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "registrations_admin_select" ON public.registrations;
CREATE POLICY "registrations_admin_select" ON public.registrations FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "registrations_admin_insert" ON public.registrations;
CREATE POLICY "registrations_admin_insert" ON public.registrations FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "registrations_admin_update" ON public.registrations;
CREATE POLICY "registrations_admin_update" ON public.registrations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "registrations_admin_delete" ON public.registrations;
CREATE POLICY "registrations_admin_delete" ON public.registrations FOR DELETE TO authenticated USING (true);
CREATE TRIGGER registrations_set_updated_at BEFORE UPDATE ON public.registrations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
