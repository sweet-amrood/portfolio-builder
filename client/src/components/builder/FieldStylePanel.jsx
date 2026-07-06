import { HiArrowPath, HiArrowDown, HiArrowUp } from 'react-icons/hi2';
import { TbAlignCenter, TbAlignLeft, TbAlignRight } from 'react-icons/tb';
import {
  PORTFOLIO_FONT_CATEGORIES,
  getFontsByCategory,
} from '../../constants/portfolioFonts';
import { loadFontByValue } from '../../utils/loadPortfolioFont';
import {
  FIELD_FONT_SIZE_MAX,
  FIELD_FONT_SIZE_MIN,
  FIELD_FONT_WEIGHTS,
  FIELD_MAX_WIDTH_MAX,
  FIELD_MAX_WIDTH_MIN,
  FIELD_SPACING_MAX,
  FIELD_SPACING_MIN,
  FIELD_TEXT_ALIGNS,
  getFieldStyleRecord,
  hasFieldStyleOverrides,
} from '../../utils/fieldStyleUtils';
import {
  getListItemMoveState,
  parseIndexedFieldPath,
} from '../../utils/builderListFieldUtils';

const ALIGN_ICONS = {
  left: TbAlignLeft,
  center: TbAlignCenter,
  right: TbAlignRight,
};

