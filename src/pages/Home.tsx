import { useState } from 'react';
import { Skull, Coffee, Moon, Flame, Sparkles, ArrowRight, Eye, Bird, Briefcase, MessageSquare } from 'lucide-react';
import { DaemonLogo } from '../components/DaemonLogo';

interface HomeProps {
  onNavigate: (page: string) => void;
  isDark?: boolean;
}

const CONFESSIONS = [
  {
    id: 1,
    title: '"I thought my password was uncrackable"',
    subtitle: '- Everyone, apparently',
    description: 'Spoiler: It was their dog\'s name followed by 123. We have a whole section dedicated to why this keeps happening.',
    cta: 'See the evidence',
    page: 'combo-cracking',
    icon: Coffee,
    color: 'var(--accent-warm)',
    bg: 'rgba(251, 146, 60, 0.1)',
  },
  {
    id: 2,
    title: '"Nobody would target MY company"',
    subtitle: '- Famous last words',
    description: 'Turns out, automated scanners don\'t discriminate. They have very poor taste, actually. They\'ll knock on any door.',
    cta: 'Browse the unfortunate',
    page: 'database',
    icon: Skull,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
  },
  {
    id: 3,
    title: '"Security through obscurity works"',
    subtitle: '- The eternal optimist',
    description: 'Narrator: It did not work. But it did make for some entertaining CVE writeups that read like comedy scripts.',
    cta: 'Read the chronicles',
    page: 'exploits',
    icon: Moon,
    color: 'var(--accent-primary)',
    bg: 'rgba(220, 38, 38, 0.1)',
  },
];

const WISDOM = [
  {
    quote: 'In the digital realm, your data is never truly yours - it\'s just on loan until someone asks nicely.',
    attribution: 'Ancient Proverb (2024)',
    page: 'stealers',
    linkText: 'Study the asking techniques',
    icon: Eye,
  },
  {
    quote: 'A tool is only as dangerous as the boredom level of its operator at 3 AM.',
    attribution: 'DaemonLabs R&D Philosophy',
    page: 'daemongrounds',
    linkText: 'Visit the workshop',
    icon: Briefcase,
  },
  {
    quote: 'Behind every great breach is a developer who said "we\'ll add auth later."',
    attribution: 'The Collected Wisdom of Hindsight',
    page: 'blog',
    linkText: 'Read the tales',
    icon: MessageSquare,
  },
];

