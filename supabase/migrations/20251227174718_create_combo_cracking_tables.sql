/*
  # Create Combo Cracking Tables

  1. New Tables
    - `combos`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the combo list
      - `description` (text) - Description of what the combo contains
      - `combo_type` (text) - Type: email:pass, user:pass, etc.
      - `line_count` (text) - Number of lines/entries
      - `source` (text) - Source or origin
      - `tags` (text[]) - Array of tags
      - `is_visible` (boolean) - Visibility flag
      - `sort_order` (integer) - Display order
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `cracking_tools`
      - `id` (uuid, primary key)
      - `name` (text) - Tool name
      - `description` (text) - Tool description
      - `tool_type` (text) - Type: checker, cracker, config, etc.
      - `platforms` (text[]) - Supported platforms
      - `version` (text) - Current version
      - `status` (text) - Active, Discontinued, Beta
      - `tags` (text[]) - Array of tags
      - `is_visible` (boolean) - Visibility flag
      - `sort_order` (integer) - Display order
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on both tables
    - Add policies for read access based on visibility
    - Add policies for admin management
*/

-- Create combos table
CREATE TABLE IF NOT EXISTS combos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  combo_type text DEFAULT 'email:pass',
  line_count text DEFAULT '0',
  source text DEFAULT '',
  tags text[] DEFAULT '{}',
  is_visible boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cracking_tools table
CREATE TABLE IF NOT EXISTS cracking_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  tool_type text DEFAULT 'checker',
  platforms text[] DEFAULT '{}',
  version text DEFAULT '',
  status text DEFAULT 'Active',
  tags text[] DEFAULT '{}',
  is_visible boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cracking_tools ENABLE ROW LEVEL SECURITY;

-- Combos policies
CREATE POLICY "Anyone can read visible combos"
  ON combos
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "Admins can read all combos"
  ON combos
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM access_keys
      WHERE access_keys.is_admin = true
      AND access_keys.is_active = true
    )
  );

CREATE POLICY "Admins can insert combos"
  ON combos
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM access_keys
      WHERE access_keys.is_admin = true
      AND access_keys.is_active = true
    )
  );

CREATE POLICY "Admins can update combos"
  ON combos
  FOR UPDATE
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM access_keys
      WHERE access_keys.is_admin = true
      AND access_keys.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM access_keys
      WHERE access_keys.is_admin = true
      AND access_keys.is_active = true
    )
  );

CREATE POLICY "Admins can delete combos"
  ON combos
  FOR DELETE
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM access_keys
      WHERE access_keys.is_admin = true
      AND access_keys.is_active = true
    )
  );

-- Cracking tools policies
CREATE POLICY "Anyone can read visible cracking tools"
  ON cracking_tools
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "Admins can read all cracking tools"
  ON cracking_tools
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM access_keys
      WHERE access_keys.is_admin = true
      AND access_keys.is_active = true
    )
  );

CREATE POLICY "Admins can insert cracking tools"
  ON cracking_tools
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM access_keys
      WHERE access_keys.is_admin = true
      AND access_keys.is_active = true
    )
  );

CREATE POLICY "Admins can update cracking tools"
  ON cracking_tools
  FOR UPDATE
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM access_keys
      WHERE access_keys.is_admin = true
      AND access_keys.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM access_keys
      WHERE access_keys.is_admin = true
      AND access_keys.is_active = true
    )
  );

CREATE POLICY "Admins can delete cracking tools"
  ON cracking_tools
  FOR DELETE
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM access_keys
      WHERE access_keys.is_admin = true
      AND access_keys.is_active = true
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS combos_sort_order_idx ON combos(sort_order);
CREATE INDEX IF NOT EXISTS combos_is_visible_idx ON combos(is_visible);
CREATE INDEX IF NOT EXISTS cracking_tools_sort_order_idx ON cracking_tools(sort_order);
CREATE INDEX IF NOT EXISTS cracking_tools_is_visible_idx ON cracking_tools(is_visible);