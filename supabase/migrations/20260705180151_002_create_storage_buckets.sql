/*
# Create storage buckets for user images

## Storage Buckets:
1. `progress-photos` - For before/after diary photos
2. `scan-images` - For AI scan images

## Policies:
- Users can only upload/view/delete their own files
- Files are organized by user_id folder structure
*/

-- Create storage buckets (if they don't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-photos', 'progress-photos', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('scan-images', 'scan-images', false)
ON CONFLICT (id) DO NOTHING;

-- Policy for progress-photos bucket
DROP POLICY IF EXISTS "Users can upload own progress photos" ON storage.objects;
CREATE POLICY "Users can upload own progress photos"
ON storage.objects FOR INSERT
TO authenticated WITH CHECK (
  bucket_id = 'progress-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can view own progress photos" ON storage.objects;
CREATE POLICY "Users can view own progress photos"
ON storage.objects FOR SELECT
TO authenticated USING (
  bucket_id = 'progress-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can delete own progress photos" ON storage.objects;
CREATE POLICY "Users can delete own progress photos"
ON storage.objects FOR DELETE
TO authenticated USING (
  bucket_id = 'progress-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy for scan-images bucket
DROP POLICY IF EXISTS "Users can upload own scan images" ON storage.objects;
CREATE POLICY "Users can upload own scan images"
ON storage.objects FOR INSERT
TO authenticated WITH CHECK (
  bucket_id = 'scan-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can view own scan images" ON storage.objects;
CREATE POLICY "Users can view own scan images"
ON storage.objects FOR SELECT
TO authenticated USING (
  bucket_id = 'scan-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can delete own scan images" ON storage.objects;
CREATE POLICY "Users can delete own scan images"
ON storage.objects FOR DELETE
TO authenticated USING (
  bucket_id = 'scan-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);