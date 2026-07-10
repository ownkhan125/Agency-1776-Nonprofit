"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/animations/gsap";

const STAR_POINTS = "50,4 61,36 96,36 68,58 79,92 50,72 21,92 32,58 4,36 39,36";
const TRAIL_POOL_SIZE = 24;
const TRAIL_SPAWN_DIST = 22; // px moved between spawns — keeps particle count in check
const TRAIL_SPAWN_DIST_SQ = TRAIL_SPAWN_DIST * TRAIL_SPAWN_DIST;

/**
 * Premium adaptive cursor.
 *
 * Structure:
 *   - Ring — larger circle with soft-lag follow, used for state paint.
 *   - Dot  — small 5-point star (matching the site's StarMark motif)
 *            tracking the pointer tightly with a very slow perpetual
 *            rotation. On button/link states it fades out just like
 *            the previous dot did.
 *   - Trail — a pool of 24 pre-created SVG stars parked at (0,0,
 *            opacity 0). Every ~22px of pointer travel, the next one
 *            in the ring buffer is set to the pointer location and
 *            tweened out (opacity → 0, scale → 0.35, tiny random drift
 *            + rotation) over ~0.9s. Pooling means zero DOM churn and
 *            a hard cap on live particles.
 *
 * Motion runs entirely on transform + opacity (compositor-only). The
 * gsap.quickTo tweens for x/y are reused every frame — no per-move
 * allocation. State transitions and `data-cursor` delegation are
 * unchanged from the previous cursor.
 *
 * Skipped entirely on touch devices (matchMedia hover: none) and for
 * users with prefers-reduced-motion.
 */
