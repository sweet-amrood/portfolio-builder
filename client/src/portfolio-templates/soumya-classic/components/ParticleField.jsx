import { useEffect, useRef } from 'react';

export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    let frameId;
    let particles = [];

    const resize = () => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth || window.innerWidth;
      const height = parent?.clientHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particles = Array.from({ length: 160 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1,
        speed: 0.05 + Math.random() * 0.15,
        opacity: 0.05 + Math.random() * 0.35,
        pulse: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      const { width, height } = canvas;
      const root = canvas.closest('.smcls');
      const particleRgb =
        root && getComputedStyle(root).getPropertyValue('--smcls-particle-rgb').trim()
          ? getComputedStyle(root).getPropertyValue('--smcls-particle-rgb').trim()
          : '255, 255, 255';

      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.x += particle.speed;
        if (particle.x > width) {
          particle.x = 0;
          particle.y = Math.random() * height;
        }

        particle.pulse += 0.02;
        const alpha = particle.opacity * (0.6 + Math.sin(particle.pulse) * 0.4);

        ctx.beginPath();
        ctx.fillStyle = `rgba(${particleRgb}, ${alpha})`;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      frameId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement || document.body);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="smcls-particles" aria-hidden="true" />;
}
