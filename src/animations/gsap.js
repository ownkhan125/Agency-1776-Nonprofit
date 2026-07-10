"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

let registered = false;

/**
 * Idempotent GSAP plugin registration.
 * Safe to call from any hook — only runs once per app lifetime.
 * Includes ScrollTrigger + ScrollSmoother (both free as of GSAP 3.13).
 */
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  registered = true;
}

export { gsap, ScrollTrigger, ScrollSmoother };
