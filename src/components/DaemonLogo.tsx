interface DaemonLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export function DaemonLogo({ size = 'md', showText = true, className = '' }: DaemonLogoProps) {
  const sizes = {
    sm: { icon: 32, text: 'text-sm', gap: 'gap-2.5' },
    md: { icon: 40, text: 'text-base', gap: 'gap-3' },
    lg: { icon: 80, text: 'text-xl', gap: 'gap-4' },
    xl: { icon: 120, text: 'text-3xl', gap: 'gap-5' },
  };

  const { icon: iconSize, text: textSize, gap } = sizes[size];

  return (
    <div className={`flex items-center ${gap} ${className}`}>
      <div className="relative">
        <img
          src="/logo.png"
          alt="Daemoncrow"
          width={iconSize}
          height={iconSize}
          className="transition-all duration-300 object-contain"
        />
      </div>

      {showText && (
        <span
          className={`logo-text ${textSize} font-semibold tracking-[0.2em] transition-colors duration-300`}
        >
          <span style={{ color: '#dc2626' }}>Daemon</span>
          <span style={{ color: '#b91c1c' }}>crow</span>
        </span>
      )}
    </div>
  );
}
