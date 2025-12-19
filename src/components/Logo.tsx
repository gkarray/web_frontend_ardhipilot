interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sizeClasses = {
  small: 'h-12',
  medium: 'h-16',
  large: 'h-24',
};

export function Logo({ size = 'medium', className = '' }: LogoProps) {
  return (
    <img
      src="/logo_ardhipilot.png"
      alt="ArdhiPilot"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
}

