import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function TemplateSortableBlock({ id, editable, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: !editable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1,
    position: 'relative',
    zIndex: isDragging ? 5 : undefined,
  };

  if (!editable) {
    return <div className="template-sortable-block">{children}</div>;
  }

  return (
    <div ref={setNodeRef} style={style} className={`template-sortable-block${isDragging ? ' template-sortable-block--dragging' : ''}`}>
      <button
        type="button"
        className="template-section-drag"
        {...attributes}
        {...listeners}
        aria-label="Drag section to reorder"
      >
        ⋮⋮
      </button>
      {children}
    </div>
  );
}
