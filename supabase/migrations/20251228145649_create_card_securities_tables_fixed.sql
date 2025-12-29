/*
  # Create Card Securities Tables

  1. New Tables
    - `security_methods`
      - `id` (uuid, primary key)
      - `title` (text) - Name of the security method
      - `category` (text) - Category (e.g., "Payment Security", "Fraud Prevention", "Encryption")
      - `description` (text) - Detailed description
      - `difficulty` (text) - Implementation difficulty level
      - `effectiveness` (text) - How effective the method is
      - `requirements` (text) - What's needed to implement
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `security_tools`
      - `id` (uuid, primary key)
      - `name` (text) - Tool name
      - `category` (text) - Tool category
      - `description` (text) - What the tool does
      - `use_case` (text) - When to use this tool
      - `price` (text) - Free/Paid/Enterprise
      - `download_url` (text) - Where to get it (optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `security_guides`
      - `id` (uuid, primary key)
      - `title` (text) - Guide title
      - `category` (text) - Guide category
      - `content` (text) - Full guide content
      - `difficulty` (text) - Beginner/Intermediate/Advanced
      - `read_time` (integer) - Estimated read time in minutes
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Allow public read access for users with valid access keys
    - Allow anon users to insert/update/delete (admin check done at application level)
*/

CREATE TABLE IF NOT EXISTS security_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL,
  effectiveness text NOT NULL,
  requirements text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS security_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  use_case text NOT NULL,
  price text NOT NULL DEFAULT 'Free',
  download_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS security_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  content text NOT NULL,
  difficulty text NOT NULL,
  read_time integer DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE security_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view security methods"
  ON security_methods FOR SELECT
  USING (true);

CREATE POLICY "Anon can manage security methods"
  ON security_methods FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view security tools"
  ON security_tools FOR SELECT
  USING (true);

CREATE POLICY "Anon can manage security tools"
  ON security_tools FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view security guides"
  ON security_guides FOR SELECT
  USING (true);

CREATE POLICY "Anon can manage security guides"
  ON security_guides FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

INSERT INTO security_methods (title, category, description, difficulty, effectiveness, requirements) VALUES
  ('PCI DSS Compliance', 'Payment Security', 'Payment Card Industry Data Security Standard - A comprehensive set of security standards designed to ensure that all companies that accept, process, store or transmit credit card information maintain a secure environment.', 'Advanced', 'Very High', 'Qualified Security Assessor, Infrastructure changes, Policy documentation'),
  ('Tokenization', 'Payment Security', 'Replace sensitive card data with unique identification symbols (tokens) that retain essential information without compromising security. Tokens are meaningless outside the specific system.', 'Intermediate', 'Very High', 'Payment gateway integration, Token vault system'),
  ('3D Secure 2.0', 'Fraud Prevention', 'Enhanced authentication protocol for online card transactions. Adds an extra layer of security by requiring cardholders to verify their identity through biometrics, passwords, or SMS codes.', 'Intermediate', 'High', 'Payment processor support, Customer authentication system'),
  ('End-to-End Encryption', 'Encryption', 'Encrypt card data from the point of entry (card reader/form) until it reaches the payment processor. Data remains encrypted throughout transmission.', 'Advanced', 'Very High', 'Hardware security modules, SSL/TLS certificates, Encryption keys management'),
  ('Address Verification Service (AVS)', 'Fraud Prevention', 'Verify the billing address provided by the customer matches the address on file with the card issuer. Reduces fraud from stolen cards.', 'Beginner', 'Medium', 'Payment gateway with AVS support'),
  ('CVV Verification', 'Fraud Prevention', 'Require the Card Verification Value (CVV) - the 3 or 4 digit code on the card - to verify the customer has physical possession of the card.', 'Beginner', 'Medium', 'Payment form with CVV field'),
  ('Fraud Scoring Systems', 'Fraud Prevention', 'Use machine learning and rules-based systems to assign risk scores to transactions based on multiple factors like location, purchase patterns, and device fingerprints.', 'Advanced', 'High', 'Fraud detection service, Transaction data analytics'),
  ('Secure Payment Forms', 'Payment Security', 'Implement security best practices for payment forms: HTTPS, no card data storage, input validation, security headers, Content Security Policy.', 'Intermediate', 'High', 'SSL certificate, Secure hosting, Payment gateway SDK');

