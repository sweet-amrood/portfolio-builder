import { resolveDevToolIcon, FallbackDevIcon } from '../constants/devToolIcons';

export default function DevToolIcon({
  name,
  size = 20,
  className = '',
  showFallback = false,
  style,
}) {
  const entry = resolveDevToolIcon(name);

  if (!entry) {
    if (!showFallback) return null;
    return <FallbackDevIcon size={size} className={`pf-dev-icon pf-dev-icon--fallback ${className}`.trim()} style={style} />;
  }

  const { Icon, color } = entry;

  return (
    <Icon
      size={size}
      className={`pf-dev-icon ${className}`.trim()}
      style={{ color, ...style }}
      aria-hidden="true"
    />
  );
}

export function TechBadge({ name, className = '' }) {
  const hasIcon = Boolean(resolveDevToolIcon(name));

  return (
    <span
      className={`pf-tech-badge${hasIcon ? '' : ' pf-tech-badge--text-only'} ${className}`.trim()}
    >
      {hasIcon ? <DevToolIcon name={name} size={15} /> : null}
      <span>{name}</span>
    </span>
  );
}

export function ToolIconTile({ name, size = 22, className = '' }) {
  const entry = resolveDevToolIcon(name);
  if (!entry) return null;

  const { color } = entry;

  return (
    <span
      className={`pf-tool-icon-tile ${className}`.trim()}
      style={{
        '--tool-accent': color,
        background: `${color}18`,
        borderColor: `${color}55`,
      }}
    >
      <DevToolIcon name={name} size={size} />
    </span>
  );
}
