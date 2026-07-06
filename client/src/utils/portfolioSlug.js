export function normalizeSlug(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function slugFromName(name = '') {
  const first = String(name).trim().split(/\s+/)[0] || '';
  return normalizeSlug(first);
}

export function getPublicPortfolioPath(slug) {
  return `/${normalizeSlug(slug)}`;
}

export function getPublicPortfolioUrl(slug) {
  return `${window.location.origin}${getPublicPortfolioPath(slug)}`;
}
