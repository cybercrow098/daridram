/*
  # Fix Security Issues

  1. Add Indexes on Foreign Keys
    - Add index on `access_keys.user_id` for better join performance
    - Add index on `user_profiles.access_key_id` for better join performance

  2. Fix RLS Policies with Select Wrapper
    - Update `user_profiles` policies to use `(select auth.uid())` instead of `auth.uid()`
    - This prevents re-evaluation for each row and improves query performance

  3. Drop Unused Indexes
    - Drop `idx_databases_country` (not being used)
    - Drop `idx_databases_size` (not being used)
    - Drop `idx_databases_visible` (not being used)

  4. Consolidate Duplicate Permissive Policies
    - Remove duplicate policies on `access_keys`, `databases`, `exploits`, `posts`, `stealers`
    - Keep the most permissive version to maintain functionality

  5. Fix Function Search Path
    - Update `handle_new_user` function with immutable search_path
*/

-- 1. Add indexes on foreign keys
CREATE INDEX IF NOT EXISTS idx_access_keys_user_id ON public.access_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_access_key_id ON public.user_profiles(access_key_id);

-- 2. Fix RLS policies on user_profiles with (select auth.uid()) wrapper
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles FOR SELECT
  TO authenticated
  USING (
    (EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = (select auth.uid()) AND up.role = 'admin'
    )) OR (id = (select auth.uid()))
  );

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- 3. Drop unused indexes
DROP INDEX IF EXISTS idx_databases_country;
DROP INDEX IF EXISTS idx_databases_size;
DROP INDEX IF EXISTS idx_databases_visible;

-- 4. Consolidate duplicate permissive policies

-- access_keys: Remove duplicates, keep consolidated policies
DROP POLICY IF EXISTS "Allow anon to validate keys" ON public.access_keys;
DROP POLICY IF EXISTS "Public can verify keys for login" ON public.access_keys;
DROP POLICY IF EXISTS "Allow anon to update key usage" ON public.access_keys;
DROP POLICY IF EXISTS "Allow key updates" ON public.access_keys;
DROP POLICY IF EXISTS "Allow key insertion" ON public.access_keys;
DROP POLICY IF EXISTS "Authenticated users can insert access keys" ON public.access_keys;
DROP POLICY IF EXISTS "Authenticated users can view access keys" ON public.access_keys;
DROP POLICY IF EXISTS "Authenticated users can update access keys" ON public.access_keys;
DROP POLICY IF EXISTS "Authenticated users can delete access keys" ON public.access_keys;

CREATE POLICY "Anon can read active keys"
  ON public.access_keys FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Anon can update active keys"
  ON public.access_keys FOR UPDATE
  TO anon
  USING (is_active = true)
  WITH CHECK (true);

CREATE POLICY "Anon can insert keys"
  ON public.access_keys FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can read keys"
  ON public.access_keys FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert keys"
  ON public.access_keys FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update keys"
  ON public.access_keys FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete keys"
  ON public.access_keys FOR DELETE
  TO authenticated
  USING (true);

-- databases: Remove duplicates
DROP POLICY IF EXISTS "Anon users can manage databases" ON public.databases;
DROP POLICY IF EXISTS "Anyone can view visible databases" ON public.databases;

CREATE POLICY "Anyone can view visible databases"
  ON public.databases FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Anon can manage databases"
  ON public.databases FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- exploits: Remove duplicates
DROP POLICY IF EXISTS "Anyone can view visible exploits" ON public.exploits;
DROP POLICY IF EXISTS "Authenticated users can manage exploits" ON public.exploits;
DROP POLICY IF EXISTS "Allow anon to insert exploits" ON public.exploits;
DROP POLICY IF EXISTS "Allow anon to update exploits" ON public.exploits;
DROP POLICY IF EXISTS "Allow anon to delete exploits" ON public.exploits;

CREATE POLICY "Anyone can view visible exploits"
  ON public.exploits FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Anon can manage exploits"
  ON public.exploits FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- posts: Remove duplicates
DROP POLICY IF EXISTS "Allow anon to read all posts" ON public.posts;
DROP POLICY IF EXISTS "Allow anon to read published posts" ON public.posts;
DROP POLICY IF EXISTS "Allow anon to insert posts" ON public.posts;
DROP POLICY IF EXISTS "Allow anon to update posts" ON public.posts;
DROP POLICY IF EXISTS "Allow anon to delete posts" ON public.posts;

CREATE POLICY "Anon can read posts"
  ON public.posts FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can insert posts"
  ON public.posts FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update posts"
  ON public.posts FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can delete posts"
  ON public.posts FOR DELETE
  TO anon
  USING (true);

-- stealers: Remove duplicates
DROP POLICY IF EXISTS "Anyone can view visible stealers" ON public.stealers;
DROP POLICY IF EXISTS "Authenticated users can manage stealers" ON public.stealers;
DROP POLICY IF EXISTS "Allow anon to insert stealers" ON public.stealers;
DROP POLICY IF EXISTS "Allow anon to update stealers" ON public.stealers;
DROP POLICY IF EXISTS "Allow anon to delete stealers" ON public.stealers;

CREATE POLICY "Anyone can view visible stealers"
  ON public.stealers FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Anon can manage stealers"
  ON public.stealers FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- 5. Fix handle_new_user function with immutable search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')
  );
  RETURN NEW;
END;
$$;
