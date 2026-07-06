import { getThemesForTemplate } from '../constants/templateThemes';

export default function BuilderThemePicker({ templateId, activeThemeId, onSelect }) {
  const themes = getThemesForTemplate(templateId);

  if (!themes.length) {
    return (
      <p className="builder-theme-empty">No color themes available for this template yet.</p>
    );
  }

  return (
    <div className="builder-themes">
      {themes.map((theme) => (
        <button
          key={theme.id}
          type="button"
          className={`builder-theme-card${activeThemeId === theme.id ? ' builder-theme-card--active' : ''}`}
          onClick={() => onSelect(theme.id)}
          title={theme.name}
        >
          <span className="builder-theme-swatch">
            <span style={{ background: theme.swatch[0] }} />
            <span style={{ background: theme.swatch[1] }} />
          </span>
          <span className="builder-theme-name">{theme.name}</span>
        </button>
      ))}
    </div>
  );
}
