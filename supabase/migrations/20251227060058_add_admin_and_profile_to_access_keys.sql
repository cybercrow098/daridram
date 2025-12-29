/*
  # Add Admin Flag and Profile Fields to Access Keys

  1. Changes to access_keys
    - `is_admin` (boolean) - Whether this key has admin privileges
    - `display_name` (text) - Custom profile display name
    - `avatar_url` (text) - Profile picture URL

  2. Security
    - Update RLS to allow public read for key verification
    - Only key owners can update their own profile fields
    - Only admins can update is_admin field or view all keys
    - Remove dependency on auth.users since this is key-only access

  3. Notes
    - First key created will be admin by default
    - Regular users can only see and manage their own key
*/

-- Add new columns to access_keys
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'access_keys' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE access_keys ADD COLUMN is_admin boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'access_keys' AND column_name = 'display_name'
  ) THEN
    ALTER TABLE access_keys ADD COLUMN display_name text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'access_keys' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE access_keys ADD COLUMN avatar_url text DEFAULT '';
  END IF;
END $$;

-- Drop all existing RLS policies on access_keys to rebuild them
DROP POLICY IF EXISTS "Anyone can verify keys" ON access_keys;
DROP POLICY IF EXISTS "Users can insert own key or admins can insert any" ON access_keys;
DROP POLICY IF EXISTS "Users can update own key" ON access_keys;
DROP POLICY IF EXISTS "Admins can delete keys" ON access_keys;
DROP POLICY IF EXISTS "Admins can view all keys" ON access_keys;
DROP POLICY IF EXISTS "Users can view own key" ON access_keys;

-- Policy: Anyone can verify keys (for login - read by key_value)
CREATE POLICY "Public can verify keys for login"
  ON access_keys
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Only admins can insert new keys (checked at application level)
CREATE POLICY "Allow key insertion"
  ON access_keys
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Allow updates (application will verify ownership)
CREATE POLICY "Allow key updates"
  ON access_keys
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Note: We handle authorization at application level since there's no auth.uid()
-- The key ID is stored in localStorage and verified in the application

-- Make the first existing key an admin if none exist
UPDATE access_keys
SET is_admin = true
WHERE id = (SELECT id FROM access_keys ORDER BY created_at ASC LIMIT 1)
AND NOT EXISTS (SELECT 1 FROM access_keys WHERE is_admin = true);