function AlignButton({ value, active, onClick }) {
  const Icon = ALIGN_ICONS[value];
  return (
    <button
      type="button"
      className={`builder-field-align-btn${active ? ' builder-field-align-btn--active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
      title={`Align ${value}`}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  );
}

function SpacingInput({ id, label, value, onChange }) {
  return (
    <label className="builder-field-spacing-cell" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        type="number"
        min={FIELD_SPACING_MIN}
        max={FIELD_SPACING_MAX}
        value={value ?? ''}
        placeholder="—"
        onChange={(e) => {
          const next = e.target.value === '' ? undefined : Number(e.target.value);
          onChange(next);
        }}
      />
    </label>
  );
}

export default function FieldStylePanel({
  selectedField,
  fieldStyles,
  content,
  onStyleChange,
  onResetStyle,
  onListItemMove,
}) {
  if (!selectedField) return null;

  const { section, field, label } = selectedField;
  const style = getFieldStyleRecord(fieldStyles, section, field);
  const hasOverrides = hasFieldStyleOverrides(fieldStyles, section, field);
  const update = (patch) => onStyleChange(section, field, patch);

  const listMeta = parseIndexedFieldPath(field);
  const listMove = listMeta
    ? getListItemMoveState(content, listMeta.arrayPath, listMeta.index)
    : null;

  return (
    <div className="builder-field-style-panel">
      <div className="builder-field-typography-head">
        <div>
          <p className="builder-field-typography-label">Selected text</p>
          <h3>{label || field}</h3>
        </div>
        {hasOverrides && (
          <button
            type="button"
            className="builder-field-typography-reset"
            onClick={() => onResetStyle(section, field)}
            title="Reset field styles to template default"
          >
            <HiArrowPath size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="builder-field-style-section">
        <div className="form-group">
          <label htmlFor="field-font-family">Font</label>
          <select
            id="field-font-family"
            className="builder-field-font-select"
            value={style.fontFamily || ''}
            onChange={(e) => {
              const next = e.target.value || undefined;
              if (next) loadFontByValue(next);
              update({ fontFamily: next });
            }}
          >
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
          {style.fontFamily && (
            <p className="builder-field-font-preview" style={{ fontFamily: style.fontFamily }}>
              The quick brown fox jumps over the lazy dog
            </p>
          )}
        </div>
      </div>

      <div className="builder-field-style-section">
        <p className="builder-field-style-section-title">Typography</p>
        <div className="builder-field-typography-grid">
          <div className="form-group">
            <label htmlFor="field-font-size">Size</label>
            <div className="builder-field-size-row">
              <input
                id="field-font-size"
                type="number"
                min={FIELD_FONT_SIZE_MIN}
                max={FIELD_FONT_SIZE_MAX}
                value={style.fontSize ?? ''}
                placeholder="Default"
                onChange={(e) => {
                  const next = e.target.value === '' ? undefined : Number(e.target.value);
                  update({ fontSize: next });
                }}
              />
              <span className="builder-field-size-unit">px</span>
            </div>
            {style.fontSize != null && (
              <input
                className="builder-field-size-slider"
                type="range"
                min={FIELD_FONT_SIZE_MIN}
                max={FIELD_FONT_SIZE_MAX}
                value={style.fontSize}
                onChange={(e) => update({ fontSize: Number(e.target.value) })}
              />
            )}
          </div>

          <div className="form-group">
            <span className="builder-field-align-label">Weight</span>
            <div className="builder-field-weight-group">
              {FIELD_FONT_WEIGHTS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`builder-field-weight-btn${
                    (style.fontWeight ?? null) === item.value ? ' builder-field-weight-btn--active' : ''
                  }`}
                  onClick={() =>
                    update({
                      fontWeight: style.fontWeight === item.value ? undefined : item.value,
                    })
                  }
                  title={item.label}
                >
                  <span className="builder-field-weight-short">{item.short}</span>
                  <span className="builder-field-weight-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="field-color">Color</label>
            <div className="builder-field-color-row">
              <input
                id="field-color"
                type="color"
                value={style.color || '#ffffff'}
                onChange={(e) => update({ color: e.target.value })}
              />
              <input
                type="text"
                value={style.color || ''}
                placeholder="Default"
                onChange={(e) => update({ color: e.target.value || undefined })}
              />
            </div>
          </div>

          <div className="form-group">
            <span className="builder-field-align-label">Alignment</span>
            <div className="builder-field-align-group">
              {FIELD_TEXT_ALIGNS.map((align) => (
                <AlignButton
                  key={align}
                  value={align}
                  active={(style.textAlign || '') === align}
                  onClick={() => update({ textAlign: style.textAlign === align ? undefined : align })}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="builder-field-style-section">
        <p className="builder-field-style-section-title">Spacing</p>
        <div className="builder-field-spacing-block">
          <span className="builder-field-spacing-title">Margin (px)</span>
          <div className="builder-field-spacing-grid builder-field-spacing-grid--4">
            <SpacingInput
              id="field-margin-top"
              label="T"
              value={style.marginTop}
              onChange={(value) => update({ marginTop: value })}
            />
            <SpacingInput
              id="field-margin-right"
              label="R"
              value={style.marginRight}
              onChange={(value) => update({ marginRight: value })}
            />
            <SpacingInput
              id="field-margin-bottom"
              label="B"
              value={style.marginBottom}
              onChange={(value) => update({ marginBottom: value })}
            />
            <SpacingInput
              id="field-margin-left"
              label="L"
              value={style.marginLeft}
              onChange={(value) => update({ marginLeft: value })}
            />
          </div>
        </div>
        <div className="builder-field-spacing-block">
          <span className="builder-field-spacing-title">Padding (px)</span>
          <div className="builder-field-spacing-grid builder-field-spacing-grid--2">
            <SpacingInput
              id="field-padding-top"
              label="T"
              value={style.paddingTop}
              onChange={(value) => update({ paddingTop: value })}
            />
            <SpacingInput
              id="field-padding-bottom"
              label="B"
              value={style.paddingBottom}
              onChange={(value) => update({ paddingBottom: value })}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="field-max-width">Max width</label>
          <div className="builder-field-size-row">
            <input
              id="field-max-width"
              type="text"
              value={style.maxWidth ?? ''}
              placeholder="Default"
              onChange={(e) => {
                const raw = e.target.value.trim();
                if (!raw) {
                  update({ maxWidth: undefined });
                  return;
                }
                if (/^\d+$/.test(raw)) {
                  update({ maxWidth: Number(raw) });
                  return;
                }
                update({ maxWidth: raw });
              }}
            />
            <span className="builder-field-size-unit">px / %</span>
          </div>
          {style.maxWidth != null && typeof style.maxWidth === 'number' && (
            <input
              className="builder-field-size-slider"
              type="range"
              min={FIELD_MAX_WIDTH_MIN}
              max={FIELD_MAX_WIDTH_MAX}
              value={style.maxWidth}
              onChange={(e) => update({ maxWidth: Number(e.target.value) })}
            />
          )}
        </div>
      </div>

      {listMeta && listMove && (
        <div className="builder-field-style-section">
          <p className="builder-field-style-section-title">List position</p>
          <p className="builder-field-list-position-meta">
            Item {listMeta.index + 1} of {listMove.total}
          </p>
          <div className="builder-field-list-move">
            <button
              type="button"
              className="builder-field-list-move-btn"
              disabled={!listMove.canMoveUp}
              onClick={() => onListItemMove(listMeta.arrayPath, listMeta.index, 'up')}
            >
              <HiArrowUp size={15} />
              Move up
            </button>
            <button
              type="button"
              className="builder-field-list-move-btn"
              disabled={!listMove.canMoveDown}
              onClick={() => onListItemMove(listMeta.arrayPath, listMeta.index, 'down')}
            >
              <HiArrowDown size={15} />
              Move down
            </button>
          </div>
        </div>
      )}

      <p className="builder-field-typography-hint">
        Single-click to select. Double-click the canvas text to edit inline.
      </p>
    </div>
  );
}
