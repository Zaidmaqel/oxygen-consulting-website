/**
 * Oxygen Marketing — Build-Your-Campaign Studio Module
 * Interactive configurator connecting real performance benchmarks to a dynamic
 * orbital visualization with live budget, reach, and conversation projections.
 */
(function () {
  'use strict';

  function initStudio() {
    const studioSection = document.getElementById('campaign-studio');
    if (!studioSection) return;

    // State tracking
    const state = {
      platforms: ['Instagram', 'Facebook'],
      services: ['paid_ads', 'content_creation'],
      goal: 'messages'
    };

    const orbitGroup = document.getElementById('orbit-nodes-group');
    const budgetDisplay = document.getElementById('studio-budget-display');
    const reachDisplay = document.getElementById('studio-reach-display');
    const convDisplay = document.getElementById('studio-conv-display');
    const requestPkgBtn = document.getElementById('studio-request-package-btn');
    const csrfToken = document.querySelector('input[name="__RequestVerificationToken"]')?.value || '';

    // Initialize pill buttons click & keyboard events
    const optionPills = studioSection.querySelectorAll('.studio-pill-option');
    optionPills.forEach(pill => {
      pill.addEventListener('click', () => toggleOption(pill));
      pill.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleOption(pill);
        }
      });
    });

    function toggleOption(pill) {
      const category = pill.getAttribute('data-category');
      const val = pill.getAttribute('data-value');

      if (category === 'goal') {
        // Single selection for goal
        state.goal = val;
        studioSection.querySelectorAll('[data-category="goal"]').forEach(p => {
          p.classList.remove('active');
          p.setAttribute('aria-pressed', 'false');
        });
        pill.classList.add('active');
        pill.setAttribute('aria-pressed', 'true');
      } else if (category === 'platform') {
        const idx = state.platforms.indexOf(val);
        if (idx > -1) {
          if (state.platforms.length > 1) { // keep at least 1
            state.platforms.splice(idx, 1);
            pill.classList.remove('active');
            pill.setAttribute('aria-pressed', 'false');
          }
        } else {
          state.platforms.push(val);
          pill.classList.add('active');
          pill.setAttribute('aria-pressed', 'true');
        }
      } else if (category === 'service') {
        const idx = state.services.indexOf(val);
        if (idx > -1) {
          if (state.services.length > 1) {
            state.services.splice(idx, 1);
            pill.classList.remove('active');
            pill.setAttribute('aria-pressed', 'false');
          }
        } else {
          state.services.push(val);
          pill.classList.add('active');
          pill.setAttribute('aria-pressed', 'true');
        }
      }

      updateOrbitVisualization();
      fetchOrComputeEstimate();
    }

    // Dynamic Orbit Visualization using SVG & GSAP
    function updateOrbitVisualization() {
      if (!orbitGroup) return;

      const activeItems = [...state.platforms, ...state.services];
      const count = activeItems.length;
      const radiusX = 140;
      const radiusY = 75; // tilted perspective orbit
      const centerX = 200;
      const centerY = 160;

      // Clear existing nodes smoothly
      orbitGroup.innerHTML = '';

      activeItems.forEach((item, index) => {
        const angle = (index / count) * (Math.PI * 2);
        const x = centerX + Math.cos(angle) * radiusX;
        const y = centerY + Math.sin(angle) * radiusY;

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'orbit-node');
        g.setAttribute('transform', `translate(${x}, ${y}) scale(0)`);

        // Glowing outer circle
        const circleOuter = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circleOuter.setAttribute('r', '14');
        circleOuter.setAttribute('fill', 'rgba(251, 217, 101, 0.25)');
        circleOuter.setAttribute('stroke', '#C79A3B');
        circleOuter.setAttribute('stroke-width', '1.5');

        // Center dot
        const circleInner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circleInner.setAttribute('r', '5');
        circleInner.setAttribute('fill', '#FBD965');

        // Node label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('y', '26');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '10');
        text.setAttribute('font-family', 'Montserrat, sans-serif');
        text.setAttribute('fill', '#EFE6D4');
        text.textContent = formatNodeLabel(item);

        g.appendChild(circleOuter);
        g.appendChild(circleInner);
        g.appendChild(text);
        orbitGroup.appendChild(g);

        // Animate in with GSAP spring
        if (window.gsap) {
          gsap.to(g, {
            attr: { transform: `translate(${x}, ${y}) scale(1)` },
            duration: 0.5,
            delay: index * 0.05,
            ease: 'back.out(1.7)'
          });
        } else {
          g.setAttribute('transform', `translate(${x}, ${y}) scale(1)`);
        }
      });
    }

    function formatNodeLabel(key) {
      const dict = {
        Instagram: 'IG',
        Facebook: 'FB',
        TikTok: 'TikTok',
        Snapchat: 'Snap',
        LinkedIn: 'In',
        X: 'X',
        YouTube: 'YT',
        paid_ads: 'Ads',
        content_creation: 'Content',
        account_management: 'Manage',
        analytics_reporting: 'Report'
      };
      return dict[key] || key;
    }

    // Live backend calculation with instant client-side fallback
    async function fetchOrComputeEstimate() {
      try {
        const response = await fetch('/Home/CalculateStudioEstimate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
          },
          body: JSON.stringify(state)
        });

        if (response.ok) {
          const data = await response.json();
          renderResults(data);
          return;
        }
      } catch (err) {
        // Fallback to client-side formula if network or offline
      }

      // Synchronous client fallback
      const fallback = computeFallbackEstimate(state);
      renderResults(fallback);
    }

    function computeFallbackEstimate(s) {
      const pCount = s.platforms.length;
      const sCount = s.services.length;
      const baseMin = (pCount * 250) + (sCount * 220);
      const baseMax = (pCount * 420) + (sCount * 380);

      let reachMult = 1.0;
      let convMult = 1.0;
      if (s.goal === 'awareness') { reachMult = 1.45; convMult = 0.40; }
      else if (s.goal === 'sales') { reachMult = 0.85; convMult = 0.90; }
      else { reachMult = 1.05; convMult = 1.25; }

      return {
        budgetMin: baseMin,
        budgetMax: baseMax,
        reachMin: Math.round(baseMin * 125 * reachMult * 0.85),
        reachMax: Math.round(baseMax * 125 * reachMult * 1.20),
        conversationsMin: Math.round(baseMin * 3.5 * convMult * 0.80),
        conversationsMax: Math.round(baseMax * 3.5 * convMult * 1.25),
        summaryTextEn: `Custom Bundle: [${s.platforms.join(', ')}], [${s.services.join(', ')}], Goal: ${s.goal.toUpperCase()}`,
        summaryTextAr: `باقة مخصصة: [${s.platforms.join(', ')}]، [${s.services.join(', ')}]، الهدف: ${s.goal}`
      };
    }

    function renderResults(data) {
      animateNumber(budgetDisplay, `$${formatNumber(data.budgetMin)} – $${formatNumber(data.budgetMax)}`);
      animateNumber(reachDisplay, `${formatNumber(data.reachMin)} – ${formatNumber(data.reachMax)}`);
      animateNumber(convDisplay, `${formatNumber(data.conversationsMin)} – ${formatNumber(data.conversationsMax)}`);

      if (requestPkgBtn) {
        requestPkgBtn.onclick = function (e) {
          e.preventDefault();
          // Pre-fill contact form
          const contactMsg = document.getElementById('contact-message-input');
          const campaignDetailsHidden = document.getElementById('campaign-details-hidden');
          const isAr = document.documentElement.lang === 'ar';
          const summary = isAr ? data.summaryTextAr : data.summaryTextEn;

          if (campaignDetailsHidden) {
            campaignDetailsHidden.value = JSON.stringify({
              platforms: state.platforms,
              services: state.services,
              goal: state.goal,
              budget: `$${data.budgetMin} - $${data.budgetMax}`,
              reach: `${data.reachMin} - ${data.reachMax}`,
              conversations: `${data.conversationsMin} - ${data.conversationsMax}`
            });
          }

          if (contactMsg) {
            contactMsg.value = isAr 
              ? `مرحباً، أود الاستفسار وطلب باقة الحملة المخصصة:\n${summary}\n\nالميزانية التقديرية: $${data.budgetMin} – $${data.budgetMax}\nالوصول المتوقع: ${formatNumber(data.reachMin)} – ${formatNumber(data.reachMax)}\nالمحادثات المتوقعة: ${formatNumber(data.conversationsMin)} – ${formatNumber(data.conversationsMax)}`
              : `Hello, I would like to inquire about and request this custom campaign bundle:\n${summary}\n\nEstimated Budget: $${data.budgetMin} – $${data.budgetMax}\nProjected Reach: ${formatNumber(data.reachMin)} – ${formatNumber(data.reachMax)}\nProjected Conversations: ${formatNumber(data.conversationsMin)} – ${formatNumber(data.conversationsMax)}`;
          }

          // Smooth scroll to contact section
          const contactSec = document.getElementById('contact');
          if (contactSec) {
            contactSec.scrollIntoView({ behavior: 'smooth' });
            contactMsg?.focus();
          }
        };
      }
    }

    function formatNumber(num) {
      return Number(num).toLocaleString('en-US');
    }

    function animateNumber(element, text) {
      if (!element) return;
      element.textContent = text;
      if (window.gsap) {
        gsap.fromTo(element, { scale: 0.95, opacity: 0.6 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'power2.out' });
      }
    }

    // Initialize initial visual state
    updateOrbitVisualization();
    fetchOrComputeEstimate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStudio);
  } else {
    initStudio();
  }
})();
