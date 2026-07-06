import { HiArrowPath } from 'react-icons/hi2';
import BuilderPropertiesPanel from '../BuilderPropertiesPanel';
import FieldStylePanel from './FieldStylePanel';

export default function BuilderInspector({
  templateId,
  activeSection,
  activeSectionMeta,
  content,
  onChange,
  isBuiltTemplate,
  onResetSection,
  selectedField,
  onFieldStyleChange,
  onResetFieldStyle,
  onListItemMove,
}) {
  return (
    <aside className="builder-v2-inspector">
      <div className="builder-v2-inspector-head">
        <div className="builder-v2-inspector-title">
          <span className="builder-v2-inspector-icon">{activeSectionMeta?.icon || '⬡'}</span>
          <div>
            <p className="builder-v2-inspector-label">Editing section</p>
            <h2>{activeSectionMeta?.label || activeSection}</h2>
          </div>
        </div>
        {isBuiltTemplate && (
          <button
            type="button"
            className="builder-v2-reset-section"
            onClick={onResetSection}
            title="Reset this section to defaults"
          >
            <HiArrowPath size={16} />
            <span>Reset section</span>
          </button>
        )}
      </div>

      <div className="builder-v2-inspector-body">
        {isBuiltTemplate && selectedField && (
          <FieldStylePanel
            selectedField={selectedField}
            fieldStyles={content.fieldStyles}
            content={content}
            onStyleChange={onFieldStyleChange}
            onResetStyle={onResetFieldStyle}
            onListItemMove={onListItemMove}
          />
        )}
        <BuilderPropertiesPanel
          templateId={templateId}
          activeSection={activeSection}
          content={content}
          onChange={onChange}
          isBuiltTemplate={isBuiltTemplate}
        />
      </div>
    </aside>
  );
}