INSERT INTO security_tools (name, category, description, use_case, price, download_url) VALUES
  ('Stripe Elements', 'Payment Processing', 'Pre-built UI components for secure payment forms. Handles PCI compliance automatically by never exposing card data to your servers.', 'Building secure checkout flows without PCI compliance burden', 'Free', 'https://stripe.com/payments/elements'),
  ('Braintree SDK', 'Payment Processing', 'PayPal-owned payment solution with built-in fraud protection, tokenization, and multiple payment method support.', 'Enterprise payment processing with advanced fraud tools', 'Transaction fees apply', 'https://www.braintreepayments.com/'),
  ('Sift', 'Fraud Detection', 'Machine learning-based fraud detection platform that analyzes user behavior, transaction patterns, and device data to identify fraudulent activity in real-time.', 'Detecting payment fraud, account takeovers, and abuse', 'Enterprise pricing', 'https://sift.com/'),
  ('Kount', 'Fraud Prevention', 'AI-powered fraud prevention platform with identity verification, device fingerprinting, and risk assessment capabilities.', 'E-commerce fraud prevention and risk management', 'Enterprise pricing', 'https://kount.com/'),
  ('Forter', 'Fraud Detection', 'Real-time fraud prevention using behavioral analysis and machine learning. Provides instant approve/decline decisions.', 'High-volume e-commerce fraud prevention', 'Enterprise pricing', 'https://www.forter.com/'),
  ('Adyen', 'Payment Processing', 'Global payment platform with built-in fraud detection, risk management, and support for 250+ payment methods worldwide.', 'International payment processing with fraud protection', 'Transaction fees apply', 'https://www.adyen.com/'),
  ('Spreedly', 'Payment Orchestration', 'Payment gateway agnostic platform that tokenizes payment methods and routes transactions to multiple processors.', 'Managing multiple payment gateways with unified tokenization', 'Subscription + transaction fees', 'https://www.spreedly.com/'),
  ('Riskified', 'Fraud Prevention', 'Chargeback guarantee fraud prevention service using machine learning and manual review to approve more legitimate orders.', 'Reducing false declines while preventing fraud', 'Enterprise pricing', 'https://www.riskified.com/');

