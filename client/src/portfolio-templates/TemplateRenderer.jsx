import { getPortfolioTemplate } from './index';
import { getTemplateById } from '../data/templates';
import { FieldStyleProvider } from '../components/builder/FieldStyleContext';
import PortfolioFontLoader from '../components/shared/PortfolioFontLoader';
import { getTemplateBodyFont, getTemplateHeadingFont } from '../constants/portfolioFonts';
import GenericPlaceholder from './placeholders/GenericPlaceholder';
import './shared/template-responsive.css';
import './shared/template-font-overrides.css';
import './shared/template-mobile-nav.css';
import './shared/template-interactions.css';
import './shared/universal-sections.css';

export default function TemplateRenderer({
  templateId,
  preview = false,
  compact = false,
  className = '',
  editable = false,
  sectionOrder,
  content,
  theme,
  focusedSection,
  onFocusedSectionChange,
}) {
  const built = getPortfolioTemplate(templateId);
  const bodyFont = getTemplateBodyFont(content);
  const headingFont = getTemplateHeadingFont(content);
  const fontStyle = {};
  if (bodyFont) fontStyle['--tpl-font-body'] = bodyFont;
  if (headingFont) fontStyle['--tpl-font-heading'] = headingFont;

  if (built?.built && built.component) {
    const Component = built.component;
    return (
      <div
        className={[
          'template-renderer',
          className,
          bodyFont ? 'template-renderer--custom-body-font' : '',
          headingFont ? 'template-renderer--custom-heading-font' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={Object.keys(fontStyle).length ? fontStyle : undefined}
      >
        <PortfolioFontLoader content={content} />
        <FieldStyleProvider fieldStyles={content?.fieldStyles}>
          <Component
            preview={preview}
            compact={compact}
            editable={editable}
            sectionOrder={sectionOrder}
            content={content}
            theme={theme}
            focusedSection={focusedSection}
            onFocusedSectionChange={onFocusedSectionChange}
          />
        </FieldStyleProvider>
      </div>
    );
  }

  const meta = getTemplateById(templateId);
  return (
    <div className={`template-renderer ${className}`}>
      <GenericPlaceholder template={meta} preview={preview} />
    </div>
  );
}
