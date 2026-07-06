import { PORTFOLIO_TEMPLATE_LIST, getPortfolioTemplate } from '../portfolio-templates';

export const TEMPLATE_TAGS = ['All', 'Minimal', 'Dark', 'Modern', 'Creative', 'IDE'];

export const TEMPLATES = [...PORTFOLIO_TEMPLATE_LIST];

export const getTemplateById = (id) => {
  const built = getPortfolioTemplate(id);
  if (built) {
    return { ...built };
  }
  return PORTFOLIO_TEMPLATE_LIST[0];
};
