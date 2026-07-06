import {
  normalizeSkillGroups,
  splitSkillAndToolGroups,
  splitIntoTwoRows,
  toSawadTools,
} from './profileSkillUtils';
import { ensureUniversalContent } from '../portfolio-templates/shared/universalSections';

export function applyProfileToTemplate(templateId, content, profile) {
  if (!profile) return content;

  const next = structuredClone(content);
  const p = profile.personal || {};
  const links = profile.links || {};

  const setIf = (key, value) => {
    if (value !== undefined && value !== null && value !== '') {
      next[key] = value;
    }
  };

  setIf('name', p.name);
  setIf('tagline', p.tagline || p.headline);
  setIf('bio', p.bio);
  setIf('about', p.about || p.bio);
  setIf('greeting', p.greeting);
  setIf('location', p.location);
  setIf('availability', p.availability);
  setIf('brandTag', p.brandTag);
  setIf('siteName', p.siteName);
  setIf('headline', p.headline);
  setIf('headlineAccent', p.headline);

  if (p.headline && templateId === 'creative-modern') {
    next.headline = p.headline;
  }

  if (profile.profileImage) {
    next.profileImage = profile.profileImage;
  }

  const mergedLinks = {
    ...(next.links || {}),
    ...Object.fromEntries(Object.entries(links).filter(([, v]) => v)),
  };

  if (profile.resume) {
    mergedLinks.resume = profile.resume;
  } else if (links.resume) {
    mergedLinks.resume = links.resume;
  }

  next.links = mergedLinks;

  const skills = splitSkillAndToolGroups(profile.skillGroups);
  if (skills.groups.length) {
    next.skillGroups = skills.groups;
    next.techStack = [...skills.allSkills, ...skills.allTools].slice(0, 20);

    if (templateId === 'dark-orange-pro') {
      const [row1, row2] = splitIntoTwoRows(skills.allSkills);
      next.skillsRow1 = row1;
      next.skillsRow2 = row2;
      if (skills.allTools.length) {
        next.tools = toSawadTools(skills.allTools);
      }
    }

    if (templateId === 'soumya-classic') {
      next.skillset = skills.allSkills;
      if (skills.allTools.length) {
        next.tools = skills.allTools;
      }
    }

    if (templateId === 'developer-classic') {
      next.expertiseGroups = skills.groups.map((group) => ({
        title: group.name,
        description: '',
        icon: group.items[0] || '',
        tech: group.items,
      }));
    }
  }

  if (profile.experience?.length) {
    next.experience = profile.experience.map((job) => ({
      company: job.company || '',
      role: job.role || '',
      period: job.period || '',
      description: job.description || '',
    }));

    if (templateId === 'soumya-classic' && next.resume) {
      next.resume = {
        ...next.resume,
        experience: profile.experience.map((job) => ({
          title: job.role,
          company: job.company,
          date: job.period,
          bullets: job.description ? [job.description] : [],
        })),
      };
    }
  }

  if (profile.education?.length) {
    next.education = profile.education;

    if (templateId === 'soumya-classic' && next.resume) {
      next.resume = {
        ...next.resume,
        education: profile.education.map((edu) => ({
          school: edu.school,
          degree: edu.degree,
          date: edu.period,
          bullets: edu.description ? [edu.description] : [],
        })),
      };
    }
  }

  if (profile.projects?.length) {
    next.projects = profile.projects.map((project, index) => ({
      title: project.title || 'Project',
      subtitle: project.subtitle || '',
      tech: project.tech || [],
      link: project.link || '#',
      featured: project.featured ?? index === 0,
      image: project.image,
    }));
  }

  if (profile.highlights?.length) {
    next.highlights = profile.highlights;
    next.testimonials = profile.highlights.map((item) => ({
      quote: item.label || item.value,
      author: item.value || '',
      role: '',
    }));
  }

  if (profile.stats?.length) {
    next.stats = profile.stats;
    next.statistics = profile.stats;
  }

  if (links.email) {
    if (next.contact && typeof next.contact === 'object') {
      next.contact = { ...next.contact, email: links.email };
    } else if (templateId === 'dark-orange-pro') {
      next.contact = { ...(next.contact || {}), email: links.email };
    }
  }

  if (p.bio && templateId === 'dark-orange-pro') {
    next.bio = p.bio;
  }

  if (p.name && templateId === 'vscode-studio') {
    next.name = p.name;
    next.highlightedName = p.name.split(' ').pop() || p.name;
  }

  if (p.tagline && templateId === 'developer-classic') {
    next.tagline = p.tagline;
    next.heroBio = p.bio || p.about || next.heroBio;
  }

  if (p.availability) {
    next.cta = {
      ...(next.cta || {}),
      subtitle: p.availability,
    };
  }

  if (p.name && p.headline) {
    next.cta = {
      ...(next.cta || {}),
      title: `Work with ${p.name}`,
      subtitle: p.headline,
    };
  }

  if (links.email) {
    next.cta = {
      ...(next.cta || {}),
      buttonHref: `mailto:${links.email}`,
    };
  }

  if (p.siteName || p.name) {
    next.footer = next.footer || `Built by ${p.siteName || p.name}`;
  }

  if (p.headline && ['aurora-flux', 'lumen-bloom', 'midnight-gold', 'prism-drift'].includes(templateId)) {
    next.headlineAccent = p.headline;
    if (p.headline && templateId === 'prism-drift') {
      const tags = p.headline.split(/[,|/]/).map((t) => t.trim()).filter(Boolean);
      if (tags.length) next.roleTags = tags;
    }
    if (p.headline && ['aurora-flux', 'midnight-gold'].includes(templateId)) {
      const roles = p.headline.split(/[,|/]/).map((t) => t.trim()).filter(Boolean);
      if (roles.length) {
        next.typingRoles = roles;
        next.flipRoles = roles;
      }
    }
  }

  return ensureUniversalContent(next);
}

export function profileHasSkillData(profile) {
  return normalizeSkillGroups(profile?.skillGroups).length > 0;
}
