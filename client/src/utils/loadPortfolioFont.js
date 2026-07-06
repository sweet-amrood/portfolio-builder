import { findFontByValue } from '../constants/portfolioFonts';

const loadedGoogleSpecs = new Set();

export function loadGoogleFontSpec(googleSpec) {
  if (!googleSpec || loadedGoogleSpecs.has(googleSpec)) return;
  loadedGoogleSpecs.add(googleSpec);

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${googleSpec}&display=swap`;
  document.head.appendChild(link);
}

export function loadFontByValue(fontValue) {
  const font = findFontByValue(fontValue);
  if (font?.google) loadGoogleFontSpec(font.google);
}

export function loadFontsFromContent(content) {
  if (!content) return;
  const bodyFont = content.templateBodyFont || content.templateFont;
  if (bodyFont) loadFontByValue(bodyFont);
  if (content.templateHeadingFont) loadFontByValue(content.templateHeadingFont);
  if (content.fieldStyles) {
    Object.values(content.fieldStyles).forEach((style) => {
      if (style?.fontFamily) loadFontByValue(style.fontFamily);
    });
  }
}