export function Cursor() {
  const dotRef = useRef(null);
  const dotStarRef = useRef(null);
  const ringRef = useRef(null);
  const eyeRef = useRef(null);
  const trailContainerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const dotStar = dotStarRef.current;
    const ring = ringRef.current;
    const eye = eyeRef.current;
    const trailContainer = trailContainerRef.current;
    if (!dot || !dotStar || !ring || !eye || !trailContainer) return;

    // Trail particle pool — SVG stars created imperatively so React
    // never re-renders on cursor move. Pool is a ring buffer.
    const pool = [];
    for (let i = 0; i < TRAIL_POOL_SIZE; i++) {
      const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svg.setAttribute("viewBox", "0 0 100 100");
      svg.setAttribute("aria-hidden", "true");
      svg.style.cssText =
        "position:fixed;left:0;top:0;width:9px;height:9px;pointer-events:none;opacity:0;will-change:transform,opacity;";
      const poly = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      poly.setAttribute("points", STAR_POINTS);
      poly.setAttribute("fill", "currentColor");
      svg.appendChild(poly);
      trailContainer.appendChild(svg);
      gsap.set(svg, { xPercent: -50, yPercent: -50 });
      pool.push(svg);
    }
    let poolIdx = 0;
    let lastSpawnX = 0;
    let lastSpawnY = 0;

    gsap.set([dot, ring, eye], { xPercent: -50, yPercent: -50, opacity: 0 });
    gsap.set(eye, { scale: 0.6 });

    // Perpetual gentle rotation on the star core — 22s per full turn
    // reads as ambient shimmer, never as spinning.
    const spinTween = gsap.to(dotStar, {
      rotation: 360,
      duration: 22,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 50%",
    });

    // quickTo tweens: one per axis per element, reused every frame.
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" });
    const eyeX = gsap.quickTo(eye, "x", { duration: 0.32, ease: "power3" });
    const eyeY = gsap.quickTo(eye, "y", { duration: 0.32, ease: "power3" });

    let visible = false;

    const spawnTrailStar = (x, y) => {
      const p = pool[poolIdx];
      poolIdx = (poolIdx + 1) % TRAIL_POOL_SIZE;
      if (!p) return;

      // ~15% of particles borrow the accent-red palette for a subtle
      // patriotic shimmer; the rest are soft foreground/gray.
      const useAccent = Math.random() < 0.15;
      p.style.color = useAccent
        ? "var(--color-accent)"
        : "var(--color-foreground)";

      const driftX = (Math.random() - 0.5) * 18;
      const driftY = (Math.random() - 0.5) * 14 - 4; // slight upward bias
      const startRot = Math.random() * 90;
      const startScale = 0.85 + Math.random() * 0.35;
      const duration = 0.75 + Math.random() * 0.35;

      gsap.killTweensOf(p);
      gsap.set(p, {
        x,
        y,
        opacity: useAccent ? 0.7 : 0.55,
        scale: startScale,
        rotation: startRot,
      });
      gsap.to(p, {
        x: x + driftX,
        y: y + driftY,
        opacity: 0,
        scale: 0.35,
        rotation: startRot + 40,
        duration,
        ease: "power2.out",
      });
    };

    const handleMove = (e) => {
      const cx = e.clientX;
      const cy = e.clientY;
      if (!visible) {
        gsap.to([dot, ring], { opacity: 1, duration: 0.4, ease: "power2.out" });
        visible = true;
        lastSpawnX = cx;
        lastSpawnY = cy;
      }
      dotX(cx);
      dotY(cy);
      ringX(cx);
      ringY(cy);
      eyeX(cx);
      eyeY(cy);

      // Distance-throttled trail spawn — hard cap on emission rate.
      const dx = cx - lastSpawnX;
      const dy = cy - lastSpawnY;
      if (dx * dx + dy * dy >= TRAIL_SPAWN_DIST_SQ) {
        spawnTrailStar(cx, cy);
        lastSpawnX = cx;
        lastSpawnY = cy;
      }
    };

    // Reusable "state" transitions for the ring
    const applyState = (state) => {
      // Reset eye by default — only "view" turns it on.
      if (state !== "view") {
        gsap.to(eye, { opacity: 0, scale: 0.6, duration: 0.22, ease: "power3.out" });
      }
      switch (state) {
        case "button":
          gsap.to(ring, {
            opacity: 1,
            scale: 1.55,
            backgroundColor: "var(--color-accent)",
            borderColor: "var(--color-accent)",
            duration: 0.32,
            ease: "power3.out",
          });
          gsap.to(dot, { opacity: 0, duration: 0.2 });
          break;
        case "card":
          gsap.to(ring, {
            opacity: 1,
            scale: 2.1,
            backgroundColor: "rgba(0,0,0,0)",
            borderColor: "var(--color-foreground)",
            duration: 0.4,
            ease: "power3.out",
          });
          gsap.to(dot, { opacity: 1, scale: 1.4, duration: 0.2 });
          break;
        case "link":
          gsap.to(ring, {
            opacity: 1,
            scale: 1.25,
            backgroundColor: "var(--color-foreground)",
            borderColor: "var(--color-foreground)",
            duration: 0.3,
            ease: "power3.out",
          });
          gsap.to(dot, { opacity: 0, duration: 0.2 });
          break;
        case "media":
          gsap.to(ring, {
            opacity: 1,
            scale: 2.6,
            backgroundColor: "rgba(0,0,0,0)",
            borderColor: "var(--color-accent)",
            duration: 0.4,
            ease: "power3.out",
          });
          gsap.to(dot, { opacity: 1, scale: 0.8, duration: 0.2 });
          break;
        case "view":
          // Eye cursor for portfolio row hover — ring grows into a
          // soft accent halo, dot fades out, the eye SVG + VIEW label
          // fade in centered on the cursor.
          gsap.to(ring, {
            opacity: 1,
            scale: 3.2,
            backgroundColor: "color-mix(in srgb, var(--color-accent) 12%, transparent)",
            borderColor: "var(--color-accent)",
            duration: 0.4,
            ease: "power3.out",
          });
          gsap.to(dot, { opacity: 0, duration: 0.2 });
          gsap.to(eye, {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: "power3.out",
          });
          break;
        case "hidden":
          // Full cursor blackout — used when a section (e.g. the
          // portfolio row list) supplies its own cursor-follow
          // element. Ring/dot/eye all fade out so the local element
          // can take over without visual conflict.
          gsap.to(ring, { opacity: 0, duration: 0.28, ease: "power3.out" });
          gsap.to(dot, { opacity: 0, duration: 0.2 });
          break;
        default:
          gsap.to(ring, {
            opacity: 1,
            scale: 1,
            backgroundColor: "rgba(0,0,0,0)",
            borderColor: "var(--color-foreground)",
            duration: 0.28,
            ease: "power3.out",
          });
          gsap.to(dot, { opacity: 1, scale: 1, duration: 0.2 });
      }
    };

    let lastState = "default";
    const handleOver = (e) => {
      const el = e.target?.closest?.("[data-cursor]");
      const next = el?.dataset.cursor || "default";
      if (next === lastState) return;
      lastState = next;
      applyState(next);
    };

    const handleLeaveWindow = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.25 });
      visible = false;
    };

    const handleEnterWindow = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.25 });
      visible = true;
    };

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseleave", handleLeaveWindow);
    document.addEventListener("mouseenter", handleEnterWindow);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseleave", handleLeaveWindow);
      document.removeEventListener("mouseenter", handleEnterWindow);
      spinTween.kill();
      pool.forEach((p) => {
        gsap.killTweensOf(p);
        p.remove();
      });
    };
  }, []);

  return (
    <>
      <div
        ref={trailContainerRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9997]"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[9998] h-8 w-8 rounded-full border opacity-0"
        style={{
          borderColor: "var(--color-foreground)",
          willChange: "transform, background-color, border-color",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="cursor-dot pointer-events-none fixed left-0 top-0 z-[9999] h-2.5 w-2.5 opacity-0"
        style={{
          color: "var(--color-foreground)",
          willChange: "transform, opacity",
        }}
      >
        <svg
          ref={dotStarRef}
          viewBox="0 0 100 100"
          fill="currentColor"
          aria-hidden="true"
          className="h-full w-full"
        >
          <polygon points={STAR_POINTS} />
        </svg>
      </div>
      <div
        ref={eyeRef}
        aria-hidden="true"
        className="cursor-eye pointer-events-none fixed left-0 top-0 z-[9999] flex flex-col items-center gap-1 opacity-0"
        style={{
          color: "var(--color-accent)",
          willChange: "transform, opacity",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-4 w-4"
        >
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span className="text-[8px] font-semibold uppercase tracking-[0.28em]">
          View
        </span>
      </div>
    </>
  );
}
