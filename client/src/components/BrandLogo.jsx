import { useState } from 'react';
import { Link } from 'react-router-dom';

const LOGO = '/logo.png';

const compactHeights = {
  sm: 34,
  md: 40,
  lg: 46,
};

const fullHeights = {
  sm: 72,
  md: 96,
  lg: 120,
};

export default function BrandLogo({
  to,
  size = 'md',
  variant = 'compact',
  showText = false,
  className = '',
  onClick,
}) {
  const [failed, setFailed] = useState(false);
  const isFull = variant === 'full';
  const isNav = className.includes('brand-logo--nav');
  const height = isNav
    ? undefined
    : isFull
      ? fullHeights[size] || fullHeights.md
      : compactHeights[size] || compactHeights.md;

  const content = failed ? (
    <span className="brand-logo-text">
      Portfolio<span className="brand-logo-accent">Forge</span>
    </span>
  ) : (
    <>
      <img
        src={LOGO}
        alt="Portfolio Forge"
        className={`brand-logo-image${isFull ? ' brand-logo-image--full' : ' brand-logo-image--compact'}`}
        style={height ? { height } : undefined}
        draggable={false}
        onError={() => setFailed(true)}
      />
      {showText ? (
        <span className="brand-logo-text">
          Portfolio<span className="brand-logo-accent">Forge</span>
        </span>
      ) : null}
    </>
  );

  const rootClass = `brand-logo brand-logo--${size} brand-logo--${isFull ? 'full' : 'compact'}${className ? ` ${className}` : ''}`;

  if (to) {
    return (
      <Link to={to} className={rootClass} onClick={onClick}>
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
    >
      {content}
    </span>
  );
}
