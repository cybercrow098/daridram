import { useState } from 'react';
import { Sun, Moon, Menu, X, ChevronDown, Crown } from 'lucide-react';
import { DaemonLogo } from './DaemonLogo';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  isAdmin?: boolean;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'exploits', label: 'Exploits' },
  { id: 'stealers', label: 'Stealers' },
  { id: 'combo-cracking', label: 'Combo Cracking' },
  { id: 'carding', label: 'Carding' },
  { id: 'daemongrounds', label: 'DaemonLabs' },
  { id: 'database', label: 'Database' },
  { id: 'blog', label: 'Blog' },
];

const MORE_ITEMS = [
  { id: 'access', label: 'Profile' },
  { id: 'contact', label: 'Contact' },
  { id: 'about', label: 'About' },
];

export function Header({ currentPage, onNavigate, isDark, onThemeToggle, isAdmin = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
    setIsMoreOpen(false);
  };

  const moreItems = isAdmin
    ? [...MORE_ITEMS, { id: 'admin-keys', label: 'Admin Keys' }]
    : MORE_ITEMS;

  const allItems = [...NAV_ITEMS, ...moreItems];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300"
        style={{
          borderColor: 'var(--border-subtle)',
          backgroundColor: isDark ? 'rgba(13, 17, 23, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center group hover:opacity-80 transition-opacity"
          >
            <DaemonLogo size="sm" showText={true} />
          </button>

          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="relative px-3 py-1.5 rounded-md font-mono text-[11px] tracking-[0.1em] uppercase transition-all duration-300"
                style={{
                  color: currentPage === item.id ? 'var(--accent-primary)' : 'var(--text-subtle)',
                }}
              >
                {currentPage === item.id && (
                  <span
                    className="absolute inset-0 rounded-md"
                    style={{
                      background: 'var(--glow-primary)',
                      opacity: 0.15,
                    }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </button>
            ))}

            <div className="relative">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                onBlur={() => setTimeout(() => setIsMoreOpen(false), 150)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md font-mono text-[11px] tracking-[0.1em] uppercase transition-all duration-300"
                style={{
                  color: moreItems.some((i) => i.id === currentPage)
                    ? 'var(--accent-primary)'
                    : 'var(--text-subtle)',
                }}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isMoreOpen && (
                <div
                  className="absolute top-full right-0 mt-2 py-2 rounded-lg min-w-[140px] animate-fade-in"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {moreItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="w-full text-left px-4 py-2 font-mono text-xs tracking-wider transition-colors flex items-center gap-2 hover:bg-[var(--bg-tertiary)]"
                      style={{
                        color: currentPage === item.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                        background: currentPage === item.id ? 'var(--glow-primary)' : 'transparent',
                      }}
                    >
                      {item.id === 'admin-keys' && (
                        <Crown className="w-3 h-3" style={{ color: 'var(--accent-warm)' }} />
                      )}
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-md transition-all duration-300 hover:scale-105"
              style={{
                color: 'var(--text-subtle)',
                background: 'var(--bg-tertiary)',
              }}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5" />
              ) : (
                <Moon className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md transition-all duration-300 hover:scale-105"
              style={{
                color: 'var(--text-subtle)',
                background: 'var(--bg-tertiary)',
              }}
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 pt-14 backdrop-blur-xl animate-fade-in lg:hidden"
          style={{
            background: isDark ? 'rgba(8, 10, 13, 0.98)' : 'rgba(250, 250, 250, 0.98)',
          }}
        >
          <nav className="max-w-6xl mx-auto px-6 py-6">
            <ul className="space-y-1">
              {allItems.map((item, index) => (
                <li
                  key={item.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className="w-full text-left py-3 px-4 rounded-lg font-mono text-sm tracking-[0.1em] uppercase transition-all duration-300 flex items-center justify-between"
                    style={{
                      color: currentPage === item.id ? 'var(--accent-primary)' : 'var(--text-subtle)',
                      background: currentPage === item.id ? 'var(--glow-primary)' : 'transparent',
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {item.id === 'admin-keys' && (
                        <Crown className="w-4 h-4" style={{ color: 'var(--accent-warm)' }} />
                      )}
                      {item.label}
                    </span>
                    {currentPage === item.id && (
                      <div className="pulse-dot" />
                    )}
                  </button>
                </li>
              ))}
            </ul>

            <div
              className="mt-8 pt-6 border-t"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <div className="flex items-center justify-center">
                <DaemonLogo size="md" showText={true} />
              </div>
              <p
                className="text-center mt-4 font-mono text-[10px] tracking-wider uppercase"
                style={{ color: 'var(--text-subtle)' }}
              >
                Sealed Network Access
              </p>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
