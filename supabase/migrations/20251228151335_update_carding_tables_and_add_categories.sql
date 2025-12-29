/*
  # Update Security Tables to Carding and Add Category Management

  1. New Tables
    - `carding_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique per section)
      - `section` (text) - which section this category belongs to (methods/tools/guides)
      - `sort_order` (integer)
      - `created_at` (timestamp)

  2. Changes
    - Rename security tables to carding tables
    - Add carding-specific content

  3. Security
    - Enable RLS on carding_categories
    - Add policies for read access and admin write access
*/

CREATE TABLE IF NOT EXISTS carding_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  section text NOT NULL CHECK (section IN ('methods', 'tools', 'guides')),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(name, section)
);

ALTER TABLE carding_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read carding categories"
  ON carding_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert carding categories"
  ON carding_categories
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM access_keys
      WHERE access_keys.key_value = current_setting('request.headers', true)::json->>'x-access-key'
      AND access_keys.is_admin = true
      AND access_keys.is_active = true
    )
  );

CREATE POLICY "Admins can update carding categories"
  ON carding_categories
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM access_keys
      WHERE access_keys.key_value = current_setting('request.headers', true)::json->>'x-access-key'
      AND access_keys.is_admin = true
      AND access_keys.is_active = true
    )
  );

CREATE POLICY "Admins can delete carding categories"
  ON carding_categories
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM access_keys
      WHERE access_keys.key_value = current_setting('request.headers', true)::json->>'x-access-key'
      AND access_keys.is_admin = true
      AND access_keys.is_active = true
    )
  );

INSERT INTO carding_categories (name, section, sort_order) VALUES
  ('BIN Lookup', 'tools', 1),
  ('CC Checker', 'tools', 2),
  ('CC Generator', 'tools', 3),
  ('Dumps', 'tools', 4),
  ('Fullz', 'tools', 5),
  ('Virtual Cards', 'tools', 6),
  ('CVV Methods', 'methods', 1),
  ('Cashout Methods', 'methods', 2),
  ('Carding Tutorials', 'methods', 3),
  ('Anti-Detection', 'methods', 4),
  ('OPSEC', 'methods', 5),
  ('Beginner Guide', 'guides', 1),
  ('Advanced Techniques', 'guides', 2),
  ('Tool Usage', 'guides', 3),
  ('Safety Tips', 'guides', 4)
ON CONFLICT (name, section) DO NOTHING;

DELETE FROM security_methods;
DELETE FROM security_tools;
DELETE FROM security_guides;

INSERT INTO security_methods (title, category, description, difficulty, effectiveness, requirements) VALUES
  ('BIN Matching', 'CVV Methods', 'Understanding Bank Identification Numbers and how they relate to card properties. Learn to identify card types, issuing banks, and geographic regions from BIN data.', 'Beginner', 'High', 'BIN database access, Basic knowledge'),
  ('Live Card Verification', 'CVV Methods', 'Techniques for validating card data before attempting transactions. Includes understanding of AVS, CVV validation, and common checker responses.', 'Intermediate', 'Very High', 'CC Checker tool, Proxy setup'),
  ('Cashout Basics', 'Cashout Methods', 'Fundamental approaches to converting card data into usable funds. Overview of different cashout channels and their risk profiles.', 'Intermediate', 'Medium', 'Clean drops, Virtual environment'),
  ('Physical Carding', 'Cashout Methods', 'In-store carding techniques using cloned cards or mobile payment integration. Understanding POS systems and their vulnerabilities.', 'Advanced', 'High', 'MSR encoder, Blank cards, Clean identity'),
  ('OPSEC Fundamentals', 'OPSEC', 'Operational security basics for maintaining anonymity. Covers VM setup, browser fingerprinting, and communication security.', 'Beginner', 'Very High', 'Virtual machine, VPN, Secure browser'),
  ('Anti-Fraud Bypass', 'Anti-Detection', 'Techniques for avoiding automated fraud detection systems. Understanding velocity checks, device fingerprinting, and behavioral analysis.', 'Advanced', 'High', 'Antidetect browser, Residential proxies'),
  ('Drop Setup', 'Cashout Methods', 'Setting up receiving addresses and accounts for physical goods or financial instruments. Risk mitigation and chain management.', 'Intermediate', 'Medium', 'Clean identity documents, Secure communication'),
  ('Fullz Utilization', 'Carding Tutorials', 'Maximizing value from full identity packages. Account takeover, synthetic identity creation, and credit applications.', 'Advanced', 'Very High', 'Quality fullz, OPSEC setup, Multiple tools')
ON CONFLICT DO NOTHING;

