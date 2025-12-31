import { useState, useRef, useEffect, useCallback } from 'react';
import { DaemonLogo } from './DaemonLogo';
import { Shield, Lock, Eye, Server, AlertTriangle, CheckCircle, Fingerprint, Wifi, Terminal, Cpu, Radio } from 'lucide-react';

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

export function AccessGate({ onVerify, isVerifying, error, onErrorClear }: AccessGateProps) {
  const [key, setKey] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationStep, setVerificationStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [indicatorsVisible, setIndicatorsVisible] = useState([false, false, false, false]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (pageLoaded) {
      indicatorsVisible.forEach((_, i) => {
        setTimeout(() => {
          setIndicatorsVisible(prev => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, 800 + i * 150);
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
    <div className="gate-container">
      <div className="gate-noise" />
      <div className="gate-gradient" />
      <div className="gate-gradient-secondary" />
      <div className="gate-vignette" />

      <div className="gate-grid" />

      <div className="gate-ambient-orb gate-ambient-orb-1" />
      <div className="gate-ambient-orb gate-ambient-orb-2" />
      <div className="gate-ambient-orb gate-ambient-orb-3" />

      <div className="gate-content">
        <div className={`gate-logo-section ${pageLoaded ? 'gate-visible' : ''}`}>
          <div className="gate-logo-glow" />
          <div className={`gate-logo-wrapper ${showSuccess ? 'gate-success-pulse' : ''}`}>
            <DaemonLogo size="xl" showText={false} />
          </div>

          <h1 className="gate-title">
            Daemoncrow
          </h1>

          <div className="gate-subtitle-container">
            <div className="gate-subtitle-line" />
            <span className="gate-subtitle">Sealed Network</span>
            <div className="gate-subtitle-line" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className={`gate-form ${pageLoaded ? 'gate-visible' : ''}`}>
          <div className="gate-input-section">
            <div className="gate-input-label">
              <span className="gate-label-text">Access Key</span>
              <div className="gate-label-icon">
                {showSuccess ? (
                  <CheckCircle className="w-4 h-4 gate-icon-success" />
                ) : (
                  <Fingerprint className={`w-4 h-4 ${isVerifying ? 'gate-icon-verifying' : ''}`} />
                )}
              </div>
            </div>

            <div className={`gate-input-wrapper ${isFocused ? 'gate-input-focused' : ''} ${showError ? 'gate-input-error' : ''} ${showSuccess ? 'gate-input-success' : ''}`}>
              {(isVerifying || showSuccess || showError) && key.length > 0 ? (
                <div className={`gate-key-display ${showError ? 'gate-shake' : ''}`}>
                  {key.split('').map((char, index) => (
                    <span
                      key={index}
                      className={`gate-key-char ${showError ? 'gate-char-error' : ''} ${showSuccess ? 'gate-char-success' : ''} ${isVerifying ? 'gate-char-verifying' : ''}`}
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
                  className="gate-input"
                  autoComplete="off"
                  spellCheck={false}
                />
              )}
              <div className="gate-input-underline">
                <div className={`gate-input-underline-glow ${isFocused || isVerifying ? 'gate-underline-active' : ''}`} />
                {isVerifying && <div className="gate-scan-line" />}
              </div>
            </div>

            <div className="gate-input-meta">
              <span className="gate-meta-text">
                {key.length > 0 ? `${key.length}/32` : 'Alphanumeric'}
              </span>
              <div className="gate-meta-status">
                <div className={`gate-status-dot ${isValidLength ? 'gate-status-active' : ''}`} />
                <span className={`gate-meta-text ${isValidLength ? 'gate-text-active' : ''}`}>
                  {isValidLength ? 'Valid' : 'Min 24'}
                </span>
              </div>
            </div>
          </div>

          {isVerifying && (
            <div className="gate-verification">
              {VERIFICATION_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === verificationStep;
                const isComplete = index < verificationStep;
                return (
                  <div
                    key={index}
                    className={`gate-verification-step ${index <= verificationStep ? 'gate-step-visible' : ''}`}
                  >
                    <div className={`gate-step-icon ${isComplete ? 'gate-step-complete' : ''} ${isActive ? 'gate-step-active' : ''}`}>
                      {isComplete ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Icon className={`w-3 h-3 ${isActive ? 'gate-icon-pulse' : ''}`} />
                      )}
                    </div>
                    <span className={`gate-step-text ${isComplete ? 'gate-text-complete' : ''} ${isActive ? 'gate-text-active' : ''}`}>
                      {step.text}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {showError && errorMessage && (
            <div className="gate-error-message">
              <AlertTriangle className="w-4 h-4" />
              <div className="gate-error-content">
                <span className="gate-error-title">Access Denied</span>
                <span className="gate-error-text">{errorMessage}</span>
              </div>
            </div>
          )}

          {showSuccess && (
            <div className="gate-success-message">
              <CheckCircle className="w-4 h-4" />
              <div className="gate-success-content">
                <span className="gate-success-title">Access Granted</span>
                <span className="gate-success-text">Establishing secure session...</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className={`gate-cta ${canSubmit ? 'gate-cta-active' : ''} ${isVerifying ? 'gate-cta-verifying' : ''}`}
          >
            <span className="gate-cta-text">
              {isVerifying ? 'Verifying' : showSuccess ? 'Access Granted' : 'Request Access'}
            </span>
            {isVerifying && <div className="gate-cta-spinner" />}
            <div className="gate-cta-sweep" />
          </button>
        </form>

        <div className={`gate-indicators ${pageLoaded ? 'gate-visible' : ''}`}>
          <div className={`gate-indicator ${indicatorsVisible[0] ? 'gate-indicator-visible' : ''}`}>
            <Lock className="w-3 h-3" />
            <span>256-bit</span>
          </div>
          <div className={`gate-indicator ${indicatorsVisible[1] ? 'gate-indicator-visible' : ''}`}>
            <Eye className="w-3 h-3" />
            <span>Zero-knowledge</span>
          </div>
          <div className={`gate-indicator ${indicatorsVisible[2] ? 'gate-indicator-visible' : ''}`}>
            <Cpu className="w-3 h-3" />
            <span>Isolated</span>
          </div>
          <div className={`gate-indicator ${indicatorsVisible[3] ? 'gate-indicator-visible' : ''}`}>
            <Radio className="w-3 h-3" />
            <span>Encrypted</span>
          </div>
        </div>

        <div className={`gate-status-bar ${pageLoaded ? 'gate-visible' : ''}`}>
          <div className="gate-status-item">
            <div className="gate-status-light gate-status-online" />
            <span>Systems Online</span>
          </div>
          <div className="gate-status-item">
            <div className="gate-status-light gate-status-online" />
            <span>DB Connected</span>
          </div>
          <div className="gate-status-item">
            <div className="gate-status-light gate-status-online" />
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
