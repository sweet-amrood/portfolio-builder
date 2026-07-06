import { appendListItem, removeListItemAt } from '../../utils/listFieldHelpers';

export function ItemBlock({ title, onRemove, canRemove = false, children }) {
  return (
    <div className="builder-item-block">
      <div className="builder-item-block-head">
        <p className="builder-item-block-title">{title}</p>
        {canRemove && onRemove ? (
          <button type="button" className="builder-item-remove" onClick={onRemove}>
            Remove
          </button>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function AddListItemButton({ label, onClick }) {
  return (
    <button type="button" className="builder-add-list-item" onClick={onClick}>
      + {label}
    </button>
  );
}

export function InlineListRow({ children, onRemove, canRemove = true }) {
  return (
    <div className="builder-inline-list-row">
      <div className="builder-inline-list-row-fields">{children}</div>
      {canRemove && onRemove ? (
        <button type="button" className="builder-inline-list-remove" onClick={onRemove} aria-label="Remove">
          ×
        </button>
      ) : null}
    </div>
  );
}

export function useListFieldHandlers({ list, onChange, key, defaultItem, minItems = 0 }) {
  const add = () => onChange({ [key]: appendListItem(list, defaultItem) });
  const remove = (index) => onChange({ [key]: removeListItemAt(list, index, minItems) });
  return { add, remove };
}
