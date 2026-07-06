import { useEffect, useState } from 'react';

export default function FlipRoles({ roles = [], active = true }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active || !roles.length) return undefined;
    const timer = setInterval(() => {
      setIndex((value) => (value + 1) % roles.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [roles, active]);

  if (!roles.length) return null;

  return (
    <span className="lbloom-flip" aria-live="polite">
      {roles.map((role, i) => (
        <span
          key={`${role}-${i}`}
          className={`lbloom-flip-item${i === index ? ' lbloom-flip-item--active' : ''}`}
        >
          {role}
        </span>
      ))}
    </span>
  );
}
