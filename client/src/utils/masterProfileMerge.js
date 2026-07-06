import { createEmptyMasterProfile } from '../constants/masterProfile';

function pickNonEmpty(target, source) {
  if (!source || typeof source !== 'object') return target;
  const next = { ...target };
  Object.entries(source).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value) && value.length === 0) return;
    next[key] = value;
  });
  return next;
}

function mergeList(existing, incoming, replace) {
  if (!incoming?.length) return existing;
  return replace ? incoming : existing?.length ? existing : incoming;
}

export function mergeExtractedIntoProfile(profile, extracted, { replaceLists = false } = {}) {
  const base = profile || createEmptyMasterProfile();
  const next = structuredClone(base);

  if (extracted.personal) {
    next.personal = pickNonEmpty(next.personal || {}, extracted.personal);
    if (extracted.personal.bio && !next.personal.about) {
      next.personal.about = extracted.personal.bio;
    }
    if (extracted.personal.headline && !next.personal.tagline) {
      next.personal.tagline = extracted.personal.headline;
    }
  }

  if (extracted.links) {
    next.links = pickNonEmpty(next.links || {}, extracted.links);
  }

  next.skillGroups = mergeList(next.skillGroups, extracted.skillGroups, replaceLists);
  next.experience = mergeList(next.experience, extracted.experience, replaceLists);
  next.education = mergeList(next.education, extracted.education, replaceLists);
  next.projects = mergeList(next.projects, extracted.projects, replaceLists);
  next.highlights = mergeList(next.highlights, extracted.highlights, replaceLists);
  next.stats = mergeList(next.stats, extracted.stats, replaceLists);

  return next;
}

export function normalizeProfileFromApi(data) {
  const empty = createEmptyMasterProfile();
  if (!data) return empty;

  return {
    personal: { ...empty.personal, ...(data.personal || {}) },
    profileImage: data.profileImage ?? null,
    resume: data.resume ?? null,
    links: { ...empty.links, ...(data.links || {}) },
    skillGroups: data.skillGroups?.length ? data.skillGroups : empty.skillGroups,
    experience: data.experience || [],
    education: data.education || [],
    projects: data.projects || [],
    highlights: data.highlights || [],
    stats: data.stats || [],
  };
}
