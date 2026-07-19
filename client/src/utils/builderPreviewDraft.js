const DRAFT_PREFIX = 'Novafolio-builder-preview-';
const PUBLISHED_PREFIX = 'Novafolio-published-';

function storageKey(templateId) {
  return `${DRAFT_PREFIX}${templateId}`;
}

function publishedStorageKey(templateId) {
  return `${PUBLISHED_PREFIX}${templateId}`;
}

export function saveBuilderPreviewDraft(draft) {
  const payload = {
    templateId: draft.templateId,
    content: draft.content,
    sectionOrder: draft.sectionOrder,
    themeId: draft.themeId,
    savedAt: Date.now(),
  };
  localStorage.setItem(storageKey(draft.templateId), JSON.stringify(payload));
}

export function loadBuilderPreviewDraft(templateId) {
  if (!templateId) return null;
  try {
    const raw = localStorage.getItem(storageKey(templateId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function removeSavedPortfolioDraft(templateId) {
  if (!templateId) return;
  localStorage.removeItem(storageKey(templateId));
  localStorage.removeItem(publishedStorageKey(templateId));
}

export function listSavedPortfolioDrafts() {
  const entries = [];

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key?.startsWith(DRAFT_PREFIX)) continue;

    try {
      const draft = JSON.parse(localStorage.getItem(key));
      if (!draft?.content) continue;

      const templateId = draft.templateId || key.slice(DRAFT_PREFIX.length);
      entries.push({ templateId, draft });
    } catch {
      continue;
    }
  }

  return entries.sort((a, b) => (b.draft.savedAt || 0) - (a.draft.savedAt || 0));
}

export function loadSavedPortfolioDraft(templateId) {
  const draft = loadBuilderPreviewDraft(templateId);
  if (!draft?.content) return null;
  return { templateId, draft };
}

export function publishPortfolioDraft(draft) {
  if (!draft?.templateId || !draft?.content) return null;
  const payload = {
    templateId: draft.templateId,
    content: structuredClone(draft.content),
    sectionOrder: [...(draft.sectionOrder || [])],
    themeId: draft.themeId,
    publishedAt: Date.now(),
    updatedAt: Date.now(),
  };
  localStorage.setItem(publishedStorageKey(draft.templateId), JSON.stringify(payload));
  return payload;
}

export function listPublishedPortfolioDrafts() {
  const entries = [];

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key?.startsWith(PUBLISHED_PREFIX)) continue;
    try {
      const draft = JSON.parse(localStorage.getItem(key));
      if (!draft?.content) continue;
      const templateId = draft.templateId || key.slice(PUBLISHED_PREFIX.length);
      entries.push({ templateId, draft });
    } catch {
      continue;
    }
  }

  return entries.sort((a, b) => (b.draft.publishedAt || 0) - (a.draft.publishedAt || 0));
}

export function hasSavedPortfolios() {
  return listSavedPortfolioDrafts().length > 0;
}

export function getMyTemplatesPath() {
  return '/my-templates';
}

export function getSavedTemplatePath(templateId, clean = false) {
  const base = `/my-templates/${templateId}`;
  return clean ? `${base}?clean=1` : base;
}

export function getMyPortfolioPath() {
  return getMyTemplatesPath();
}

export function getBuilderPreviewPath(templateId) {
  return `/templates/${templateId}/preview?draft=1`;
}

export function openBuilderPreview(draft) {
  saveBuilderPreviewDraft({
    templateId: draft.templateId,
    content: structuredClone(draft.content),
    sectionOrder: [...draft.sectionOrder],
    themeId: draft.themeId,
  });
  const url = `${window.location.origin}${getBuilderPreviewPath(draft.templateId)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function buildDraftSnapshot({ templateId, content, sectionOrder, themeId }) {
  return {
    templateId,
    content: structuredClone(content),
    sectionOrder: [...sectionOrder],
    themeId,
  };
}

export function formatSavedAt(savedAt) {
  if (!savedAt) return 'Recently saved';
  return new Date(savedAt).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
