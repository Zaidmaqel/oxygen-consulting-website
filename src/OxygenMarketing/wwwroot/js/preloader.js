/**
 * Oxygen Marketing — Preloader Module
 * Handles the signature golden iris open animation.
 * Features session caching to skip repeat delays and a failsafe safety timeout.
 */
(function () {
  'use strict';

  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Check if user already visited during this browser session
    const hasVisited = sessionStorage.getItem('oxygen_visited_session');
    if (hasVisited) {
      preloader.style.display = 'none';
      return;
    }

    // Safety failsafe: never trap or block the visitor if anything delays
    const failsafeTimeout = setTimeout(() => {
      dismissPreloader();
    }, 2200);

    function dismissPreloader() {
      clearTimeout(failsafeTimeout);
      preloader.classList.add('loaded');
      sessionStorage.setItem('oxygen_visited_session', 'true');
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.style.display = 'none';
        }
      }, 900);
    }

    // Normal sequence completion
    window.addEventListener('load', () => {
      setTimeout(dismissPreloader, 1400);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }
})();
