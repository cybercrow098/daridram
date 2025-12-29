/*
  # Allow users to insert their own access key

  1. Changes
    - Update insert policy to allow users to insert keys for themselves
    - Users can only insert keys where user_id matches their own auth.uid()

  2. Security
    - Users cannot insert keys for other users
    - Admins can still insert keys for anyone
*/

DROP POLICY IF EXISTS "Admins can insert keys" ON access_keys;

CREATE POLICY "Users can insert own key or admins can insert any"
  ON access_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );
