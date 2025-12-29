import { useState, useEffect } from 'react';
import { useAccess } from './hooks/useAccess';
import { AccessGate } from './components/AccessGate';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { DaemonLabs } from './pages/DaemonLabs';
import { Database } from './pages/Database';
import { Blog } from './pages/Blog';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { AccessManagement } from './pages/AccessManagement';
import { AdminKeys } from './pages/AdminKeys';
import { Exploits } from './pages/Exploits';
import { Stealers } from './pages/Stealers';
import { ComboCracking } from './pages/ComboCracking';
import { CardSecurities } from './pages/CardSecurities';
import { RefreshCw } from 'lucide-react';

type Page = 'home' | 'database' | 'daemongrounds' | 'blog' | 'contact' | 'about' | 'access' | 'admin-keys' | 'exploits' | 'stealers' | 'combo-cracking' | 'carding';

function App() {
  const { isVerified, isVerifying, error, verifyKey, setError, currentKey, isAdmin, refreshCurrentKey, revokeAccess } = useAccess();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('daemon_theme');
    return stored ? stored === 'dark' : true;
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('daemon_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (isVerified) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isVerified]);

  useEffect(() => {
    if (isVerified && !currentKey) {
      revokeAccess();
    }
  }, [isVerified, currentKey, revokeAccess]);

  const handleNavigate = (page: string) => {
    if (page === currentPage) return;

    if (page === 'admin-keys' && !isAdmin) {
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page as Page);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  };

  const handleThemeToggle = () => {
    setIsDark(!isDark);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} isDark={isDark} />;
      case 'database':
        return <Database isAdmin={isAdmin} />;
      case 'daemongrounds':
        return <DaemonLabs isAdmin={isAdmin} />;
      case 'blog':
        return <Blog isAdmin={isAdmin} />;
      case 'contact':
        return <Contact />;
      case 'about':
        return <About isDark={isDark} />;
      case 'access':
        if (!currentKey) {
          return (
            <div className="min-h-screen flex items-center justify-center">
              <RefreshCw className="w-6 h-6 animate-spin" style={{ color: 'var(--accent-primary)' }} />
            </div>
          );
        }
        return <AccessManagement currentKey={currentKey} onKeyUpdate={refreshCurrentKey} onLogout={revokeAccess} />;
      case 'admin-keys':
        if (!currentKey) {
          return (
            <div className="min-h-screen flex items-center justify-center">
              <RefreshCw className="w-6 h-6 animate-spin" style={{ color: 'var(--accent-primary)' }} />
            </div>
          );
        }
        return isAdmin ? (
          <AdminKeys currentKeyId={currentKey.id} />
        ) : (
          <Home onNavigate={handleNavigate} isDark={isDark} />
        );
      case 'exploits':
        return <Exploits isAdmin={isAdmin} />;
      case 'stealers':
        return <Stealers isAdmin={isAdmin} />;
      case 'combo-cracking':
        return <ComboCracking isAdmin={isAdmin} />;
      case 'carding':
        return <CardSecurities isAdmin={isAdmin} />;
      default:
        return <Home onNavigate={handleNavigate} isDark={isDark} />;
    }
  };

  if (!isVerified) {
    return (
      <AccessGate
        onVerify={verifyKey}
        isVerifying={isVerifying}
        error={error}
        onErrorClear={() => setError(false)}
      />
    );
  }

  return (
    <div
      className={`
        transition-opacity duration-500
        ${showContent ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <Layout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
        isAdmin={isAdmin}
      >
        <div
          className={`
            transition-all duration-300
            ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
          `}
        >
          {renderPage()}
        </div>
      </Layout>
    </div>
  );
}

export default App;
