import { useMemo, useRef, useEffect, useCallback } from 'react';
import { useBuilderEdit } from './BuilderEditContext';
import { useFieldStyles } from './FieldStyleContext';
import { resolveFieldStyleCss } from '../../utils/fieldStyleUtils';

function textFromChildren(children) {
  if (children == null) return '';
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  return '';
}

export default function EditableText({
  field,
  section,
  label,
  as: Tag = 'span',
  className,
  children,
  multiline = false,
  style,
  ...props
}) {
  const ctx = useBuilderEdit();
  const fieldStyles = useFieldStyles();
  const editRef = useRef(null);
  const editSessionRef = useRef(null);

  const typographyStyle = useMemo(
    () => resolveFieldStyleCss(fieldStyles, section, field),
    [fieldStyles, section, field]
  );

  const mergedStyle = typographyStyle ? { ...typographyStyle, ...style } : style;
  const isSelected =
    ctx?.selectedField?.field === field && ctx?.selectedField?.section === section;
  const isEditing =
    ctx?.editingField?.field === field && ctx?.editingField?.section === section;

  const beginEditSession = useCallback(() => {
    const el = editRef.current;
    if (!el) return;
    const sessionKey = `${section}::${field}`;
    if (editSessionRef.current === sessionKey) return;
    editSessionRef.current = sessionKey;
    el.textContent = textFromChildren(children);
    requestAnimationFrame(() => {
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    });
  }, [section, field, children]);

  useEffect(() => {
    if (!isEditing) {
      editSessionRef.current = null;
      return;
    }
    beginEditSession();
  }, [isEditing, beginEditSession]);

  const handleBlur = (event) => {
    if (!isEditing) return;
    const value = event.currentTarget.innerText.replace(/\n$/, '');
    ctx?.onEndFieldEdit?.(field, value);
  };

  const handleKeyDown = (event) => {
    if (!isEditing) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      ctx?.onCancelFieldEdit?.();
      return;
    }
    if (event.key === 'Enter' && !multiline && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.blur();
    }
  };

  if (!ctx?.editable || !field) {
    return (
      <Tag className={className} style={mergedStyle} {...props}>
        {children}
      </Tag>
    );
  }

  const classes = [
    'pf-editable-field',
    isSelected ? 'pf-field--selected' : '',
    isEditing ? 'pf-field--editing' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      ref={editRef}
      className={classes}
      style={mergedStyle}
      data-pf-field={field}
      data-pf-section={section}
      data-pf-label={label || field}
      contentEditable={isEditing}
      suppressContentEditableWarning
      tabIndex={isEditing ? 0 : -1}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      {...(multiline ? { 'data-pf-multiline': '' } : {})}
      {...props}
    >
      {isEditing ? null : children}
    </Tag>
  );
}
