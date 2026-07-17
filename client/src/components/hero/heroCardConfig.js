import { PORTFOLIO_TEMPLATES } from '../../portfolio-templates';

export const HERO_PORTFOLIO_CARDS = [
  {
    kind: 'hero',
    label: 'Hero',
    templateId: 'aurora-flux',
  },
  {
    kind: 'work',
    label: 'Projects',
    templateId: 'dev-minimal',
  },
  {
    kind: 'about',
    label: 'Profile',
    templateId: 'vscode-studio',
  },
];

export function getHeroCardTemplate(templateId) {
  return PORTFOLIO_TEMPLATES[templateId] || PORTFOLIO_TEMPLATES['aurora-flux'];
}
