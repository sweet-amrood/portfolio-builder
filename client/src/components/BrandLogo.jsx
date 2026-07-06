import { useState } from 'react';
import { Link } from 'react-router-dom';

const LOGO_FULL = '/logo.png';
const LOGO_ICON = '/favicon.svg';

const iconSizes = {
  sm: 28,
  md: 32,
  lg: 38,
};

const fullHeights = {
  sm: 72,
  md: 88,
  lg: 104,
};

export default function BrandLogo({
  to,
  size = 'md',
  variant = 'compact',
  showText,
  className = '',
  onClick,
}) {
  const [fullLogoFailed, setFullLogoFailed] = useState(false);
  const useCompact = variant !== 'full' || fullLogoFailed;
  const showLabel = showText ?? useCompact;

  let content;

  if (!useCompact) {
    content = (
      <img
        src={LOGO_FULL}
        alt="PortfolioForge"
        className="brand-logo-image brand-logo-image--full"
        style={{ height: fullHeights[size] || fullHeights.md }}
        draggable={false}
        onError={() => setFullLogoFailed(true)}
      />
    );
  } else {
    const iconPx = iconSizes[size] || iconSizes.md;
    content = (
      <>
        <img
          src={LOGO_ICON}
          alt=""
          aria-hidden="true"
          className="brand-logo-icon"
          width={iconPx}
          height={iconPx}
          draggable={false}
        />
        {showLabel ? (
          <span className="brand-logo-text">
            Portfolio<span className="brand-logo-accent">Forge</span>
          </span>
        ) : null}
      </>
    );
  }

  const rootClass = `brand-logo brand-logo--${size} brand-logo--${useCompact ? 'compact' : 'full'}${className ? ` ${className}` : ''}`;

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
