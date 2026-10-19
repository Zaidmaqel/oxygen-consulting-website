/**
 * Oxygen Marketing — 3D Hero Experience
 * Renders the procedural translucent golden glass ring with breathing scale
 * and ambient gold particles using Three.js.
 * Automatically handles WebGL detection, tab visibility, and reduced-motion fallback.
 */
import * as THREE from '/lib/three/three.module.min.js';

(function () {
  'use strict';

  const container = document.getElementById('hero-canvas-container');
  if (!container) return;

  // Check prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    container.style.display = 'none';
    return;
  }

  // Check WebGL availability
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!isWebGLAvailable()) {
    container.style.display = 'none';
    return;
  }

  let scene, camera, renderer, ringMesh, orbitRingMesh, particleSystem;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let isVisible = true;
  let animationFrameId = null;

  try {
    // 1. Scene setup
    scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7.5;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap at 2 for performance
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. High-End Luminous Golden Torus Ring
    const ringGeometry = new THREE.TorusGeometry(2.35, 0.42, 36, 120);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xC79A3B,
      emissive: 0x6E470E,
      emissiveIntensity: 0.6,
      roughness: 0.16,
      metalness: 0.88
    });

    ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI * 0.22;
    ringMesh.rotation.y = Math.PI * 0.14;
    scene.add(ringMesh);

    // 2.1 Secondary Thin Orbital Ring with Golden Glow
    const orbitRingGeo = new THREE.TorusGeometry(3.3, 0.035, 16, 120);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0xFBD965,
      transparent: true,
      opacity: 0.55
    });
    orbitRingMesh = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRingMesh.rotation.x = -Math.PI * 0.25;
    scene.add(orbitRingMesh);

    // 3. Floating Gold Particles / Embers (Oxygen Molecules Concept)
    const particleCount = window.innerWidth < 768 ? 80 : 220;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xFBD965,
      size: 0.065,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 4. Multi-Layered Warm Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xEFE6D4, 1.4);
    scene.add(ambientLight);

    const warmLight = new THREE.PointLight(0xFBD965, 4.5, 35);
    warmLight.position.set(5, 6, 5);
    scene.add(warmLight);

    const rimLight = new THREE.PointLight(0xA67422, 3.2, 30);
    rimLight.position.set(-6, -5, -3);
    scene.add(rimLight);

    const centerGlow = new THREE.PointLight(0xFBD965, 2.0, 15);
    centerGlow.position.set(0, 0, 0);
    scene.add(centerGlow);

    // 5. Mouse Interaction
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // Device Tilt Interaction (Mobile gyroscope where available)
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          mouseX = (e.gamma / 45);
          mouseY = ((e.beta - 45) / 45);
        }
      }, { passive: true });
    }

    // 6. Resize handling
    window.addEventListener('resize', () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    // 7. Pause rendering when off-screen or tab hidden for peak performance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          renderLoop();
        }
      });
    }, { threshold: 0.05 });
    observer.observe(container);

    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
      if (isVisible && !animationFrameId) {
        renderLoop();
      }
    });

    // 8. Animation & Breathing Loop
    let clock = new THREE.Clock();

    function renderLoop() {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse follow with damping
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      if (ringMesh) {
        // Continuous slow rotation
        ringMesh.rotation.y = elapsed * 0.25 + targetX * 0.6;
        ringMesh.rotation.x = Math.PI * 0.18 + Math.sin(elapsed * 0.3) * 0.15 + targetY * 0.4;

        // Signature 5.5s Breathing cycle (scale & subtle pulse)
        const breathe = 1 + Math.sin(elapsed * (Math.PI * 2 / 5.5)) * 0.045;
        ringMesh.scale.set(breathe, breathe, breathe);
      }

      if (orbitRingMesh) {
        orbitRingMesh.rotation.z = elapsed * 0.12;
        orbitRingMesh.rotation.y = -targetX * 0.45;
      }

      if (particleSystem) {
        particleSystem.rotation.y = elapsed * 0.05 + targetX * 0.2;
        particleSystem.rotation.x = elapsed * 0.02 + targetY * 0.2;
      }

      renderer.render(scene, camera);
    }

    renderLoop();
  } catch (err) {
    console.warn('Three.js hero initialized in CSS fallback mode:', err);
    if (container) container.style.display = 'none';
  }
})();
