const VISITOR_ID_KEY = 'portfolioforge-visitor-id';

export function getVisitorId() {
  let id = sessionStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

function visitStorageKey(slug) {
  return `portfolioforge-visit-tracked-${slug}`;
}

export function hasTrackedVisit(slug) {
  return sessionStorage.getItem(visitStorageKey(slug)) === '1';
}

export function markVisitTracked(slug) {
  sessionStorage.setItem(visitStorageKey(slug), '1');
}
