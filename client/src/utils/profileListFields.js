export function parseCommaList(value) {
  if (!value?.trim()) return [];
  return value
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function listDraftsFromProfile(profile) {
  return {
    skillDrafts: profile.skillGroups.map((g) => (g.items || []).join(', ')),
    techDrafts: profile.projects.map((p) => (p.tech || []).join(', ')),
  };
}

export function commitListFields(profile, skillDrafts, techDrafts) {
  return {
    ...profile,
    skillGroups: profile.skillGroups.map((g, i) => ({
      ...g,
      items: parseCommaList(skillDrafts[i] ?? (g.items || []).join(', ')),
    })),
    projects: profile.projects.map((p, i) => ({
      ...p,
      tech: parseCommaList(techDrafts[i] ?? (p.tech || []).join(', ')),
    })),
  };
}
