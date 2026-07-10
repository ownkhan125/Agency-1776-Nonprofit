"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useBorderSweep } from "@/hooks/useBorderSweep";

/**
 * Wraps page content in the DOM structure ScrollSmoother requires and
 * activates the smoother on mount. Any fixed-position UI (top nav,
 * main nav, custom cursor) must live OUTSIDE this component.
 *
 * Also mounts the ambient border-sweep animations here so a single
 * gsap.context() owns every panel/seam tween on the page.
 */
export function SmoothScrollProvider({ children }) {
  useSmoothScroll();
  useBorderSweep();

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
