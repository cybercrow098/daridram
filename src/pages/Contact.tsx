import { Key, Shield, Radio, Clock, Mail } from 'lucide-react';

const CONTACT_VECTORS = [
  {
    id: 'pgp',
    label: 'PGP Fingerprint',
    value: '7A4D 2E8B 1C9D 6F3A 2E5B 8C1D 4F7A 9E2B',
    icon: Key,
    note: 'Preferred for sensitive communications',
    accent: 'var(--accent-primary)',
  },
  {
    id: 'signal',
    label: 'Signal Protocol',
    value: 'Available upon key verification',
    icon: Radio,
    note: 'Request access via PGP',
    accent: 'var(--accent-tertiary)',
  },
  {
    id: 'session',
    label: 'Session ID',
    value: '05a7d4f2e8b1c9d6f3a2e5b8c1d4f7a9e2b5c8d1f4',
    icon: Shield,
    note: 'Onion routing compatible',
    accent: 'var(--accent-warm)',
  },
];

export function Contact() {
  return (
    <div className="min-h-screen">
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12">
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2.5 rounded-lg"
              style={{
                background: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid var(--border-accent)',
              }}
            >
              <Mail className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <h1 className="logo-text text-xl tracking-[0.2em] text-gradient">
              Contact
            </h1>
          </div>
          <p
            className="font-sans text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            Secure channels only. No forms. No tracking.
          </p>
        </div>

        <div className="section-divider mb-10" />

        <div className="grid gap-4 animate-slide-up">
          {CONTACT_VECTORS.map((vector, index) => {
            const Icon = vector.icon;
            return (
              <div
                key={vector.id}
                className="card card-hover"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: vector.accent }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-mono text-[10px] tracking-[0.15em] uppercase mb-2"
                      style={{ color: 'var(--text-subtle)' }}
                    >
                      {vector.label}
                    </h3>
                    <p
                      className="font-mono text-sm break-all mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {vector.value}
                    </p>
                    <p
                      className="font-sans text-xs"
                      style={{ color: 'var(--text-subtle)' }}
                    >
                      {vector.note}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card mt-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-lg"
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Clock
                className="w-4 h-4"
                style={{ color: 'var(--accent-warm)' }}
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h3
                className="font-mono text-[10px] tracking-[0.15em] uppercase mb-1"
                style={{ color: 'var(--text-subtle)' }}
              >
                Response Time
              </h3>
              <p
                className="font-sans text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                Expect 24-72 hours for initial acknowledgment. Verification may extend timeline.
              </p>
            </div>
          </div>
        </div>

        <div
          className="mt-12 pt-8 border-t animate-fade-in"
          style={{ borderColor: 'var(--border-subtle)', animationDelay: '0.3s' }}
        >
          <h2
            className="font-mono text-[10px] tracking-[0.15em] uppercase mb-6"
            style={{ color: 'var(--text-subtle)' }}
          >
            Communication Protocol
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Encrypt all messages with provided PGP key',
              'Include your public key for response',
              'Do not reference specific operations in subject lines',
              'Verify fingerprints before transmitting sensitive data',
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-lg"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
              >
                <span
                  className="font-mono text-xs font-medium"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  0{i + 1}
                </span>
                <span
                  className="font-sans text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
