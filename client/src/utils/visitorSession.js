export function saveVisitorSession(slug, { token, name, email }) {
  if (!slug || !token) return;
  localStorage.setItem(`Novafolio-visitor-token-${slug}`, token);
  if (name || email) {
    localStorage.setItem(
      `Novafolio-visitor-profile-${slug}`,
      JSON.stringify({ name: name || '', email: email || '' })
    );
  }
}

export function loadVisitorSession(slug) {
  if (!slug) return { token: '', profile: null };
  try {
    const token = localStorage.getItem(`Novafolio-visitor-token-${slug}`) || '';
    const raw = localStorage.getItem(`Novafolio-visitor-profile-${slug}`);
    const profile = raw ? JSON.parse(raw) : null;
    return { token, profile };
  } catch {
    return { token: '', profile: null };
  }
}

export function clearVisitorSession(slug) {
  if (!slug) return;
  localStorage.removeItem(`Novafolio-visitor-token-${slug}`);
  localStorage.removeItem(`Novafolio-visitor-profile-${slug}`);
}
