/*
  # Add image URL to posts table

  1. Changes
    - Add `image_url` column to posts table for cover images
    - Column is optional (nullable) for backwards compatibility

  2. Notes
    - Existing posts will have null image_url
    - New posts can optionally include a cover image
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE posts ADD COLUMN image_url text;
  END IF;
END $$;