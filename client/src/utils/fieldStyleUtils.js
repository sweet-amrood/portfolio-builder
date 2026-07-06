export const FIELD_FONT_WEIGHTS = [
  { value: 400, label: 'Regular', short: 'Rg' },
  { value: 500, label: 'Medium', short: 'Md' },
  { value: 600, label: 'Semibold', short: 'Sb' },
  { value: 700, label: 'Bold', short: 'Bd' },
];

export const FIELD_TEXT_ALIGNS = ['left', 'center', 'right'];

export const FIELD_FONT_SIZE_MIN = 10;
export const FIELD_FONT_SIZE_MAX = 96;
export const FIELD_SPACING_MIN = 0;
export const FIELD_SPACING_MAX = 120;
export const FIELD_MAX_WIDTH_MIN = 80;
export const FIELD_MAX_WIDTH_MAX = 1200;

const SPACING_KEYS = [
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'paddingTop',
  'paddingBottom',
];

function toPx(value) {
  if (value == null || value === '') return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

function toMaxWidth(value) {
  if (value == null || value === '') return undefined;
  if (typeof value === 'number') return `${value}px`;
  return value;
}

export function fieldStyleKey(section, field) {
  return `${section}::${field}`;
}

export function getFieldStyleRecord(fieldStyles, section, field) {
  if (!fieldStyles || !section || !field) return {};
  return fieldStyles[fieldStyleKey(section, field)] || {};
}

function needsBoxLayout(style) {
  return (
    SPACING_KEYS.some((key) => style[key] != null && style[key] !== '') ||
    Boolean(style.textAlign) ||
    (style.maxWidth != null && style.maxWidth !== '')
  );
}

export function resolveFieldStyleCss(fieldStyles, section, field) {
  const style = getFieldStyleRecord(fieldStyles, section, field);
  if (!Object.keys(style).length) return undefined;

  const css = {};
  if (style.fontSize != null && style.fontSize !== '') {
    css.fontSize = toPx(style.fontSize);
  }
  if (style.fontWeight != null && style.fontWeight !== '') {
    css.fontWeight = style.fontWeight;
  }
  if (style.fontFamily) {
    css.fontFamily = style.fontFamily;
  }
  if (style.color) {
    css.color = style.color;
  }
  if (style.textAlign) {
    css.textAlign = style.textAlign;
  }

  SPACING_KEYS.forEach((key) => {
    if (style[key] != null && style[key] !== '') {
      css[key] = toPx(style[key]);
    }
  });

  if (style.maxWidth != null && style.maxWidth !== '') {
    css.maxWidth = toMaxWidth(style.maxWidth);
  }

  if (needsBoxLayout(style)) {
    css.display = style.textAlign || style.maxWidth != null ? 'block' : 'inline-block';
    css.boxSizing = 'border-box';
    if (style.textAlign || style.maxWidth != null) {
      css.width = '100%';
    }
  }

  return Object.keys(css).length ? css : undefined;
}

export function patchFieldStyle(content, section, field, stylePatch) {
  if (!section || !field) return content;
  const next = structuredClone(content);
  if (!next.fieldStyles) next.fieldStyles = {};

  const key = fieldStyleKey(section, field);
  const merged = { ...getFieldStyleRecord(next.fieldStyles, section, field) };

  Object.entries(stylePatch).forEach(([prop, value]) => {
    if (value === undefined || value === null || value === '') {
      delete merged[prop];
    } else {
      merged[prop] = value;
    }
  });

  if (Object.keys(merged).length === 0) {
    delete next.fieldStyles[key];
  } else {
    next.fieldStyles[key] = merged;
  }

  if (Object.keys(next.fieldStyles).length === 0) {
    delete next.fieldStyles;
  }

  return next;
}

export function resetFieldStyle(content, section, field) {
  if (!section || !field) return content;
  const next = structuredClone(content);
  if (!next.fieldStyles) return content;

  delete next.fieldStyles[fieldStyleKey(section, field)];

  if (Object.keys(next.fieldStyles).length === 0) {
    delete next.fieldStyles;
  }

  return next;
}

export function resetSectionFieldStyles(content, sectionId) {
  if (!sectionId || !content?.fieldStyles) return content;
  const next = structuredClone(content);
  const prefix = `${sectionId}::`;

  Object.keys(next.fieldStyles).forEach((key) => {
    if (key.startsWith(prefix)) delete next.fieldStyles[key];
  });

  if (Object.keys(next.fieldStyles).length === 0) {
    delete next.fieldStyles;
  }

  return next;
}

export function hasFieldStyleOverrides(fieldStyles, section, field) {
  const style = getFieldStyleRecord(fieldStyles, section, field);
  return Object.keys(style).length > 0;
}
