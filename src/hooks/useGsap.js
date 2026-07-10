"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Runs a GSAP setup callback inside a scoped gsap.context.
 * Cleanup (tweens, ScrollTriggers, event listeners) is handled on unmount.
 *
 * const ref = useGsap((ctx) => {
 *   gsap.to(".target", { x: 100 });
 * }, [deps]);
 */
export function useGsap(callback, deps = []) {
  const scopeRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(callback, scopeRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}
