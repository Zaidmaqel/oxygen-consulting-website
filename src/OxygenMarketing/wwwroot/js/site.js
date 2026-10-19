/**
 * Oxygen Marketing — Luxury Interactive Audio & Ambient Micro-Interactions
 * Generates harmonic synthesizer soundscapes via Web Audio API (zero external assets).
 * Includes smooth tilt, cursor spotlight, and interactive telemetry feedback.
 */
(function () {
  'use strict';

  // ==========================================
  // 1. Luxury Web Audio Synthesizer
  // ==========================================
  let audioCtx = null;
  let isAudioEnabled = false;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Soft resonant hover ping (harmonic 528Hz luxury chime)
  function playHoverTone() {
    if (!isAudioEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, now);
      osc.frequency.exponentialRampToValueAtTime(792, now + 0.08);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      // Ignore if autoplay restricted
    }
  }

  // Crisp golden confirmation chime (chord on click)
  function playClickChime() {
    if (!isAudioEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const freqs = [440, 554.37, 659.25]; // A Major luxury triad

      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.03);

        gain.gain.setValueAtTime(0.04, now + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35 + idx * 0.03);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + idx * 0.03);
        osc.stop(now + 0.4 + idx * 0.03);
      });
    } catch (e) {}
  }

  // Telemetry slider pitch modulation
  function playSliderTone(normalizedVal) {
    if (!isAudioEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      const freq = 220 + (normalizedVal * 440);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  // Setup sound toggle button
  function initAudioToggle() {
    const toggleBtns = document.querySelectorAll('#soundToggleBtn, .sound-toggle-trigger');
    
    // Check saved preference
    const saved = localStorage.getItem('oxygen_audio_fx');
    if (saved === 'enabled') {
      isAudioEnabled = true;
      toggleBtns.forEach(btn => btn.classList.add('audio-active'));
    }

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        initAudioContext();
        isAudioEnabled = !isAudioEnabled;

        toggleBtns.forEach(b => {
          if (isAudioEnabled) {
            b.classList.add('audio-active');
          } else {
            b.classList.remove('audio-active');
          }
        });

        localStorage.setItem('oxygen_audio_fx', isAudioEnabled ? 'enabled' : 'disabled');
        if (isAudioEnabled) {
          playClickChime();
        }
      });
    });

    // Attach subtle acoustic feedback to interactive luxury elements
    const interactiveSelectors = [
      '.btn-gold',
      '.btn-glass',
      '.platform-eco-card',
      '.tactical-pillar-card',
      '.delicate-kpi-pill',
      '.delicate-nav-btn',
      '.nav-link-item',
      '.studio-pill-option',
      '.tilt-card',
      '.oxygen-orbital-emblem'
    ];

    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest(interactiveSelectors.join(','));
      if (target) {
        playHoverTone();
      }
    });

    document.addEventListener('click', (e) => {
      const target = e.target.closest('.btn-gold, .btn-glass, .studio-pill-option, .oxygen-orbital-emblem');
      if (target) {
        playClickChime();
      }
    });

    // Listen to range sliders if present
    document.addEventListener('input', (e) => {
      if (e.target && e.target.type === 'range') {
        const min = parseFloat(e.target.min) || 0;
        const max = parseFloat(e.target.max) || 100;
        const val = parseFloat(e.target.value) || 0;
        const norm = (val - min) / (max - min);
        playSliderTone(norm);
      }
    });
  }

  // ==========================================
  // 2. Before vs After Interactive Toggle
  // ==========================================
  function initComparisonToggle() {
    const toggles = document.querySelectorAll('.comparison-view-toggle');
    if (!toggles.length) return;

    toggles.forEach(toggle => {
      toggle.addEventListener('click', function () {
        const targetView = this.getAttribute('data-target');
        toggles.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const beforeCol = document.getElementById('comparison-col-before');
        const afterCol = document.getElementById('comparison-col-after');

        if (targetView === 'both') {
          if (beforeCol) beforeCol.style.display = 'block';
          if (afterCol) afterCol.style.display = 'block';
        } else if (targetView === 'before') {
          if (beforeCol) beforeCol.style.display = 'block';
          if (afterCol) afterCol.style.display = 'none';
        } else if (targetView === 'after') {
          if (beforeCol) beforeCol.style.display = 'none';
          if (afterCol) afterCol.style.display = 'block';
        }
      });
    });
  }

  // ==========================================
  // 3. Delicate Animated Portfolio Carousel / Slider
  // ==========================================
  function initDelicateSlider() {
    const slider = document.querySelector('.delicate-slider-wrapper');
    if (!slider) return;

    const slides = slider.querySelectorAll('.delicate-slide');
    const dots = slider.querySelectorAll('.delicate-slider-dot');
    const prevBtn = slider.querySelector('.delicate-prev-btn');
    const nextBtn = slider.querySelector('.delicate-next-btn');
    const progressBar = slider.querySelector('.delicate-slider-progress-bar');

    if (!slides.length) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    const duration = 5500; // 5.5s autoplay per slide
    let startTime = null;
    let animFrameId = null;
    let isPaused = false;

    function goToSlide(index) {
      if (index < 0) {
        index = totalSlides - 1;
      } else if (index >= totalSlides) {
        index = 0;
      }

      currentIndex = index;

      slides.forEach((slide, idx) => {
        if (idx === currentIndex) {
          slide.classList.add('active-slide');
          slide.setAttribute('aria-hidden', 'false');
        } else {
          slide.classList.remove('active-slide');
          slide.setAttribute('aria-hidden', 'true');
        }
      });

      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.classList.remove('active');
          dot.removeAttribute('aria-current');
        }
      });

      // Reset progress animation timestamp
      startTime = performance.now();
    }

    function animateProgress(timestamp) {
      if (!startTime) startTime = timestamp;

      if (!isPaused) {
        const elapsed = timestamp - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);

        if (progressBar) {
          progressBar.style.width = progress + '%';
        }

        if (elapsed >= duration) {
          goToSlide(currentIndex + 1);
        }
      } else {
        // Hold progress bar steady while paused
        startTime = timestamp - (parseFloat(progressBar ? progressBar.style.width : 0) / 100) * duration;
      }

      animFrameId = requestAnimationFrame(animateProgress);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        goToSlide(isRtl ? currentIndex + 1 : currentIndex - 1);
        playClickChime();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        goToSlide(isRtl ? currentIndex - 1 : currentIndex + 1);
        playClickChime();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', function () {
        const targetIdx = parseInt(this.getAttribute('data-index') || '0', 10);
        goToSlide(targetIdx);
        playClickChime();
      });
    });

    // Pause on hover
    slider.addEventListener('mouseenter', () => {
      isPaused = true;
    });

    slider.addEventListener('mouseleave', () => {
      isPaused = false;
    });

    // Touch Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      isPaused = true;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      isPaused = false;
      const diff = touchEndX - touchStartX;
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          goToSlide(isRtl ? currentIndex - 1 : currentIndex + 1);
        } else {
          goToSlide(isRtl ? currentIndex + 1 : currentIndex - 1);
        }
      }
    }, { passive: true });

    // Initialize first slide & launch progress loop
    goToSlide(0);
    animFrameId = requestAnimationFrame(animateProgress);
  }

  // Initialize all on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initAudioToggle();
      initComparisonToggle();
      initDelicateSlider();
    });
  } else {
    initAudioToggle();
    initComparisonToggle();
    initDelicateSlider();
  }
})();

