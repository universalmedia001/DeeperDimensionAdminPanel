/*
# Media tables: photos, videos, trailers, galleries

1. New Tables
- `photos`: title, description, image_url, file_name, file_size, mime_type, status
- `videos`: title, description, category, video_url, thumbnail_url, duration, views, status, featured
- `trailers`: title, description, release_date, video_url, thumbnail_url, status
- `galleries`: title, description, category, cover_image, status
- `gallery_photos`: junction table connecting galleries to photos

2. Security
- RLS enabled on all tables.
- Public SELECT for published rows; authenticated admin full CRUD.
*/

-- photos
CREATE TABLE IF NOT EXISTS public.photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  file_name text DEFAULT '',
  file_size text DEFAULT '',
  mime_type text DEFAULT '',
  status text NOT NULL DEFAULT 'Draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "photos_public_select" ON public.photos;
CREATE POLICY "photos_public_select" ON public.photos FOR SELECT TO anon, authenticated USING (status = 'Published');
DROP POLICY IF EXISTS "photos_admin_insert" ON public.photos;
CREATE POLICY "photos_admin_insert" ON public.photos FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "photos_admin_update" ON public.photos;
CREATE POLICY "photos_admin_update" ON public.photos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "photos_admin_delete" ON public.photos;
CREATE POLICY "photos_admin_delete" ON public.photos FOR DELETE TO authenticated USING (true);
CREATE TRIGGER photos_set_updated_at BEFORE UPDATE ON public.photos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- videos
CREATE TABLE IF NOT EXISTS public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT '',
  video_url text DEFAULT '',
  thumbnail_url text DEFAULT '',
  duration text DEFAULT '',
  views integer DEFAULT 0,
  status text NOT NULL DEFAULT 'Draft',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "videos_public_select" ON public.videos;
CREATE POLICY "videos_public_select" ON public.videos FOR SELECT TO anon, authenticated USING (status = 'Published');
DROP POLICY IF EXISTS "videos_admin_insert" ON public.videos;
CREATE POLICY "videos_admin_insert" ON public.videos FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "videos_admin_update" ON public.videos;
CREATE POLICY "videos_admin_update" ON public.videos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "videos_admin_delete" ON public.videos;
CREATE POLICY "videos_admin_delete" ON public.videos FOR DELETE TO authenticated USING (true);
CREATE TRIGGER videos_set_updated_at BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- trailers
CREATE TABLE IF NOT EXISTS public.trailers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  release_date text DEFAULT '',
  video_url text DEFAULT '',
  thumbnail_url text DEFAULT '',
  status text NOT NULL DEFAULT 'Draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.trailers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "trailers_public_select" ON public.trailers;
CREATE POLICY "trailers_public_select" ON public.trailers FOR SELECT TO anon, authenticated USING (status = 'Published');
DROP POLICY IF EXISTS "trailers_admin_insert" ON public.trailers;
CREATE POLICY "trailers_admin_insert" ON public.trailers FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "trailers_admin_update" ON public.trailers;
CREATE POLICY "trailers_admin_update" ON public.trailers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "trailers_admin_delete" ON public.trailers;
CREATE POLICY "trailers_admin_delete" ON public.trailers FOR DELETE TO authenticated USING (true);
CREATE TRIGGER trailers_set_updated_at BEFORE UPDATE ON public.trailers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- galleries
CREATE TABLE IF NOT EXISTS public.galleries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT '',
  cover_image text DEFAULT '',
  status text NOT NULL DEFAULT 'Draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "galleries_public_select" ON public.galleries;
CREATE POLICY "galleries_public_select" ON public.galleries FOR SELECT TO anon, authenticated USING (status = 'Published');
DROP POLICY IF EXISTS "galleries_admin_insert" ON public.galleries;
CREATE POLICY "galleries_admin_insert" ON public.galleries FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "galleries_admin_update" ON public.galleries;
CREATE POLICY "galleries_admin_update" ON public.galleries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "galleries_admin_delete" ON public.galleries;
CREATE POLICY "galleries_admin_delete" ON public.galleries FOR DELETE TO authenticated USING (true);
CREATE TRIGGER galleries_set_updated_at BEFORE UPDATE ON public.galleries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- gallery_photos junction
CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id uuid NOT NULL REFERENCES public.galleries(id) ON DELETE CASCADE,
  photo_id uuid NOT NULL REFERENCES public.photos(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "gallery_photos_public_select" ON public.gallery_photos;
CREATE POLICY "gallery_photos_public_select" ON public.gallery_photos FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "gallery_photos_admin_insert" ON public.gallery_photos;
CREATE POLICY "gallery_photos_admin_insert" ON public.gallery_photos FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "gallery_photos_admin_delete" ON public.gallery_photos;
CREATE POLICY "gallery_photos_admin_delete" ON public.gallery_photos FOR DELETE TO authenticated USING (true);
CREATE UNIQUE INDEX IF NOT EXISTS gallery_photos_gallery_photo_idx ON public.gallery_photos(gallery_id, photo_id);
