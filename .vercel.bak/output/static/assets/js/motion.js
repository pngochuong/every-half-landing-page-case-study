(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;

  function startMotion() {
    if (reducedMotion.matches) return;
    root.classList.add('motion-ready');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18 });
    document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element));

    const hero = document.querySelector('[data-parallax]');
    let frame = 0;
    window.addEventListener('scroll', () => {
      if (frame || !hero) return;
      frame = window.requestAnimationFrame(() => {
        hero.style.transform = `scale(1.08) translate3d(0, ${Math.min(window.scrollY * 0.08, 70)}px, 0)`;
        frame = 0;
      });
    }, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startMotion, { once: true }); else startMotion();
})();
