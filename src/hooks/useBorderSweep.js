"use client";

import { useLayoutEffect } from "react";
import { gsap, registerGsap } from "@/animations/gsap";

/**
 * Drives two ambient border animations via GSAP:
 *   • [data-animate-border] on .angular-panel — rotates the registered
 *     CSS custom property --panel-sweep-angle 0deg → 360deg on repeat.
 *   • [data-animate-seam]   on .tac-seam      — shifts backgroundPositionX
 *     by exactly one dash period (20px) so the dashes drift seamlessly.
 *
 * Each tween is created once, but PAUSED by default and only played
 * while its element is intersecting the viewport. That saves
 * continuous compositor work on the (typically many) panels/seams
 * sitting off-screen — the /services profile counted 622 will-change
 * elements + 26 continuous CSS animations before this gate.
 *
 * `will-change` is applied by GSAP on tween start and released on
 * tween pause, matching the tween lifecycle. Skipped entirely when
 * prefers-reduced-motion is set.
 */
export function useBorderSweep() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (reduced?.matches) return;

    registerGsap();
    const tweenByEl = new WeakMap();
    const observed = [];

    const start = (el) => {
      const tw = tweenByEl.get(el);
      if (tw && tw.paused()) tw.play();
    };
    const stop = (el) => {
      const tw = tweenByEl.get(el);
      if (tw && !tw.paused()) tw.pause();
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) start(entry.target);
          else stop(entry.target);
        });
      },
      { rootMargin: "10% 0px" }
    );

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray("[data-animate-border]");
      panels.forEach((el, i) => {
        gsap.set(el, { "--panel-sweep-angle": "0deg" });
        const tw = gsap.to(el, {
          "--panel-sweep-angle": "360deg",
          duration: 14,
          ease: "none",
          repeat: -1,
          delay: (i % 5) * 0.6,
          paused: true,
        });
        tweenByEl.set(el, tw);
        io.observe(el);
        observed.push(el);
      });

      const seams = gsap.utils.toArray("[data-animate-seam]");
      seams.forEach((el, i) => {
        gsap.set(el, { backgroundPositionX: "0px" });
        const tw = gsap.to(el, {
          backgroundPositionX: "20px",
          duration: 6,
          ease: "none",
          repeat: -1,
          delay: (i % 4) * 0.35,
          paused: true,
        });
        tweenByEl.set(el, tw);
        io.observe(el);
        observed.push(el);
      });
    });

    return () => {
      observed.forEach((el) => io.unobserve(el));
      io.disconnect();
      ctx.revert();
    };
  }, []);
}
