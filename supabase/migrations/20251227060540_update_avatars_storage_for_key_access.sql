/*
  # Update Avatars Storage for Key-Based Access

  1. Changes
    - Update storage policies to allow uploads without auth.uid()
    - Since this is a key-only system (no Supabase auth), we allow 
      uploads from any authenticated/anon user
    - The application layer controls access via access keys

  2. Security
    - Anyone can upload to avatars bucket
    - Anyone can view avatars (public read)
    - Anyone can update avatars
    - File names include key ID for organization
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;

-- Ensure avatars bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow anyone to upload avatars (app controls via key)
CREATE POLICY "Allow avatar uploads"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'avatars');

-- Allow anyone to view avatars
CREATE POLICY "Allow avatar viewing"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'avatars');

-- Allow anyone to update avatars
CREATE POLICY "Allow avatar updates"
  ON storage.objects
  FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'avatars')
  WITH CHECK (bucket_id = 'avatars');

-- Allow anyone to delete avatars
CREATE POLICY "Allow avatar deletion"
  ON storage.objects
  FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'avatars');
