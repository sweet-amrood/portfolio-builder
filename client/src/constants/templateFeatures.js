export const BUILT_TEMPLATE_FEATURES = {
  'dark-orange-pro': {
    profilePhoto: true,
    microInteractions: true,
  },
  'dev-minimal': {
    profilePhoto: true,
    microInteractions: true,
  },
  'vscode-studio': {
    profilePhoto: true,
    microInteractions: true,
  },
  'creative-modern': {
    profilePhoto: true,
    microInteractions: true,
  },
  'developer-classic': {
    profilePhoto: true,
    microInteractions: true,
  },
  'soumya-classic': {
    profilePhoto: false,
    microInteractions: true,
  },
  'aurora-flux': {
    profilePhoto: true,
    microInteractions: true,
  },
  'lumen-bloom': {
    profilePhoto: true,
    microInteractions: true,
  },
  'midnight-gold': {
    profilePhoto: true,
    microInteractions: true,
  },
  'prism-drift': {
    profilePhoto: true,
    microInteractions: true,
  },
};

export function templateHasFeature(templateId, feature) {
  return Boolean(BUILT_TEMPLATE_FEATURES[templateId]?.[feature]);
}

export function getTemplateFeatures(templateId) {
  return BUILT_TEMPLATE_FEATURES[templateId] || {};
}
