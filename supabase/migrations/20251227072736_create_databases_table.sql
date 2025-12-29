/*
  # Create Databases Table
  
  1. New Tables
    - `databases`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the database
      - `description` (text) - Brief description
      - `country` (text) - Country of origin
      - `size` (text) - Size category (Small, Medium, Large, Massive)
      - `record_count` (text) - Number of records (e.g., "1.2M", "500K")
      - `download_url` (text) - URL for downloading
      - `is_visible` (boolean) - Visibility flag
      - `sort_order` (integer) - Display order
      - `created_at` (timestamptz) - Creation timestamp
  
  2. Security
    - Enable RLS on `databases` table
    - Add policy for public read access to visible databases
    - Add policy for authenticated users with admin access to manage
*/

CREATE TABLE IF NOT EXISTS databases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  country text NOT NULL DEFAULT 'Unknown',
  size text NOT NULL DEFAULT 'Medium',
  record_count text DEFAULT '',
  download_url text DEFAULT '',
  is_visible boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE databases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible databases"
  ON databases
  FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins can manage databases"
  ON databases
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM access_keys
      WHERE access_keys.user_id = auth.uid()
      AND access_keys.is_admin = true
      AND access_keys.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM access_keys
      WHERE access_keys.user_id = auth.uid()
      AND access_keys.is_admin = true
      AND access_keys.is_active = true
    )
  );

CREATE INDEX idx_databases_country ON databases(country);
CREATE INDEX idx_databases_size ON databases(size);
CREATE INDEX idx_databases_visible ON databases(is_visible);
