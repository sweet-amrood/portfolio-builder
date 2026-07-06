const RESERVED_SLUGS = new Set([
  'login',
  'signup',
  'home',
  'templates',
  'my-templates',
  'my-portfolio',
  'dashboard',
  'profile',
  'builder',
  'contact',
  'forgot-password',
  'reset-password',
  'api',
  'admin',
  'settings',
  'help',
  'support',
  'about',
  'pricing',
  'blog',
  'www',
  'app',
  'auth',
  'oauth',
  'static',
  'assets',
  'public',
  'portfolio',
  'portfolios',
]);

export function normalizeSlug(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function validateSlug(slug) {
  if (!slug) {
    return { valid: false, reason: 'Portfolio name is required' };
  }
  if (slug.length < 3) {
    return { valid: false, reason: 'Portfolio name must be at least 3 characters' };
  }
  if (slug.length > 40) {
    return { valid: false, reason: 'Portfolio name must be 40 characters or less' };
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { valid: false, reason: 'Use only lowercase letters, numbers, and hyphens' };
  }
  if (RESERVED_SLUGS.has(slug)) {
    return { valid: false, reason: 'This name is reserved' };
  }
  return { valid: true };
}

export function slugFromName(name = '') {
  const first = String(name).trim().split(/\s+/)[0] || '';
  return normalizeSlug(first);
}

export function slugFromEmail(email = '') {
  const local = String(email).split('@')[0] || '';
  return normalizeSlug(local);
}

export function buildSlugSuggestions({ base, name = '', email = '' }) {
  const normalizedBase = normalizeSlug(base) || slugFromName(name) || slugFromEmail(email) || 'portfolio';
  const lastName = String(name).trim().split(/\s+/)[1] || '';
  const emailPart = slugFromEmail(email);
  const suffix = Math.floor(100 + Math.random() * 900);

  const raw = [
    normalizedBase,
    lastName ? `${normalizedBase}-${normalizeSlug(lastName).slice(0, 6)}` : '',
    emailPart && emailPart !== normalizedBase ? emailPart : '',
    `${normalizedBase}-dev`,
    `${normalizedBase}-portfolio`,
    `${normalizedBase}-${suffix}`,
    `${normalizedBase}-${Date.now().toString().slice(-4)}`,
  ];

  const unique = [];
  const seen = new Set();
  for (const candidate of raw) {
    const slug = normalizeSlug(candidate);
    if (!slug || seen.has(slug)) continue;
    const validation = validateSlug(slug);
    if (!validation.valid) continue;
    seen.add(slug);
    unique.push(slug);
    if (unique.length >= 6) break;
  }
  return unique;
}

export function getPublicPortfolioUrl(slug) {
  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
  return `${clientUrl}/${slug}`;
}
