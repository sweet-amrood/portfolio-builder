export default function SectionAddMenu({ sections, availableIds, onAdd }) {
  if (!availableIds.length) return null;

  const sectionMap = Object.fromEntries(sections.map((s) => [s.id, s]));

  return (
    <div className="builder-add-section-menu">
      <p className="builder-add-section-label">Add section</p>
      <div className="builder-add-section-options">
        {availableIds.map((id) => {
          const section = sectionMap[id];
          if (!section) return null;
          return (
            <button
              key={id}
              type="button"
              className="builder-add-section-option"
              onClick={() => onAdd(id)}
            >
              <span className="section-icon">{section.icon}</span>
              {section.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
