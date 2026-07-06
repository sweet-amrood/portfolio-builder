const TOOL_GROUP_RE = /\b(tools?|technologies|tech\s*stack|devops|platforms?)\b/i;

function tokenizeItems(items = []) {
  return items
    .flatMap((item) => String(item || '').split(/[,;\n]+/))
    .map((token) => token.trim())
    .filter(Boolean);
}

export function countSkillItems(profile) {
  return (profile?.skillGroups || []).reduce((total, group) => total + (group.items?.length || 0), 0);
}

export function normalizeSkillGroups(skillGroups) {
  if (!skillGroups?.length) return [];

  return skillGroups
    .map((group) => ({
      name: (group.name || 'Skills').trim(),
      items: tokenizeItems(group.items || []),
    }))
    .filter((group) => group.items.length > 0);
}

export function splitSkillAndToolGroups(skillGroups) {
  const groups = normalizeSkillGroups(skillGroups);
  if (!groups.length) {
    return {
      groups: [],
      skillGroups: [],
      toolGroups: [],
      allSkills: [],
      allTools: [],
    };
  }

  const toolGroups = groups.filter((group) => TOOL_GROUP_RE.test(group.name));
  const skillOnlyGroups = groups.filter((group) => !TOOL_GROUP_RE.test(group.name));
  const allSkills = (skillOnlyGroups.length ? skillOnlyGroups : groups).flatMap((group) => group.items);
  const allTools = toolGroups.flatMap((group) => group.items);

  return {
    groups,
    skillGroups: skillOnlyGroups.length ? skillOnlyGroups : groups,
    toolGroups,
    allSkills,
    allTools,
  };
}

export function splitIntoTwoRows(items) {
  if (!items.length) return [[], []];
  const half = Math.ceil(items.length / 2);
  return [items.slice(0, half), items.slice(half)];
}

export function toSawadTools(names) {
  return names.map((name) => ({ name, desc: '', showDesc: false }));
}
