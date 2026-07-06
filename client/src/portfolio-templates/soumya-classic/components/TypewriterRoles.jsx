import { useEffect, useState } from 'react';

export default function TypewriterRoles({ roles = [], active = true, className = '' }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!active || !roles.length) return undefined;

    const current = roles[index] || '';
    let timeout;

    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), 70);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), 40);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setIndex((value) => (value + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, index, roles, active]);

  return (
    <span className={`smcls-typewriter ${className}`.trim()}>
      <span className="smcls-typewriter-text">{text}</span>
      <span className="smcls-typewriter-cursor" aria-hidden="true">
        |
      </span>
    </span>
  );
}
