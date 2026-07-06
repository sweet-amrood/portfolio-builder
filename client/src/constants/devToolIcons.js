import {
  SiAngular,
  SiBootstrap,
  SiCplusplus,
  SiCss,
  SiDocker,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiFlutter,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiGo,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiKubernetes,
  SiLangchain,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiNpm,
  SiPandas,
  SiPostgresql,
  SiPostman,
  SiPrisma,
  SiPython,
  SiReact,
  SiRedis,
  SiRust,
  SiSass,
  SiStreamlit,
  SiTailwindcss,
  SiTypescript,
  SiDotnet,
  SiVercel,
  SiVite,
  SiVuedotjs,
  SiWebpack,
  SiYarn,
} from 'react-icons/si';
import { TbBrandAws, TbBrandOpenai } from 'react-icons/tb';
import { VscVscode } from 'react-icons/vsc';
import { HiCodeBracket } from 'react-icons/hi2';

const ICON_ENTRIES = {
  vscode: { Icon: VscVscode, color: '#007ACC' },
  docker: { Icon: SiDocker, color: '#2496ED' },
  python: { Icon: SiPython, color: '#3776AB' },
  javascript: { Icon: SiJavascript, color: '#F7DF1E' },
  typescript: { Icon: SiTypescript, color: '#3178C6' },
  react: { Icon: SiReact, color: '#61DAFB' },
  nextjs: { Icon: SiNextdotjs, color: '#ffffff' },
  nodejs: { Icon: SiNodedotjs, color: '#339933' },
  express: { Icon: SiExpress, color: '#ffffff' },
  mongodb: { Icon: SiMongodb, color: '#47A248' },
  postgresql: { Icon: SiPostgresql, color: '#4169E1' },
  mysql: { Icon: SiMysql, color: '#4479A1' },
  redis: { Icon: SiRedis, color: '#DC382D' },
  git: { Icon: SiGit, color: '#F05032' },
  github: { Icon: SiGithub, color: '#ffffff' },
  githubactions: { Icon: SiGithubactions, color: '#2088FF' },
  openai: { Icon: TbBrandOpenai, color: '#412991' },
  langchain: { Icon: SiLangchain, color: '#1C3C3C' },
  pandas: { Icon: SiPandas, color: '#150458' },
  streamlit: { Icon: SiStreamlit, color: '#FF4B4B' },
  figma: { Icon: SiFigma, color: '#F24E1E' },
  tailwindcss: { Icon: SiTailwindcss, color: '#06B6D4' },
  'tailwind css': { Icon: SiTailwindcss, color: '#06B6D4' },
  tailwind: { Icon: SiTailwindcss, color: '#06B6D4' },
  css: { Icon: SiCss, color: '#1572B6' },
  css3: { Icon: SiCss, color: '#1572B6' },
  html: { Icon: SiHtml5, color: '#E34F26' },
  html5: { Icon: SiHtml5, color: '#E34F26' },
  vue: { Icon: SiVuedotjs, color: '#4FC08D' },
  vuejs: { Icon: SiVuedotjs, color: '#4FC08D' },
  angular: { Icon: SiAngular, color: '#DD0031' },
  vite: { Icon: SiVite, color: '#646CFF' },
  webpack: { Icon: SiWebpack, color: '#8DD6F9' },
  graphql: { Icon: SiGraphql, color: '#E10098' },
  prisma: { Icon: SiPrisma, color: '#2D3748' },
  sass: { Icon: SiSass, color: '#CC6699' },
  bootstrap: { Icon: SiBootstrap, color: '#7952B3' },
  firebase: { Icon: SiFirebase, color: '#FFCA28' },
  aws: { Icon: TbBrandAws, color: '#FF9900' },
  kubernetes: { Icon: SiKubernetes, color: '#326CE5' },
  nginx: { Icon: SiNginx, color: '#009639' },
  linux: { Icon: SiLinux, color: '#FCC624' },
  npm: { Icon: SiNpm, color: '#CB3837' },
  yarn: { Icon: SiYarn, color: '#2C8EBB' },
  postman: { Icon: SiPostman, color: '#FF6C37' },
  vercel: { Icon: SiVercel, color: '#ffffff' },
  nestjs: { Icon: SiNestjs, color: '#E0234E' },
  jest: { Icon: SiJest, color: '#C21325' },
  go: { Icon: SiGo, color: '#00ADD8' },
  golang: { Icon: SiGo, color: '#00ADD8' },
  rust: { Icon: SiRust, color: '#DEA584' },
  cpp: { Icon: SiCplusplus, color: '#00599C' },
  'c++': { Icon: SiCplusplus, color: '#00599C' },
  csharp: { Icon: SiDotnet, color: '#512BD4' },
  'c#': { Icon: SiDotnet, color: '#512BD4' },
  dotnet: { Icon: SiDotnet, color: '#512BD4' },
  flutter: { Icon: SiFlutter, color: '#02569B' },
  'rest apis': { Icon: HiCodeBracket, color: '#94a3b8' },
  'rest api': { Icon: HiCodeBracket, color: '#94a3b8' },
  api: { Icon: HiCodeBracket, color: '#94a3b8' },
};

const ALIASES = {
  'vs code': 'vscode',
  'visual studio code': 'vscode',
  visualstudiocode: 'vscode',
  node: 'nodejs',
  'node.js': 'nodejs',
  nodejs: 'nodejs',
  mongo: 'mongodb',
  postgres: 'postgresql',
  psql: 'postgresql',
  ts: 'typescript',
  js: 'javascript',
  reactjs: 'react',
  next: 'nextjs',
  'next.js': 'nextjs',
  vue: 'vuejs',
  'vue.js': 'vuejs',
  k8s: 'kubernetes',
  amazonwebservices: 'aws',
  'amazon web services': 'aws',
  'github actions': 'githubactions',
  'github-actions': 'githubactions',
};

function normalizeKey(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/#/g, 'sharp')
    .replace(/\s+/g, ' ');
}

export function resolveDevToolIcon(name) {
  const normalized = normalizeKey(name);
  if (!normalized) return null;

  const alias = ALIASES[normalized];
  const key = alias || normalized;

  if (ICON_ENTRIES[key]) {
    return { key, ...ICON_ENTRIES[key] };
  }

  const compact = normalized.replace(/[\s._-]/g, '');
  if (ICON_ENTRIES[compact]) {
    return { key: compact, ...ICON_ENTRIES[compact] };
  }

  for (const [entryKey, entry] of Object.entries(ICON_ENTRIES)) {
    const entryCompact = entryKey.replace(/[\s._-]/g, '');
    if (compact === entryCompact || compact.includes(entryCompact) || entryCompact.includes(compact)) {
      return { key: entryKey, ...entry };
    }
  }

  return null;
}

export const DEV_TOOL_ICON_LIST = Object.keys(ICON_ENTRIES).sort();

export { HiCodeBracket as FallbackDevIcon };
