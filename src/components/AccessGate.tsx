import { useState, useRef, useEffect, useCallback } from 'react';
import { DaemonLogo } from './DaemonLogo';
import { Shield, Lock, Eye, Server, AlertTriangle, CheckCircle, Fingerprint, Wifi, Terminal, Cpu, Radio, Sun, Moon, Send, Zap, Database, Code, Settings, Key, DollarSign, Users, HardDrive, Wrench } from 'lucide-react';

interface AccessGateProps {
  onVerify: (key: string) => Promise<boolean>;
  isVerifying: boolean;
  error: boolean;
  onErrorClear: () => void;
}

const SARCASTIC_FAILURES = [
  "Nice try, script kiddie. That's not even close.",
  "Did you just mash your keyboard and hope for the best?",
  "Error 401: Your hacking skills need an upgrade.",
  "Brute force detected. Just kidding, you're not that sophisticated.",
  "Invalid key. Maybe try 'password123'? Oh wait, that won't work either.",
  "Access denied. The algorithm laughed at your attempt.",
  "That key is about as valid as a $3 bill.",
  "Nope. Not today. Not ever with that key.",
  "Your key has been rejected with extreme prejudice.",
  "Fun fact: Random strings rarely unlock secure systems.",
  "The system has noted your failed attempt. It finds you amusing.",
  "That's not a key, that's a cry for help.",
];

const VERIFICATION_STEPS = [
  { text: 'Initializing secure handshake', icon: Wifi },
  { text: 'Validating key format', icon: Terminal },
  { text: 'Checking against database', icon: Server },
  { text: 'Verifying permissions', icon: Shield },
  { text: 'Establishing session', icon: Lock },
];

const TOOLS = [
  { icon: Code, label: 'Proprietary checkers & verification tools' },
  { icon: Zap, label: 'In-house crypto utilities & libraries' },
  { icon: Settings, label: 'Internal automation & analysis systems' },
  { icon: Wrench, label: 'Private utilities under continuous development' },
];

const SECURITY_INDICATORS = [
  { icon: Lock, label: 'Encrypted Sessions' },
  { icon: Cpu, label: 'Isolated Execution' },
  { icon: Shield, label: 'Zero-Trust Model' },
  { icon: Key, label: 'Session Authorization' },
];

