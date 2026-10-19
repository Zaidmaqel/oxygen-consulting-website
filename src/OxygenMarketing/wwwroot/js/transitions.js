/**
 * Oxygen Marketing — Transitions & Smooth Scrolling Module
 * Integrates Lenis smooth scrolling engine and manages the top scroll progress bar.
 */
(function () {
  'use strict';

  function initTransitions() {
    // Top Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
      if (!progressBar) return;
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    }, { passive: true });

    // Smooth scroll with Lenis (if loaded and reduced-motion is not set)
    if (window.Lenis && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      try {
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          smoothTouch: false,
          touchMultiplier: 2
        });

        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Connect Lenis with GSAP ScrollTrigger if both are present
        if (window.ScrollTrigger) {
          lenis.on('scroll', ScrollTrigger.update);
          gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
          });
          gsap.ticker.lagSmoothing(0);
        }
      } catch (err) {
        console.warn('Lenis smooth scroll fallback:', err);
      }
    }

    // Anchor links smooth navigation with fixed header offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerOffset = 90;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTransitions);
  } else {
    initTransitions();
  }
})();
