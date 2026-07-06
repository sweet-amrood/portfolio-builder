import { HiArrowPath } from 'react-icons/hi2';
import {
  PORTFOLIO_FONT_CATEGORIES,
  PORTFOLIO_FONTS,
  TEMPLATE_FONT_QUICK_PICKS,
  TEMPLATE_HEADING_FONT_QUICK_PICKS,
  findFontByValue,
  getFontsByCategory,
} from '../../constants/portfolioFonts';
import { loadFontByValue } from '../../utils/loadPortfolioFont';

function FontSelect({ id, value, onChange }) {
  return (
    <select id={id} className="builder-field-font-select" value={value || ''} onChange={onChange}>
      {PORTFOLIO_FONT_CATEGORIES.map((category) => {
        const fonts = getFontsByCategory(category.id);
        if (!fonts.length) return null;
        return (
          <optgroup key={category.id} label={category.label}>
            {fonts.map((font) => (
              <option key={font.id} value={font.value}>
                {font.label}
              </option>
            ))}
          </optgroup>
        );
      })}
    </select>
  );
}

function FontRolePicker({
  roleId,
  title,
  description,
  value,
  quickPickIds,
  onSelect,
  previewTitle,
  previewBody,
}) {
  const active = findFontByValue(value || '');

  const handleSelect = (nextValue) => {
    const resolved = nextValue || undefined;
    if (resolved) loadFontByValue(resolved);
    onSelect(resolved);
  };

  return (
    <div className="builder-template-font-role">
      <div className="builder-template-font-role-head">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className="builder-template-font-quick">
        {quickPickIds.map((fontId) => {
          const font = PORTFOLIO_FONTS.find((item) => item.id === fontId);
          if (!font?.value) return null;
          const isActive = value === font.value;
          return (
            <button
              key={font.id}
              type="button"
              className={`builder-template-font-chip${isActive ? ' builder-template-font-chip--active' : ''}`}
              style={{ fontFamily: font.value }}
              onClick={() => handleSelect(font.value)}
              title={`Apply ${font.label}`}
            >
              {font.label}
            </button>
          );
        })}
      </div>

      <label className="builder-v2-field" htmlFor={`${roleId}-font-select`}>
        <span className="builder-v2-field-label">All fonts</span>
        <FontSelect
          id={`${roleId}-font-select`}
          value={value || ''}
          onChange={(e) => handleSelect(e.target.value || undefined)}
        />
      </label>

      <div
        className="builder-template-font-preview"
        style={value ? { fontFamily: value } : undefined}
      >
        <p className="builder-template-font-preview-kicker">{active.label}</p>
        <p className="builder-template-font-preview-title" style={roleId === 'heading' ? { fontFamily: value || undefined } : undefined}>
          {previewTitle}
        </p>
        <p className="builder-template-font-preview-body" style={roleId === 'body' ? { fontFamily: value || undefined } : undefined}>
          {previewBody}
        </p>
      </div>

      {value && (
        <button type="button" className="builder-template-font-reset" onClick={() => handleSelect(undefined)}>
          <HiArrowPath size={14} />
          Reset to template default
        </button>
      )}
    </div>
  );
}

export default function BuilderTemplateFontPicker({
  templateBodyFont,
  templateHeadingFont,
  onBodyFontSelect,
  onHeadingFontSelect,
}) {
  return (
    <div className="builder-template-font-picker">
      <p className="builder-template-font-lead">
        Set body and heading fonts separately. Per-field overrides in the inspector still win on individual text.
      </p>

      <FontRolePicker
        roleId="body"
        title="Body font"
        description="Paragraphs, labels, nav links, and general UI text."
        value={templateBodyFont}
        quickPickIds={TEMPLATE_FONT_QUICK_PICKS}
        onSelect={onBodyFontSelect}
        previewTitle="Your portfolio, your voice."
        previewBody="The quick brown fox jumps over the lazy dog. 0123456789"
      />

      <div className="builder-v2-panel-divider" />

      <FontRolePicker
        roleId="heading"
        title="Heading font"
        description="Hero titles, section headings, project names, and large display text."
        value={templateHeadingFont}
        quickPickIds={TEMPLATE_HEADING_FONT_QUICK_PICKS}
        onSelect={onHeadingFontSelect}
        previewTitle="Design that speaks loud."
        previewBody="Body text stays on the body font unless you change it per field."
      />
    </div>
  );
}
