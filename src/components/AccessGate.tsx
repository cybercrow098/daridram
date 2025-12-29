import { useState, useRef, useEffect, useCallback } from 'react';
import { DaemonLogo } from './DaemonLogo';
import { Shield, Lock, Eye, Server, AlertTriangle, CheckCircle, XCircle, Fingerprint, Wifi, Clock, Terminal } from 'lucide-react';

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
  { text: 'Initializing secure handshake...', icon: Wifi },
  { text: 'Validating key format...', icon: Terminal },
  { text: 'Checking against database...', icon: Server },
  { text: 'Verifying permissions...', icon: Shield },
  { text: 'Establishing session...', icon: Lock },
];

export function AccessGate({ onVerify, isVerifying, error, onErrorClear }: AccessGateProps) {
  const [key, setKey] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationStep, setVerificationStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [keyChars, setKeyChars] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
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
      setKeyChars(value.split(''));
    }
  };

  const getCharAnimation = useCallback((index: number) => {
    if (isVerifying) {
      const delay = index * 0.03;
      return {
        animation: `pulse 0.5s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      };
    }
    if (showSuccess) {
      const delay = index * 0.02;
      return {
        animation: `successPop 0.3s ease-out forwards`,
        animationDelay: `${delay}s`,
        color: 'var(--accent-primary)',
      };
    }
    if (showError) {
      return {
        animation: `shake 0.1s ease-in-out`,
        animationDelay: `${index * 0.01}s`,
        color: 'var(--accent-primary)',
      };
    }
    return {};
  }, [isVerifying, showSuccess, showError]);

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 relative overflow-hidden py-12"
      style={{ background: 'var(--bg-base)' }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.95); }
        }
        @keyframes successPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); color: #10b981; }
          100% { transform: scale(1); color: #10b981; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        @keyframes scanLine {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(220, 38, 38, 0.3); }
          50% { box-shadow: 0 0 40px rgba(220, 38, 38, 0.6); }
        }
        @keyframes successGlow {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        .scan-line {
          animation: scanLine 2s ease-in-out infinite;
        }
        .glow-animation {
          animation: glow 1.5s ease-in-out infinite;
        }
        .success-glow {
          animation: successGlow 1s ease-out;
        }
        .fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[700px] pointer-events-none"
        style={{
          background: showSuccess
            ? 'radial-gradient(ellipse 50% 35% at 50% 0%, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05) 50%, transparent 80%)'
            : showError
            ? 'radial-gradient(ellipse 50% 35% at 50% 0%, rgba(220, 38, 38, 0.2), rgba(185, 28, 28, 0.08) 50%, transparent 80%)'
            : 'radial-gradient(ellipse 50% 35% at 50% 0%, rgba(220, 38, 38, 0.12), rgba(185, 28, 28, 0.05) 50%, transparent 80%)',
          transition: 'background 0.5s ease',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(rgba(220, 38, 38, 0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="w-full max-w-md relative z-10 flex-1 flex flex-col justify-center">
        <div className="flex flex-col items-center mb-12 animate-fade-in">
          <div className="relative mb-6">
            <div
              className="absolute inset-0 blur-3xl -z-10 scale-[2] transition-all duration-500"
              style={{
                background: showSuccess
                  ? 'rgba(16, 185, 129, 0.3)'
                  : showError
                  ? 'rgba(220, 38, 38, 0.4)'
                  : 'var(--glow-primary)',
              }}
            />
            <div className={showSuccess ? 'success-glow rounded-full' : ''}>
              <DaemonLogo size="xl" showText={false} />
            </div>
          </div>

          <h1 className="logo-text text-2xl tracking-[0.35em] text-gradient mb-2">
            Daemoncrow
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <div className="h-px w-8" style={{ background: 'var(--border-accent)' }} />
            <p
              className="font-mono text-[10px] tracking-[0.3em] uppercase"
              style={{ color: 'var(--text-subtle)' }}
            >
              Sealed Network
            </p>
            <div className="h-px w-8" style={{ background: 'var(--border-accent)' }} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div
            className={`p-6 rounded-xl border relative overflow-hidden transition-all duration-300 ${
              isVerifying ? 'glow-animation' : ''
            } ${showSuccess ? 'success-glow' : ''}`}
            style={{
              background: 'var(--bg-secondary)',
              borderColor: showError
                ? 'var(--accent-primary)'
                : showSuccess
                ? '#10b981'
                : isVerifying
                ? 'var(--accent-primary)'
                : 'var(--border-subtle)',
              boxShadow: showError
                ? '0 0 40px var(--glow-primary), inset 0 0 20px rgba(220, 38, 38, 0.05)'
                : showSuccess
                ? '0 0 40px rgba(16, 185, 129, 0.3), inset 0 0 20px rgba(16, 185, 129, 0.05)'
                : '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            {isVerifying && (
              <div
                className="absolute left-0 right-0 h-0.5 scan-line"
                style={{ background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)' }}
              />
            )}

            <div className="flex items-center justify-between mb-4">
              <label
                className="font-mono text-[10px] tracking-[0.2em] uppercase"
                style={{ color: 'var(--text-subtle)' }}
              >
                Access Key
              </label>
              <div className="flex items-center gap-2">
                {showSuccess ? (
                  <CheckCircle className="w-4 h-4" style={{ color: '#10b981' }} />
                ) : showError ? (
                  <XCircle className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                ) : (
                  <Fingerprint
                    className="w-4 h-4 transition-all"
                    style={{
                      color: isVerifying ? 'var(--accent-primary)' : 'var(--text-subtle)',
                      animation: isVerifying ? 'pulse 1s infinite' : 'none',
                    }}
                  />
                )}
              </div>
            </div>

            <div className="relative">
              {(isVerifying || showSuccess || showError) && key.length > 0 ? (
                <div
                  className="w-full px-4 py-3.5 rounded-lg font-mono text-base text-center tracking-[0.15em] flex justify-center items-center gap-0.5 flex-wrap min-h-[52px]"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {keyChars.map((char, index) => (
                    <span
                      key={index}
                      className="inline-block transition-all"
                      style={{
                        color: showError ? 'var(--accent-primary)' : showSuccess ? '#10b981' : 'var(--text-primary)',
                        ...getCharAnimation(index),
                      }}
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
                  placeholder="ENTER ACCESS KEY"
                  disabled={isVerifying || showSuccess}
                  className={`
                    w-full input-field text-center tracking-[0.15em] text-base
                    ${showError ? 'error-glow' : ''}
                    ${isVerifying ? 'opacity-50 cursor-wait' : ''}
                  `}
                  autoComplete="off"
                  spellCheck={false}
                />
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <span
                className="font-mono text-[10px] tracking-wider"
                style={{ color: 'var(--text-subtle)' }}
              >
                {key.length > 0 ? `${key.length}/32 characters` : 'Alphanumeric only'}
              </span>
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full transition-all"
                  style={{
                    background: key.length >= 24 ? (showSuccess ? '#10b981' : 'var(--accent-primary)') : 'var(--text-subtle)',
                    boxShadow: key.length >= 24 ? `0 0 8px ${showSuccess ? '#10b981' : 'var(--accent-primary)'}` : 'none',
                  }}
                />
                <span
                  className="font-mono text-[10px]"
                  style={{ color: key.length >= 24 ? (showSuccess ? '#10b981' : 'var(--accent-tertiary)') : 'var(--text-subtle)' }}
                >
                  {key.length >= 24 ? 'Valid length' : 'Min 24 chars'}
                </span>
              </div>
            </div>

            {isVerifying && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="space-y-2">
                  {VERIFICATION_STEPS.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === verificationStep;
                    const isComplete = index < verificationStep;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 fade-in-up"
                        style={{
                          opacity: index <= verificationStep ? 1 : 0.3,
                          animationDelay: `${index * 0.1}s`,
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center transition-all"
                          style={{
                            background: isComplete ? 'rgba(16, 185, 129, 0.2)' : isActive ? 'rgba(220, 38, 38, 0.2)' : 'var(--bg-tertiary)',
                            border: `1px solid ${isComplete ? '#10b981' : isActive ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                          }}
                        >
                          {isComplete ? (
                            <CheckCircle className="w-3 h-3" style={{ color: '#10b981' }} />
                          ) : (
                            <Icon
                              className="w-3 h-3"
                              style={{
                                color: isActive ? 'var(--accent-primary)' : 'var(--text-subtle)',
                                animation: isActive ? 'pulse 0.5s infinite' : 'none',
                              }}
                            />
                          )}
                        </div>
                        <span
                          className="font-mono text-[10px] tracking-wider"
                          style={{
                            color: isComplete ? '#10b981' : isActive ? 'var(--text-primary)' : 'var(--text-subtle)',
                          }}
                        >
                          {step.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {showError && errorMessage && (
            <div
              className="mt-4 p-4 rounded-xl fade-in-up"
              style={{
                background: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid var(--accent-primary)',
              }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <p className="font-mono text-xs font-medium mb-1" style={{ color: 'var(--accent-primary)' }}>
                    Access Denied
                  </p>
                  <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
                    {errorMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showSuccess && (
            <div
              className="mt-4 p-4 rounded-xl fade-in-up"
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10b981',
              }}
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#10b981' }} />
                <div>
                  <p className="font-mono text-xs font-medium mb-1" style={{ color: '#10b981' }}>
                    Access Granted
                  </p>
                  <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
                    Key validated successfully. Establishing secure session...
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying || key.length < 24}
            className={`
              w-full mt-5 btn-primary py-4 relative overflow-hidden
              ${key.length < 24 ? 'opacity-30 cursor-not-allowed' : ''}
              ${isVerifying ? 'opacity-50 cursor-wait' : ''}
            `}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isVerifying ? (
                <>
                  <div
                    className="w-4 h-4 border-2 rounded-full animate-spin"
                    style={{ borderColor: 'transparent', borderTopColor: 'white' }}
                  />
                  <span>Verifying...</span>
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Access Granted</span>
                </>
              ) : (
                'Request Access'
              )}
            </span>
          </button>
        </form>

        <div
          className="mt-10 p-4 rounded-xl animate-slide-up"
          style={{
            animationDelay: '0.25s',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            <span
              className="font-mono text-[10px] tracking-[0.2em] uppercase"
              style={{ color: 'var(--text-subtle)' }}
            >
              Security Information
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Lock className="w-3 h-3" style={{ color: 'var(--text-subtle)' }} />
              <span className="font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>
                256-bit encryption
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-3 h-3" style={{ color: 'var(--text-subtle)' }} />
              <span className="font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>
                Zero-knowledge proof
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-3 h-3" style={{ color: 'var(--text-subtle)' }} />
              <span className="font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>
                Isolated instances
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" style={{ color: 'var(--text-subtle)' }} />
              <span className="font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>
                Session timeout
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div
            className="inline-flex items-center gap-3 px-4 py-2 rounded-lg"
            style={{ background: 'rgba(220, 38, 38, 0.05)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="pulse-dot" />
            <span
              className="font-mono text-[10px] tracking-wider uppercase"
              style={{ color: 'var(--text-subtle)' }}
            >
              Zero-trust gateway active
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md text-center animate-fade-in mt-auto pt-8" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ boxShadow: '0 0 6px #10b981' }} />
            <span className="font-mono text-[9px]" style={{ color: 'var(--text-subtle)' }}>Systems Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ boxShadow: '0 0 6px #10b981' }} />
            <span className="font-mono text-[9px]" style={{ color: 'var(--text-subtle)' }}>DB Connected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ boxShadow: '0 0 6px #10b981' }} />
            <span className="font-mono text-[9px]" style={{ color: 'var(--text-subtle)' }}>Gateway Secure</span>
          </div>
        </div>
        <p
          className="font-mono text-[9px] tracking-[0.25em] uppercase"
          style={{ color: 'var(--text-subtle)', opacity: 0.4 }}
        >
          Unauthorized access is prohibited
        </p>
      </div>
    </div>
  );
}
