import {
  renderBuiltSectionFields,
  GenericHeroFields,
  GenericAboutFields,
  GenericPlaceholderFields,
} from './builder/builderSectionFields';

export default function BuilderPropertiesPanel({
  templateId,
  activeSection,
  content,
  onChange,
  isBuiltTemplate,
}) {
  if (!isBuiltTemplate) {
    if (activeSection === 'hero') {
      return <GenericHeroFields content={content} onChange={onChange} />;
    }
    if (activeSection === 'about') {
      return <GenericAboutFields content={content} onChange={onChange} />;
    }
    if (activeSection === 'projects' || activeSection === 'skills' || activeSection === 'contact') {
      return <GenericPlaceholderFields activeSection={activeSection} />;
    }
    return null;
  }

  return renderBuiltSectionFields({ templateId, activeSection, content, onChange });
}
