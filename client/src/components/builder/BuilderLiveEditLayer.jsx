import { useState, useEffect, useRef, useCallback } from 'react';
import { useBuilderEdit } from './BuilderEditContext';

function getCanvasScale(canvas) {
  const rect = canvas.getBoundingClientRect();
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;
  if (!width || !height) return { x: 1, y: 1 };
  return {
    x: rect.width / width,
    y: rect.height / height,
  };
}

function measureFieldBox(canvas, el) {
  const canvasRect = canvas.getBoundingClientRect();
  const rect = el.getBoundingClientRect();
  const scale = getCanvasScale(canvas);
  return {
    top: (rect.top - canvasRect.top) / scale.y,
    left: (rect.left - canvasRect.left) / scale.x,
    width: rect.width / scale.x,
    height: rect.height / scale.y,
    label: el.dataset.pfLabel || el.dataset.pfField,
  };
}

function findFieldElement(canvas, fieldMeta) {
  if (!canvas || !fieldMeta) return null;
  return canvas.querySelector(
    `[data-pf-field="${fieldMeta.field}"][data-pf-section="${fieldMeta.section}"]`
  );
}

export default function BuilderLiveEditLayer() {
  const {
    editable,
    onSectionSelect,
    onSelectField,
    onStartFieldEdit,
    selectedField,
    editingField,
    canvasRef,
  } = useBuilderEdit();
  const [hoverBox, setHoverBox] = useState(null);
  const [selectionBox, setSelectionBox] = useState(null);
  const [editingBox, setEditingBox] = useState(null);
  const hoverBoxRef = useRef(null);

  const getFieldEl = useCallback(
    (target) => {
      if (!target || !canvasRef?.current) return null;
      const el = target.closest('[data-pf-field]');
      if (!el || !canvasRef.current.contains(el)) return null;
      if (el.closest('.template-section-drag')) return null;
      if (el.closest('button')) return null;
      return el;
    },
    [canvasRef]
  );

  const refreshBoxes = useCallback(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    if (editingField) {
      const editingEl = findFieldElement(canvas, editingField);
      setEditingBox(editingEl ? measureFieldBox(canvas, editingEl) : null);
      setSelectionBox(null);
      return;
    }

    setEditingBox(null);

    if (selectedField) {
      const selectedEl = findFieldElement(canvas, selectedField);
      setSelectionBox(selectedEl ? measureFieldBox(canvas, selectedEl) : null);
    } else {
      setSelectionBox(null);
    }
  }, [canvasRef, selectedField, editingField]);

  useEffect(() => {
    refreshBoxes();
  }, [refreshBoxes]);

  useEffect(() => {
    if (!editable) return undefined;
    const canvas = canvasRef?.current;
    if (!canvas) return undefined;

    const observer = new ResizeObserver(() => refreshBoxes());
    observer.observe(canvas);

    return () => observer.disconnect();
  }, [editable, canvasRef, refreshBoxes]);

  useEffect(() => {
    if (!editable) return undefined;
    const canvas = canvasRef?.current;
    if (!canvas) return undefined;

    const onMove = (event) => {
      if (editingField) return;
      const el = getFieldEl(event.target);
      if (!el) {
        hoverBoxRef.current = null;
        setHoverBox(null);
        return;
      }
      const box = measureFieldBox(canvas, el);
      hoverBoxRef.current = box;
      setHoverBox(box);
    };

    const onLeave = (event) => {
      if (editingField) return;
      if (!canvas.contains(event.relatedTarget)) {
        hoverBoxRef.current = null;
        setHoverBox(null);
      }
    };

    const selectField = (el) => {
      const section = el.dataset.pfSection;
      if (section) onSectionSelect?.(section);
      onSelectField?.({
        field: el.dataset.pfField,
        section,
        label: el.dataset.pfLabel || el.dataset.pfField,
      });
    };

    const onMouseDown = (event) => {
      const el = getFieldEl(event.target);
      if (!el) return;
      const link = el.closest('a');
      if (link && event.detail < 2) event.preventDefault();
    };

    const onClick = (event) => {
      if (editingField) return;
      const el = getFieldEl(event.target);
      if (!el) return;
      event.stopPropagation();
      if (event.detail > 1) return;
      selectField(el);
    };

    const onDblClick = (event) => {
      const el = getFieldEl(event.target);
      if (!el) return;
      event.preventDefault();
      event.stopPropagation();
      const section = el.dataset.pfSection;
      const fieldMeta = {
        field: el.dataset.pfField,
        section,
        label: el.dataset.pfLabel || el.dataset.pfField,
      };
      if (section) onSectionSelect?.(section);
      onStartFieldEdit?.(fieldMeta);
    };

    const scrollParent = canvas.closest('.builder-v2-canvas-wrap');
    const onScroll = () => {
      if (editingField) {
        refreshBoxes();
        return;
      }
      if (hoverBoxRef.current) {
        const hovered = canvas.querySelector('[data-pf-field]:hover');
        if (hovered) {
          const box = measureFieldBox(canvas, hovered);
          hoverBoxRef.current = box;
          setHoverBox(box);
        }
      }
      refreshBoxes();
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('mousedown', onMouseDown, true);
    canvas.addEventListener('click', onClick, true);
    canvas.addEventListener('dblclick', onDblClick, true);
    scrollParent?.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', refreshBoxes);

    return () => {
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('mousedown', onMouseDown, true);
      canvas.removeEventListener('click', onClick, true);
      canvas.removeEventListener('dblclick', onDblClick, true);
      scrollParent?.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', refreshBoxes);
    };
  }, [
    editable,
    canvasRef,
    getFieldEl,
    onSectionSelect,
    onSelectField,
    onStartFieldEdit,
    editingField,
    refreshBoxes,
  ]);

  if (!editable) return null;

  const box = editingBox || selectionBox || hoverBox;
  const boxClass = editingBox
    ? ' pf-live-edit-highlight--editing'
    : selectionBox
      ? ' pf-live-edit-highlight--selected'
      : '';

  return (
    <div className="pf-live-edit-layer" aria-hidden="true">
      {box && (
        <div
          className={`pf-live-edit-highlight${boxClass}`}
          style={{
            top: box.top,
            left: box.left,
            width: box.width,
            height: box.height,
          }}
        >
          <span className="pf-live-edit-label">
            {editingBox ? 'Editing — type here' : box.label}
          </span>
        </div>
      )}
    </div>
  );
}
