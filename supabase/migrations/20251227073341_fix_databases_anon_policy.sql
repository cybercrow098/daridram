/*
  # Fix Databases Policy for Anon Access
  
  1. Changes
    - Drop the authenticated-only policy
    - Add policy for anon role to manage databases
    - This matches how the app handles admin access via access_keys table
*/

DROP POLICY IF EXISTS "Authenticated users can manage databases" ON databases;

CREATE POLICY "Anon users can manage databases"
  ON databases
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
