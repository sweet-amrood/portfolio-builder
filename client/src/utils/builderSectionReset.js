import { getDefaultContent } from '../constants/defaultTemplateContent';
import { getDefaultSectionOrder, getSectionsForTemplate } from '../constants/templateSections';

const SECTION_KEYS = {
  'dark-orange-pro': {
    hero: ['name', 'headline', 'tagline', 'bio', 'nav', 'stats', 'profileImage'],
    skills: ['skillsRow1', 'skillsRow2'],
    projects: ['projects'],
    experience: ['experience'],
    tools: ['tools'],
    thoughts: ['thoughts'],
    contact: ['contact', 'footer'],
  },
  'dev-minimal': {
    hero: ['siteName', 'name', 'tagline', 'intro', 'links', 'profileImage'],
    about: ['about'],
    projects: ['projects'],
    skills: ['skillGroups'],
    experience: ['experience'],
    education: ['education'],
    contact: ['contact'],
    stats: ['stats'],
  },
  'vscode-studio': {
    hero: ['workspaceName', 'siteTitle', 'name', 'highlightedName', 'roles', 'company', 'welcomeComment', 'typingLine', 'bio', 'links', 'stats', 'footer', 'profileImage'],
    copilot: ['copilot'],
    about: ['about'],
    projects: ['projects'],
    skills: ['skillGroups'],
    experience: ['experience'],
    contact: ['contact'],
  },
  'creative-modern': {
    hero: ['brandTag', 'greeting', 'name', 'typingRoles', 'headline', 'availability', 'location', 'heroCta', 'links', 'footer', 'profileImage'],
    about: ['aboutTitle', 'about', 'toolsTitle', 'toolsIntro', 'skillGroups'],
    services: ['services'],
    projects: ['projects'],
    contact: ['contact'],
  },
  'developer-classic': {
    hero: ['name', 'tagline', 'heroBio', 'availability', 'links', 'profileImage', 'nav'],
    expertise: ['expertiseGroups'],
    experience: ['experience'],
    projects: ['projects'],
    contact: ['contact'],
  },
  'soumya-classic': {
    hero: ['name', 'initials', 'greeting', 'wave', 'typingRoles', 'homeIntro', 'socialSection', 'footer', 'links', 'navBlogLabel'],
    about: ['about', 'skillsetTitle', 'toolsTitle', 'githubHeadingLead', 'githubHeadingHighlight', 'skillset', 'tools'],
    projects: ['projectsHeadingLead', 'projectsHeadingHighlight', 'projectsSubtitle', 'projects'],
    resume: ['resume', 'links'],
  },
  'aurora-flux': {
    hero: ['brandTag', 'name', 'greeting', 'headlineAccent', 'typingRoles', 'tagline', 'availability', 'location', 'links', 'footer', 'profileImage', 'nav'],
    about: ['about', 'highlights'],
    skills: ['skillGroups'],
    projects: ['projects'],
    experience: ['experience'],
    contact: ['contact'],
  },
  'lumen-bloom': {
    hero: ['brandTag', 'name', 'greeting', 'headlineAccent', 'flipRoles', 'tagline', 'heroPrimaryButtonLabel', 'heroPrimaryButtonHref', 'heroSecondaryButtonLabel', 'heroSecondaryButtonHref', 'availability', 'location', 'links', 'footer', 'profileImage', 'nav'],
    about: ['about', 'pullQuote', 'highlights'],
    skills: ['skillGroups'],
    projects: ['projects'],
    experience: ['experience'],
    contact: ['contact'],
  },
  'midnight-gold': {
    hero: ['brandTag', 'name', 'greeting', 'headlineAccent', 'flipRoles', 'tagline', 'availability', 'location', 'links', 'footer', 'profileImage', 'nav'],
    about: ['about', 'highlights'],
    skills: ['skillGroups'],
    projects: ['projects'],
    experience: ['experience'],
    contact: ['contact'],
  },
  'prism-drift': {
    hero: ['brandTag', 'name', 'greeting', 'headlineAccent', 'roleTags', 'tagline', 'availability', 'location', 'links', 'footer', 'profileImage', 'nav'],
    about: ['about', 'pullQuote', 'highlights'],
    skills: ['skillGroups'],
    projects: ['projects'],
    experience: ['experience'],
    contact: ['contact'],
  },
};

const UNIVERSAL_SECTION_KEYS = {
  'tech-stack': ['techStack'],
  services: ['services'],
  testimonials: ['testimonials'],
  statistics: ['statistics'],
  cta: ['cta'],
  footer: ['footer'],
};

export function resetSectionContent(templateId, sectionId, currentContent) {
  const defaults = getDefaultContent(templateId);
  const keys = SECTION_KEYS[templateId]?.[sectionId] || UNIVERSAL_SECTION_KEYS[sectionId];
  if (!keys?.length) return currentContent;

  const patch = {};
  keys.forEach((key) => {
    if (key in defaults) {
      patch[key] = structuredClone(defaults[key]);
    }
  });

  return { ...currentContent, ...patch };
}

export function resetAllContent(templateId) {
  return getDefaultContent(templateId);
}

export function resetSectionOrder(templateId, isBuilt) {
  return getDefaultSectionOrder(templateId, isBuilt).filter(
    (id) => !getSectionsForTemplate(templateId, isBuilt).find((s) => s.id === id)?.fixed
  );
}
