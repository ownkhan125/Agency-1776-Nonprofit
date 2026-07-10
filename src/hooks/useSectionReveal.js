"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/animations/gsap";
import { EASE, DUR, STAGGER, TRIGGER } from "@/animations/presets";

/**
 * Drives the mandatory build-in sequence for every section:
 *   1. Border stroke draws in  (.js-section-border, uses pathLength="1")
 *   2. Icons scale + fade in    (.js-reveal-icon, staggered)
 *   3. Text words rise up       (.js-reveal-text .rt-word, staggered)
 *
 * A separate reveal runs on any [data-scrub-text] container.
 *
 * Reveal triggering uses IntersectionObserver rather than
 * ScrollTrigger onEnter — ScrollTrigger callbacks proved unreliable
 * under ScrollSmoother in this project (the original code shipped
 * with the same workaround). Direction is inferred from the observed
 * entry's boundingClientRect at the moment it stops intersecting:
 *   - element is BELOW viewport (rect.top > 0)  → user scrolled UP
 *     past the section → play the timeline in reverse for a smooth
 *     exit animation.
 *   - element is ABOVE viewport (rect.bottom < viewport top) → user
 *     scrolled DOWN past the section → leave as-is.
 * Sections that opt out via `data-reveal-mode="once"` skip reversal.
 *
 * Parallax elements ([data-parallax="<px>"]) still use the scrubbed
 * ScrollTrigger — decorative motion only.
 */
export function useSectionReveal(options = {}) {
  const {
    borderEase = EASE.border,
    borderDuration = DUR.border,
    iconEase = EASE.icon,
    iconDuration = DUR.icon,
    iconStagger = STAGGER.icon,
    textEase = EASE.text,
    textDuration = DUR.text,
    textStagger = STAGGER.textWord,
    parallaxTrigger = TRIGGER.parallax,
  } = options;

  const scopeRef = useRef(null);

  useEffect(() => {
    if (!scopeRef.current) return;
    registerGsap();
    const root = scopeRef.current;
    const revealMode = root.dataset.revealMode || "reverse";
    const oneShot = revealMode === "once";
    const observers = [];

    const ctx = gsap.context(() => {
      const border = root.querySelector(".js-section-border");
      const icons = root.querySelectorAll(".js-reveal-icon");
      const timelineWords = root.querySelectorAll(
        ".js-reveal-text:not([data-scrub-text]) .rt-word"
      );
      const scrubContainers = root.querySelectorAll("[data-scrub-text]");
      const parallaxNodes = root.querySelectorAll("[data-parallax]");

      // Baseline hidden states.
      if (border) gsap.set(border, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(icons, {
        opacity: 0,
        scale: 0.86,
        y: 0,
        transformOrigin: "50% 50%",
      });
      gsap.set(timelineWords, { yPercent: 110, y: 0, opacity: 0 });

      // Build-in timeline (border → icons → text)
      const tl = gsap.timeline({
        paused: true,
        defaults: { overwrite: "auto" },
      });

      if (border) {
        tl.to(
          border,
          {
            strokeDashoffset: 0,
            duration: borderDuration,
            ease: borderEase,
          },
          0
        );
      }

      if (icons.length) {
        tl.to(
          icons,
          {
            opacity: 1,
            scale: 1,
            duration: iconDuration,
            ease: iconEase,
            stagger: iconStagger,
          },
          borderDuration * 0.25
        );
      }

      if (timelineWords.length) {
        tl.to(
          timelineWords,
          {
            yPercent: 0,
            opacity: 1,
            duration: textDuration,
            ease: textEase,
            stagger: textStagger,
          },
          borderDuration * 0.3
        );
      }

      // IntersectionObserver drives play/reverse.
      // rootMargin fires early (10% before section reaches viewport
      // bottom) so headings begin resolving as soon as the section
      // starts entering — well before the reader hits mid-section.
      let hasEntered = false;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              tl.play();
              hasEntered = true;
              return;
            }
            if (!hasEntered || oneShot) return;
            // Not intersecting — determine which side we exited.
            const rect = entry.boundingClientRect;
            const vh =
              window.innerHeight || document.documentElement.clientHeight;
            if (rect.top >= vh * 0.5) {
              // Element sits below viewport → user scrolled UP past
              // the section → play reverse for the smooth exit reveal.
              tl.reverse();
            }
            // Else element is above viewport → user scrolled DOWN
            // past section → leave the animation played.
          });
        },
        { threshold: 0, rootMargin: "0px 0px -8% 0px" }
      );
      io.observe(root);
      observers.push(io);

      // ---- Scrub-marked headings (data-scrub-text) ----
      scrubContainers.forEach((container) => {
        const words = container.querySelectorAll(".rt-word");
        if (!words.length) return;
        gsap.set(words, { yPercent: 110, y: 0, opacity: 0 });

        const scrubTl = gsap.timeline({ paused: true });
        scrubTl.to(words, {
          yPercent: 0,
          opacity: 1,
          duration: textDuration,
          ease: textEase,
          stagger: STAGGER.scrubWord,
        });

        let scrubEntered = false;
        const scrubIo = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                scrubTl.play();
                scrubEntered = true;
                return;
              }
              if (!scrubEntered || oneShot) return;
              const rect = entry.boundingClientRect;
              const vh =
                window.innerHeight || document.documentElement.clientHeight;
              if (rect.top >= vh * 0.5) {
                scrubTl.reverse();
              }
            });
          },
          { threshold: 0, rootMargin: "0px 0px -8% 0px" }
        );
        scrubIo.observe(container);
        observers.push(scrubIo);
      });

      // ---- Soft parallax (decorative, still scrubbed) ----
      parallaxNodes.forEach((node) => {
        const distance = parseFloat(node.dataset.parallax) || 40;
        gsap.fromTo(
          node,
          { yPercent: distance / 2 },
          {
            yPercent: -distance / 2,
            ease: EASE.parallax,
            scrollTrigger: {
              trigger: node,
              ...parallaxTrigger,
            },
          }
        );
      });
    }, scopeRef);

    return () => {
      observers.forEach((o) => o.disconnect());
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return scopeRef;
}
