import { useEffect } from 'react';
import Lenis from 'lenis';

export const useLenis = () => {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let animationFrameId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };

    animationFrameId = requestAnimationFrame(raf);

    const handleHashScroll = (e: HashChangeEvent) => {
      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target as HTMLElement, { offset: -80 });
        }
      }
    };

    window.addEventListener('hashchange', handleHashScroll);

    const initialHash = window.location.hash;
    if (initialHash) {
      setTimeout(() => {
        const target = document.querySelector(initialHash);
        if (target) lenis.scrollTo(target as HTMLElement, { offset: -80 });
      }, 200);
    }

    return () => {
      lenis.destroy();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('hashchange', handleHashScroll);
    };
  }, []);
};
