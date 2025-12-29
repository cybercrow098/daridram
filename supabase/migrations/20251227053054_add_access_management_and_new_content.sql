/*
  # Access Management and New Content Tables

  1. New Tables
    - `access_keys`
      - `id` (uuid, primary key)
      - `key` (text, unique) - The actual access key string
      - `username` (text) - Custom username for the key holder
      - `created_at` (timestamptz)
      - `last_used_at` (timestamptz)
      - `is_active` (boolean) - Whether the key is currently active
      - `permissions` (text[]) - Array of permission strings
      - `notes` (text) - Admin notes about this key

    - `exploits`
      - `id` (uuid, primary key)
      - `name` (text) - Exploit name/codename
      - `description` (text)
      - `category` (text) - e.g., 'Web', 'Network', 'Binary'
      - `severity` (text) - e.g., 'Critical', 'High', 'Medium', 'Low'
      - `status` (text) - e.g., 'Active', 'Patched', 'Archived'
      - `cve_id` (text) - CVE identifier if applicable
      - `tags` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `is_visible` (boolean)
      - `sort_order` (integer)

    - `stealers`
      - `id` (uuid, primary key)
      - `name` (text) - Stealer name/codename
      - `description` (text)
      - `target_type` (text) - e.g., 'Browser', 'Wallet', 'Credentials'
      - `platforms` (text[]) - e.g., ['Windows', 'Linux', 'macOS']
      - `status` (text) - e.g., 'Active', 'Detected', 'Archived'
      - `detection_rate` (text) - e.g., 'Low', 'Medium', 'High'
      - `tags` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `is_visible` (boolean)
      - `sort_order` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Access Keys table
CREATE TABLE IF NOT EXISTS access_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  username text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz,
  is_active boolean DEFAULT true,
  permissions text[] DEFAULT ARRAY['read']::text[],
  notes text DEFAULT ''
);

ALTER TABLE access_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view access keys"
  ON access_keys
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert access keys"
  ON access_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update access keys"
  ON access_keys
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete access keys"
  ON access_keys
  FOR DELETE
  TO authenticated
  USING (true);

-- Exploits table
CREATE TABLE IF NOT EXISTS exploits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'General',
  severity text DEFAULT 'Medium',
  status text DEFAULT 'Active',
  cve_id text DEFAULT '',
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_visible boolean DEFAULT true,
  sort_order integer DEFAULT 0
);

ALTER TABLE exploits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible exploits"
  ON exploits
  FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated users can manage exploits"
  ON exploits
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Stealers table
CREATE TABLE IF NOT EXISTS stealers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  target_type text DEFAULT 'General',
  platforms text[] DEFAULT ARRAY['Windows']::text[],
  status text DEFAULT 'Active',
  detection_rate text DEFAULT 'Low',
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_visible boolean DEFAULT true,
  sort_order integer DEFAULT 0
);

ALTER TABLE stealers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible stealers"
  ON stealers
  FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated users can manage stealers"
  ON stealers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample exploits
INSERT INTO exploits (name, description, category, severity, status, cve_id, tags, sort_order) VALUES
('CVE-2024-0001', 'Remote code execution vulnerability in web framework', 'Web', 'Critical', 'Active', 'CVE-2024-0001', ARRAY['RCE', 'Web', 'Framework'], 1),
('Buffer Overflow X86', 'Stack-based buffer overflow in legacy system', 'Binary', 'High', 'Active', '', ARRAY['Buffer Overflow', 'x86', 'Memory'], 2),
('SQL Injection Vector', 'Blind SQL injection in authentication module', 'Web', 'High', 'Active', '', ARRAY['SQLi', 'Auth', 'Database'], 3),
('SSRF Chain', 'Server-side request forgery with cloud metadata access', 'Web', 'Critical', 'Active', '', ARRAY['SSRF', 'Cloud', 'AWS'], 4),
('Privilege Escalation', 'Local privilege escalation via misconfigured service', 'System', 'High', 'Active', '', ARRAY['PrivEsc', 'Windows', 'Service'], 5),
('XSS Stored', 'Persistent cross-site scripting in comment system', 'Web', 'Medium', 'Patched', '', ARRAY['XSS', 'DOM', 'Stored'], 6);

-- Insert sample stealers
INSERT INTO stealers (name, description, target_type, platforms, status, detection_rate, tags, sort_order) VALUES
('ChromeGrabber', 'Extracts saved credentials and cookies from Chromium browsers', 'Browser', ARRAY['Windows', 'Linux', 'macOS'], 'Active', 'Low', ARRAY['Browser', 'Chrome', 'Cookies'], 1),
('WalletDrain', 'Cryptocurrency wallet extraction module', 'Wallet', ARRAY['Windows'], 'Active', 'Medium', ARRAY['Crypto', 'Wallet', 'BTC', 'ETH'], 2),
('DiscordToken', 'Discord token and session harvester', 'Credentials', ARRAY['Windows', 'Linux'], 'Active', 'Low', ARRAY['Discord', 'Token', 'Session'], 3),
('FileExfil', 'Targeted document and file exfiltration', 'Files', ARRAY['Windows', 'macOS'], 'Active', 'Low', ARRAY['Documents', 'Files', 'Exfil'], 4),
('KeyLogger Pro', 'Advanced keystroke logging with screenshot capture', 'Credentials', ARRAY['Windows'], 'Detected', 'High', ARRAY['Keylogger', 'Screenshot', 'Input'], 5),
('TelegramGrab', 'Telegram session and chat extraction', 'Credentials', ARRAY['Windows', 'Linux'], 'Active', 'Low', ARRAY['Telegram', 'Session', 'Chat'], 6);
