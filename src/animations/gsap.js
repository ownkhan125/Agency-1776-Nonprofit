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

/** True on phone-width viewports (<768px). */
export function isMobileViewport() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches
  );
}

/**
 * Mobile-aware toggleActions for scroll reveals. On desktop the reveal
 * replays in reverse when the reader scrolls back up (the fourth action,
 * `reverse`). On mobile it plays ONCE and stays — revealed cards/content
 * must not vanish on scroll-up, and one-shot triggers are lighter on
 * low-power devices. Evaluate at trigger-creation time.
 */
export function revealToggleActions() {
  return isMobileViewport() ? "play none none none" : "play none none reverse";
}
