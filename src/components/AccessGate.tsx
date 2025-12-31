import { useState, useRef, useEffect, useCallback } from 'react';
import { DaemonLogo } from './DaemonLogo';
import {
  Shield, Lock, Eye, Server, AlertTriangle, CheckCircle, XCircle,
  Fingerprint, Wifi, Terminal, Send, Database, Bug,
  CreditCard, Layers, Zap, Crown, ArrowRight, Sparkles
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
  { icon: Database, label: 'Premium Databases' },
  { icon: Bug, label: 'Private Exploits' },
  { icon: Layers, label: 'Combo Lists' },
  { icon: CreditCard, label: 'Carding Tools' },
  { icon: Zap, label: 'In-house Tools' },
  { icon: Eye, label: 'Stealer Logs' },
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
      return {
        animation: `pulse 0.5s ease-in-out infinite`,
        animationDelay: `${index * 0.03}s`,
      };
    }
    if (showSuccess) {
      return {
        animation: `successPop 0.3s ease-out forwards`,
        animationDelay: `${index * 0.02}s`,
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
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#050507' }}>
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
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(3deg); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-2deg); }
        }
        @keyframes morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50% { border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%; }
          75% { border-radius: 60% 40% 60% 30% / 70% 30% 50% 60%; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(150px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 71, 87, 0.4)); }
          50% { filter: drop-shadow(0 0 40px rgba(255, 71, 87, 0.6)); }
        }
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .float { animation: float 8s ease-in-out infinite; }
        .float-reverse { animation: floatReverse 7s ease-in-out infinite; }
        .morph { animation: morph 12s ease-in-out infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #ff8a94 0%, #ff4757 25%, #ffa726 50%, #ff4757 75%, #ff8a94 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .fade-up { animation: fadeUp 0.5s ease-out forwards; }
        .glow-pulse { animation: glow 2s ease-in-out infinite; }
      `}</style>

      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] morph float opacity-30"
          style={{
            top: '-15%',
            left: '-10%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 71, 87, 0.4) 0%, rgba(255, 71, 87, 0.1) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] morph float-reverse opacity-25"
          style={{
            top: '20%',
            right: '-5%',
            background: 'radial-gradient(circle at 70% 30%, rgba(255, 167, 38, 0.35) 0%, rgba(255, 167, 38, 0.1) 40%, transparent 70%)',
            filter: 'blur(50px)',
            animationDelay: '-3s',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] morph float opacity-20"
          style={{
            bottom: '5%',
            left: '20%',
            background: 'radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.3) 0%, rgba(0, 212, 255, 0.05) 50%, transparent 70%)',
            filter: 'blur(40px)',
            animationDelay: '-6s',
          }}
        />

        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="1" fill="#ff4757" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] opacity-10">
          <div className="absolute inset-0" style={{ animation: 'orbit 20s linear infinite' }}>
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)', boxShadow: '0 0 20px var(--accent-primary)' }} />
          </div>
          <div className="absolute inset-0" style={{ animation: 'orbit 25s linear infinite reverse' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-warm)', boxShadow: '0 0 15px var(--accent-warm)' }} />
          </div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 py-16 gap-16 lg:gap-24">

          <div className="w-full max-w-xl lg:max-w-lg fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-4 lg:gap-5 mb-10">
              <div className="relative shrink-0 glow-pulse">
                <DaemonLogo size="lg" showText={false} className="lg:hidden" />
                <DaemonLogo size="xl" showText={false} className="hidden lg:block" />
              </div>
              <div className="min-w-0">
                <h1 className="logo-text text-2xl sm:text-3xl lg:text-4xl tracking-[0.2em] lg:tracking-[0.25em] shimmer-text">
                  Daemoncrow
                </h1>
                <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-1.5 lg:mt-2 opacity-50" style={{ color: 'var(--text-muted)' }}>
                  Exclusive Network
                </p>
              </div>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6" style={{ color: 'var(--text-primary)' }}>
              One Place.<br />
              <span className="text-gradient">Everything You Need.</span>
            </h2>

            <p className="text-lg leading-relaxed mb-10 opacity-70" style={{ color: 'var(--text-muted)' }}>
              Your exclusive gateway to premium databases, private exploits,
              in-house tools, and curated intelligence.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              {FEATURES.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group flex items-center gap-2.5 px-4 py-2.5 transition-all duration-300 cursor-default"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                      borderRadius: '100px',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <Icon className="w-4 h-4 transition-colors duration-300 group-hover:text-[var(--accent-primary)]" style={{ color: 'var(--text-subtle)' }} />
                    <span className="text-sm transition-colors duration-300 group-hover:text-[var(--text-primary)]" style={{ color: 'var(--text-muted)' }}>
                      {feature.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              className="relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 167, 38, 0.08) 0%, rgba(255, 71, 87, 0.04) 100%)',
                borderRadius: '24px',
                padding: '1px',
              }}
            >
              <div
                className="relative p-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9) 0%, rgba(5, 5, 7, 0.95) 100%)',
                  borderRadius: '23px',
                }}
              >
                <div className="flex items-start gap-5">
                  <div
                    className="shrink-0 w-14 h-14 flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-warm) 0%, var(--accent-primary) 100%)',
                      borderRadius: '16px',
                    }}
                  >
                    <Crown className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>$45</span>
                      <span className="text-sm opacity-60" style={{ color: 'var(--text-muted)' }}>/month</span>
                    </div>
                    <p className="text-xs uppercase tracking-wider mb-4 opacity-50" style={{ color: 'var(--text-muted)' }}>
                      Premium Membership
                    </p>
                    <div className="space-y-2.5">
                      {[
                        'Dedicated servers & 24/7 uptime',
                        'Exclusive private tools & zero-days',
                        'Fresh daily updates & intel'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <div className="w-5 h-5 flex items-center justify-center" style={{ borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)' }}>
                            <CheckCircle className="w-3 h-3" style={{ color: '#10b981' }} />
                          </div>
                          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md fade-up" style={{ animationDelay: '0.3s' }}>
            <form onSubmit={handleSubmit}>
              <div
                className="relative overflow-hidden"
                style={{
                  background: showSuccess
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)'
                    : showError
                    ? 'linear-gradient(135deg, rgba(255, 71, 87, 0.15) 0%, rgba(255, 71, 87, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 71, 87, 0.1) 0%, rgba(255, 167, 38, 0.05) 100%)',
                  borderRadius: '32px',
                  padding: '1px',
                }}
              >
                <div
                  className="relative backdrop-blur-xl"
                  style={{
                    background: 'linear-gradient(180deg, rgba(15, 15, 20, 0.95) 0%, rgba(10, 10, 12, 0.98) 100%)',
                    borderRadius: '31px',
                  }}
                >
                  {isVerifying && (
                    <div
                      className="absolute left-0 right-0 h-0.5"
                      style={{
                        background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)',
                        animation: 'scan 1.5s ease-in-out infinite',
                      }}
                    />
                  )}

                  <div className="p-8 pb-6">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 flex items-center justify-center"
                          style={{
                            background: showSuccess
                              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                              : 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-blood) 100%)',
                            borderRadius: '14px',
                          }}
                        >
                          {showSuccess ? (
                            <CheckCircle className="w-6 h-6 text-white" />
                          ) : showError ? (
                            <XCircle className="w-6 h-6 text-white" />
                          ) : (
                            <Fingerprint className="w-6 h-6 text-white" style={{ animation: isVerifying ? 'pulse 1s infinite' : 'none' }} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Access Portal</p>
                          <p className="text-xs opacity-50" style={{ color: 'var(--text-muted)' }}>Enter activation key</p>
                        </div>
                      </div>
                      <div
                        className="flex items-center gap-1.5 px-3 py-1.5"
                        style={{
                          background: 'rgba(16, 185, 129, 0.1)',
                          borderRadius: '100px',
                        }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ boxShadow: '0 0 8px #10b981' }} />
                        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#10b981' }}>Secure</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      {(isVerifying || showSuccess || showError) && key.length > 0 ? (
                        <div
                          className="w-full px-6 py-5 font-mono text-sm text-center tracking-[0.2em] flex justify-center items-center gap-0.5 flex-wrap min-h-[62px]"
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.05)',
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
                          className="w-full px-6 py-5 font-mono text-sm text-center tracking-[0.2em] focus:outline-none transition-all duration-300 placeholder:opacity-30"
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            color: 'var(--text-primary)',
                          }}
                          autoComplete="off"
                          spellCheck={false}
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs opacity-40" style={{ color: 'var(--text-muted)' }}>
                        {key.length > 0 ? `${key.length}/32` : 'Alphanumeric'}
                      </span>
                      <div className="flex gap-1.5">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="w-8 h-1 transition-all duration-300"
                            style={{
                              background: key.length >= (i + 1) * 6
                                ? showSuccess ? '#10b981' : 'var(--accent-primary)'
                                : 'rgba(255,255,255,0.1)',
                              borderRadius: '2px',
                              boxShadow: key.length >= (i + 1) * 6 ? `0 0 10px ${showSuccess ? '#10b981' : 'var(--accent-primary)'}` : 'none',
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {isVerifying && (
                      <div className="mb-6 space-y-3">
                        {VERIFICATION_STEPS.map((step, index) => {
                          const Icon = step.icon;
                          const isActive = index === verificationStep;
                          const isComplete = index < verificationStep;
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-3 transition-all duration-300"
                              style={{ opacity: index <= verificationStep ? 1 : 0.3 }}
                            >
                              <div
                                className="w-7 h-7 flex items-center justify-center transition-all duration-300"
                                style={{
                                  background: isComplete ? 'rgba(16, 185, 129, 0.15)' : isActive ? 'rgba(255, 71, 87, 0.15)' : 'rgba(255,255,255,0.03)',
                                  borderRadius: '8px',
                                }}
                              >
                                {isComplete ? (
                                  <CheckCircle className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
                                ) : (
                                  <Icon className="w-3.5 h-3.5" style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-subtle)' }} />
                                )}
                              </div>
                              <span className="font-mono text-xs" style={{ color: isComplete ? '#10b981' : isActive ? 'var(--text-primary)' : 'var(--text-subtle)' }}>
                                {step.text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {showError && errorMessage && (
                      <div
                        className="mb-6 p-4 flex items-start gap-3"
                        style={{
                          background: 'rgba(255, 71, 87, 0.08)',
                          borderRadius: '14px',
                        }}
                      >
                        <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: 'var(--accent-primary)' }} />
                        <div>
                          <p className="font-medium text-xs mb-0.5" style={{ color: 'var(--accent-primary)' }}>Access Denied</p>
                          <p className="text-sm opacity-70" style={{ color: 'var(--text-muted)' }}>{errorMessage}</p>
                        </div>
                      </div>
                    )}

                    {showSuccess && (
                      <div
                        className="mb-6 p-4 flex items-start gap-3"
                        style={{
                          background: 'rgba(16, 185, 129, 0.08)',
                          borderRadius: '14px',
                        }}
                      >
                        <Sparkles className="w-5 h-5 shrink-0" style={{ color: '#10b981' }} />
                        <div>
                          <p className="font-medium text-xs mb-0.5" style={{ color: '#10b981' }}>Access Granted</p>
                          <p className="text-sm opacity-70" style={{ color: 'var(--text-muted)' }}>Establishing secure session...</p>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isVerifying || key.length < 24}
                      className="w-full py-4 font-mono text-sm tracking-[0.15em] uppercase font-medium transition-all duration-300 relative overflow-hidden group"
                      style={{
                        background: key.length >= 24
                          ? 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-blood) 100%)'
                          : 'rgba(255,255,255,0.03)',
                        color: key.length >= 24 ? '#fff' : 'var(--text-subtle)',
                        borderRadius: '14px',
                        opacity: isVerifying ? 0.6 : 1,
                        cursor: key.length < 24 || isVerifying ? 'not-allowed' : 'pointer',
                        boxShadow: key.length >= 24 ? '0 20px 40px -15px rgba(255, 71, 87, 0.4)' : 'none',
                      }}
                    >
                      <span className="relative flex items-center justify-center gap-2">
                        {isVerifying ? (
                          <>
                            <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'transparent', borderTopColor: 'white' }} />
                            <span>Verifying...</span>
                          </>
                        ) : showSuccess ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Access Granted</span>
                          </>
                        ) : (
                          <>
                            <span>Request Access</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </>
                        )}
                      </span>
                    </button>
                  </div>

                  <div
                    className="px-8 py-5 flex items-center justify-around"
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      borderTop: '1px solid rgba(255,255,255,0.03)',
                      borderRadius: '0 0 31px 31px',
                    }}
                  >
                    {[
                      { icon: Lock, label: 'AES-256' },
                      { icon: Eye, label: 'Zero-Trust' },
                      { icon: Server, label: 'Isolated' },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5">
                        <item.icon className="w-4 h-4 opacity-40" style={{ color: 'var(--text-muted)' }} />
                        <span className="text-[10px] opacity-40" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm mb-3 opacity-60" style={{ color: 'var(--text-muted)' }}>Need an Access Key?</p>
              <a
                href="https://t.me/daemoncrow"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #0088cc 0%, #0077b5 100%)',
                  borderRadius: '100px',
                  color: '#fff',
                  boxShadow: '0 15px 35px -10px rgba(0, 136, 204, 0.4)',
                }}
              >
                <Send className="w-4 h-4" />
                <span className="font-medium">Contact @daemoncrow</span>
              </a>
            </div>
          </div>
        </div>

        <div className="relative z-10 py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-6">
              {['Systems Online', 'DB Connected'].map((label, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ boxShadow: '0 0 8px #10b981' }} />
                  <span className="text-[10px] font-mono opacity-40" style={{ color: 'var(--text-muted)' }}>{label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="pulse-dot" />
              <span className="text-[10px] font-mono uppercase tracking-wider opacity-40" style={{ color: 'var(--text-muted)' }}>
                Gateway Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