INSERT INTO security_tools (name, category, description, use_case, price, download_url) VALUES
  ('Luhn Validator', 'CC Generator', 'Validate credit card numbers using the Luhn algorithm. Essential for verifying generated or obtained card numbers before use.', 'Validating card number checksums', 'Free', NULL),
  ('BIN Database', 'BIN Lookup', 'Comprehensive database of Bank Identification Numbers with issuer details, card type, and country information.', 'Identifying card properties from first 6 digits', 'Free', NULL),
  ('Antidetect Browser', 'Anti-Detection', 'Browser with configurable fingerprinting to avoid detection. Manage multiple profiles with unique browser fingerprints.', 'Creating unique browser identities', '$100/month', NULL),
  ('Residential Proxy Network', 'Anti-Detection', 'Pool of residential IP addresses for appearing as legitimate users. Essential for avoiding IP-based fraud detection.', 'Masking true IP address with residential IPs', '$50/month', NULL),
  ('CC Checker Pro', 'CC Checker', 'Advanced card validation tool supporting multiple payment gateways. Provides detailed response codes and card status.', 'Validating cards before use', '$25/month', NULL),
  ('Virtual Card Generator', 'Virtual Cards', 'Generate virtual card numbers for testing and privacy. Some services allow funding for actual transactions.', 'Creating disposable card numbers', 'Varies', NULL),
  ('MSR Reader/Writer', 'Dumps', 'Hardware for reading and writing magnetic stripe data. Essential for physical card operations.', 'Cloning cards from dump data', '$200-500', NULL),
  ('Socks5 Manager', 'Anti-Detection', 'Manage and rotate SOCKS5 proxies efficiently. Supports geo-targeting and automatic switching.', 'Managing proxy connections', 'Free', NULL)
ON CONFLICT DO NOTHING;

INSERT INTO security_guides (title, category, content, difficulty, read_time) VALUES
  ('Getting Started with Carding', 'Beginner Guide', E'Introduction to the carding ecosystem and fundamental concepts.\n\nKey Topics:\n1. Understanding Card Data Types\n   - CVV/CVV2: Card data with security code\n   - Dumps: Magnetic stripe data (Track 1 & 2)\n   - Fullz: Complete identity packages\n\n2. Essential Tools\n   - Antidetect browser for fingerprint management\n   - Proxy services (residential preferred)\n   - Card checkers for validation\n   - BIN lookup databases\n\n3. Basic OPSEC\n   - Never use personal devices\n   - Separate virtual machines\n   - Encrypted communications\n   - Clean operational identity\n\n4. Starting Points\n   - Begin with lower-risk activities\n   - Build reputation in trusted communities\n   - Invest in quality tools\n   - Learn from experienced carders\n\nRemember: Success requires patience, learning, and proper security measures.', 'Beginner', 15),
  ('Understanding BINs and Card Types', 'Tool Usage', E'Deep dive into Bank Identification Numbers and their significance.\n\nBIN Structure:\n- First 6 digits identify the issuing institution\n- Reveals card type (Visa, MC, Amex, etc.)\n- Indicates card level (Classic, Gold, Platinum, Business)\n- Shows issuing country and bank\n\nWhy BINs Matter:\n1. Card Quality Assessment\n   - Business/Corporate cards often have higher limits\n   - Premium cards may have better success rates\n   - Regional considerations for fraud detection\n\n2. Matching Strategies\n   - Match BIN country with billing address\n   - Consider card type for purchase profile\n   - Avoid heavily monitored BIN ranges\n\n3. BIN Intelligence\n   - Track successful BINs over time\n   - Note which BINs work with which merchants\n   - Understand issuer fraud detection levels\n\nPro Tips:\n- Build a personal BIN database\n- Test new BINs with small amounts first\n- Stay updated on BIN list changes', 'Intermediate', 12),
  ('Advanced Anti-Detection Techniques', 'Advanced Techniques', E'Comprehensive guide to avoiding fraud detection systems.\n\nBrowser Fingerprinting:\n1. Canvas fingerprinting mitigation\n2. WebGL hash management\n3. Audio context spoofing\n4. Font enumeration control\n5. Plugin/extension hiding\n\nBehavioral Analysis:\n- Mouse movement patterns\n- Typing rhythm consistency\n- Session duration norms\n- Navigation patterns\n- Time zone consistency\n\nDevice Fingerprinting:\n- Hardware hash rotation\n- Screen resolution matching\n- Language and locale settings\n- Battery API spoofing\n\nNetwork Security:\n- Residential proxy selection\n- Geographic IP matching\n- DNS leak prevention\n- WebRTC disabling\n\nSession Management:\n- Cookie persistence strategies\n- Local storage handling\n- Cache management\n- History simulation\n\nAdvanced Considerations:\n- Machine learning-based detection\n- Velocity checks and limits\n- Cross-merchant tracking\n- Device reputation systems', 'Advanced', 20),
  ('OPSEC Best Practices', 'Safety Tips', E'Essential operational security for carding activities.\n\nDigital Security:\n1. Hardware Isolation\n   - Dedicated devices for operations\n   - No cross-contamination with personal use\n   - Regular hardware rotation\n\n2. Virtual Environment\n   - Whonix or Tails for anonymity\n   - Snapshots before risky operations\n   - Clean VM templates\n\n3. Network Security\n   - VPN over Tor or vice versa\n   - Avoid home network for operations\n   - MAC address randomization\n\n4. Communication Security\n   - End-to-end encrypted messaging\n   - No real identifiers ever\n   - Compartmentalized contacts\n\nPhysical Security:\n- Secure drop locations\n- Chain of custody for goods\n- Cash handling procedures\n- Identity separation\n\nOperational Discipline:\n- Time-based activity patterns\n- Consistent cover stories\n- Documentation destruction\n- Exit strategy planning\n\nCommon Mistakes to Avoid:\n- Mixing personal and operational activities\n- Bragging or oversharing\n- Predictable patterns\n- Poor communication security', 'Intermediate', 18)
ON CONFLICT DO NOTHING;
