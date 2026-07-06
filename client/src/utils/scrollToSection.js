function findScrollableAncestor(element) {
  let node = element.parentElement;

  while (node && node !== document.documentElement) {
    const { overflowY } = window.getComputedStyle(node);
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      node.scrollHeight > node.clientHeight + 1
    ) {
      return node;
    }
    node = node.parentElement;
  }

  return null;
}

export function scrollToSection(sectionId, { offset = 64 } = {}) {
  const target = document.getElementById(sectionId);
  if (!target) return false;

  const scrollContainer = findScrollableAncestor(target);

  if (!scrollContainer) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }

  const targetTop = target.getBoundingClientRect().top;
  const containerTop = scrollContainer.getBoundingClientRect().top;
  const nextTop = scrollContainer.scrollTop + (targetTop - containerTop) - offset;

  scrollContainer.scrollTo({
    top: Math.max(0, nextTop),
    behavior: 'smooth',
  });

  return true;
}
