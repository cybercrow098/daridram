/*
  # Fix Databases Admin Policy
  
  1. Changes
    - Drop the overly restrictive admin policy
    - Add simpler policy matching exploits/stealers tables
    - Allow authenticated users to manage databases
*/

DROP POLICY IF EXISTS "Admins can manage databases" ON databases;

CREATE POLICY "Authenticated users can manage databases"
  ON databases
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