export function AccessGate({ onVerify, isVerifying, error, onErrorClear }: AccessGateProps) {
  const [key, setKey] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationStep, setVerificationStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [sectionsVisible, setSectionsVisible] = useState<boolean[]>([false, false, false, false, false, false]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (pageLoaded) {
      sectionsVisible.forEach((_, i) => {
        setTimeout(() => {
          setSectionsVisible(prev => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, 400 + i * 200);
      });
    }
  }, [pageLoaded]);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (error) {
      setShowError(true);
      setErrorMessage(SARCASTIC_FAILURES[Math.floor(Math.random() * SARCASTIC_FAILURES.length)]);
      const timer = setTimeout(() => {
        setShowError(false);
        setErrorMessage('');
        onErrorClear();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, onErrorClear]);

  useEffect(() => {
    if (isVerifying) {
      setVerificationStep(0);
      const interval = setInterval(() => {
        setVerificationStep(prev => {
          if (prev < VERIFICATION_STEPS.length - 1) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [isVerifying]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim() && !isVerifying) {
      const success = await onVerify(key);
      if (success) {
        setShowSuccess(true);
      }
    }
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 32) {
      setKey(value);
    }
  };

  const getCharAnimation = useCallback((index: number) => {
    if (showError) {
      return { animationDelay: `${index * 0.01}s` };
    }
    return {};
  }, [showError]);

  const isValidLength = key.length >= 24;
  const canSubmit = isValidLength && !isVerifying;

  return (
    <div className={`gate-page ${isDark ? 'gate-dark' : 'gate-light'}`}>
      <div className="gate-bg-noise" />
      <div className="gate-bg-gradient-1" />
      <div className="gate-bg-gradient-2" />
      <div className="gate-bg-vignette" />
      <div className="gate-bg-grid" />
      <div className="gate-orb gate-orb-1" />
      <div className="gate-orb gate-orb-2" />
      <div className="gate-orb gate-orb-3" />

      <button
        onClick={() => setIsDark(!isDark)}
        className="gate-theme-toggle"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <div className="gate-main">
        <div className={`gate-hero ${pageLoaded ? 'gate-visible' : ''}`}>
          <div className="gate-logo-glow" />
          <div className={`gate-logo-wrap ${showSuccess ? 'gate-success-ring' : ''}`}>
            <DaemonLogo size="xl" showText={false} />
          </div>

          <h1 className="gate-brand">Daemoncrow</h1>

          <div className="gate-tagline">
            <span className="gate-tagline-line" />
            <span className="gate-tagline-text">Private Network Gateway</span>
            <span className="gate-tagline-line" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className={`gate-access-form ${sectionsVisible[0] ? 'gate-visible' : ''}`}>
          <div className="gate-form-header">
            <span className="gate-form-label">Access Key</span>
            <div className="gate-form-icon">
              {showSuccess ? (
                <CheckCircle className="w-4 h-4 gate-icon-success" />
              ) : (
                <Fingerprint className={`w-4 h-4 ${isVerifying ? 'gate-icon-pulse' : ''}`} />
              )}
            </div>
          </div>

          <div className={`gate-input-container ${isFocused ? 'gate-focused' : ''} ${showError ? 'gate-error' : ''} ${showSuccess ? 'gate-success' : ''}`}>
            {(isVerifying || showSuccess || showError) && key.length > 0 ? (
              <div className={`gate-key-chars ${showError ? 'gate-shake' : ''}`}>
                {key.split('').map((char, index) => (
                  <span
                    key={index}
                    className={`gate-char ${showError ? 'gate-char-err' : ''} ${showSuccess ? 'gate-char-ok' : ''} ${isVerifying ? 'gate-char-wave' : ''}`}
                    style={getCharAnimation(index)}
                  >
                    {char}
                  </span>
                ))}
              </div>
            ) : (
              <input
                ref={inputRef}
                type="text"
                value={key}
                onChange={handleKeyChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="ENTER ACCESS KEY"
                disabled={isVerifying || showSuccess}
                className="gate-text-input"
                autoComplete="off"
                spellCheck={false}
              />
            )}
            <div className="gate-underline">
              <div className={`gate-underline-glow ${isFocused || isVerifying ? 'active' : ''}`} />
              {isVerifying && <div className="gate-scanner" />}
            </div>
          </div>

          <div className="gate-input-info">
            <span className="gate-info-text">{key.length > 0 ? `${key.length}/32` : 'Alphanumeric'}</span>
            <div className="gate-info-status">
              <div className={`gate-dot ${isValidLength ? 'active' : ''}`} />
              <span className={`gate-info-text ${isValidLength ? 'active' : ''}`}>
                {isValidLength ? 'Valid' : 'Min 24'}
              </span>
            </div>
          </div>

          {isVerifying && (
            <div className="gate-verify-steps">
              {VERIFICATION_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === verificationStep;
                const isComplete = index < verificationStep;
                return (
                  <div key={index} className={`gate-step ${index <= verificationStep ? 'visible' : ''}`}>
                    <div className={`gate-step-icon ${isComplete ? 'complete' : ''} ${isActive ? 'active' : ''}`}>
                      {isComplete ? <CheckCircle className="w-3 h-3" /> : <Icon className={`w-3 h-3 ${isActive ? 'pulse' : ''}`} />}
                    </div>
                    <span className={`gate-step-label ${isComplete ? 'complete' : ''} ${isActive ? 'active' : ''}`}>{step.text}</span>
                  </div>
                );
              })}
            </div>
          )}

          {showError && errorMessage && (
            <div className="gate-msg gate-msg-error">
              <AlertTriangle className="w-4 h-4" />
              <div className="gate-msg-content">
                <span className="gate-msg-title">Access Denied</span>
                <span className="gate-msg-text">{errorMessage}</span>
              </div>
            </div>
          )}

          {showSuccess && (
            <div className="gate-msg gate-msg-success">
              <CheckCircle className="w-4 h-4" />
              <div className="gate-msg-content">
                <span className="gate-msg-title">Access Granted</span>
                <span className="gate-msg-text">Establishing secure session...</span>
              </div>
            </div>
          )}

          <button type="submit" disabled={!canSubmit} className={`gate-submit ${canSubmit ? 'enabled' : ''} ${isVerifying ? 'verifying' : ''}`}>
            <span className="gate-submit-text">
              {isVerifying ? 'Verifying' : showSuccess ? 'Access Granted' : 'Request Access'}
            </span>
            {isVerifying && <div className="gate-spinner" />}
            <div className="gate-sweep" />
          </button>
        </form>

        <div className={`gate-section ${sectionsVisible[1] ? 'gate-visible' : ''}`}>
          <div className="gate-section-header">
            <Send className="w-4 h-4" />
            <span>How to Get Access</span>
          </div>
          <div className="gate-protocol">
            <p className="gate-protocol-line">Access keys are issued manually.</p>
            <p className="gate-protocol-line">To request access, contact admin via Telegram:</p>
            <a href="https://t.me/daemoncrow" target="_blank" rel="noopener noreferrer" className="gate-contact">
              @daemoncrow
            </a>
          </div>
        </div>

        <div className={`gate-section ${sectionsVisible[2] ? 'gate-visible' : ''}`}>
          <div className="gate-section-header">
            <Database className="w-4 h-4" />
            <span>Platform Overview</span>
          </div>
          <div className="gate-briefing">
            <p className="gate-brief-line highlight">DAEMONCROW is a private, all-in-one platform for advanced tools, research, and utilities.</p>
            <p className="gate-brief-line">Centralized access to everything required - no scattered services.</p>
            <p className="gate-brief-line">Built for serious users, not the public.</p>
          </div>
        </div>

        <div className={`gate-section ${sectionsVisible[3] ? 'gate-visible' : ''}`}>
          <div className="gate-section-header">
            <Wrench className="w-4 h-4" />
            <span>In-House Tools</span>
          </div>
          <div className="gate-tools">
            {TOOLS.map((tool, i) => (
              <div key={i} className="gate-tool">
                <tool.icon className="w-4 h-4" />
                <span>{tool.label}</span>
              </div>
            ))}
          </div>
          <div className="gate-tools-note">
            <span>All tools are built in-house, maintained privately, and not available elsewhere.</span>
          </div>
        </div>

        <div className={`gate-section ${sectionsVisible[4] ? 'gate-visible' : ''}`}>
          <div className="gate-section-header">
            <DollarSign className="w-4 h-4" />
            <span>Subscription Model</span>
          </div>
          <div className="gate-pricing">
            <div className="gate-price">
              <span className="gate-price-amount">$45</span>
              <span className="gate-price-period">/ month</span>
            </div>
            <div className="gate-price-reasons">
              <div className="gate-reason">
                <HardDrive className="w-3 h-3" />
                <span>Maintain and scale private infrastructure</span>
              </div>
              <div className="gate-reason">
                <Server className="w-3 h-3" />
                <span>Operate and secure dedicated servers</span>
              </div>
              <div className="gate-reason">
                <Code className="w-3 h-3" />
                <span>Continuously develop exclusive in-house tools</span>
              </div>
              <div className="gate-reason">
                <Shield className="w-3 h-3" />
                <span>Protect private knowledge, data, and resources</span>
              </div>
              <div className="gate-reason">
                <Users className="w-3 h-3" />
                <span>Keep access limited and high-signal</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`gate-security ${sectionsVisible[5] ? 'gate-visible' : ''}`}>
          {SECURITY_INDICATORS.map((item, i) => (
            <div key={i} className="gate-sec-item">
              <item.icon className="w-3 h-3" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className={`gate-status-row ${pageLoaded ? 'gate-visible' : ''}`}>
          <div className="gate-status">
            <div className="gate-status-dot online" />
            <span>Systems Online</span>
          </div>
          <div className="gate-status">
            <div className="gate-status-dot online" />
            <span>DB Connected</span>
          </div>
          <div className="gate-status">
            <div className="gate-status-dot online" />
            <span>Gateway Secure</span>
          </div>
        </div>

        <div className={`gate-footer ${pageLoaded ? 'gate-visible' : ''}`}>
          <span>Unauthorized access is prohibited</span>
        </div>
      </div>
    </div>
  );
}
