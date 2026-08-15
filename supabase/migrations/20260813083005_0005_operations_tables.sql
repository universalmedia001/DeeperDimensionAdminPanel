/*
# Operations tables: giving_campaigns, news, devotionals, resources, contact_requests

1. New Tables
- `giving_campaigns`: campaign_name, category, description, target_amount, current_amount, status
- `news`: title, content, category, featured_image, status, published_at
- `devotionals`: title, scripture, content, featured_image, status, published_at
- `resources`: title, description, resource_type, resource_url, status
- `contact_requests`: name, email, phone, request, status (PRIVATE admin data)

2. Security
- RLS enabled on all tables.
- giving_campaigns, news, devotionals, resources: public SELECT for published; admin CRUD.
- contact_requests: authenticated admin ONLY (no public SELECT).
*/

-- giving_campaigns
CREATE TABLE IF NOT EXISTS public.giving_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name text NOT NULL,
  category text DEFAULT '',
  description text DEFAULT '',
  target_amount numeric DEFAULT 0,
  current_amount numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'Draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.giving_campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "giving_campaigns_public_select" ON public.giving_campaigns;
CREATE POLICY "giving_campaigns_public_select" ON public.giving_campaigns FOR SELECT TO anon, authenticated USING (status = 'Published');
DROP POLICY IF EXISTS "giving_campaigns_admin_insert" ON public.giving_campaigns;
CREATE POLICY "giving_campaigns_admin_insert" ON public.giving_campaigns FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "giving_campaigns_admin_update" ON public.giving_campaigns;
CREATE POLICY "giving_campaigns_admin_update" ON public.giving_campaigns FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "giving_campaigns_admin_delete" ON public.giving_campaigns;
CREATE POLICY "giving_campaigns_admin_delete" ON public.giving_campaigns FOR DELETE TO authenticated USING (true);
CREATE TRIGGER giving_campaigns_set_updated_at BEFORE UPDATE ON public.giving_campaigns FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- news
CREATE TABLE IF NOT EXISTS public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text DEFAULT '',
  category text DEFAULT '',
  featured_image text DEFAULT '',
  status text NOT NULL DEFAULT 'Draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "news_public_select" ON public.news;
CREATE POLICY "news_public_select" ON public.news FOR SELECT TO anon, authenticated USING (status = 'Published');
DROP POLICY IF EXISTS "news_admin_insert" ON public.news;
CREATE POLICY "news_admin_insert" ON public.news FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "news_admin_update" ON public.news;
CREATE POLICY "news_admin_update" ON public.news FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "news_admin_delete" ON public.news;
CREATE POLICY "news_admin_delete" ON public.news FOR DELETE TO authenticated USING (true);
CREATE TRIGGER news_set_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- devotionals
CREATE TABLE IF NOT EXISTS public.devotionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  scripture text DEFAULT '',
  content text DEFAULT '',
  featured_image text DEFAULT '',
  status text NOT NULL DEFAULT 'Draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.devotionals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "devotionals_public_select" ON public.devotionals;
CREATE POLICY "devotionals_public_select" ON public.devotionals FOR SELECT TO anon, authenticated USING (status = 'Published');
DROP POLICY IF EXISTS "devotionals_admin_insert" ON public.devotionals;
CREATE POLICY "devotionals_admin_insert" ON public.devotionals FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "devotionals_admin_update" ON public.devotionals;
CREATE POLICY "devotionals_admin_update" ON public.devotionals FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "devotionals_admin_delete" ON public.devotionals;
CREATE POLICY "devotionals_admin_delete" ON public.devotionals FOR DELETE TO authenticated USING (true);
CREATE TRIGGER devotionals_set_updated_at BEFORE UPDATE ON public.devotionals FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- resources
CREATE TABLE IF NOT EXISTS public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  resource_type text DEFAULT '',
  resource_url text DEFAULT '',
  status text NOT NULL DEFAULT 'Draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "resources_public_select" ON public.resources;
CREATE POLICY "resources_public_select" ON public.resources FOR SELECT TO anon, authenticated USING (status = 'Published');
DROP POLICY IF EXISTS "resources_admin_insert" ON public.resources;
CREATE POLICY "resources_admin_insert" ON public.resources FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "resources_admin_update" ON public.resources;
CREATE POLICY "resources_admin_update" ON public.resources FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "resources_admin_delete" ON public.resources;
CREATE POLICY "resources_admin_delete" ON public.resources FOR DELETE TO authenticated USING (true);
CREATE TRIGGER resources_set_updated_at BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- contact_requests (PRIVATE admin data)
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text DEFAULT '',
  phone text DEFAULT '',
  request text DEFAULT '',
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "contact_requests_admin_select" ON public.contact_requests;
CREATE POLICY "contact_requests_admin_select" ON public.contact_requests FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "contact_requests_admin_insert" ON public.contact_requests;
CREATE POLICY "contact_requests_admin_insert" ON public.contact_requests FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "contact_requests_admin_update" ON public.contact_requests;
CREATE POLICY "contact_requests_admin_update" ON public.contact_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "contact_requests_admin_delete" ON public.contact_requests;
CREATE POLICY "contact_requests_admin_delete" ON public.contact_requests FOR DELETE TO authenticated USING (true);
CREATE TRIGGER contact_requests_set_updated_at BEFORE UPDATE ON public.contact_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
