/**
 * Oxygen Marketing — Platforms Marquee Module
 * Handles smooth interaction, touch and pause-on-hover for the omnichannel platform ecosystem.
 */
(function () {
  'use strict';

  function initMarquee() {
    const sections = document.querySelectorAll('.platforms-marquee-section, .marquee-container');
    if (!sections.length) return;

    sections.forEach(section => {
      const tracks = section.querySelectorAll('.marquee-scroll-track, .marquee-track');
      if (!tracks.length) return;

      section.addEventListener('mouseenter', () => {
        tracks.forEach(track => {
          track.style.animationPlayState = 'paused';
        });
      });

      section.addEventListener('mouseleave', () => {
        tracks.forEach(track => {
          track.style.animationPlayState = 'running';
        });
      });

      section.addEventListener('touchstart', () => {
        tracks.forEach(track => {
          track.style.animationPlayState = 'paused';
        });
      }, { passive: true });

      section.addEventListener('touchend', () => {
        tracks.forEach(track => {
          track.style.animationPlayState = 'running';
        });
      }, { passive: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMarquee);
  } else {
    initMarquee();
  }
})();
