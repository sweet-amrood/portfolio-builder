import { sawadContent } from '../portfolio-templates/sawad/sawad.content';
import { devMinimalContent } from '../portfolio-templates/dev-minimal/dev-minimal.content';
import { vscodeStudioContent } from '../portfolio-templates/vscode-studio/vscode-studio.content';
import { creativeModernContent } from '../portfolio-templates/creative-modern/creative-modern.content';
import { developerClassicContent } from '../portfolio-templates/developer-classic/developer-classic.content';
import { soumyaClassicContent } from '../portfolio-templates/soumya-classic/soumya-classic.content';
import { auroraFluxContent } from '../portfolio-templates/aurora-flux/aurora-flux.content';
import { lumenBloomContent } from '../portfolio-templates/lumen-bloom/lumen-bloom.content';
import { midnightGoldContent } from '../portfolio-templates/midnight-gold/midnight-gold.content';
import { prismDriftContent } from '../portfolio-templates/prism-drift/prism-drift.content';
import { aiDynamicContent } from '../portfolio-templates/ai-dynamic/ai-dynamic.content';
import { ensureUniversalContent } from '../portfolio-templates/shared/universalSections';

export const DEFAULT_TEMPLATE_CONTENT = {
  'dark-orange-pro': structuredClone(sawadContent),
  'dev-minimal': structuredClone(devMinimalContent),
  'vscode-studio': structuredClone(vscodeStudioContent),
  'creative-modern': structuredClone(creativeModernContent),
  'developer-classic': structuredClone(developerClassicContent),
  'soumya-classic': structuredClone(soumyaClassicContent),
  'aurora-flux': structuredClone(auroraFluxContent),
  'lumen-bloom': structuredClone(lumenBloomContent),
  'midnight-gold': structuredClone(midnightGoldContent),
  'prism-drift': structuredClone(prismDriftContent),
  'ai-dynamic': structuredClone(aiDynamicContent),
};

export function getDefaultContent(templateId) {
  const base = structuredClone(
    DEFAULT_TEMPLATE_CONTENT[templateId] || DEFAULT_TEMPLATE_CONTENT['dark-orange-pro']
  );
  return ensureUniversalContent(base);
}
