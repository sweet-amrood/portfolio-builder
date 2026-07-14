import DevMinimalTemplate from './dev-minimal';
import SawadTemplate from './sawad';
import VscodeStudioTemplate from './vscode-studio';
import CreativeModernTemplate from './creative-modern';
import DeveloperClassicTemplate from './developer-classic';
import SoumyaClassicTemplate from './soumya-classic';
import AuroraFluxTemplate from './aurora-flux';
import LumenBloomTemplate from './lumen-bloom';
import MidnightGoldTemplate from './midnight-gold';
import PrismDriftTemplate from './prism-drift';
import AiDynamicTemplate from './ai-dynamic';

export const PORTFOLIO_TEMPLATES = {
  'dev-minimal': {
    id: 'dev-minimal',
    name: 'Dev Minimal',
    description: 'Clean developer portfolio with sidebar navigation, section-based layout, and subtle motion — inspired by modern docs-style sites.',
    tags: ['Minimal', 'Dark'],
    colors: ['#09090b', '#8b5cf6'],
    accent: '#8b5cf6',
    component: DevMinimalTemplate,
    built: true,
    complexity: 'medium',
    maxThemes: 4,
  },
  'dark-orange-pro': {
    id: 'dark-orange-pro',
    name: 'Dark Orange Pro',
    description: 'Bold dark portfolio with orange accents, marquee skills, project grid, experience timeline, and contact form.',
    tags: ['Dark', 'Modern'],
    colors: ['#0a0a0a', '#ff6b2c'],
    accent: '#ff6b2c',
    component: SawadTemplate,
    built: true,
    complexity: 'medium',
    maxThemes: 4,
  },
  'vscode-studio': {
    id: 'vscode-studio',
    name: 'VS Code Studio',
    description: 'IDE-style portfolio with file explorer, tabs, Copilot panel, custom cursor, and syntax-themed sections — inspired by developer portfolio sites.',
    tags: ['Dark', 'Modern', 'IDE'],
    colors: ['#1e1e1e', '#c586c0'],
    accent: '#007acc',
    component: VscodeStudioTemplate,
    built: true,
    complexity: 'medium',
    maxThemes: 4,
  },
  'creative-modern': {
    id: 'creative-modern',
    name: 'Skyline',
    description: 'Animated hero with typing roles, particle backdrop, service cards, and polished project grid — inspired by creative developer portfolios.',
    tags: ['Creative', 'Modern'],
    colors: ['#f8fafc', '#0891b2'],
    accent: '#0891b2',
    component: CreativeModernTemplate,
    built: true,
    complexity: 'medium',
    maxThemes: 4,
  },
  'developer-classic': {
    id: 'developer-classic',
    name: 'Developer Classic',
    description: 'Polished developer portfolio with hero profile, expertise cards, career timeline, project grid, and contact form — inspired by the open-source React portfolio template.',
    tags: ['Modern', 'Minimal'],
    colors: ['#0d1116', '#5000ca'],
    accent: '#5000ca',
    component: DeveloperClassicTemplate,
    built: true,
    complexity: 'medium',
    maxThemes: 4,
  },
  'soumya-classic': {
    id: 'soumya-classic',
    name: 'Soumya Classic',
    description: 'Dark purple developer portfolio with particle hero, typewriter roles, multi-page navigation, skill grid, project cards, and resume timeline — inspired by the Soumyajit open-source template.',
    tags: ['Dark', 'Creative'],
    colors: ['#1b1429', '#c770f0'],
    accent: '#c770f0',
    component: SoumyaClassicTemplate,
    built: true,
    complexity: 'medium',
    maxThemes: 4,
  },
  'aurora-flux': {
    id: 'aurora-flux',
    name: 'Aurora Flux',
    description: 'Immersive creative portfolio with animated aurora mesh, glass dock navigation, orbital hero, bento grids, dual skill marquees, and glowing project cards.',
    tags: ['Creative', 'Dark', 'Animated'],
    colors: ['#050508', '#22d3ee'],
    accent: '#22d3ee',
    component: AuroraFluxTemplate,
    built: true,
    complexity: 'medium',
    maxThemes: 4,
  },
  'lumen-bloom': {
    id: 'lumen-bloom',
    name: 'Lumen Bloom',
    description: 'Warm light editorial portfolio with paper textures, polaroid hero, ribbon navigation, flip roles, horizontal project scroll, and soft pastel accents.',
    tags: ['Light', 'Creative', 'Editorial'],
    colors: ['#faf7f2', '#e07a5f'],
    accent: '#e07a5f',
    component: LumenBloomTemplate,
    built: true,
    complexity: 'medium',
    maxThemes: 4,
  },
  'midnight-gold': {
    id: 'midnight-gold',
    name: 'Midnight Gold',
    description: 'Luxury dark portfolio with champagne gold accents, serif display typography, gold dust particles, framed project cards, and refined career timeline.',
    tags: ['Dark', 'Luxury', 'Creative'],
    colors: ['#08090d', '#c9a44c'],
    accent: '#c9a44c',
    component: MidnightGoldTemplate,
    built: true,
    complexity: 'medium',
    maxThemes: 4,
  },
  'prism-drift': {
    id: 'prism-drift',
    name: 'Prism Drift',
    description: 'Split-panel brutalist portfolio with fixed left rail navigation, full-width typographic intro, prism signal visual, masonry projects, and gradient contact band.',
    tags: ['Creative', 'Dark', 'Bold'],
    colors: ['#0e0e14', '#ff3cac'],
    accent: '#ff3cac',
    component: PrismDriftTemplate,
    built: true,
    complexity: 'medium',
    maxThemes: 4,
  },
  'ai-dynamic': {
    id: 'ai-dynamic',
    name: 'AI Studio',
    description: 'Generate a full portfolio from a prompt. Layout and content stay within PortfolioForge system limits so you can edit and publish immediately.',
    tags: ['Modern', 'Creative', 'AI'],
    colors: ['#070b16', '#6366f1'],
    accent: '#6366f1',
    component: AiDynamicTemplate,
    built: true,
    complexity: 'medium',
    maxThemes: 2,
    ai: true,
  },
};

export const PORTFOLIO_TEMPLATE_LIST = Object.values(PORTFOLIO_TEMPLATES);

export const getPortfolioTemplate = (id) => PORTFOLIO_TEMPLATES[id] || null;

export { SawadTemplate, DevMinimalTemplate, VscodeStudioTemplate, CreativeModernTemplate, DeveloperClassicTemplate, SoumyaClassicTemplate, AuroraFluxTemplate, LumenBloomTemplate, MidnightGoldTemplate, PrismDriftTemplate, AiDynamicTemplate };
