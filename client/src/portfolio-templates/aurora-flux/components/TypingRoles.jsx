import { useEffect, useState } from 'react';

export default function TypingRoles({ roles = [], active = true }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!active || !roles.length) return undefined;

    const current = roles[index] || '';
    let timeout;

    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), 65);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), 35);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setIndex((value) => (value + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, index, roles, active]);

  return (
    <span className="aflux-typing">
      {text}
      <span className="aflux-typing-cursor" aria-hidden="true">
        _
      </span>
    </span>
  );
}
