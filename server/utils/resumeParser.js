const SECTION_MARKERS = [
  { key: 'experience', patterns: [/^(work\s+)?experience$/i, /^employment$/i, /^professional\s+experience$/i] },
  { key: 'education', patterns: [/^education$/i, /^academic$/i] },
  { key: 'skills', patterns: [/^(technical\s+)?skills$/i, /^technologies$/i, /^core\s+competencies$/i] },
  { key: 'projects', patterns: [/^projects$/i, /^portfolio$/i, /^selected\s+projects$/i] },
];

const DATE_RANGE =
  /(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4}|\b\d{4})\s*[-–—to]+\s*(\b(?:present|current|now|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4}|\b\d{4}))/i;

const EMAIL_RE = /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i;
const PHONE_RE = /(\+?\d[\d\s().-]{7,}\d)/;
const URL_RE = /https?:\/\/[^\s)]+/gi;
const LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i;
const GITHUB_RE = /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/i;

function normalizeLines(text) {
  return text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function findSectionRanges(lines) {
  const hits = [];

  lines.forEach((line, index) => {
    SECTION_MARKERS.forEach(({ key, patterns }) => {
      if (patterns.some((pattern) => pattern.test(line)) && line.length < 40) {
        hits.push({ key, index, title: line });
      }
    });
  });

  hits.sort((a, b) => a.index - b.index);

  const ranges = {};
  hits.forEach((hit, i) => {
    const next = hits[i + 1];
    ranges[hit.key] = lines.slice(hit.index + 1, next ? next.index : lines.length);
  });

  return ranges;
}

function guessName(lines, email) {
  const candidates = lines.slice(0, 8).filter((line) => {
    if (line.length > 60 || line.length < 2) return false;
    if (EMAIL_RE.test(line)) return false;
    if (PHONE_RE.test(line) && line.replace(/\D/g, '').length > 8) return false;
    if (/^(resume|curriculum vitae|cv)$/i.test(line)) return false;
    if (URL_RE.test(line) && line.length < 80) return false;
    if (/^(experience|education|skills|summary|profile)$/i.test(line)) return false;
    return /^[A-Za-z][A-Za-z\s.'-]+$/.test(line);
  });

  return candidates[0] || '';
}

function parseSkills(lines) {
  const blob = lines.join(' ');
  const split = blob
    .split(/[,|•·▪◦\n|]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 40);

  const unique = [...new Set(split)].slice(0, 24);
  if (!unique.length) return { skillGroups: [], skills: [] };

  const groups = [
    { name: 'Technical', items: unique.slice(0, 12) },
  ];
  if (unique.length > 12) {
    groups.push({ name: 'Tools', items: unique.slice(12, 24) });
  }

  return { skillGroups: groups, skills: unique };
}

function parseExperience(lines) {
  const entries = [];
  let current = null;

  const flush = () => {
    if (current && (current.role || current.company)) {
      entries.push({
        company: current.company || 'Company',
        role: current.role || 'Role',
        period: current.period || '',
        description: current.description.trim(),
      });
    }
    current = null;
  };

  lines.forEach((line) => {
    const dateMatch = line.match(DATE_RANGE);
    if (dateMatch) {
      flush();
      const period = dateMatch[0];
      const before = line.replace(period, '').trim();
      const parts = before.split(/\s+[-–@|]\s+|\s+at\s+/i).filter(Boolean);
      current = {
        role: parts[0] || before || 'Role',
        company: parts[1] || '',
        period,
        description: '',
      };
      return;
    }

    if (!current) {
      if (line.length < 80) {
        const parts = line.split(/\s+[-–@|]\s+|\s+at\s+/i);
        if (parts.length >= 2) {
          flush();
          current = {
            role: parts[0].trim(),
            company: parts.slice(1).join(' ').trim(),
            period: '',
            description: '',
          };
          return;
        }
      }
      return;
    }

    if (line.length > 20 || line.startsWith('-') || line.startsWith('•')) {
      current.description += `${line.replace(/^[-•]\s*/, '')} `;
    }
  });

  flush();
  return entries.slice(0, 8);
}

function parseEducation(lines) {
  const entries = [];

  lines.forEach((line) => {
    const dateMatch = line.match(DATE_RANGE);
    if (dateMatch || /b\.?s\.?|m\.?s\.?|b\.?a\.?|ph\.?d|bachelor|master|university|college|institute/i.test(line)) {
      const period = dateMatch ? dateMatch[0] : '';
      const rest = period ? line.replace(period, '').trim() : line;
      const parts = rest.split(/[,|–-]/).map((p) => p.trim()).filter(Boolean);
      entries.push({
        school: parts.length > 1 ? parts[parts.length - 1] : parts[0] || 'School',
        degree: parts.length > 1 ? parts.slice(0, -1).join(', ') : rest,
        period,
        description: '',
      });
    }
  });

  return entries.slice(0, 5);
}

function parseProjects(lines) {
  const entries = [];
  lines.forEach((line) => {
    if (line.length < 8) return;
    const techMatch = line.match(/\(([^)]+)\)\s*$/);
    entries.push({
      title: techMatch ? line.replace(techMatch[0], '').trim() : line.slice(0, 60),
      subtitle: line,
      tech: techMatch ? techMatch[1].split(/[,|]/).map((t) => t.trim()).filter(Boolean) : [],
      link: '',
      featured: entries.length === 0,
    });
  });
  return entries.slice(0, 6);
}

function buildBio(lines, ranges) {
  const summaryIdx = lines.findIndex((l) => /^(summary|profile|about|objective)$/i.test(l));
  if (summaryIdx >= 0) {
    const end = Math.min(summaryIdx + 6, lines.length);
    return lines.slice(summaryIdx + 1, end).join(' ').slice(0, 500);
  }
  const fallback = lines.slice(1, 5).filter((l) => l.length > 40).join(' ');
  return fallback.slice(0, 500);
}

export function parseResumeText(text) {
  const lines = normalizeLines(text);
  const ranges = findSectionRanges(lines);

  const email = text.match(EMAIL_RE)?.[0] || '';
  const phone = text.match(PHONE_RE)?.[0]?.trim() || '';
  const linkedin = text.match(LINKEDIN_RE)?.[0] || '';
  const github = text.match(GITHUB_RE)?.[0] || '';
  const name = guessName(lines, email);

  const { skillGroups } = parseSkills(ranges.skills || []);
  const experience = parseExperience(ranges.experience || []);
  const education = parseEducation(ranges.education || []);
  const projects = parseProjects(ranges.projects || []);
  const bio = buildBio(lines, ranges);

  const headline =
    experience[0]?.role ||
    education[0]?.degree ||
  '';

  return {
    personal: {
      name,
      headline,
      tagline: headline,
      bio,
      about: bio,
      phone,
    },
    links: {
      email,
      linkedin: linkedin ? (linkedin.startsWith('http') ? linkedin : `https://${linkedin}`) : '',
      github: github ? (github.startsWith('http') ? github : `https://${github}`) : '',
    },
    skillGroups,
    experience,
    education,
    projects,
    highlights: experience.length
      ? [
          { value: String(experience.length), label: 'Roles listed' },
          { value: String(skillGroups[0]?.items?.length || 0), label: 'Skills found' },
        ]
      : [],
    stats: education.length
      ? [{ value: String(education.length), label: 'Education entries' }]
      : [],
  };
}
