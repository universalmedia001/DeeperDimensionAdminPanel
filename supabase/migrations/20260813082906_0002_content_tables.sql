/*
# Content tables: sermons, series, preachers, events, schedule, live streams

1. New Tables
- `sermons`: title, description, preacher, series, youtube_url, category, duration, views, status, featured
- `series`: sermon series (title, description, start_date, end_date, status, featured)
- `preachers`: name, role, biography, ministry, photo, status, featured
- `events`: title, description, start_date, end_date, time, venue, capacity, category, registrations, image, status, featured
- `schedule`: session_title, date, start_time, end_time, speaker, venue, status
- `live_streams`: title, description, provider, live_url, status, started_at, ended_at

2. Security
- RLS enabled on all tables.
- Public SELECT for rows where status='Published' (public website reads published content).
- Authenticated admin full CRUD.
- Admin-only tables (none in this migration — all content can be published).

3. Notes
- `sermons.preacher` and `sermons.series` are text fields (preacher name, series name) matching the existing app fields.
- `youtube_url` stored as text.
- All have created_at, updated_at triggers.
*/

-- sermons
CREATE TABLE IF NOT EXISTS public.sermons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  preacher text DEFAULT '',
  series text DEFAULT '',
  youtube_url text DEFAULT '',
  category text DEFAULT '',
  duration text DEFAULT '',
  views integer DEFAULT 0,
  status text NOT NULL DEFAULT 'Draft',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "sermons_public_select" ON public.sermons;
CREATE POLICY "sermons_public_select" ON public.sermons FOR SELECT TO anon, authenticated USING (status = 'Published');
DROP POLICY IF EXISTS "sermons_admin_insert" ON public.sermons;
CREATE POLICY "sermons_admin_insert" ON public.sermons FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "sermons_admin_update" ON public.sermons;
CREATE POLICY "sermons_admin_update" ON public.sermons FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "sermons_admin_delete" ON public.sermons;
CREATE POLICY "sermons_admin_delete" ON public.sermons FOR DELETE TO authenticated USING (true);
CREATE INDEX IF NOT EXISTS sermons_status_idx ON public.sermons(status);
CREATE TRIGGER sermons_set_updated_at BEFORE UPDATE ON public.sermons FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- series
CREATE TABLE IF NOT EXISTS public.series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  start_date text DEFAULT '',
  end_date text DEFAULT '',
  status text NOT NULL DEFAULT 'Draft',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "series_public_select" ON public.series;
CREATE POLICY "series_public_select" ON public.series FOR SELECT TO anon, authenticated USING (status = 'Published');
DROP POLICY IF EXISTS "series_admin_insert" ON public.series;
CREATE POLICY "series_admin_insert" ON public.series FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "series_admin_update" ON public.series;
CREATE POLICY "series_admin_update" ON public.series FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "series_admin_delete" ON public.series;
CREATE POLICY "series_admin_delete" ON public.series FOR DELETE TO authenticated USING (true);
CREATE TRIGGER series_set_updated_at BEFORE UPDATE ON public.series FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- preachers
CREATE TABLE IF NOT EXISTS public.preachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text DEFAULT '',
  biography text DEFAULT '',
  ministry text DEFAULT '',
  photo text DEFAULT '',
  status text NOT NULL DEFAULT 'Draft',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.preachers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "preachers_public_select" ON public.preachers;
CREATE POLICY "preachers_public_select" ON public.preachers FOR SELECT TO anon, authenticated USING (status = 'Published');
DROP POLICY IF EXISTS "preachers_admin_insert" ON public.preachers;
CREATE POLICY "preachers_admin_insert" ON public.preachers FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "preachers_admin_update" ON public.preachers;
CREATE POLICY "preachers_admin_update" ON public.preachers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "preachers_admin_delete" ON public.preachers;
CREATE POLICY "preachers_admin_delete" ON public.preachers FOR DELETE TO authenticated USING (true);
CREATE TRIGGER preachers_set_updated_at BEFORE UPDATE ON public.preachers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- events
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  start_date text DEFAULT '',
  end_date text DEFAULT '',
  time text DEFAULT '',
  venue text DEFAULT '',
  capacity integer DEFAULT 0,
  category text DEFAULT '',
  registrations integer DEFAULT 0,
  image text DEFAULT '',
  status text NOT NULL DEFAULT 'Draft',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "events_public_select" ON public.events;
CREATE POLICY "events_public_select" ON public.events FOR SELECT TO anon, authenticated USING (status = 'Published');
DROP POLICY IF EXISTS "events_admin_insert" ON public.events;
CREATE POLICY "events_admin_insert" ON public.events FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "events_admin_update" ON public.events;
CREATE POLICY "events_admin_update" ON public.events FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "events_admin_delete" ON public.events;
CREATE POLICY "events_admin_delete" ON public.events FOR DELETE TO authenticated USING (true);
CREATE TRIGGER events_set_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- schedule
CREATE TABLE IF NOT EXISTS public.schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_title text NOT NULL,
  date text DEFAULT '',
  start_time text DEFAULT '',
  end_time text DEFAULT '',
  speaker text DEFAULT '',
  venue text DEFAULT '',
  status text NOT NULL DEFAULT 'Draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "schedule_public_select" ON public.schedule;
CREATE POLICY "schedule_public_select" ON public.schedule FOR SELECT TO anon, authenticated USING (status = 'Published');
DROP POLICY IF EXISTS "schedule_admin_insert" ON public.schedule;
CREATE POLICY "schedule_admin_insert" ON public.schedule FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "schedule_admin_update" ON public.schedule;
CREATE POLICY "schedule_admin_update" ON public.schedule FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "schedule_admin_delete" ON public.schedule;
CREATE POLICY "schedule_admin_delete" ON public.schedule FOR DELETE TO authenticated USING (true);
CREATE TRIGGER schedule_set_updated_at BEFORE UPDATE ON public.schedule FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- live_streams
CREATE TABLE IF NOT EXISTS public.live_streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  provider text DEFAULT 'YouTube',
  live_url text DEFAULT '',
  status text NOT NULL DEFAULT 'Upcoming',
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.live_streams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "live_streams_public_select" ON public.live_streams;
CREATE POLICY "live_streams_public_select" ON public.live_streams FOR SELECT TO anon, authenticated USING (status = 'LIVE' OR status = 'Published');
DROP POLICY IF EXISTS "live_streams_admin_insert" ON public.live_streams;
CREATE POLICY "live_streams_admin_insert" ON public.live_streams FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "live_streams_admin_update" ON public.live_streams;
CREATE POLICY "live_streams_admin_update" ON public.live_streams FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "live_streams_admin_delete" ON public.live_streams;
CREATE POLICY "live_streams_admin_delete" ON public.live_streams FOR DELETE TO authenticated USING (true);
CREATE TRIGGER live_streams_set_updated_at BEFORE UPDATE ON public.live_streams FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
