import { useId } from 'react';
import { Link } from 'react-router-dom';

function NovaMark({ className = '' }) {
  const gid = useId().replace(/:/g, '');

  return (
    <svg
      className={`brand-logo-mark ${className}`.trim()}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0e7490" />
          <stop offset="0.55" stopColor="#0891b2" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="#07111f" />
      <rect
        x="1.25"
        y="1.25"
        width="29.5"
        height="29.5"
        rx="7.75"
        stroke={`url(#${gid})`}
        strokeWidth="1.5"
        opacity="0.95"
      />
      <path
        d="M9 22.5V9.5h4.1c2.55 0 4.15 1.35 4.15 3.45 0 1.35-.7 2.4-1.9 2.95L19.9 22.5h-3.55l-3.7-5.85H12.2V22.5H9zm3.2-8.55h.75c1.15 0 1.85-.55 1.85-1.5s-.7-1.45-1.85-1.45H12.2v2.95z"
        fill="#ecfeff"
      />
      <circle cx="23.2" cy="10.3" r="2.15" fill="#67e8f9" />
      <circle cx="23.2" cy="10.3" r="3.6" stroke="#67e8f9" strokeOpacity="0.35" strokeWidth="1" />
    </svg>
  );
}

export default function BrandLogo({
  to,
  size = 'md',
  variant = 'compact',
  showText = true,
  className = '',
  onClick,
}) {
  const isFull = variant === 'full';
  const showWordmark = showText || isFull;

  const content = (
    <>
      <NovaMark />
      {showWordmark ? (
        <span className="brand-logo-text">
          Nova<span className="brand-logo-accent">folio</span>
        </span>
      ) : null}
    </>
  );

  const rootClass = `brand-logo brand-logo--${size} brand-logo--${isFull ? 'full' : 'compact'}${className ? ` ${className}` : ''}`;

  if (to) {
    return (
      <Link to={to} className={rootClass} onClick={onClick} aria-label="Novafolio">
        {content}
      </Link>
    );
  }

  return (
    <span
      className={rootClass}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label="Novafolio"
    >
      {content}
    </span>
  );
}
