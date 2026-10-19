/**
 * Oxygen Marketing — Custom Cursor & Magnetic Interactions
 * Active exclusively on fine pointer desktop devices.
 * Soft gold follower with magnetic attraction to key buttons.
 */
(function () {
  'use strict';

  function initCursor() {
    // Only initialize on desktop devices with fine pointers and no reduced-motion
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cursorDot = document.querySelector('.custom-cursor');
    let cursorFollower = document.querySelector('.custom-cursor-follower');

    if (!cursorDot) {
      cursorDot = document.createElement('div');
      cursorDot.className = 'custom-cursor';
      document.body.appendChild(cursorDot);
    }

    if (!cursorFollower) {
      cursorFollower = document.createElement('div');
      cursorFollower.className = 'custom-cursor-follower';
      document.body.appendChild(cursorFollower);
    }

    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    // Smooth follower interpolation loop
    function renderFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
      requestAnimationFrame(renderFollower);
    }
    renderFollower();

    // Hover expanders
    const interactiveElements = 'a, button, input, select, textarea, .studio-pill-option, .radar-blip, .brand-logo-wrap, [role="button"]';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveElements)) {
        document.body.classList.add('cursor-expanded');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveElements)) {
        document.body.classList.remove('cursor-expanded');
      }
    });

    // Magnetic pull effect on luxury buttons
    const magneticBtns = document.querySelectorAll('.btn-gold, .btn-glass, .floating-whatsapp');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.28;
        const deltaY = (e.clientY - centerY) * 0.28;

        btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
  } else {
    initCursor();
  }
})();
