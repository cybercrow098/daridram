/*
  # Update access_keys table schema

  1. Changes
    - Add `username` column for custom usernames
    - Add `permissions` column for access control
    - Add `notes` column for admin notes
    - Add `last_used_at` column for tracking usage

  2. Notes
    - Uses IF NOT EXISTS to safely add columns
    - Preserves existing data
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'access_keys' AND column_name = 'username'
  ) THEN
    ALTER TABLE access_keys ADD COLUMN username text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'access_keys' AND column_name = 'permissions'
  ) THEN
    ALTER TABLE access_keys ADD COLUMN permissions text[] DEFAULT ARRAY['read']::text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'access_keys' AND column_name = 'notes'
  ) THEN
    ALTER TABLE access_keys ADD COLUMN notes text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'access_keys' AND column_name = 'last_used_at'
  ) THEN
    ALTER TABLE access_keys ADD COLUMN last_used_at timestamptz;
  END IF;
END $$;
