export const AI_TEMPLATE_ID = 'ai-dynamic';

export const AI_ALLOWED_SECTIONS = [
  'hero',
  'about',
  'skills',
  'projects',
  'experience',
  'education',
  'contact',
];

export const AI_ALLOWED_LAYOUTS = ['split-hero'];

export const AI_ALLOWED_MODES = ['dark', 'light'];

export const AI_SYSTEM_PROMPT = `You are PortfolioForge's portfolio generator.
Return ONLY valid JSON. No markdown. No code fences. No commentary.

You must generate a complete portfolio template that fits PortfolioForge exactly.

Hard rules:
1. Output a single JSON object matching this schema:
{
  "layout": "split-hero",
  "theme": {
    "mode": "dark" | "light",
    "accent": "#hexcolor",
    "fontHeading": "string",
    "fontBody": "string"
  },
  "sectionOrder": ["hero", ...],
  "content": {
    "personal": {
      "name": "",
      "headline": "",
      "tagline": "",
      "greeting": "",
      "bio": "",
      "about": "",
      "location": "",
      "availability": ""
    },
    "links": {
      "email": "",
      "github": "",
      "linkedin": "",
      "website": ""
    },
    "skillGroups": [{ "name": "", "items": [""] }],
    "projects": [{ "title": "", "subtitle": "", "tech": [""], "link": "" }],
    "experience": [{ "role": "", "company": "", "period": "", "description": "" }],
    "education": [{ "school": "", "degree": "", "period": "", "description": "" }],
    "highlights": [{ "value": "", "label": "" }],
    "contact": {
      "heading": "",
      "subheading": "",
      "ctaLabel": ""
    }
  }
}

2. layout MUST be exactly "split-hero".
3. sectionOrder MUST start with "hero" and only include: hero, about, skills, projects, experience, education, contact, testimonials.
4. Include at least: hero, about, skills, projects, contact.
5. Prefer master profile data when provided. Improve wording, do not invent fake employers or schools if profile has real ones.
6. If profile is empty, create polished realistic placeholder content matching the user prompt.
7. accent must be a valid hex color that fits the prompt mood.
8. fontHeading/fontBody should be common Google Fonts names (e.g. "Space Grotesk", "DM Sans", "Sora", "Inter").
9. Keep text concise and portfolio-ready.
10. Never include HTML, JSX, CSS, or JavaScript.`;

export function buildAiUserPrompt({ prompt, profile, preferences }) {
  return [
    `User request:\n${prompt}`,
    preferences?.mode ? `Preferred theme mode: ${preferences.mode}` : null,
    preferences?.accent ? `Preferred accent color: ${preferences.accent}` : null,
    profile
      ? `Master profile JSON (prefer these facts):\n${JSON.stringify(profile)}`
      : 'Master profile: none provided',
    'Generate the portfolio JSON now.',
  ]
    .filter(Boolean)
    .join('\n\n');
}

export function createEmptyAiContent() {
  return {
    personal: {
      name: '',
      headline: '',
      tagline: '',
      greeting: '',
      bio: '',
      about: '',
      location: '',
      availability: '',
    },
    links: {
      email: '',
      github: '',
      linkedin: '',
      website: '',
    },
    skillGroups: [{ name: 'Skills', items: [] }],
    projects: [],
    experience: [],
    education: [],
    highlights: [],
    contact: {
      heading: 'Let’s work together',
      subheading: 'Open to opportunities and collaborations.',
      ctaLabel: 'Get in touch',
    },
    profileImage: null,
    fieldStyles: {},
  };
}

function asString(value, fallback = '') {
  if (typeof value === 'string') return value.trim();
  if (value == null) return fallback;
  return String(value).trim() || fallback;
}

function asStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asString(item)).filter(Boolean);
}

function normalizeHex(color, fallback = '#6366f1') {
  const raw = asString(color, fallback);
  if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
    const [, r, g, b] = raw;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return fallback;
}

