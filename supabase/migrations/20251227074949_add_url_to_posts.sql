/*
  # Add URL field to posts table

  1. Changes
    - Add `url` column to posts table for external links
    - Column is optional (nullable) to support posts without URLs

  2. Notes
    - Existing posts will have null URL values
*/

ALTER TABLE posts ADD COLUMN IF NOT EXISTS url text;
