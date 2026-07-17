import { useEffect } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

export default function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      autoRaf: true,
    });

    const onScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on('scroll', onScroll);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      lenis.off('scroll', onScroll);
      lenis.destroy();
    };
  }, [enabled]);
}
