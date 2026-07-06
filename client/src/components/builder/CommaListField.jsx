import { useState, useEffect, useRef } from 'react';
import { joinCommaList, parseCommaList } from '../../utils/contentHelpers';

export default function CommaListField({ value, onChange, id, placeholder }) {
  const [draft, setDraft] = useState(() => joinCommaList(value));
  const focusedRef = useRef(false);

  useEffect(() => {
    if (focusedRef.current) return;
    setDraft(joinCommaList(value));
  }, [value]);

  const commit = () => {
    focusedRef.current = false;
    const parsed = parseCommaList(draft);
    onChange(parsed);
    setDraft(joinCommaList(parsed));
  };

  return (
    <input
      id={id}
      value={draft}
      placeholder={placeholder}
      onFocus={() => {
        focusedRef.current = true;
      }}
      onChange={(e) => {
        const next = e.target.value;
        setDraft(next);
        onChange(parseCommaList(next));
      }}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    />
  );
}
