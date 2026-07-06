import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableRow({ section, active, onSelect, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
    zIndex: isDragging ? 2 : undefined,
  };

  return (
    <li ref={setNodeRef} style={style} className="builder-section-row">
      <button
        type="button"
        className={`builder-section-btn${active === section.id ? ' builder-section-btn--active' : ''}`}
        onClick={() => onSelect(section.id)}
      >
        <span className="section-drag" {...attributes} {...listeners} aria-label="Drag to reorder">
          ⋮⋮
        </span>
        <span className="section-icon">{section.icon}</span>
        <span className="builder-section-label">{section.label}</span>
      </button>
      <button
        type="button"
        className="builder-section-remove"
        onClick={() => onRemove(section.id)}
        aria-label={`Remove ${section.label} section`}
      >
        ×
      </button>
    </li>
  );
}

export default function SortableSectionList({
  sections,
  order,
  activeSection,
  onSelect,
  onReorder,
  onRemove,
  fixedSections = [],
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(active.id);
    const newIndex = order.indexOf(over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(order, oldIndex, newIndex));
  };

  const sectionMap = Object.fromEntries(sections.map((s) => [s.id, s]));
  const fixed = fixedSections.map((id) => sectionMap[id]).filter(Boolean);
  const ordered = order.map((id) => sectionMap[id]).filter(Boolean);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <ul className="builder-section-list">
        {fixed.map((section) => (
          <li key={section.id}>
            <button
              type="button"
              className={`builder-section-btn builder-section-btn--fixed${activeSection === section.id ? ' builder-section-btn--active' : ''}`}
              onClick={() => onSelect(section.id)}
            >
              <span className="section-icon">{section.icon}</span>
              {section.label}
            </button>
          </li>
        ))}
      </ul>
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <ul className="builder-section-list builder-section-list--sortable">
          {ordered.map((section) => (
            <SortableRow
              key={section.id}
              section={section}
              active={activeSection}
              onSelect={onSelect}
              onRemove={onRemove}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