export function Home({ onNavigate, isDark = true }: HomeProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredWisdom, setHoveredWisdom] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(220, 38, 38, 0.15) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 60%)',
          }}
        />

        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 relative">
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <DaemonLogo size="xl" showText={false} />
                <div
                  className="absolute inset-0 blur-2xl opacity-40"
                  style={{ background: 'var(--accent-primary)' }}
                />
              </div>
            </div>

            <h1 className="logo-text text-2xl xs:text-3xl sm:text-4xl md:text-5xl tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] text-gradient mb-6">
              Daemoncrow
            </h1>

            <p
              className="font-mono text-sm max-w-2xl mx-auto leading-relaxed mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              Where digital optimism comes to face uncomfortable realities.
            </p>
            <p
              className="font-sans text-xs max-w-xl mx-auto"
              style={{ color: 'var(--text-subtle)' }}
            >
              Documenting the eternal dance between those who build walls and those who find the unlocked window.
            </p>
          </div>

          <div className="flex justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div
              className="inline-flex items-center gap-3 px-5 py-3 rounded-full"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Bird className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                The crow sees all. The crow judges silently.
              </span>
              <div className="pulse-dot" />
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-16"
        style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12 animate-slide-up">
            <h2
              className="font-mono text-xs tracking-[0.3em] uppercase mb-3"
              style={{ color: 'var(--accent-primary)' }}
            >
              Overheard in the Wild
            </h2>
            <p
              className="font-sans text-2xl font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Confessions of the Compromised
            </p>
            <p
              className="font-sans text-sm"
              style={{ color: 'var(--text-subtle)' }}
            >
              Real quotes from people moments before everything went sideways
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONFESSIONS.map((confession, index) => {
              const Icon = confession.icon;
              const isHovered = hoveredCard === confession.id;
              return (
                <button
                  key={confession.id}
                  onClick={() => onNavigate(confession.page)}
                  onMouseEnter={() => setHoveredCard(confession.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="text-left p-6 rounded-xl transition-all duration-300 animate-slide-up group"
                  style={{
                    animationDelay: `${0.1 + index * 0.1}s`,
                    background: isHovered ? confession.bg : 'var(--bg-primary)',
                    border: `1px solid ${isHovered ? confession.color : 'var(--border-subtle)'}`,
                    transform: isHovered ? 'translateY(-4px)' : 'none',
                    boxShadow: isHovered ? `0 20px 40px ${confession.bg}` : 'none',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center"
                    style={{
                      background: confession.bg,
                      border: `1px solid ${confession.color}40`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: confession.color }} />
                  </div>
                  <h3
                    className="font-mono text-sm font-medium mb-1"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {confession.title}
                  </h3>
                  <p
                    className="font-mono text-[10px] tracking-wider uppercase mb-3"
                    style={{ color: confession.color }}
                  >
                    {confession.subtitle}
                  </p>
                  <p
                    className="font-sans text-xs leading-relaxed mb-4"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {confession.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-[10px] tracking-wider uppercase"
                      style={{ color: confession.color }}
                    >
                      {confession.cta}
                    </span>
                    <ArrowRight
                      className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                      style={{ color: confession.color }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12 animate-slide-up">
            <h2
              className="font-mono text-xs tracking-[0.3em] uppercase mb-3"
              style={{ color: 'var(--accent-tertiary)' }}
            >
              Words of Dubious Wisdom
            </h2>
            <p
              className="font-sans text-2xl font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Truths Nobody Asked For
            </p>
          </div>

          <div className="space-y-4">
            {WISDOM.map((item, index) => {
              const Icon = item.icon;
              const isHovered = hoveredWisdom === index;
              return (
                <button
                  key={index}
                  onClick={() => onNavigate(item.page)}
                  onMouseEnter={() => setHoveredWisdom(index)}
                  onMouseLeave={() => setHoveredWisdom(null)}
                  className="w-full text-left p-6 rounded-xl transition-all duration-300 group animate-slide-up"
                  style={{
                    animationDelay: `${0.1 + index * 0.1}s`,
                    background: isHovered ? 'rgba(255, 71, 87, 0.05)' : 'var(--bg-secondary)',
                    border: `1px solid ${isHovered ? 'var(--accent-tertiary)' : 'var(--border-subtle)'}`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="p-2.5 rounded-lg shrink-0 transition-colors"
                      style={{
                        background: isHovered ? 'rgba(255, 71, 87, 0.1)' : 'var(--bg-primary)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <Icon
                        className="w-5 h-5 transition-colors"
                        style={{ color: isHovered ? 'var(--accent-tertiary)' : 'var(--text-subtle)' }}
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className="font-sans text-sm leading-relaxed mb-2 italic"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        "{item.quote}"
                      </p>
                      <div className="flex items-center justify-between">
                        <p
                          className="font-mono text-[10px] tracking-wider"
                          style={{ color: 'var(--text-subtle)' }}
                        >
                          - {item.attribution}
                        </p>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span
                            className="font-mono text-[10px] tracking-wider uppercase"
                            style={{ color: 'var(--accent-tertiary)' }}
                          >
                            {item.linkText}
                          </span>
                          <ArrowRight className="w-3 h-3" style={{ color: 'var(--accent-tertiary)' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div
            className="p-8 rounded-xl animate-slide-up"
            style={{
              background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.08) 0%, rgba(220, 38, 38, 0.02) 100%)',
              border: '1px solid var(--border-accent)',
            }}
          >
            <Flame className="w-8 h-8 mx-auto mb-4" style={{ color: 'var(--accent-primary)' }} />
            <h3
              className="font-mono text-lg tracking-wider mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              "But it was working in production..."
            </h3>
            <p
              className="font-sans text-sm leading-relaxed mb-6"
              style={{ color: 'var(--text-muted)' }}
            >
              Famous last words heard echoing through countless incident response calls.
              <br />
              Here, we document the aftermath for educational purposes and light entertainment.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('about')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs tracking-wider transition-all hover:scale-105"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Who are we?
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs tracking-wider transition-all hover:scale-105"
                style={{
                  background: 'var(--accent-primary)',
                  color: 'white',
                }}
              >
                Make contact
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer
        className="border-t py-10"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <DaemonLogo size="md" showText={true} />
            </div>
            <p
              className="font-mono text-[10px] tracking-wider text-center md:text-left"
              style={{ color: 'var(--text-subtle)' }}
            >
              Remember: In the grand timeline of security, we're all just future case studies.
            </p>
            <div className="flex items-center gap-6">
              <button
                onClick={() => onNavigate('about')}
                className="font-mono text-[10px] tracking-wider uppercase transition-colors hover:opacity-80"
                style={{ color: 'var(--text-subtle)' }}
              >
                About
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="font-mono text-[10px] tracking-wider uppercase transition-colors hover:opacity-80"
                style={{ color: 'var(--text-subtle)' }}
              >
                Contact
              </button>
              <button
                onClick={() => onNavigate('blog')}
                className="font-mono text-[10px] tracking-wider uppercase transition-colors hover:opacity-80"
                style={{ color: 'var(--text-subtle)' }}
              >
                Blog
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
