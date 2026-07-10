"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap, registerGsap } from "@/animations/gsap";
import { cn } from "@/utils/cn";

/**
 * Deterministic scatter of small stars across an SVG canvas. Not a
 * flag union block — the positions are perturbed by a seedable hash
 * so no rectangular grid can be perceived. The user should feel
 * "there are stars up there" without registering it as flag.
 *
 * Every star is wrapped in two nested <g> elements:
 *   • outer <g transform="translate(x y)"> — permanent position, so
 *     the star sits at its scattered coordinate inside the viewBox
 *   • inner <g data-star-inner>            — animation target, so
 *     GSAP's transform (scale/rotate/y) pivots around 0,0 which is
 *     the polygon's own center
 * That split keeps GSAP tweens on the inner group from clobbering
 * the outer's positional translate.
 *
 * Each star gets four subtle loops with seeded per-star timing:
 *   • opacity twinkle (sine.inOut, 2.6–5.8s)
 *   • scale pulse    (sine.inOut, 3.4–6.4s, 0.85–1.20 target)
 *   • y-float        (sine.inOut, 4.5–8.5s, ±0.5–1.7 SVG units)
 *   • slow rotation  (linear, 18–32s, only ~55% of stars)
 *
 * All tweens are compositor-friendly (opacity + transform), yoyo
 * where reversible, and viewport-gated via IntersectionObserver so
 * they only run while the StarField is on-screen. Skipped entirely
 * when prefers-reduced-motion is set — the static field remains
 * visible, it just doesn't animate.
 */

function seededRandom(seed) {
  let s = seed || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function starPoints(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.42;
    const x = cx + rr * Math.cos(angle);
    const y = cy + rr * Math.sin(angle);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(" ");
}

export function StarField({
  count = 22,
  seed = 42,
  className = "",
  tone = "accent",
  minSize = 3,
  maxSize = 7,
}) {
  const svgRef = useRef(null);

  const stars = useMemo(() => {
    const rand = seededRandom(seed);
    return Array.from({ length: count }, () => {
      const x = rand() * 100;
      const y = rand() * 100;
      const s = minSize + rand() * (maxSize - minSize);
      const o = 0.25 + rand() * 0.6;
      // Deterministic per-star timing so the field looks organic
      // without any React re-render randomness. Speed tuned so the
      // motion reads clearly at a glance without ever feeling flashy.
      const twinkleDuration = 1.4 + rand() * 2.0;   // 1.4–3.4s  (was 2.6–5.8s)
      const twinkleDelay = rand() * twinkleDuration;
      const twinkleTo = 0.18 + rand() * 0.27;        // 0.18–0.45 (deeper pulse)
      const scaleDuration = 2.0 + rand() * 2.0;      // 2.0–4.0s  (was 3.4–6.4s)
      const scaleDelay = rand() * scaleDuration;
      const scaleTo = 0.80 + rand() * 0.45;          // 0.80–1.25 (a hair more range)
      const floatDuration = 2.6 + rand() * 2.6;      // 2.6–5.2s  (was 4.5–8.5s)
      const floatDelay = rand() * floatDuration;
      const floatY = (rand() < 0.5 ? -1 : 1) * (0.7 + rand() * 1.3);
      const shouldRotate = rand() < 0.55;
      const rotateDuration = 12 + rand() * 8;        // 12–20s    (was 18–32s)
      const rotateDelay = rand() * 4;
      const rotateDir = rand() < 0.5 ? 360 : -360;
      return {
        x,
        y,
        s,
        o,
        twinkleDuration,
        twinkleDelay,
        twinkleTo,
        scaleDuration,
        scaleDelay,
        scaleTo,
        floatDuration,
        floatDelay,
        floatY,
        shouldRotate,
        rotateDuration,
        rotateDelay,
        rotateDir,
      };
    });
  }, [count, seed, minSize, maxSize]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!svgRef.current) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (reduced?.matches) return;

    registerGsap();

    const nodes = svgRef.current.querySelectorAll("[data-star-inner]");
    if (!nodes.length) return;

    let ctx = null;
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      ctx = gsap.context(() => {
        nodes.forEach((node, i) => {
          const s = stars[i];
          if (!s) return;
          // Baseline. Origin at "0px 0px" == polygon's own center
          // because points were generated around (0, 0).
          gsap.set(node, { transformOrigin: "0px 0px", opacity: 1 });
          // Twinkle
          gsap.to(node, {
            opacity: s.twinkleTo,
            duration: s.twinkleDuration,
            delay: s.twinkleDelay,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
          // Scale pulse
          gsap.to(node, {
            scale: s.scaleTo,
            duration: s.scaleDuration,
            delay: s.scaleDelay,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
          // Vertical float
          gsap.to(node, {
            y: s.floatY,
            duration: s.floatDuration,
            delay: s.floatDelay,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
          // Occasional slow rotation
          if (s.shouldRotate) {
            gsap.to(node, {
              rotation: s.rotateDir,
              duration: s.rotateDuration,
              delay: s.rotateDelay,
              ease: "none",
              repeat: -1,
            });
          }
        });
      }, svgRef);
    };

    const stop = () => {
      if (!started) return;
      started = false;
      ctx?.revert();
      ctx = null;
    };

    // Viewport gate — no reason to burn a dozen tweens per field
    // while the reader is looking at a different section.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) start();
          else stop();
        });
      },
      { rootMargin: "10% 0px" }
    );
    io.observe(svgRef.current);

    return () => {
      io.disconnect();
      stop();
    };
  }, [stars]);

  const fill =
    tone === "accent" ? "var(--color-accent)" : "var(--color-foreground)";

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn("pointer-events-none", className)}
    >
      {stars.map((star, i) => (
        <g key={i} transform={`translate(${star.x} ${star.y})`}>
          <g data-star-inner>
            <polygon
              fill={fill}
              fillOpacity={star.o}
              points={starPoints(0, 0, star.s / 2)}
            />
          </g>
        </g>
      ))}
    </svg>
  );
}
