/*
  # DAEMONCROW Database Schema

  1. New Tables
    - `access_keys`
      - `id` (uuid, primary key)
      - `key_value` (text, unique) - the 24-32 character access key
      - `is_active` (boolean) - whether key can be used
      - `is_one_time` (boolean) - if true, key becomes inactive after use
      - `expires_at` (timestamptz, nullable) - optional expiration
      - `used_at` (timestamptz, nullable) - when key was used
      - `created_at` (timestamptz)
    
    - `posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `content` (text)
      - `tags` (text array)
      - `is_published` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `tools`
      - `id` (uuid, primary key)
      - `codename` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `status` (text) - Active, Experimental, Locked
      - `access_level` (text) - Public Key, Private Key, Internal
      - `category` (text)
      - `sort_order` (integer)
      - `is_visible` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Access keys readable by anon for validation
    - Posts readable by anon (gated by frontend)
    - Tools readable by anon (gated by frontend)
*/

-- Access Keys Table
CREATE TABLE IF NOT EXISTS access_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_value text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  is_one_time boolean DEFAULT false,
  expires_at timestamptz,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE access_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon to validate keys"
  ON access_keys
  FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Allow anon to update key usage"
  ON access_keys
  FOR UPDATE
  TO anon
  USING (is_active = true)
  WITH CHECK (is_active = true OR is_active = false);

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL DEFAULT '',
  tags text[] DEFAULT '{}',
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon to read published posts"
  ON posts
  FOR SELECT
  TO anon
  USING (is_published = true);

-- Tools Table
CREATE TABLE IF NOT EXISTS tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codename text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'Experimental',
  access_level text NOT NULL DEFAULT 'Public Key',
  category text DEFAULT 'Utility',
  sort_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon to read visible tools"
  ON tools
  FOR SELECT
  TO anon
  USING (is_visible = true);

-- Insert sample access keys
INSERT INTO access_keys (key_value, is_active, is_one_time) VALUES
  ('DAEMON7X9K2M4P6Q8R1S3T5V7W9Y', true, false),
  ('CROW2024ALPHA8B3N5J7K9L1M3P5', true, false),
  ('X9Y7Z5W3V1U8T6S4R2Q0P8N6M4K2', true, true);

-- Insert sample posts
INSERT INTO posts (title, slug, content, tags, is_published, created_at) VALUES
  ('Signal Integrity Protocols', 'signal-integrity-protocols', 'Verification methods for maintaining chain authenticity across distributed nodes. Reference implementation available in DaemonLib.', ARRAY['protocols', 'verification', 'chains'], true, now() - interval '2 days'),
  ('Key Rotation Schedule', 'key-rotation-schedule', 'Updated rotation policy effective immediately. All endpoints must comply within 72 hours.', ARRAY['security', 'keys', 'policy'], true, now() - interval '5 days'),
  ('Substrate Analysis Complete', 'substrate-analysis-complete', 'Phase 2 analysis of target substrates concluded. Results archived in secure vault. Contact for access.', ARRAY['analysis', 'archive', 'research'], true, now() - interval '12 days'),
  ('Network Topology Update', 'network-topology-update', 'Mesh restructuring complete. Latency reduced by 34%. New node identifiers propagating.', ARRAY['network', 'infrastructure', 'update'], true, now() - interval '18 days');

-- Insert sample tools
INSERT INTO tools (codename, slug, description, status, access_level, category, sort_order) VALUES
  ('KEYCHECK', 'keycheck', 'Validate key integrity and authenticity', 'Active', 'Public Key', 'Checkers', 1),
  ('CHAINWATCH', 'chainwatch', 'BTC address monitoring and analysis', 'Active', 'Public Key', 'Chain Utilities', 2),
  ('HASHVERIFY', 'hashverify', 'Multi-algorithm hash verification', 'Active', 'Public Key', 'Validators', 3),
  ('CODEAUDIT', 'codeaudit', 'App code validation scanner', 'Experimental', 'Private Key', 'Validators', 4),
  ('DAEMONLIB', 'daemonlib', 'Advanced internal reference library', 'Locked', 'Internal', 'Library', 5),
  ('PHANTOM', 'phantom', 'Experimental stealth module', 'Experimental', 'Internal', 'Experimental', 6),
  ('NULLVEC', 'nullvec', 'Vector analysis toolkit', 'Locked', 'Private Key', 'Analysis', 7);