INSERT INTO security_guides (title, category, content, difficulty, read_time) VALUES
  ('Payment Security Fundamentals', 'Getting Started', 'Understanding payment security starts with the principle of "never touch card data". Modern payment systems use tokenization and encryption to ensure sensitive card information never reaches your servers.

Key Concepts:
1. PCI DSS - The security standard all merchants must follow
2. Tokenization - Replacing card data with secure tokens
3. Encryption - Protecting data in transit and at rest
4. Strong Customer Authentication (SCA) - Verifying cardholder identity

Best Practices:
- Use payment service providers (PSPs) that handle PCI compliance
- Implement HTTPS everywhere
- Never log or store full card numbers
- Use CVV and AVS for additional verification
- Monitor transactions for suspicious patterns
- Keep payment forms simple and trustworthy
- Implement proper session management
- Use fraud detection tools

By following these fundamentals, you can build secure payment systems that protect both your business and your customers.', 'Beginner', 10),
  
  ('Implementing Tokenization', 'Payment Security', 'Tokenization is the process of replacing sensitive card data with non-sensitive equivalents (tokens) that have no exploitable value.

How It Works:
1. Customer enters card details on your payment form
2. Card data is sent directly to payment processor (not your server)
3. Processor validates card and returns a unique token
4. Your system stores only the token, not card data
5. For future charges, send the token to the processor

Implementation Steps:

Step 1: Choose a Payment Processor
Select a processor that supports tokenization (Stripe, Braintree, Adyen, etc.)

Step 2: Integrate Client-Side SDK
Use the processor''s JavaScript SDK to create secure payment forms that capture card data without it touching your servers.

Step 3: Handle Token Response
Receive the token from the processor and store it securely in your database associated with the customer.

Step 4: Process Payments
When charging the customer, send the token (not card details) to process the payment.

Security Benefits:
- Reduced PCI DSS scope
- No sensitive data exposure
- Reduced risk from data breaches
- Simplified compliance requirements

Tokenization is the foundation of modern payment security and should be used in all payment implementations.', 'Intermediate', 15),
  
  ('Fraud Detection Strategies', 'Fraud Prevention', 'Detecting and preventing payment fraud requires a multi-layered approach combining automated systems and manual review.

Common Fraud Indicators:
- Multiple failed payment attempts
- Mismatched billing/shipping addresses
- High-value first-time purchases
- Rapid succession of orders
- Unusual shipping locations
- VPN or proxy usage
- Device fingerprint anomalies
- Velocity checks (multiple cards from same IP)

Fraud Prevention Layers:

1. Basic Verification
- CVV validation
- AVS (Address Verification Service)
- Email verification
- Phone number validation

2. Risk Scoring
- Transaction amount vs customer history
- Geographic risk assessment
- Device fingerprinting
- Behavioral analysis

3. Machine Learning
- Pattern recognition across transactions
- Anomaly detection
- Real-time risk scoring
- Continuous model improvement

4. Manual Review
- High-risk transaction review
- Customer contact verification
- Document verification

5. Post-Transaction Monitoring
- Chargeback tracking
- Refund pattern analysis
- Account behavior monitoring

Implementing Rules:
Start with simple rules and gradually add complexity:
- Block orders from high-risk countries
- Limit first-purchase amounts
- Require verification for large orders
- Flag multiple failed attempts
- Review mismatched billing/shipping

Balancing Security and Friction:
Too much security creates friction and abandonment. Too little creates fraud exposure. Use risk-based approaches to apply additional verification only when needed.

Key Metrics:
- False positive rate (legitimate orders declined)
- False negative rate (fraudulent orders approved)
- Chargeback rate
- Manual review volume
- Customer friction impact

Effective fraud prevention protects revenue while maintaining good customer experience.', 'Advanced', 20),
  
  ('Secure Checkout Implementation', 'Payment Security', 'Building a secure checkout experience requires attention to multiple security layers from the user interface to the backend processing.

Frontend Security:

1. Use HTTPS Everywhere
- Ensure entire site uses SSL/TLS
- Use HSTS headers
- Regular certificate renewal

2. Payment Form Security
- Never store card data in localStorage/sessionStorage
- Use payment processor''s hosted fields or iframes
- Implement Content Security Policy (CSP)
- Disable autocomplete on sensitive fields
- Clear form data after submission

3. Input Validation
- Client-side validation for user experience
- Format validation (card number, CVV, expiry)
- Luhn algorithm for card number validation
- Never rely solely on client-side validation

4. Session Security
- Implement secure session management
- Use HTTP-only, secure cookies
- Implement CSRF protection
- Session timeout for inactive users

Backend Security:

1. Never Handle Raw Card Data
- Use tokenization from day one
- If you must handle card data, comply with PCI DSS Level 1
- Use payment processor SDKs

2. API Security
- Rate limiting on payment endpoints
- Authentication and authorization
- Request validation and sanitization
- Idempotency keys for duplicate prevention

3. Logging and Monitoring
- Log all payment attempts (without card data)
- Monitor for suspicious patterns
- Alert on unusual activity
- Never log sensitive data (full card numbers, CVV)

4. Error Handling
- Generic error messages to users
- Detailed logging for debugging
- Prevent information leakage

Payment Flow:
1. Customer enters payment details
2. Client-side validation for UX
3. Card data sent to payment processor
4. Receive token from processor
5. Send token to your backend
6. Backend validates and processes
7. Return clear result to customer

Compliance Checklist:
- HTTPS on all pages
- PCI DSS compliant (or using compliant PSP)
- No card data storage
- Tokenization implemented
- CVV and AVS verification
- Fraud detection in place
- Security headers configured
- Regular security audits
- Incident response plan

Testing:
- Test with processor''s test cards
- Verify error handling
- Test fraud detection rules
- Security penetration testing
- Load testing for payment flows

A secure checkout protects your customers, your business, and maintains trust in your brand.', 'Intermediate', 18);
