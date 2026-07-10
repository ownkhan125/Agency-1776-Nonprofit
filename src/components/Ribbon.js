"use client";

import { useLayoutEffect, useRef, useId } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/animations/gsap";
import { cn } from "@/utils/cn";

/**
 * Premium fabric ribbon.
 *
 * Refactor (2026-07-10): the previous three-stroke stack read as a
 * feathered wisp because every layer used low-alpha, round-capped
 * strokes. This version is built from a single band whose body is
 * filled by a gradient along the wave normal (top→middle→bottom of
 * the SVG viewBox), plus a crisp highlight crease running along the
 * band centre. Endpoints extend well beyond the visible viewBox so
 * the ribbon can never terminate mid-air inside a section — it enters
 * off one edge and exits off the other.
 *
 * Props:
 *   variant   "flow" | "fold"   – flow is a wide horizontal wave; fold
 *                                 is a tighter diagonal drape.
 *   tone      "accent" | "foreground"  – hue of the ribbon body.
 *   opacity   number             – overall ribbon opacity (multiplies
 *                                  through the layered strokes).
 *   width     number             – body thickness in SVG user units.
 *                                  With vector-effect="non-scaling-
 *                                  stroke" this is close to screen px.
 *   className string             – positioning by the caller.
 *   reverse   boolean            – flips drift + parallax direction so
 *                                  crossing ribbons don't move in sync.
 */
export function Ribbon({
  variant = "flow",
  tone = "accent",
  opacity = 0.55,
  width = 20,
  className = "",
  reverse = false,
}) {
  const wrapRef = useRef(null);
  // useId is stable across SSR — keeps gradient ids unique per instance
  // so multiple ribbons on a page don't collide when hydration matches.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  useLayoutEffect(() => {
    if (!wrapRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      // Subtle scroll-linked parallax drift. Kept small so the ribbon
      // never appears to detach from its section — reads as the fabric
      // slowly catching a breeze as the reader travels past it.
      gsap.fromTo(
        wrapRef.current,
        { yPercent: reverse ? 5 : -5, xPercent: reverse ? 2 : -2 },
        {
          yPercent: reverse ? -5 : 5,
          xPercent: reverse ? -2 : 2,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
          },
        }
      );
    }, wrapRef);
    return () => ctx.revert();
  }, [reverse]);

  const stroke =
    tone === "accent" ? "var(--color-accent)" : "var(--color-foreground)";

  // Paths extend from x=-160 to x=1320 so both ends live well outside
  // the visible viewBox. That guarantees the ribbon enters/exits the
  // section off-screen at every aspect ratio without a hard endpoint.
  const path =
    variant === "fold"
      ? "M -160 40 C 160 -60 400 200 660 80 S 1000 -20 1320 120"
      : "M -160 110 C 200 20 420 210 660 120 S 1000 40 1320 140";

  const bodyGrad = `ribbon-body-${uid}`;
  const glowGrad = `ribbon-glow-${uid}`;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute", "ribbon-glow", className)}
      style={{ overflow: "visible" }}
    >
      <div
        className={reverse ? "ribbon-drift-slow" : "ribbon-drift"}
        style={{ height: "100%", width: "100%" }}
      >
        <svg
          viewBox="0 0 1160 200"
          preserveAspectRatio="none"
          className="h-full w-full"
          fill="none"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Body gradient — brighter middle, softer top/bottom edges
                so the fabric reads as lit from above rather than flat. */}
            <linearGradient id={bodyGrad} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={opacity * 0.35} />
              <stop offset="45%" stopColor={stroke} stopOpacity={opacity * 1.05} />
              <stop offset="55%" stopColor={stroke} stopOpacity={opacity * 1.15} />
              <stop offset="100%" stopColor={stroke} stopOpacity={opacity * 0.25} />
            </linearGradient>
            {/* Outer bloom — very soft halo behind the body, gives the
                ribbon depth without adding a third opaque stroke. */}
            <linearGradient id={glowGrad} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0} />
              <stop offset="50%" stopColor={stroke} stopOpacity={opacity * 0.35} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Outer bloom */}
          <path
            d={path}
            stroke={`url(#${glowGrad})`}
            strokeWidth={width * 2.1}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Fabric body */}
          <path
            d={path}
            stroke={`url(#${bodyGrad})`}
            strokeWidth={width}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Highlight crease along band centre — reads as the light
              catching the ridge of the fold. */}
          <path
            d={path}
            stroke={stroke}
            strokeWidth={Math.max(1, width * 0.14)}
            strokeOpacity={opacity * 0.95}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
