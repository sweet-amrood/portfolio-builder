import { useEffect, useState } from 'react';

export default function IdeCustomCursor({ active, rootRef }) {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return undefined;

    let ringFrame;
    const root = rootRef?.current;

    const onMove = (event) => {
      const el = rootRef?.current;
      if (!el) {
        setPos({ x: event.clientX, y: event.clientY });
        setRingPos({ x: event.clientX, y: event.clientY });
        setVisible(true);
        return;
      }

      const rect = el.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      setVisible(inside);
      if (!inside) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setPos({ x, y });
      cancelAnimationFrame(ringFrame);
      ringFrame = requestAnimationFrame(() => setRingPos({ x, y }));
    };

    const onLeave = () => setVisible(false);
    const target = root || window;

    target.addEventListener('mousemove', onMove);
    if (root) root.addEventListener('mouseleave', onLeave);

    return () => {
      target.removeEventListener('mousemove', onMove);
      if (root) root.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(ringFrame);
    };
  }, [active, rootRef]);

  if (!active || !visible) return null;

  return (
    <>
      <div className="vsc-cursor-ring" style={{ left: ringPos.x, top: ringPos.y }} />
      <div className="vsc-cursor-dot" style={{ left: pos.x, top: pos.y }} />
    </>
  );
}
