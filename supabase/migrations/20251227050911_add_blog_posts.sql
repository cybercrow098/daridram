/*
  # Add Blog Posts for Daemon Blog

  1. New Data
    - Adding blog posts about underground methods and news
    - Posts cover topics like OPSEC, anonymity, crypto, and security research

  2. Notes
    - These are sample posts for the Daemon Blog section
    - All posts are marked as published
*/

INSERT INTO posts (title, slug, content, tags, is_published, created_at) VALUES
  (
    'The Art of Digital Invisibility',
    'art-of-digital-invisibility',
    'In an age of persistent surveillance, true anonymity requires more than a VPN subscription. It demands a complete restructuring of how you interact with digital systems.

The first principle: compartmentalization. Every identity exists in isolation. Hardware, software, network paths—each layer must be independent. A single cross-contamination event can unravel years of careful operational security.

Consider your threat model. Nation-state actors operate differently than corporate surveillance or opportunistic attackers. Your countermeasures should match your adversaries.

Key practices:
- Hardware isolation between identities
- Tor over VPN is not always the answer
- Timing analysis defeats most anonymity networks
- Physical location matters more than you think

The goal is not perfection. The goal is raising the cost of surveillance beyond what your adversaries are willing to spend.',
    ARRAY['opsec', 'anonymity', 'tradecraft'],
    true,
    now() - interval '1 day'
  ),
  (
    'Chain Analysis Countermeasures',
    'chain-analysis-countermeasures',
    'Blockchain transparency is a double-edged sword. While it enables trustless verification, it also creates permanent records that sophisticated analysis can de-anonymize.

Modern chain analysis combines:
- Heuristic clustering of addresses
- Exchange KYC correlation
- Timing analysis of transactions
- Cross-chain tracking
- Off-chain data integration

Countermeasures require understanding these techniques. Atomic swaps, coinjoins, and mixing services each have tradeoffs. Lightning Network provides privacy but introduces liquidity constraints.

The most effective approach: never let coins touch addresses that can be linked to identity. Fresh wallets, hardware isolation, and careful transaction timing remain fundamental.

Remember: the chain never forgets. Every transaction is permanent. Plan accordingly.',
    ARRAY['crypto', 'privacy', 'blockchain'],
    true,
    now() - interval '3 days'
  ),
  (
    'Dead Drops in the Digital Age',
    'dead-drops-digital-age',
    'The concept of dead drops has evolved. Physical dead drops—leaving data in hidden locations—now have digital equivalents that provide similar security properties.

Steganography allows embedding data within innocent-looking files. Modern algorithms can hide encrypted payloads in images, audio, and video with statistical undetectability.

Distributed storage systems create natural dead drops. IPFS content addressing means data can be retrieved without knowing the original uploader. Combined with encryption, this provides powerful plausible deniability.

Timing-based dead drops use scheduled posts, delayed emails, or blockchain transactions as coordination mechanisms. The parties never communicate directly.

Key considerations:
- Avoid patterns in timing or location
- Use one-time encryption keys
- Establish fallback protocols
- Verify integrity independently

The best dead drop is one that looks like normal activity to outside observers.',
    ARRAY['tradecraft', 'steganography', 'communication'],
    true,
    now() - interval '6 days'
  ),
  (
    'Hardware Security Beyond TPM',
    'hardware-security-beyond-tpm',
    'Trusted Platform Modules provide a baseline, but sophisticated attackers operate below the OS level. Understanding hardware attack surfaces is essential for serious security.

Supply chain attacks remain the highest-impact vector. Firmware implants can survive OS reinstallation, disk replacement, and even some hardware changes. Air-gapped machines are not immune if the hardware itself is compromised.

Side-channel attacks extract secrets through power analysis, electromagnetic emissions, and acoustic signatures. Your encryption key might be leaking through your laptop''s LED.

Countermeasures:
- Verify hardware provenance when possible
- Use dedicated machines for sensitive operations
- Consider open-source hardware designs
- Monitor for unexpected RF emissions
- Physical inspection protocols

The paranoid approach: assume any hardware you didn''t personally assemble is potentially compromised. Plan your operations accordingly.',
    ARRAY['hardware', 'security', 'supply-chain'],
    true,
    now() - interval '9 days'
  ),
  (
    'The Metadata Problem',
    'the-metadata-problem',
    'Content encryption is solved. Metadata protection remains an open problem.

Who you communicate with, when, how often, from where—this metadata often reveals more than message content. Intelligence agencies have stated publicly that they "kill people based on metadata."

Current limitations:
- Tor hides content but leaks timing
- Signal protects messages but not contact graphs
- Email headers survive content encryption
- Mobile devices constantly leak location

Emerging solutions show promise. Mixnets with cover traffic, PIR-based communication, and decentralized systems with built-in metadata protection are being developed.

For now, operational discipline remains the primary defense. Compartmentalize communications. Use cover traffic. Vary timing patterns. Assume the network is always watched.

The metadata problem won''t be solved by technology alone. It requires changing how we think about communication itself.',
    ARRAY['privacy', 'metadata', 'surveillance'],
    true,
    now() - interval '14 days'
  ),
  (
    'Zero-Day Economics',
    'zero-day-economics',
    'The vulnerability market operates in shadows, but its economics are becoming clearer. Understanding these dynamics is essential for both offense and defense.

Current market tiers:
- iOS full chain: $2M+
- Android full chain: $2.5M+
- Windows RCE: $1M+
- Browser zero-days: $500K-1M

Prices continue rising as platforms improve security. The economics favor well-resourced actors—nation-states and their contractors dominate the high end.

For defenders, this has implications. Your adversaries may have capabilities you cannot detect. Defense in depth becomes critical when you cannot trust any single layer.

The bug bounty market provides legal alternatives but pays orders of magnitude less. This creates incentives that security researchers must navigate carefully.

The market is evolving. Exploit-as-a-service models are emerging. Access brokers specialize in initial footholds. The ecosystem grows more sophisticated each year.',
    ARRAY['exploits', 'security', 'market'],
    true,
    now() - interval '20 days'
  )
ON CONFLICT (slug) DO NOTHING;