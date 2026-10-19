/**
 * Oxygen Marketing — Brand Pulse Radar & Telemetry Dashboard
 * Interactive radar with sweeping line, live pulsing telemetry blips,
 * glass tooltips, and animated count-up KPI metrics.
 */
(function () {
  'use strict';

  function initRadar() {
    const radarContainer = document.getElementById('brand-pulse-radar');
    if (!radarContainer) return;

    const blips = radarContainer.querySelectorAll('.radar-blip');
    const tooltip = document.getElementById('radar-glass-tooltip');
    const tooltipTitle = document.getElementById('radar-tooltip-title');
    const tooltipValue = document.getElementById('radar-tooltip-val');
    const tooltipSub = document.getElementById('radar-tooltip-sub');

    blips.forEach(blip => {
      function showTooltip(e) {
        if (!tooltip) return;
        const title = blip.getAttribute('data-title');
        const val = blip.getAttribute('data-value');
        const sub = blip.getAttribute('data-sub');

        if (tooltipTitle) tooltipTitle.textContent = title;
        if (tooltipValue) tooltipValue.textContent = val;
        if (tooltipSub) tooltipSub.textContent = sub;

        const rect = blip.getBoundingClientRect();
        const containerRect = radarContainer.getBoundingClientRect();

        tooltip.style.left = `${rect.left - containerRect.left + 15}px`;
        tooltip.style.top = `${rect.top - containerRect.top - 45}px`;
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
      }

      function hideTooltip() {
        if (!tooltip) return;
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(8px)';
      }

      blip.addEventListener('mouseenter', showTooltip);
      blip.addEventListener('mouseleave', hideTooltip);
      blip.addEventListener('click', (e) => {
        e.stopPropagation();
        showTooltip(e);
      });
    });

    document.addEventListener('click', () => {
      if (tooltip) {
        tooltip.style.opacity = '0';
      }
    });

    // Animate Dashboard Charts & Numbers on Scroll Entry
    const dashboardSection = document.getElementById('telemetry-dashboard');
    if (dashboardSection && window.IntersectionObserver) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            triggerDashboardAnimations();
            observer.unobserve(dashboardSection);
          }
        });
      }, { threshold: 0.25 });
      observer.observe(dashboardSection);
    } else {
      triggerDashboardAnimations();
    }

    function triggerDashboardAnimations() {
      // 1. Draw SVG Line Charts
      const chartPaths = document.querySelectorAll('.dashboard-chart-path');
      chartPaths.forEach(path => {
        const length = path.getTotalLength ? path.getTotalLength() : 400;
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)';
        requestAnimationFrame(() => {
          path.style.strokeDashoffset = '0';
        });
      });

      // 2. Grow Progress Bars
      const bars = document.querySelectorAll('.kpi-progress-fill');
      bars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-width') || '80%';
        bar.style.width = '0%';
        bar.style.transition = 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
        requestAnimationFrame(() => {
          bar.style.width = targetWidth;
        });
      });

      // 3. Counter count-up numbers
      const counters = document.querySelectorAll('.countup-val');
      counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target') || '0');
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
        let start = 0;
        const duration = 1800;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          // Ease out cubic
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          const current = start + (target - start) * easedProgress;

          counter.textContent = prefix + (decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString('en-US')) + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          }
        }

        requestAnimationFrame(updateCount);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRadar);
  } else {
    initRadar();
  }
})();
