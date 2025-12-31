import { useState, useRef, useEffect, useCallback } from 'react';
import { DaemonLogo } from './DaemonLogo';
import {
  Shield, Lock, Eye, Server, AlertTriangle, CheckCircle, XCircle,
  Fingerprint, Wifi, Clock, Terminal, Send, Database, Bug,
  CreditCard, Layers, Zap, Crown, MessageCircle
} from 'lucide-react';

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

const FEATURES = [
  { icon: Database, label: 'Premium Databases', desc: 'Fresh & exclusive leaks' },
  { icon: Bug, label: 'Private Exploits', desc: 'Zero-day vulnerabilities' },
  { icon: Layers, label: 'Combo Lists', desc: 'High-quality credentials' },
  { icon: CreditCard, label: 'Carding Tools', desc: 'Security research tools' },
  { icon: Zap, label: 'In-house Tools', desc: 'Custom built utilities' },
  { icon: Eye, label: 'Stealer Logs', desc: 'Curated data streams' },
];

export function AccessGate({ onVerify, isVerifying, error, onErrorClear }: AccessGateProps) {
  const [key, setKey] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationStep, setVerificationStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [keyChars, setKeyChars] = useState<string[]>([]);
  const [activeFeature, setActiveFeature] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % FEATURES.length);
    }, 3000);
    return () => clearInterval(interval);
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
        color: '#10b981',
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
      className="min-h-screen flex flex-col relative overflow-hidden"
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
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes morphBlob {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50% { border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%; }
          75% { border-radius: 60% 40% 60% 30% / 70% 30% 50% 60%; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes borderGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
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
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        .morph-blob {
          animation: morphBlob 8s ease-in-out infinite;
        }
        .shimmer-text {
          background: linear-gradient(90deg, var(--accent-tertiary) 0%, var(--accent-primary) 25%, var(--accent-warm) 50%, var(--accent-primary) 75%, var(--accent-tertiary) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .border-glow {
          animation: borderGlow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 morph-blob opacity-20"
          style={{
            background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute top-1/4 -right-20 w-80 h-80 morph-blob opacity-15"
          style={{
            background: 'radial-gradient(circle, var(--accent-warm) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animationDelay: '-4s',
          }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-72 h-72 morph-blob opacity-10"
          style={{
            background: 'radial-gradient(circle, var(--accent-cyan) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animationDelay: '-2s',
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(var(--accent-primary) 1px, transparent 1px),
              linear-gradient(90deg, var(--accent-primary) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        <div className="lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
          <div className="max-w-lg mx-auto lg:mx-0 w-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div
                  className="absolute inset-0 blur-2xl -z-10 scale-150"
                  style={{ background: 'var(--glow-primary)' }}
                />
                <DaemonLogo size="lg" showText={false} />
              </div>
              <div>
                <h1 className="logo-text text-2xl tracking-[0.3em] shimmer-text">
                  Daemoncrow
                </h1>
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase mt-1" style={{ color: 'var(--text-subtle)' }}>
                  Exclusive Access Network
                </p>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                One Platform.
                <br />
                <span className="text-gradient">Everything You Need.</span>
              </h2>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Your exclusive gateway to premium databases, private exploits, in-house tools,
                and curated intelligence. Built by researchers, for researchers.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-10">
              {FEATURES.map((feature, index) => {
                const Icon = feature.icon;
                const isActive = index === activeFeature;
                return (
                  <div
                    key={index}
                    className="relative p-4 rounded-2xl transition-all duration-500 cursor-default group"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(255, 71, 87, 0.15) 0%, rgba(255, 71, 87, 0.05) 100%)'
                        : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isActive ? 'rgba(255, 71, 87, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`,
                      transform: isActive ? 'scale(1.02)' : 'scale(1)',
                    }}
                    onMouseEnter={() => setActiveFeature(index)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="p-2 rounded-xl transition-all duration-300"
                        style={{
                          background: isActive
                            ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-blood))'
                            : 'var(--bg-tertiary)',
                        }}
                      >
                        <Icon
                          className="w-4 h-4 transition-colors duration-300"
                          style={{ color: isActive ? '#fff' : 'var(--text-subtle)' }}
                        />
                      </div>
                      <div>
                        <p
                          className="font-medium text-sm transition-colors duration-300"
                          style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}
                        >
                          {feature.label}
                        </p>
                        <p
                          className="text-xs mt-0.5 transition-colors duration-300"
                          style={{ color: isActive ? 'var(--text-muted)' : 'var(--text-subtle)' }}
                        >
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                    {isActive && (
                      <div
                        className="absolute inset-0 rounded-2xl pointer-events-none border-glow"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 71, 87, 0.1), transparent)',
                          boxShadow: '0 0 30px rgba(255, 71, 87, 0.1)',
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div
              className="p-5 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 167, 38, 0.1) 0%, rgba(255, 71, 87, 0.05) 100%)',
                border: '1px solid rgba(255, 167, 38, 0.2)',
              }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div
                  className="p-2.5 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, var(--accent-warm), var(--accent-primary))' }}
                >
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                    $45<span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>/month</span>
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>Premium Membership</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Dedicated server infrastructure & 24/7 uptime
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Exclusive private tools & zero-day access
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Fresh daily updates & curated intelligence
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-16">
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit}>
              <div
                className={`relative rounded-3xl overflow-hidden transition-all duration-500 ${
                  isVerifying ? 'glow-animation' : ''
                } ${showSuccess ? 'success-glow' : ''}`}
                style={{
                  background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
                  boxShadow: showError
                    ? '0 25px 80px -20px rgba(255, 71, 87, 0.4), 0 0 0 1px var(--accent-primary)'
                    : showSuccess
                    ? '0 25px 80px -20px rgba(16, 185, 129, 0.4), 0 0 0 1px #10b981'
                    : '0 25px 80px -20px rgba(0, 0, 0, 0.6), 0 0 0 1px var(--border-subtle)',
                }}
              >
                {isVerifying && (
                  <div
                    className="absolute left-0 right-0 h-1 scan-line"
                    style={{ background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)' }}
                  />
                )}

                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background: showSuccess
                      ? 'linear-gradient(90deg, transparent, #10b981, transparent)'
                      : 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)',
                    opacity: 0.5,
                  }}
                />

                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center"
                        style={{
                          background: showSuccess
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : 'linear-gradient(135deg, var(--accent-primary), var(--accent-blood))',
                        }}
                      >
                        {showSuccess ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : showError ? (
                          <XCircle className="w-5 h-5 text-white" />
                        ) : (
                          <Fingerprint
                            className="w-5 h-5 text-white"
                            style={{ animation: isVerifying ? 'pulse 1s infinite' : 'none' }}
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                          Access Portal
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                          Enter your activation key
                        </p>
                      </div>
                    </div>
                    <div
                      className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider"
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                      }}
                    >
                      Secure
                    </div>
                  </div>

                  <div className="relative mb-4">
                    {(isVerifying || showSuccess || showError) && key.length > 0 ? (
                      <div
                        className="w-full px-5 py-4 rounded-2xl font-mono text-sm text-center tracking-[0.15em] flex justify-center items-center gap-0.5 flex-wrap min-h-[56px]"
                        style={{
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-default)',
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
                          w-full px-5 py-4 rounded-2xl font-mono text-sm text-center tracking-[0.15em]
                          focus:outline-none transition-all duration-300
                          ${showError ? 'error-glow' : ''}
                          ${isVerifying ? 'opacity-50 cursor-wait' : ''}
                        `}
                        style={{
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-primary)',
                        }}
                        autoComplete="off"
                        spellCheck={false}
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                      {key.length > 0 ? `${key.length}/32 characters` : 'Alphanumeric only'}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                            style={{
                              background: key.length >= (i + 1) * 6
                                ? (showSuccess ? '#10b981' : 'var(--accent-primary)')
                                : 'var(--bg-elevated)',
                              boxShadow: key.length >= (i + 1) * 6
                                ? `0 0 8px ${showSuccess ? '#10b981' : 'var(--accent-primary)'}`
                                : 'none',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {isVerifying && (
                    <div className="mb-6 p-4 rounded-2xl" style={{ background: 'var(--bg-tertiary)' }}>
                      <div className="space-y-2.5">
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
                                className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                                style={{
                                  background: isComplete
                                    ? 'rgba(16, 185, 129, 0.2)'
                                    : isActive
                                    ? 'rgba(255, 71, 87, 0.2)'
                                    : 'var(--bg-elevated)',
                                  border: `1px solid ${
                                    isComplete ? '#10b981' : isActive ? 'var(--accent-primary)' : 'var(--border-subtle)'
                                  }`,
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
                                className="font-mono text-xs"
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

                  {showError && errorMessage && (
                    <div
                      className="mb-6 p-4 rounded-2xl fade-in-up"
                      style={{
                        background: 'rgba(255, 71, 87, 0.1)',
                        border: '1px solid rgba(255, 71, 87, 0.3)',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: 'var(--accent-primary)' }} />
                        <div>
                          <p className="font-medium text-xs mb-0.5" style={{ color: 'var(--accent-primary)' }}>
                            Access Denied
                          </p>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {errorMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {showSuccess && (
                    <div
                      className="mb-6 p-4 rounded-2xl fade-in-up"
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 shrink-0" style={{ color: '#10b981' }} />
                        <div>
                          <p className="font-medium text-xs mb-0.5" style={{ color: '#10b981' }}>
                            Access Granted
                          </p>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            Key validated. Establishing secure session...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isVerifying || key.length < 24}
                    className="w-full py-4 rounded-2xl font-mono text-sm tracking-[0.15em] uppercase font-medium transition-all duration-300 relative overflow-hidden group"
                    style={{
                      background: key.length >= 24
                        ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-blood))'
                        : 'var(--bg-tertiary)',
                      color: key.length >= 24 ? '#fff' : 'var(--text-subtle)',
                      opacity: isVerifying ? 0.5 : 1,
                      cursor: key.length < 24 || isVerifying ? 'not-allowed' : 'pointer',
                      boxShadow: key.length >= 24
                        ? '0 10px 40px -10px rgba(255, 71, 87, 0.5)'
                        : 'none',
                    }}
                  >
                    {key.length >= 24 && !isVerifying && (
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))',
                        }}
                      />
                    )}
                    <span className="relative flex items-center justify-center gap-2">
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
                </div>

                <div
                  className="px-8 py-5 border-t"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    background: 'rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Lock className="w-4 h-4 mx-auto mb-1.5" style={{ color: 'var(--text-subtle)' }} />
                      <p className="text-[10px]" style={{ color: 'var(--text-subtle)' }}>AES-256</p>
                    </div>
                    <div>
                      <Eye className="w-4 h-4 mx-auto mb-1.5" style={{ color: 'var(--text-subtle)' }} />
                      <p className="text-[10px]" style={{ color: 'var(--text-subtle)' }}>Zero-Trust</p>
                    </div>
                    <div>
                      <Server className="w-4 h-4 mx-auto mb-1.5" style={{ color: 'var(--text-subtle)' }} />
                      <p className="text-[10px]" style={{ color: 'var(--text-subtle)' }}>Isolated</p>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            <div
              className="mt-6 p-5 rounded-2xl text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(255, 71, 87, 0.05) 100%)',
                border: '1px solid rgba(0, 212, 255, 0.15)',
              }}
            >
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Need an Access Key?
              </p>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                Contact our admin to get your exclusive membership
              </p>
              <a
                href="https://t.me/daemoncrow"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #0088cc, #0077b5)',
                  color: '#fff',
                  boxShadow: '0 8px 30px -10px rgba(0, 136, 204, 0.5)',
                }}
              >
                <Send className="w-4 h-4" />
                <span>@daemoncrow</span>
              </a>
            </div>

            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2">
                <div className="pulse-dot" />
                <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
                  Gateway Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative z-10 border-t py-4 px-6"
        style={{
          borderColor: 'var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ boxShadow: '0 0 8px #10b981' }} />
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-subtle)' }}>Systems Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ boxShadow: '0 0 8px #10b981' }} />
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-subtle)' }}>DB Connected</span>
            </div>
          </div>
          <p className="text-[10px] font-mono tracking-wider" style={{ color: 'var(--text-subtle)', opacity: 0.5 }}>
            Unauthorized access is prohibited
          </p>
        </div>
      </div>
    </div>
  );
}
