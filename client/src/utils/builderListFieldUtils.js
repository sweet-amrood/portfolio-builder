import { getContentByPath } from './builderFieldUtils';

export function parseIndexedFieldPath(field) {
  if (!field) return null;
  const parts = field.split('.');
  for (let i = 0; i < parts.length; i += 1) {
    if (/^\d+$/.test(parts[i])) {
      return {
        arrayPath: parts.slice(0, i).join('.'),
        index: Number(parts[i]),
      };
    }
  }
  return null;
}

export function remapIndexedFieldPath(field, oldIndex, newIndex) {
  if (!field || oldIndex === newIndex) return field;
  const token = `.${oldIndex}.`;
  if (field.includes(token)) return field.replace(token, `.${newIndex}.`);
  if (field.endsWith(`.${oldIndex}`)) return field.slice(0, -String(oldIndex).length) + String(newIndex);
  return field;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function swapFieldStylesForListItem(fieldStyles, arrayPath, indexA, indexB) {
  if (!fieldStyles || indexA === indexB) return fieldStyles;

  const next = structuredClone(fieldStyles);
  const arrayPrefix = `${arrayPath}.`;
  const pathPattern = new RegExp(`^${escapeRegExp(arrayPath)}\\.(\\d+)(.*)$`);
  const bucketA = [];
  const bucketB = [];

  Object.entries(next).forEach(([key, value]) => {
    const sep = key.indexOf('::');
    if (sep === -1) return;
    const section = key.slice(0, sep);
    const fieldPath = key.slice(sep + 2);
    const match = fieldPath.match(pathPattern);
    if (!match) return;
    const idx = Number(match[1]);
    const tail = match[2];
    if (idx === indexA) bucketA.push({ section, tail, value });
    if (idx === indexB) bucketB.push({ section, tail, value });
    delete next[key];
  });

  bucketA.forEach(({ section, tail, value }) => {
    next[`${section}::${arrayPath}.${indexB}${tail}`] = value;
  });
  bucketB.forEach(({ section, tail, value }) => {
    next[`${section}::${arrayPath}.${indexA}${tail}`] = value;
  });

  return Object.keys(next).length ? next : undefined;
}

export function swapAdjacentListItem(content, arrayPath, index, direction) {
  const delta = direction === 'up' ? -1 : 1;
  const targetIndex = index + delta;
  const list = getContentByPath(content, arrayPath);
  if (!Array.isArray(list) || targetIndex < 0 || targetIndex >= list.length) return content;

  const next = structuredClone(content);
  const parts = arrayPath.split('.');
  let node = next;
  for (let i = 0; i < parts.length - 1; i += 1) {
    node = node[parts[i]];
    if (node == null) return content;
  }
  const arr = node[parts[parts.length - 1]];
  if (!Array.isArray(arr)) return content;
  [arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]];

  if (next.fieldStyles) {
    const swapped = swapFieldStylesForListItem(next.fieldStyles, arrayPath, index, targetIndex);
    if (swapped) next.fieldStyles = swapped;
    else delete next.fieldStyles;
  }

  return next;
}

export function getListItemMoveState(content, arrayPath, index) {
  const list = getContentByPath(content, arrayPath);
  if (!Array.isArray(list)) return { canMoveUp: false, canMoveDown: false, total: 0 };
  return {
    canMoveUp: index > 0,
    canMoveDown: index < list.length - 1,
    total: list.length,
  };
}
