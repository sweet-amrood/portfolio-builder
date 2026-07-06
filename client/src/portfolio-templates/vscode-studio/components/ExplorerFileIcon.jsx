import {
  SiCss,
  SiHtml5,
  SiJavascript,
  SiMarkdown,
  SiReact,
  SiTypescript,
} from 'react-icons/si';
import { VscFileCode, VscFilePdf, VscJson } from 'react-icons/vsc';

const EXTENSION_ICONS = {
  tsx: { Icon: SiReact, color: '#61dafb' },
  jsx: { Icon: SiReact, color: '#61dafb' },
  html: { Icon: SiHtml5, color: '#e44d26' },
  htm: { Icon: SiHtml5, color: '#e44d26' },
  js: { Icon: SiJavascript, color: '#f7df1e' },
  mjs: { Icon: SiJavascript, color: '#f7df1e' },
  ts: { Icon: SiTypescript, color: '#3178c6' },
  json: { Icon: VscJson, color: '#cbcb41' },
  css: { Icon: SiCss, color: '#42a5f5' },
  md: { Icon: SiMarkdown, color: '#519aba' },
  pdf: { Icon: VscFilePdf, color: '#f14c4c' },
};

const FILENAME_ICONS = {
  'home.tsx': EXTENSION_ICONS.tsx,
  'about.html': EXTENSION_ICONS.html,
  'projects.js': EXTENSION_ICONS.js,
  'skills.json': EXTENSION_ICONS.json,
  'experience.ts': EXTENSION_ICONS.ts,
  'contact.css': EXTENSION_ICONS.css,
  'README.md': EXTENSION_ICONS.md,
  'Resume.pdf': EXTENSION_ICONS.pdf,
};

function resolveFileIcon(filename) {
  if (FILENAME_ICONS[filename]) return FILENAME_ICONS[filename];

  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext && EXTENSION_ICONS[ext]) return EXTENSION_ICONS[ext];

  return { Icon: VscFileCode, color: '#c5c5c5' };
}

export default function ExplorerFileIcon({ filename, size = 16, className = '' }) {
  const { Icon, color } = resolveFileIcon(filename);

  return (
    <span className={`vsc-file-icon${className ? ` ${className}` : ''}`} style={{ color }} aria-hidden="true">
      <Icon size={size} />
    </span>
  );
}

export { resolveFileIcon };
