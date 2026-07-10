"use client";

import { useEffect, useLayoutEffect } from "react";
import { registerGsap, ScrollSmoother, ScrollTrigger } from "@/animations/gsap";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Boots a single ScrollSmoother instance bound to the required
 * #smooth-wrapper / #smooth-content DOM structure. Fixed nav elements
 * that live OUTSIDE the wrapper still behave as fixed.
 *
 * Runs in a plain useEffect (not useLayoutEffect) so section-level
 * ScrollTriggers already exist by the time the smoother is created —
 * ScrollSmoother.refresh() then re-associates them with the smoothed
 * scroller. This avoids the "trigger fires at wrong scroll position"
 * class of bug.
 *
 * The `effects: true` flag enables `data-speed` / `data-lag` parallax
 * on any child element (we use it for soft depth on section columns).
 */
export function useSmoothScroll() {
  // Use useLayoutEffect (via iso wrapper) so ScrollSmoother is created
  // BEFORE any child section's useEffect runs. React fires effects
  // bottom-up: child useLayoutEffect → parent useLayoutEffect → paint
  // → child useEffect → parent useEffect. Since sections' triggers
  // register in child useEffect, having the parent create the smoother
  // in useLayoutEffect guarantees ScrollTrigger sees the smoothed
  // scroller from the very first trigger registration onward.
  useIsoLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    registerGsap();

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.15,
      effects: true,
      smoothTouch: 0.1,
    });

    return () => {
      smoother?.kill();
    };
  }, []);
}
