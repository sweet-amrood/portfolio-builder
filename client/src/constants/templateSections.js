import { UNIVERSAL_SECTION_IDS, UNIVERSAL_SECTION_META } from '../portfolio-templates/shared/universalSections';

export const GENERIC_SECTIONS = [
  { id: 'hero', label: 'Hero', icon: '⬡' },
  { id: 'about', label: 'About', icon: '◎' },
  { id: 'projects', label: 'Projects', icon: '▦' },
  { id: 'skills', label: 'Skills', icon: '◈' },
  { id: 'contact', label: 'Contact', icon: '✉' },
];

export const BUILT_TEMPLATE_SECTIONS = {
  'dev-minimal': [
    { id: 'hero', label: 'Introduction', icon: '⬡', fixed: true },
    { id: 'about', label: 'About', icon: '◎' },
    { id: 'projects', label: 'Projects', icon: '▦' },
    { id: 'skills', label: 'Skills & Tools', icon: '◈' },
    { id: 'experience', label: 'Experience', icon: '▣' },
    { id: 'education', label: 'Education', icon: '▤' },
    { id: 'contact', label: 'Contact', icon: '✉' },
    { id: 'stats', label: 'Stats', icon: '◉' },
  ],
  'dark-orange-pro': [
    { id: 'hero', label: 'Hero', icon: '⬡', fixed: true },
    { id: 'skills', label: 'Skills', icon: '◈' },
    { id: 'projects', label: 'Projects', icon: '▦' },
    { id: 'experience', label: 'Experience', icon: '◎' },
    { id: 'tools', label: 'Tools', icon: '⚙' },
    { id: 'thoughts', label: 'Thoughts', icon: '✎' },
    { id: 'contact', label: 'Contact', icon: '✉' },
  ],
  'vscode-studio': [
    { id: 'hero', label: 'Editor', icon: '⬡', fixed: true },
    { id: 'copilot', label: 'Copilot', icon: '✦', fixed: true },
    { id: 'about', label: 'About', icon: '◎' },
    { id: 'projects', label: 'Projects', icon: '▦' },
    { id: 'skills', label: 'Skills', icon: '◈' },
    { id: 'experience', label: 'Experience', icon: '▣' },
    { id: 'contact', label: 'Contact', icon: '✉' },
  ],
  'creative-modern': [
    { id: 'hero', label: 'Hero', icon: '⬡', fixed: true },
    { id: 'about', label: 'About', icon: '◎' },
    { id: 'services', label: 'Services', icon: '◆' },
    { id: 'projects', label: 'Projects', icon: '▦' },
    { id: 'contact', label: 'Contact', icon: '✉' },
  ],
  'developer-classic': [
    { id: 'hero', label: 'Hero', icon: '⬡', fixed: true },
    { id: 'expertise', label: 'Expertise', icon: '◈' },
    { id: 'experience', label: 'History', icon: '▣' },
    { id: 'projects', label: 'Projects', icon: '▦' },
    { id: 'contact', label: 'Contact', icon: '✉' },
  ],
  'soumya-classic': [
    { id: 'hero', label: 'Home', icon: '⬡', fixed: true },
    { id: 'about', label: 'About', icon: '◎' },
    { id: 'projects', label: 'Projects', icon: '▦' },
    { id: 'resume', label: 'Resume', icon: '▤' },
  ],
  'aurora-flux': [
    { id: 'hero', label: 'Hero', icon: '⬡', fixed: true },
    { id: 'about', label: 'About', icon: '◎' },
    { id: 'skills', label: 'Skills', icon: '◈' },
    { id: 'projects', label: 'Projects', icon: '▦' },
    { id: 'experience', label: 'Journey', icon: '▣' },
    { id: 'contact', label: 'Contact', icon: '✉' },
  ],
  'lumen-bloom': [
    { id: 'hero', label: 'Hero', icon: '⬡', fixed: true },
    { id: 'about', label: 'About', icon: '◎' },
    { id: 'skills', label: 'Skills', icon: '◈' },
    { id: 'projects', label: 'Work', icon: '▦' },
    { id: 'experience', label: 'Story', icon: '▣' },
    { id: 'contact', label: 'Hello', icon: '✉' },
  ],
  'midnight-gold': [
    { id: 'hero', label: 'Hero', icon: '⬡', fixed: true },
    { id: 'about', label: 'Profile', icon: '◎' },
    { id: 'skills', label: 'Expertise', icon: '◈' },
    { id: 'projects', label: 'Portfolio', icon: '▦' },
    { id: 'experience', label: 'Career', icon: '▣' },
    { id: 'contact', label: 'Contact', icon: '✉' },
  ],
  'prism-drift': [
    { id: 'hero', label: 'Hero', icon: '⬡', fixed: true },
    { id: 'about', label: 'About', icon: '◎' },
    { id: 'skills', label: 'Skills', icon: '◈' },
    { id: 'projects', label: 'Work', icon: '▦' },
    { id: 'experience', label: 'Path', icon: '▣' },
    { id: 'contact', label: 'Contact', icon: '✉' },
  ],
  'ai-dynamic': [
    { id: 'hero', label: 'Hero', icon: '⬡', fixed: true },
    { id: 'about', label: 'About', icon: '◎' },
    { id: 'skills', label: 'Skills', icon: '◈' },
    { id: 'projects', label: 'Projects', icon: '▦' },
    { id: 'experience', label: 'Experience', icon: '▣' },
    { id: 'education', label: 'Education', icon: '▤' },
    { id: 'contact', label: 'Contact', icon: '✉' },
  ],
};

