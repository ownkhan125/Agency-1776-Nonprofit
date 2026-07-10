"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { gsap, registerGsap } from "@/animations/gsap";
import { cn } from "@/utils/cn";

/**
 * Wave Grid Background — Agency 1776 adaptation.
 *
 * Ported from the Vengence UI `wave-grid-background` (Three.js) and
 * tuned to fit our design system:
 *   • Palette locked to red / black / white — colours come from live
 *     CSS custom properties so the wave grid re-tints itself the moment
 *     the ThemeToggle flips between light and dark.
 *   • Amplitude, exposure and shadow bias dialled down so peaks read as
 *     a subtle stage-lit ripple rather than a highlighter. Hero content
 *     stays fully legible over the animation.
 *   • Quality tiering by viewport width — desktop gets the full 40×40
 *     grid with shadows + post-processing, tablet and mobile drop to
 *     smaller grids and skip the expensive passes so the frame budget
 *     stays comfortable on lower-end GPUs.
 *   • `prefers-reduced-motion` → mount a single static frame and skip
 *     both the render loop AND the idle-ripple emitter.
 *   • Wired into the project's GSAP lifecycle — an initial 900ms opacity
 *     fade-in via `gsap.to` makes the canvas materialise gracefully,
 *     and the render loop lives inside a `gsap.context` so tear-down
 *     shares the same discipline as every other animated component
 *     in the app.
 */

const MAX_TRAIL = 128;