export function normalizeAiTemplate(raw, profile = null) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const contentIn = source.content && typeof source.content === 'object' ? source.content : {};
  const personalIn = contentIn.personal || {};
  const linksIn = contentIn.links || {};
  const contactIn = contentIn.contact || {};
  const themeIn = source.theme && typeof source.theme === 'object' ? source.theme : {};

  const sectionOrder = Array.isArray(source.sectionOrder)
    ? source.sectionOrder.map((id) => asString(id)).filter((id) => AI_ALLOWED_SECTIONS.includes(id))
    : [];

  const uniqueOrder = [...new Set(sectionOrder)];
  if (!uniqueOrder.includes('hero')) uniqueOrder.unshift('hero');
  for (const required of ['about', 'skills', 'projects', 'contact']) {
    if (!uniqueOrder.includes(required)) uniqueOrder.push(required);
  }

  const mode = AI_ALLOWED_MODES.includes(themeIn.mode) ? themeIn.mode : 'dark';

  const content = {
    ...createEmptyAiContent(),
    personal: {
      name: asString(personalIn.name || profile?.personal?.name),
      headline: asString(personalIn.headline || profile?.personal?.headline),
      tagline: asString(personalIn.tagline || profile?.personal?.tagline),
      greeting: asString(personalIn.greeting || profile?.personal?.greeting || 'Hi, I’m'),
      bio: asString(personalIn.bio || profile?.personal?.bio),
      about: asString(personalIn.about || profile?.personal?.about),
      location: asString(personalIn.location || profile?.personal?.location),
      availability: asString(personalIn.availability || profile?.personal?.availability),
    },
    links: {
      email: asString(linksIn.email || profile?.links?.email),
      github: asString(linksIn.github || profile?.links?.github),
      linkedin: asString(linksIn.linkedin || profile?.links?.linkedin),
      website: asString(linksIn.website || profile?.links?.website),
    },
    skillGroups: Array.isArray(contentIn.skillGroups) && contentIn.skillGroups.length
      ? contentIn.skillGroups.map((group) => ({
          name: asString(group?.name, 'Skills'),
          items: asStringArray(group?.items),
        }))
      : profile?.skillGroups?.length
        ? profile.skillGroups.map((group) => ({
            name: asString(group?.name, 'Skills'),
            items: asStringArray(group?.items),
          }))
        : [{ name: 'Skills', items: ['React', 'Node.js', 'JavaScript'] }],
    projects: Array.isArray(contentIn.projects) && contentIn.projects.length
      ? contentIn.projects.map((project) => ({
          title: asString(project?.title, 'Project'),
          subtitle: asString(project?.subtitle),
          tech: asStringArray(project?.tech),
          link: asString(project?.link),
        }))
      : profile?.projects?.length
        ? profile.projects.map((project) => ({
            title: asString(project?.title, 'Project'),
            subtitle: asString(project?.subtitle),
            tech: asStringArray(project?.tech),
            link: asString(project?.link),
          }))
        : [
            {
              title: 'Featured Project',
              subtitle: 'A polished case study generated for your portfolio.',
              tech: ['React', 'API'],
              link: '',
            },
          ],
    experience: Array.isArray(contentIn.experience)
      ? contentIn.experience.map((job) => ({
          role: asString(job?.role),
          company: asString(job?.company),
          period: asString(job?.period),
          description: asString(job?.description),
        }))
      : Array.isArray(profile?.experience)
        ? profile.experience.map((job) => ({
            role: asString(job?.role),
            company: asString(job?.company),
            period: asString(job?.period),
            description: asString(job?.description),
          }))
        : [],
    education: Array.isArray(contentIn.education)
      ? contentIn.education.map((edu) => ({
          school: asString(edu?.school),
          degree: asString(edu?.degree),
          period: asString(edu?.period),
          description: asString(edu?.description),
        }))
      : Array.isArray(profile?.education)
        ? profile.education.map((edu) => ({
            school: asString(edu?.school),
            degree: asString(edu?.degree),
            period: asString(edu?.period),
            description: asString(edu?.description),
          }))
        : [],
    highlights: Array.isArray(contentIn.highlights)
      ? contentIn.highlights
          .map((item) => ({
            value: asString(item?.value),
            label: asString(item?.label),
          }))
          .filter((item) => item.value || item.label)
      : Array.isArray(profile?.highlights)
        ? profile.highlights
            .map((item) => ({
              value: asString(item?.value),
              label: asString(item?.label),
            }))
            .filter((item) => item.value || item.label)
        : [],
    contact: {
      heading: asString(contactIn.heading, 'Let’s work together'),
      subheading: asString(contactIn.subheading, 'Open to opportunities and collaborations.'),
      ctaLabel: asString(contactIn.ctaLabel, 'Get in touch'),
    },
    profileImage: profile?.profileImage || null,
    fieldStyles: {},
    _aiSpec: {
      layout: 'split-hero',
      theme: {
        mode,
        accent: normalizeHex(themeIn.accent),
        fontHeading: asString(themeIn.fontHeading, 'Space Grotesk'),
        fontBody: asString(themeIn.fontBody, 'DM Sans'),
      },
      generatedAt: new Date().toISOString(),
    },
  };

  if (!content.personal.name) content.personal.name = 'Your Name';
  if (!content.personal.headline) content.personal.headline = 'Software Developer';
  if (!content.personal.bio) {
    content.personal.bio = 'Building thoughtful products with clean code and clear communication.';
  }
  if (!content.personal.about) {
    content.personal.about =
      content.personal.bio ||
      'I design and build digital experiences with a focus on clarity, performance, and craft.';
  }

  return {
    templateId: AI_TEMPLATE_ID,
    layout: 'split-hero',
    themeId: mode === 'light' ? 'ai-light' : 'ai-dark',
    sectionOrder: uniqueOrder.filter((id) => id !== 'hero'),
    content,
    templateSpec: content._aiSpec,
  };
}

export function extractJsonObject(text) {
  const raw = String(text || '').trim();
  if (!raw) throw new Error('Empty AI response');

  try {
    return JSON.parse(raw);
  } catch {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
      throw new Error('AI response was not valid JSON');
    }
    return JSON.parse(raw.slice(start, end + 1));
  }
}
