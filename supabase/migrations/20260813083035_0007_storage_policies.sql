/*
# Storage bucket policies

1. Security Changes
- admin-profiles: public read; authenticated upload/update/delete.
- photos, videos, website-assets, event-images, sermon-assets, resources: public read; authenticated upload/update/delete.
*/

-- admin-profiles bucket policies
DROP POLICY IF EXISTS "admin_profiles_public_read" ON storage.objects;
CREATE POLICY "admin_profiles_public_read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'admin-profiles');
DROP POLICY IF EXISTS "admin_profiles_auth_upload" ON storage.objects;
CREATE POLICY "admin_profiles_auth_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'admin-profiles');
DROP POLICY IF EXISTS "admin_profiles_auth_update" ON storage.objects;
CREATE POLICY "admin_profiles_auth_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'admin-profiles') WITH CHECK (bucket_id = 'admin-profiles');
DROP POLICY IF EXISTS "admin_profiles_auth_delete" ON storage.objects;
CREATE POLICY "admin_profiles_auth_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'admin-profiles');

-- photos bucket policies
DROP POLICY IF EXISTS "photos_public_read" ON storage.objects;
CREATE POLICY "photos_public_read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'photos');
DROP POLICY IF EXISTS "photos_auth_upload" ON storage.objects;
CREATE POLICY "photos_auth_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'photos');
DROP POLICY IF EXISTS "photos_auth_update" ON storage.objects;
CREATE POLICY "photos_auth_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'photos') WITH CHECK (bucket_id = 'photos');
DROP POLICY IF EXISTS "photos_auth_delete" ON storage.objects;
CREATE POLICY "photos_auth_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'photos');

-- videos bucket policies
DROP POLICY IF EXISTS "videos_public_read" ON storage.objects;
CREATE POLICY "videos_public_read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'videos');
DROP POLICY IF EXISTS "videos_auth_upload" ON storage.objects;
CREATE POLICY "videos_auth_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'videos');
DROP POLICY IF EXISTS "videos_auth_update" ON storage.objects;
CREATE POLICY "videos_auth_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'videos') WITH CHECK (bucket_id = 'videos');
DROP POLICY IF EXISTS "videos_auth_delete" ON storage.objects;
CREATE POLICY "videos_auth_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'videos');

-- website-assets bucket policies
DROP POLICY IF EXISTS "website_assets_public_read" ON storage.objects;
CREATE POLICY "website_assets_public_read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'website-assets');
DROP POLICY IF EXISTS "website_assets_auth_upload" ON storage.objects;
CREATE POLICY "website_assets_auth_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'website-assets');
DROP POLICY IF EXISTS "website_assets_auth_update" ON storage.objects;
CREATE POLICY "website_assets_auth_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'website-assets') WITH CHECK (bucket_id = 'website-assets');
DROP POLICY IF EXISTS "website_assets_auth_delete" ON storage.objects;
CREATE POLICY "website_assets_auth_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'website-assets');

-- event-images bucket policies
DROP POLICY IF EXISTS "event_images_public_read" ON storage.objects;
CREATE POLICY "event_images_public_read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'event-images');
DROP POLICY IF EXISTS "event_images_auth_upload" ON storage.objects;
CREATE POLICY "event_images_auth_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'event-images');
DROP POLICY IF EXISTS "event_images_auth_update" ON storage.objects;
CREATE POLICY "event_images_auth_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'event-images') WITH CHECK (bucket_id = 'event-images');
DROP POLICY IF EXISTS "event_images_auth_delete" ON storage.objects;
CREATE POLICY "event_images_auth_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'event-images');

-- sermon-assets bucket policies
DROP POLICY IF EXISTS "sermon_assets_public_read" ON storage.objects;
CREATE POLICY "sermon_assets_public_read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'sermon-assets');
DROP POLICY IF EXISTS "sermon_assets_auth_upload" ON storage.objects;
CREATE POLICY "sermon_assets_auth_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'sermon-assets');
DROP POLICY IF EXISTS "sermon_assets_auth_update" ON storage.objects;
CREATE POLICY "sermon_assets_auth_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'sermon-assets') WITH CHECK (bucket_id = 'sermon-assets');
DROP POLICY IF EXISTS "sermon_assets_auth_delete" ON storage.objects;
CREATE POLICY "sermon_assets_auth_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'sermon-assets');

-- resources bucket policies
DROP POLICY IF EXISTS "resources_public_read" ON storage.objects;
CREATE POLICY "resources_public_read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'resources');
DROP POLICY IF EXISTS "resources_auth_upload" ON storage.objects;
CREATE POLICY "resources_auth_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resources');
DROP POLICY IF EXISTS "resources_auth_update" ON storage.objects;
CREATE POLICY "resources_auth_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'resources') WITH CHECK (bucket_id = 'resources');
DROP POLICY IF EXISTS "resources_auth_delete" ON storage.objects;
CREATE POLICY "resources_auth_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'resources');
