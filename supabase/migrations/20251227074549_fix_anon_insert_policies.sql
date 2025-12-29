/*
  # Fix anonymous insert/update/delete policies

  This migration adds policies to allow anonymous users to manage content.
  Since admin authentication is handled at the application level via access_keys,
  we need to allow anon role to perform these operations.

  1. Changes
    - Add INSERT policy for exploits (anon)
    - Add UPDATE policy for exploits (anon)
    - Add DELETE policy for exploits (anon)
    - Add INSERT policy for stealers (anon)
    - Add UPDATE policy for stealers (anon)
    - Add DELETE policy for stealers (anon)
    - Add INSERT policy for tools (anon)
    - Add UPDATE policy for tools (anon)
    - Add DELETE policy for tools (anon)
    - Add INSERT policy for posts (anon)
    - Add UPDATE policy for posts (anon)
    - Add DELETE policy for posts (anon)
*/

-- Exploits: Allow anon to insert
CREATE POLICY "Allow anon to insert exploits"
  ON exploits FOR INSERT
  TO anon
  WITH CHECK (true);

-- Exploits: Allow anon to update
CREATE POLICY "Allow anon to update exploits"
  ON exploits FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Exploits: Allow anon to delete
CREATE POLICY "Allow anon to delete exploits"
  ON exploits FOR DELETE
  TO anon
  USING (true);

-- Stealers: Allow anon to insert
CREATE POLICY "Allow anon to insert stealers"
  ON stealers FOR INSERT
  TO anon
  WITH CHECK (true);

-- Stealers: Allow anon to update
CREATE POLICY "Allow anon to update stealers"
  ON stealers FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Stealers: Allow anon to delete
CREATE POLICY "Allow anon to delete stealers"
  ON stealers FOR DELETE
  TO anon
  USING (true);

-- Tools: Allow anon to insert
CREATE POLICY "Allow anon to insert tools"
  ON tools FOR INSERT
  TO anon
  WITH CHECK (true);

-- Tools: Allow anon to update
CREATE POLICY "Allow anon to update tools"
  ON tools FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Tools: Allow anon to delete
CREATE POLICY "Allow anon to delete tools"
  ON tools FOR DELETE
  TO anon
  USING (true);

-- Posts: Allow anon to insert
CREATE POLICY "Allow anon to insert posts"
  ON posts FOR INSERT
  TO anon
  WITH CHECK (true);

-- Posts: Allow anon to update
CREATE POLICY "Allow anon to update posts"
  ON posts FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Posts: Allow anon to delete
CREATE POLICY "Allow anon to delete posts"
  ON posts FOR DELETE
  TO anon
  USING (true);

-- Also add SELECT policy for posts for anon to see all (admin needs to see drafts)
CREATE POLICY "Allow anon to read all posts"
  ON posts FOR SELECT
  TO anon
  USING (true);
