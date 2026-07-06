export function getContentByPath(content, path) {
  if (!path || !content) return undefined;
  return path.split('.').reduce((acc, part) => acc?.[part], content);
}

export function patchContentField(content, path, value) {
  if (!path || !content) return content;
  const next = structuredClone(content);
  const parts = path.split('.');
  let node = next;
  for (let i = 0; i < parts.length - 1; i += 1) {
    node = node[parts[i]];
    if (node == null) return content;
  }
  node[parts[parts.length - 1]] = value;
  return next;
}
