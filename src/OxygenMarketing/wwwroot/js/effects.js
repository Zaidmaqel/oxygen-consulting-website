/**
 * Oxygen Marketing — Creative Animations & Micro-Interactions (Inspired by High-End Luxury Tech)
 * - Dynamic ambient cursor spotlight following mouse
 * - 3D card tilt with specular border glare reflection
 * - Live animated count-up numbers for telemetry & metrics
 * - Smooth scroll entrance reveals
 * - Logo Easter Egg: 5 clicks spawn gold particle celebration burst
 */
(function () {
  'use strict';

  function initEffects() {
    // 1. Sticky Header scroll transition
    const header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }, { passive: true });
    }

    // 2. Global Ambient Cursor Spotlight (Nova AI Style)
    if (window.matchMedia('(pointer: fine)').matches) {
      let rafId = null;
      let lastX = window.innerWidth / 2;
      let lastY = window.innerHeight * 0.4;

      window.addEventListener('mousemove', (e) => {
        lastX = e.clientX;
        lastY = e.clientY;
        if (!rafId) {
          rafId = requestAnimationFrame(() => {
            document.documentElement.style.setProperty('--mouse-x', `${lastX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${lastY}px`);
            rafId = null;
          });
        }
      }, { passive: true });
    }

    // 3. 3D Tilt + Specular Card Glare Effect
    if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const tiltCards = document.querySelectorAll('.tilt-card, .glass-card');
      tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -7;
          const rotateY = ((x - centerX) / centerX) * 7;

          // Update card specular glare coords
          card.style.setProperty('--card-x', `${(x / rect.width) * 100}%`);
          card.style.setProperty('--card-y', `${(y / rect.height) * 100}%`);

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
      });
    }

    // 4. Live Count-Up Numbers Animation
    const counterElements = document.querySelectorAll('.countup-val, [data-countup]');
    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseFloat(el.getAttribute('data-target') || el.innerText.replace(/[^0-9.]/g, ''));
            const prefix = el.getAttribute('data-prefix') || (el.innerText.trim().startsWith('+') ? '+' : (el.innerText.trim().startsWith('$') ? '$' : ''));
            const suffix = el.getAttribute('data-suffix') || (el.innerText.trim().endsWith('%') ? '%' : '');
            const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
            
            if (!isNaN(target)) {
              animateValue(el, 0, target, 1600, prefix, suffix, decimals);
            }
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.2 });

      counterElements.forEach(el => counterObserver.observe(el));
    }

    function animateValue(obj, start, end, duration, prefix, suffix, decimals) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Ease out quad
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const current = start + (end - start) * easeProgress;
        
        let formatted = decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toLocaleString();
        obj.innerText = `${prefix}${formatted}${suffix}`;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          obj.innerText = `${prefix}${decimals > 0 ? end.toFixed(decimals) : end.toLocaleString()}${suffix}`;
        }
      };
      window.requestAnimationFrame(step);
    }

    // 5. Easter Egg: 5 clicks on logo triggers gold particle burst
    const logos = document.querySelectorAll('.brand-logo-wrap');
    let clickCount = 0;
    let clickResetTimer = null;

    logos.forEach(logo => {
      logo.addEventListener('click', (e) => {
        clickCount++;
        clearTimeout(clickResetTimer);

        if (clickCount >= 5) {
          e.preventDefault();
          spawnGoldParticleBurst(e.clientX || window.innerWidth / 2, e.clientY || 50);
          clickCount = 0;
        } else {
          clickResetTimer = setTimeout(() => {
            clickCount = 0;
          }, 3000);
        }
      });
    });

    function spawnGoldParticleBurst(originX, originY) {
      const particleCanvas = document.createElement('canvas');
      particleCanvas.style.position = 'fixed';
      particleCanvas.style.top = '0';
      particleCanvas.style.left = '0';
      particleCanvas.style.width = '100vw';
      particleCanvas.style.height = '100vh';
      particleCanvas.style.pointerEvents = 'none';
      particleCanvas.style.zIndex = '9999999';
      document.body.appendChild(particleCanvas);

      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
      const ctx = particleCanvas.getContext('2d');

      const colors = ['#FBD965', '#C79A3B', '#A67422', '#FFFFFF', '#FAF6EE'];
      const particles = [];
      const total = 80;

      for (let i = 0; i < total; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 7;
        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5,
          radius: 2 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.015 + Math.random() * 0.02
        });
      }

      function animate() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        let alive = 0;

        particles.forEach(p => {
          if (p.alpha > 0) {
            alive++;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.14; // gravity
            p.alpha -= p.decay;

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });

        if (alive > 0) {
          requestAnimationFrame(animate);
        } else {
          particleCanvas.remove();
        }
      }
      animate();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEffects);
  } else {
    initEffects();
  }
})();
