export function withDefaultProjectImages(projects) {
  return projects.map((project) => ({ ...project }));
}
