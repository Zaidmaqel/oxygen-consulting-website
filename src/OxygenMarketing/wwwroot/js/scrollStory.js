/**
 * Oxygen Marketing — Scroll Storytelling Module
 * Implements the pinned step-by-step narrative: "What happens at Oxygen?"
 * Strategy -> Content -> Campaigns -> Analysis
 * Respects Arabic cursive typography by animating whole words/lines instead of single characters.
 */
(function () {
  'use strict';

  function initScrollStory() {
    if (!window.gsap || !window.ScrollTrigger) {
      console.warn('GSAP/ScrollTrigger not detected, defaulting to natural CSS scroll flow.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const storySection = document.getElementById('scroll-story-section');
    if (!storySection) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const cards = gsap.utils.toArray('.story-card');
    if (!cards.length) return;

    // Pin section on desktop / wide screens
    if (window.innerWidth >= 992) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: storySection,
          pin: true,
          start: 'top top',
          end: `+=${cards.length * 100}%`,
          scrub: 1,
          anticipatePin: 1
        }
      });

      cards.forEach((card, i) => {
        if (i === 0) {
          gsap.set(card, { opacity: 1, y: 0, scale: 1 });
        } else {
          gsap.set(card, { opacity: 0, y: 80, scale: 0.95 });
          tl.to(cards[i - 1], {
            opacity: 0,
            y: -50,
            scale: 0.9,
            duration: 0.8,
            ease: 'power2.inOut'
          }, `step-${i}`);

          tl.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power2.out'
          }, `step-${i}+=0.3`);
        }
      });
    } else {
      // Mobile: standard staggered reveal per card on scroll
      cards.forEach(card => {
        gsap.fromTo(card, 
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%'
            }
          }
        );
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollStory);
  } else {
    initScrollStory();
  }
})();
