export const BUILT_TEMPLATE_META = {
  'dark-orange-pro': {
    designWidth: 1100,
    rootClass: 'sawad',
  },
  'dev-minimal': {
    designWidth: 1100,
    rootClass: 'devmin',
  },
  'vscode-studio': {
    designWidth: 1280,
    rootClass: 'vsc-studio',
  },
  'creative-modern': {
    designWidth: 1180,
    rootClass: 'cmod',
  },
  'developer-classic': {
    designWidth: 1100,
    rootClass: 'dcls',
  },
  'soumya-classic': {
    designWidth: 1140,
    rootClass: 'smcls',
  },
  'aurora-flux': {
    designWidth: 1140,
    rootClass: 'aflux',
  },
  'lumen-bloom': {
    designWidth: 1080,
    rootClass: 'lbloom',
  },
  'midnight-gold': {
    designWidth: 1120,
    rootClass: 'mgold',
  },
  'prism-drift': {
    designWidth: 1140,
    rootClass: 'pdrift',
  },
};

export { BUILT_TEMPLATE_FEATURES, templateHasFeature, getTemplateFeatures } from './templateFeatures';

export function getBuiltTemplateMeta(templateId) {
  return BUILT_TEMPLATE_META[templateId] || BUILT_TEMPLATE_META['dark-orange-pro'];
}
