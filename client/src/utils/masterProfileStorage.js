import { profileAPI } from '../services/api';
import { createEmptyMasterProfile } from '../constants/masterProfile';
import { normalizeProfileFromApi } from './masterProfileMerge';
import { countSkillItems } from './profileSkillUtils';

const localKey = (userId) => `Novafolio-master-profile-${userId || 'guest'}`;

function mergeProfileSources(remote, local) {
  if (!local) return remote;

  const hasText = (value) => typeof value === 'string' && value.trim().length > 0;
  const hasItems = (value) => Array.isArray(value) && value.length > 0;
  const mergeTextObjects = (remoteObj = {}, localObj = {}) => {
    const keys = new Set([...Object.keys(localObj), ...Object.keys(remoteObj)]);
    const merged = {};
    keys.forEach((key) => {
      const remoteValue = remoteObj[key];
      const localValue = localObj[key];
      merged[key] = hasText(remoteValue) ? remoteValue : localValue ?? remoteValue ?? '';
    });
    return merged;
  };
  const localHasMoreSkills = countSkillItems(local) > countSkillItems(remote);

  return {
    personal: mergeTextObjects(remote.personal, local.personal),
    profileImage: remote.profileImage || local.profileImage || null,
    resume: remote.resume || local.resume || null,
    links: mergeTextObjects(remote.links, local.links),
    skillGroups: localHasMoreSkills || !hasItems(remote.skillGroups) ? local.skillGroups : remote.skillGroups,
    experience: hasItems(remote.experience) ? remote.experience : local.experience,
    education: hasItems(remote.education) ? remote.education : local.education,
    projects: hasItems(remote.projects) ? remote.projects : local.projects,
    highlights: hasItems(remote.highlights) ? remote.highlights : local.highlights,
    stats: hasItems(remote.stats) ? remote.stats : local.stats,
  };
}

export function loadLocalMasterProfile(userId) {
  try {
    const raw = localStorage.getItem(localKey(userId));
    if (!raw) return null;
    return normalizeProfileFromApi(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveLocalMasterProfile(userId, profile) {
  localStorage.setItem(localKey(userId), JSON.stringify(profile));
}

export async function fetchMasterProfile(userId) {
  const local = loadLocalMasterProfile(userId);
  try {
    const { data } = await profileAPI.get();
    const remote = normalizeProfileFromApi(data.profile);
    const profile = mergeProfileSources(remote, local);
    saveLocalMasterProfile(userId, profile);
    return profile;
  } catch {
    return local || createEmptyMasterProfile();
  }
}

export async function saveMasterProfile(userId, profile) {
  saveLocalMasterProfile(userId, profile);
  try {
    const { data } = await profileAPI.update(profile);
    const saved = normalizeProfileFromApi(data.profile);
    saveLocalMasterProfile(userId, saved);
    return saved;
  } catch (error) {
    throw error;
  }
}

export async function parseResumeFile(file) {
  const formData = new FormData();
  formData.append('resume', file);
  const { data } = await profileAPI.parseResume(formData);
  return data;
}
