export function appendListItem(list, item) {
  return [...(list || []), structuredClone(item)];
}

export function removeListItemAt(list, index, minLength = 0) {
  const current = list || [];
  if (current.length <= minLength) return current;
  return current.filter((_, i) => i !== index);
}

export function updateListItemAt(list, index, patch) {
  return (list || []).map((item, i) => (i === index ? { ...item, ...patch } : item));
}
