import { useEffect, useRef } from 'react';

export function useBuilderAutosave({ enabled, isDirty, onAutosave, delay = 2500 }) {
  const onAutosaveRef = useRef(onAutosave);
  onAutosaveRef.current = onAutosave;

  useEffect(() => {
    if (!enabled || !isDirty) return undefined;

    const timer = window.setTimeout(() => {
      onAutosaveRef.current();
    }, delay);

    return () => window.clearTimeout(timer);
  }, [enabled, isDirty, delay, onAutosave]);
}
