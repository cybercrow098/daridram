/*
  # Add User Profiles and Role-Based Access Control

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `display_name` (text) - Custom profile name
      - `avatar_url` (text) - Profile picture URL
      - `role` (text) - 'admin' or 'member'
      - `access_key_id` (uuid) - References access_keys
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Changes to access_keys
    - Add `user_id` column to link keys to authenticated users

  3. Security
    - Enable RLS on user_profiles
    - Admins can see all profiles and keys
    - Members can only see/update their own profile
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text DEFAULT '',
  avatar_url text DEFAULT '',
  role text DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  access_key_id uuid REFERENCES access_keys(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add user_id to access_keys if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'access_keys' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE access_keys ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
    OR id = auth.uid()
  );

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Users can update their own profile (but not role)
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Update access_keys RLS policies
DROP POLICY IF EXISTS "Admins can view all keys" ON access_keys;
DROP POLICY IF EXISTS "Users can view own key" ON access_keys;
DROP POLICY IF EXISTS "Admins can insert keys" ON access_keys;
DROP POLICY IF EXISTS "Users can update own key" ON access_keys;
DROP POLICY IF EXISTS "Admins can update any key" ON access_keys;
DROP POLICY IF EXISTS "Anyone can verify keys" ON access_keys;

-- Anyone can verify keys (for login)
CREATE POLICY "Anyone can verify keys"
  ON access_keys
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admins can insert keys
CREATE POLICY "Admins can insert keys"
  ON access_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- Users can update their own key, admins can update any
CREATE POLICY "Users can update own key"
  ON access_keys
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  )
  WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- Only admins can delete keys
CREATE POLICY "Admins can delete keys"
  ON access_keys
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- Create function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