export const DEFAULT_SECTION_ORDER = {
  'dev-minimal': ['about', 'projects', 'skills', 'experience', 'education', 'contact', 'stats'],
  'dark-orange-pro': ['skills', 'projects', 'experience', 'tools', 'thoughts', 'contact'],
  'vscode-studio': ['about', 'projects', 'skills', 'experience', 'contact'],
  'creative-modern': ['about', 'services', 'projects', 'contact'],
  'developer-classic': ['expertise', 'experience', 'projects', 'contact'],
  'soumya-classic': ['about', 'projects', 'resume'],
  'aurora-flux': ['about', 'skills', 'projects', 'experience', 'contact'],
  'lumen-bloom': ['about', 'skills', 'projects', 'experience', 'contact'],
  'midnight-gold': ['about', 'skills', 'projects', 'experience', 'contact'],
  'prism-drift': ['about', 'skills', 'projects', 'experience', 'contact'],
  'ai-dynamic': ['about', 'skills', 'projects', 'experience', 'education', 'contact'],
  generic: ['hero', 'about', 'projects', 'skills', 'contact'],
};

const SECTION_CANONICAL = {
  hero: 'hero',
  about: 'about',
  skills: 'skills',
  'tech-stack': 'tech-stack',
  tools: 'tech-stack',
  experience: 'experience',
  education: 'education',
  projects: 'projects',
  services: 'services',
  testimonials: 'testimonials',
  thoughts: 'testimonials',
  statistics: 'statistics',
  stats: 'statistics',
  contact: 'contact',
  cta: 'cta',
  footer: 'footer',
};

function sectionFromUniversalId(id) {
  const meta = UNIVERSAL_SECTION_META[id];
  return { id, label: meta?.label || id, icon: meta?.icon || '•' };
}

function appendUniversalOptionalSections(sections) {
  const canonicalPresent = new Set(
    sections.map((section) => SECTION_CANONICAL[section.id] || section.id)
  );

  const missing = UNIVERSAL_SECTION_IDS.filter((id) => !canonicalPresent.has(id));
  if (!missing.length) return sections;

  return [...sections, ...missing.map(sectionFromUniversalId)];
}

const ENRICHED_BUILT_TEMPLATE_SECTIONS = Object.fromEntries(
  Object.entries(BUILT_TEMPLATE_SECTIONS).map(([templateId, sections]) => [
    templateId,
    appendUniversalOptionalSections(sections),
  ])
);

export function getSectionsForTemplate(templateId, isBuilt) {
  if (isBuilt && ENRICHED_BUILT_TEMPLATE_SECTIONS[templateId]) {
    return ENRICHED_BUILT_TEMPLATE_SECTIONS[templateId];
  }
  return GENERIC_SECTIONS;
}

export function getDefaultSectionOrder(templateId, isBuilt) {
  if (isBuilt && DEFAULT_SECTION_ORDER[templateId]) {
    return [...DEFAULT_SECTION_ORDER[templateId]];
  }
  return [...DEFAULT_SECTION_ORDER.generic];
}

export function getReorderableSectionIds(templateId, isBuilt) {
  return getSectionsForTemplate(templateId, isBuilt)
    .filter((s) => !s.fixed)
    .map((s) => s.id);
}

export function getAvailableSectionsToAdd(templateId, isBuilt, currentOrder) {
  const all = getReorderableSectionIds(templateId, isBuilt);
  return all.filter((id) => !currentOrder.includes(id));
}
