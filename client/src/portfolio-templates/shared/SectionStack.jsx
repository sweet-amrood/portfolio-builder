import TemplateSortableBlock from '../../components/TemplateSortableBlock';
import { UniversalTemplateSection } from './universalSections';

export default function SectionStack({
  order,
  renderers,
  content,
  preview = false,
  editable = false,
}) {
  return order.map((sectionId) => {
    const Section = renderers[sectionId];
    if (!Section) {
      return (
        <TemplateSortableBlock key={sectionId} id={sectionId} editable={editable}>
          <UniversalTemplateSection sectionId={sectionId} c={content} preview={preview} />
        </TemplateSortableBlock>
      );
    }

    return (
      <TemplateSortableBlock key={sectionId} id={sectionId} editable={editable}>
        <Section c={content} preview={preview} />
      </TemplateSortableBlock>
    );
  });
}
