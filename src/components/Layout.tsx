import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  isAdmin?: boolean;
}

export function Layout({ children, currentPage, onNavigate, isDark, onThemeToggle, isAdmin = false }: LayoutProps) {
  return (
    <div className="min-h-screen relative">
      <div className="ambient-glow" />
      <div className="ember-particles" />
      <Header
        currentPage={currentPage}
        onNavigate={onNavigate}
        isDark={isDark}
        onThemeToggle={onThemeToggle}
        isAdmin={isAdmin}
      />
      <main className="pt-16 relative z-10">
        {children}
      </main>
    </div>
  );
}
