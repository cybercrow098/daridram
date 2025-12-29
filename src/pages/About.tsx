import { Shield, Eye, Fingerprint, Server, Info } from 'lucide-react';
import { DaemonLogo } from '../components/DaemonLogo';

const PRINCIPLES = [
  {
    icon: Shield,
    title: 'Zero Trust',
    description: 'Every request is verified. No implicit trust based on network location or prior access.',
  },
  {
    icon: Eye,
    title: 'Minimal Footprint',
    description: 'No tracking. No analytics. No cookies. Presence leaves no trace.',
  },
  {
    icon: Fingerprint,
    title: 'Cryptographic Verification',
    description: 'Identity and integrity verified through cryptographic proofs, not credentials.',
  },
  {
    icon: Server,
    title: 'Decentralized Architecture',
    description: 'Distributed systems with no single point of failure or control.',
  },
];

interface AboutProps {
  isDark?: boolean;
}

export function About({ isDark = true }: AboutProps) {
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
              <Info className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <h1 className="logo-text text-xl tracking-[0.2em] text-gradient">
              About
            </h1>
          </div>
          <p
            className="font-sans text-sm max-w-2xl leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            DAEMONCROW operates as a sealed terminal for research, tools, and secure communications.
            Access is granted exclusively through verified invitation keys.
          </p>
        </div>

        <div className="section-divider mb-12" />

        <div className="mb-14 animate-slide-up">
          <h2
            className="font-mono text-[10px] tracking-[0.15em] uppercase mb-6"
            style={{ color: 'var(--text-subtle)' }}
          >
            Core Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRINCIPLES.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <div
                  key={principle.title}
                  className="card card-hover animate-slide-up"
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
                        style={{ color: 'var(--accent-primary)' }}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <h3
                        className="font-mono text-sm tracking-wider mb-2 font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {principle.title}
                      </h3>
                      <p
                        className="font-sans text-sm leading-relaxed"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <h2
            className="font-mono text-[10px] tracking-[0.15em] uppercase mb-6"
            style={{ color: 'var(--text-subtle)' }}
          >
            Technical Specifications
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: 'Encryption', value: 'AES-256-GCM' },
              { label: 'Key Exchange', value: 'X25519' },
              { label: 'Hashing', value: 'BLAKE2b' },
              { label: 'Protocol', value: 'STP v2.4' },
            ].map((spec) => (
              <div key={spec.label}>
                <h3
                  className="font-mono text-[10px] tracking-wider uppercase mb-2"
                  style={{ color: 'var(--text-subtle)' }}
                >
                  {spec.label}
                </h3>
                <p
                  className="font-mono text-sm font-medium"
                  style={{ color: 'var(--accent-tertiary)' }}
                >
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-14 pt-8 border-t text-center animate-fade-in"
          style={{ borderColor: 'var(--border-subtle)', animationDelay: '0.3s' }}
        >
          <div className="flex justify-center mb-6">
            <DaemonLogo size="md" showText={true} />
          </div>
          <p
            className="font-mono text-[10px] tracking-wider uppercase mb-2"
            style={{ color: 'var(--text-subtle)' }}
          >
            Site Fingerprint
          </p>
          <p
            className="font-mono text-xs break-all max-w-md mx-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            a7d4f2e8b1c9d6f3a2e5b8c1d4f7a9e2b5c8d1f4
          </p>
        </div>
      </section>
    </div>
  );
}