const VIGNETTE_RGB_SHIFT_SHADER = {
  uniforms: {
    tDiffuse: { value: null },
    // Zeroed — the tiny per-quadrant RGB shift was creating subtle
    // left-side chromatic tinting that read as a dark band on wide
    // viewports. Keep the vignette darkening for framing, drop the
    // aberration.
    shiftAmount: { value: 0.0 },
    vignetteRadius: { value: 0.35 },
    vignetteSoftness: { value: 0.4 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float shiftAmount;
    uniform float vignetteRadius;
    uniform float vignetteSoftness;
    varying vec2 vUv;

    void main() {
      vec2 center = vec2(0.5);
      float dist = distance(vUv, center);
      float horzQuadrant = sign(vUv.x - center.x);
      float vertQuadrant = sign(vUv.y - center.y);

      float vignetteFactor = smoothstep(vignetteRadius, vignetteRadius + vignetteSoftness, dist);
      float currentShift = shiftAmount * vignetteFactor;

      vec4 sampleR = texture2D(tDiffuse, vUv + vec2(currentShift * horzQuadrant, currentShift * vertQuadrant));
      vec4 sampleG = texture2D(tDiffuse, vUv);
      vec4 sampleB = texture2D(tDiffuse, vUv - vec2(currentShift * horzQuadrant, currentShift * vertQuadrant));

      // Zero darken — any positive value pulls the corners away from
      // pure page white. The hero's white must match every other
      // section verbatim, so the post-processing pass is now a pure
      // pass-through (kept in the pipeline for future tuning).
      float darken = 1.0;
      // Preserve alpha from the centre sample so empty cells stay
      // transparent — lets the page background bleed through cleanly.
      gl_FragColor = vec4(vec3(sampleR.r, sampleG.g, sampleB.b) * darken, sampleG.a);
    }
  `,
};

function overrideVertexShader(vertexShader) {
  return vertexShader
    .replace(
      "#include <common>",
      /* glsl */ `#include <common>
      varying float vHeight;
      attribute vec2 aOffset;
      uniform sampler2D uTrailTexture;
      uniform int       uTrailCount;
      uniform float     uWaveSpeed;
      uniform float     uWaveFreq;
      uniform float     uWaveWidth;
      uniform float     uFadeTime;
      uniform float     uAmplitude;
      uniform float     uJitter;
      uniform float     uMaxHeight;

      vec2 hash2( vec2 p ) {
        p = vec2( dot( p, vec2( 127.1, 311.7 ) ), dot( p, vec2( 269.5, 183.3 ) ) );
        return fract( sin( p ) * 43758.5453123 ) - 0.5;
      }`,
    )
    .replace(
      "#include <begin_vertex>",
      /* glsl */ `#include <begin_vertex>

      vHeight = 0.0;

      if ( position.y > 0.0 ) {
        vec2 jitter  = hash2( aOffset ) * uJitter;
        vec2 worldXZ = aOffset + jitter;
        float waveHeight  = 0.0;
        float totalWeight = 0.0;

        for ( int i = 0; i < uTrailCount; i++ ) {
          vec4 td = texture2D( uTrailTexture, vec2( ( float(i) + 0.5 ) / 128.0, 0.5 ) );
          float dist      = length( worldXZ - td.rg );
          float wavefront = uWaveSpeed * td.b;
          float relDist   = dist - wavefront;

          float window = exp( -( relDist * relDist ) / ( uWaveWidth * uWaveWidth ) );
          float fade   = exp( -td.b / uFadeTime );
          float atten  = 1.0 / ( 1.0 + dist * 0.1 );
          float weight = fade * window * atten * td.a;

          waveHeight  += weight * cos( uWaveFreq * relDist );
          totalWeight += weight;
        }

        waveHeight /= max( totalWeight, 1.0 );

        float displacement = clamp( waveHeight * uAmplitude, -uMaxHeight, uMaxHeight );
        transformed.y += displacement;
        vHeight = displacement;
      }`,
    );
}

// Read a token colour from the running document (respects light/dark theme).
// Falls back to a hard-coded hex if the variable is unavailable — protects
// SSR paths and very-old browsers.
function readTokenColor(name, fallback) {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return raw || fallback;
}

// Downscale the grid and skip the heavier passes on smaller viewports so
// the frame budget stays comfortable on integrated mobile GPUs. Shadows
// were dropped globally because their cast patches created dark rings
// under cube peaks that fought the "airy" hero look — the wave grid
// carries its own visual weight through the base→peak color ramp.
function pickQuality(width) {
  if (width < 640) {
    return { gridSize: 22, shadows: false, postFX: false, pixelRatio: 1.25 };
  }
  if (width < 1024) {
    return { gridSize: 30, shadows: false, postFX: true, pixelRatio: 1.5 };
  }
  return { gridSize: 36, shadows: false, postFX: true, pixelRatio: 1.75 };
}

export function WaveGridBackground({
  className,
  // Tuned defaults for a subtle, cinematic ripple. Amplitude is roughly
  // half the vengenceui reference so peaks stay soft.
  waveAmplitude = 0.22,
  waveSpeed = 5.5,
  waveFrequency = 1.15,
  waveWidth = 3.2,
  waveMaxHeight = 0.35,
  waveJitter = 0.18,
  autoAnimate = true,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    registerGsap();

    // Respect user motion preferences — no wave animation for anyone
    // who's asked for reduced motion. We still paint one static frame
    // so the hero doesn't have an empty rectangle.
    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    const startWidth = container.clientWidth || window.innerWidth;
    const quality = pickQuality(startWidth);
    const gridSize = quality.gridSize;

    const cubeWidth = 0.8;
    const cubeHeight = 3;
    const gap = 0.01;
    const bounds = gridSize * (cubeWidth + gap);

    const getSize = () => ({
      width: container.clientWidth || 1,
      height: container.clientHeight || 1,
      pixelRatio: Math.min(window.devicePixelRatio || 1, quality.pixelRatio),
    });
    let size = getSize();

    // Palette — read from live CSS custom properties so the wave grid
    // follows the ThemeToggle.
    //   colorBase  — the "unlit" cube face. Locked to the page
    //                background so at-rest cubes disappear into the
    //                hero — only wave peaks read visually. This is the
    //                critical change that prevents the 40×40 grid from
    //                rendering as a wall of dark cubes.
    //   colorHigh  — wave peak. Our accent red.
    const paletteBase = readTokenColor("--color-background", "#ffffff");
    const paletteHigh = readTokenColor("--color-accent", "#bf0a30");
    const paletteBg = readTokenColor("--color-background", "#ffffff");

    const scene = new THREE.Scene();
    // Scene left transparent — the WebGL canvas will render the cubes
    // + their peaks over an alpha-clear background so the page bg
    // shows through. Combined with a moderate CSS opacity on the
    // canvas, the wave grid reads as a translucent ripple rather than
    // a heavy dark wash that competes with the hero copy.
    scene.background = null;

    const radius = 12;
    const alphaRange = Math.PI * 0.03;
    const betaRange = Math.PI * 0.05;
    const mouse = new THREE.Vector2(0, 0);
    const lerpedMouse = new THREE.Vector2(0, 0);

    const camera = new THREE.PerspectiveCamera(40, size.width / size.height, 0.1, 200);
    const positionCamera = (mx, my) => {
      const alpha = my * alphaRange;
      const beta = mx * betaRange;
      camera.position.set(
        -radius * Math.cos(alpha) * Math.sin(beta),
        radius * Math.cos(alpha) * Math.cos(beta),
        radius * Math.sin(alpha),
      );
      camera.up.set(0, 0, -1);
      camera.lookAt(0, 0, 0);
    };
    positionCamera(0, 0);
    scene.add(camera);

    const onMouseMove = (e) => {
      mouse.x = (e.clientX / size.width) * 2 - 1;
      mouse.y = -(e.clientY / size.height) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Bright ambient + a single overhead key. The old off-axis key
    // light (-20, 10, 6) was creating a visible left→right brightness
    // gradient across the grid — cubes closer to the light angle read
    // slightly warmer, cubes farther slightly cooler, and the eye
    // interpreted this as a dark left band. Overhead key at (0, 20, 0)
    // is rotationally symmetric so the whole grid renders uniformly.
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight("#ffffff", 1.4);
    keyLight.position.set(0, 20, 0);
    scene.add(keyLight);

    // Mouse-trail texture — feeds ripple sources to the vertex shader.
    const trailData = new Float32Array(MAX_TRAIL * 4);
    const trailTexture = new THREE.DataTexture(
      trailData,
      MAX_TRAIL,
      1,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    trailTexture.needsUpdate = true;

    const trailUniforms = {
      uTrailTexture: { value: trailTexture },
      uTrailCount: { value: 0 },
      uFadeTime: { value: 2.0 },
      uWaveSpeed: { value: waveSpeed },
      uWaveFreq: { value: waveFrequency },
      uWaveWidth: { value: waveWidth },
      uAmplitude: { value: waveAmplitude },
      uJitter: { value: waveJitter },
      uMaxHeight: { value: waveMaxHeight },
    };
    const colorUniforms = {
      uColorBase: { value: new THREE.Color(paletteBase) },
      uColorHigh: { value: new THREE.Color(paletteHigh) },
    };

    const trail = [];
    let lastPoint = null;
    let timeSinceLastMove = 0;
    let randomPointTimer = 0;
    let placingRandom = autoAnimate;
    const fadeTime = 2.0;
    const trailSpacing = 0.1;

    const rayPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(bounds, bounds),
      new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, visible: false }),
    );
    rayPlane.rotation.x = -Math.PI / 2;
    rayPlane.updateMatrixWorld(true);

    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();
    let rect = canvas.getBoundingClientRect();

    const onPointerMove = (e) => {
      pointerNDC.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointerNDC, camera);
      const hits = raycaster.intersectObject(rayPlane);
      if (hits.length === 0) return;
      const { x, z } = hits[0].point;

      let distDelta = 0;
      if (lastPoint) {
        const dx = x - lastPoint.x;
        const dz = z - lastPoint.z;
        distDelta = Math.sqrt(dx * dx + dz * dz);
        if (distDelta < trailSpacing) return;
      }
      if (trail.length >= MAX_TRAIL) trail.shift();
      trail.push({ x, z, age: 0, distDelta });
      lastPoint = { x, z };
      timeSinceLastMove = 0;
      placingRandom = false;
      randomPointTimer = 0;
    };
    canvas.addEventListener("pointermove", onPointerMove);

    const addRandomPoint = () => {
      // Widened spawn window (±0.4 * bounds vs the reference's ±0.25)
      // so idle ripples land across the whole grid, not just the
      // horizontal centre band. Combined with more primer points,
      // this fills the hero with continuous ambient motion.
      const x = (Math.random() * 0.8 - 0.4) * bounds;
      const z = (Math.random() * 0.8 - 0.4) * bounds;
      const distDelta = 0.8 + Math.random() * 0.2;
      if (trail.length >= MAX_TRAIL) trail.shift();
      trail.push({ x, z, age: 0, distDelta });
    };

    // Prime the pump so the hero doesn't start dead-flat. Six seeded
    // ripples at staggered ages produce a natural in-progress state
    // where a couple of waves are already mid-expansion when the
    // canvas first fades in.
    if (autoAnimate && !reduceMotion) {
      for (let i = 0; i < 6; i++) {
        const x = (Math.random() * 0.8 - 0.4) * bounds;
        const z = (Math.random() * 0.8 - 0.4) * bounds;
        trail.push({ x, z, age: i * 0.35, distDelta: 0.9 });
      }
    }

    const updateTrail = (delta) => {
      const expiry = fadeTime * 4;
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age += delta;
        if (trail[i].age > expiry) trail.splice(i, 1);
      }

      timeSinceLastMove += delta;
      if (timeSinceLastMove >= 3.0 && !placingRandom && autoAnimate && !reduceMotion) {
        placingRandom = true;
        randomPointTimer = 0;
      }
      if (placingRandom && autoAnimate && !reduceMotion) {
        randomPointTimer += delta;
        // 1.6s cadence keeps the hero visibly alive without becoming a
        // screensaver — combined with the widened spawn area, ripples
        // now travel across the whole grid instead of clustering at
        // centre.
        if (randomPointTimer >= 1.6) {
          addRandomPoint();
          randomPointTimer = 0;
        }
      }

      const count = Math.min(trail.length, MAX_TRAIL);
      if (count > 0 || trailUniforms.uTrailCount.value > 0) {
        for (let i = 0; i < count; i++) {
          const ti = i * 4;
          trailData[ti] = trail[i].x;
          trailData[ti + 1] = trail[i].z;
          trailData[ti + 2] = trail[i].age;
          trailData[ti + 3] = trail[i].distDelta;
        }
        trailTexture.needsUpdate = true;
        trailUniforms.uTrailCount.value = count;
      }
    };

    const count = gridSize * gridSize;
    const geometry = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeWidth);
    const offsetAttribute = new THREE.InstancedBufferAttribute(new Float32Array(count * 2), 2);
    geometry.setAttribute("aOffset", offsetAttribute);

    // MeshBasicMaterial — no lighting math, so a cube's rendered colour
    // is exactly the interpolated `mix(colorBase, colorHigh, t)`. With
    // MeshPhongMaterial the ambient + directional shading dropped the
    // "white" base cubes down to ~85% brightness (measured rgb(218) vs
    // the site's rgb(253)), which visibly darkened the whole hero
    // against the pure-white sections below. Basic + our fragment
    // override guarantees the at-rest state matches the page bg
    // exactly.
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, trailUniforms, colorUniforms);
      shader.vertexShader = overrideVertexShader(shader.vertexShader);
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
          varying float vHeight;
          uniform vec3  uColorBase;
          uniform vec3  uColorHigh;
          uniform float uMaxHeight;`,
        )
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
          float t = clamp( vHeight / uMaxHeight, 0.0, 1.0 );
          diffuseColor.rgb = mix( uColorBase, uColorHigh, t );`,
        );
    };

    const depthMaterial = new THREE.MeshDepthMaterial();
    depthMaterial.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, trailUniforms);
      shader.vertexShader = overrideVertexShader(shader.vertexShader);
    };

    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    instancedMesh.customDepthMaterial = depthMaterial;
    instancedMesh.castShadow = quality.shadows;
    instancedMesh.receiveShadow = quality.shadows;
    scene.add(instancedMesh);

    const dummy = new THREE.Object3D();
    const spacing = cubeWidth + gap;
    const offset = ((gridSize - 1) * spacing) / 2;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const idx = i * gridSize + j;
        const x = i * spacing - offset;
        const z = j * spacing - offset;
        dummy.position.set(x, 0, z);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(idx, dummy.matrix);
        offsetAttribute.setXY(idx, x, z);
      }
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    offsetAttribute.needsUpdate = true;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    // NoToneMapping — ACES filmic (previously used) compresses linear
    // white output to ~0.8 which reads as rgb(205) on the canvas,
    // silently tinting the hero ~35 units darker than the sections
    // below. Pass-through mapping keeps input=output so pure-white
    // input renders as pure-white pixels, matching the rest of the
    // site exactly.
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = quality.shadows;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    // Transparent clear so the page background bleeds through the empty
    // cells between cube peaks — the hero feels airy at rest and only
    // catches subtle red highlights where the wave crests.
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(size.pixelRatio);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const vignettePass = new ShaderPass(VIGNETTE_RGB_SHIFT_SHADER);
    if (quality.postFX) composer.addPass(vignettePass);
    composer.addPass(new OutputPass());
    composer.setSize(size.width, size.height);
    composer.setPixelRatio(size.pixelRatio);

    const applySize = () => {
      size = getSize();
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
      renderer.setSize(size.width, size.height);
      renderer.setPixelRatio(size.pixelRatio);
      composer.setSize(size.width, size.height);
      composer.setPixelRatio(size.pixelRatio);
      rect = canvas.getBoundingClientRect();
    };
    const resizeObserver = new ResizeObserver(applySize);
    resizeObserver.observe(container);
    window.addEventListener("resize", applySize);

    // GSAP fade-in — canvas mounts at opacity 0, floats to full 1.0
    // across 900ms so the wave grid materialises like a stage light
    // warming up. Base cubes are locked to the page-bg colour and use
    // MeshBasicMaterial, so at-rest state is exactly the same pixel as
    // the rest of the site — full opacity is safe (only red wave crests
    // become visible). Scoped inside a gsap.context so tear-down
    // matches every other animated component in the app.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        canvas,
        { opacity: 0 },
        { opacity: 1, duration: 0.9, ease: "power2.out", delay: 0.15 },
      );
    }, container);

    // Re-read the CSS custom properties and push the new values into the
    // shader uniforms. Called on every `data-theme` mutation so the
    // wave grid re-tints instantly the moment the ThemeToggle fires —
    // no page refresh, no rebuild, no dropped frames.
    //
    // Kept minimal on purpose: only the shader uniforms are touched.
    // Scene background stays `null` and the renderer clearColor stays
    // `(0x000000, 0)` — a prior version of this callback set both to
    // the (opaque) bg colour, which broke transparency for every
    // subsequent frame after the first theme swap. Do NOT reintroduce
    // either of those writes here.
    const refreshPalette = () => {
      const base = readTokenColor("--color-background", "#ffffff");
      const high = readTokenColor("--color-accent", "#bf0a30");
      colorUniforms.uColorBase.value.set(base);
      colorUniforms.uColorHigh.value.set(high);
      // Force a single render so the reduced-motion path (which only
      // paints once at mount) reflects the swap. In the normal
      // animation loop the very next frame picks up the new uniforms
      // automatically, so this render is essentially free.
      composer.render();
    };

    // The ThemeToggle mutates data-theme on <html>. Watch that attribute
    // so the grid re-tints instantly on theme swap.
    const themeObserver = new MutationObserver(refreshPalette);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const clock = new THREE.Clock();
    const frame = () => {
      const delta = clock.getDelta();
      updateTrail(delta);
      lerpedMouse.x += (mouse.x - lerpedMouse.x) * 0.04;
      lerpedMouse.y += (mouse.y - lerpedMouse.y) * 0.04;
      positionCamera(lerpedMouse.x, lerpedMouse.y);
      composer.render();
    };

    // Reduced-motion path — paint one frame and stop. Trail update still
    // runs once so the initial primed ripples show.
    if (reduceMotion) {
      updateTrail(0.016);
      composer.render();
    } else {
      // Viewport-gated render loop. The hero grid was the single
      // biggest continuous cost on / while the reader was reading
      // sections below the fold (measured against the /services and
      // /portfolio pages that don't render it). IntersectionObserver
      // pauses the animation loop once the hero leaves the viewport
      // and resumes it when it comes back.
      let running = false;
      const startLoop = () => {
        if (running) return;
        running = true;
        clock.getDelta(); // discard time-since-pause so the wave doesn't jump
        renderer.setAnimationLoop(frame);
      };
      const stopLoop = () => {
        if (!running) return;
        running = false;
        renderer.setAnimationLoop(null);
      };
      const visIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) startLoop();
            else stopLoop();
          });
        },
        { rootMargin: "0px" }
      );
      visIo.observe(container);
      // Also pause when the tab is hidden — no reason to burn GPU in
      // the background.
      const onVisibilityChange = () => {
        if (document.hidden) stopLoop();
        else if (container.getBoundingClientRect().bottom > 0) startLoop();
      };
      document.addEventListener("visibilitychange", onVisibilityChange);

      // Attach cleanup hooks to the outer return by stashing them.
      // Wrapped into the existing cleanup closure below.
      const originalCleanup = () => {
        visIo.disconnect();
        document.removeEventListener("visibilitychange", onVisibilityChange);
        stopLoop();
      };
      // eslint-disable-next-line no-underscore-dangle
      container.__waveGridCleanup = originalCleanup;
    }

    return () => {
      renderer.setAnimationLoop(null);
      // Run any additional cleanup we stashed on the container.
      // eslint-disable-next-line no-underscore-dangle
      if (typeof container.__waveGridCleanup === "function") {
        container.__waveGridCleanup();
        // eslint-disable-next-line no-underscore-dangle
        delete container.__waveGridCleanup;
      }
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", applySize);
      canvas.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      ctx.revert();

      geometry.dispose();
      material.dispose();
      depthMaterial.dispose();
      rayPlane.geometry.dispose();
      rayPlane.material.dispose();
      trailTexture.dispose();
      composer.dispose();
      renderer.dispose();
    };
  }, [
    waveAmplitude,
    waveSpeed,
    waveFrequency,
    waveWidth,
    waveMaxHeight,
    waveJitter,
    autoAnimate,
  ]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn("relative h-full w-full overflow-hidden", className)}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full opacity-0"
      />
    </div>
  );
}

export default WaveGridBackground;
