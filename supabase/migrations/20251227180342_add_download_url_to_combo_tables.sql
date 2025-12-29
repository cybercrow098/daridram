/*
  # Add Download URL to Combo Cracking Tables

  1. Changes
    - Add `download_url` column to `combos` table
    - Add `download_url` column to `cracking_tools` table
    
  2. Description
    - Allows storing download links for combo files and cracking tools
    - Default value is empty string
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'combos' AND column_name = 'download_url'
  ) THEN
    ALTER TABLE combos ADD COLUMN download_url text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cracking_tools' AND column_name = 'download_url'
  ) THEN
    ALTER TABLE cracking_tools ADD COLUMN download_url text DEFAULT '';
  END IF;
END $$;