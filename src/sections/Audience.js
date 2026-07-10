"use client";

import { useLayoutEffect, useRef } from "react";
import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { StarMark } from "@/components/StarMark";
import { Ribbon } from "@/components/Ribbon";
import { gsap, registerGsap } from "@/animations/gsap";
import { cn } from "@/utils/cn";

const AUDIENCE = [
  "Local nonprofits",
  "Community organizations",
  "Faith-based organizations",
  "Education nonprofits",
  "Youth programs",
  "Veteran support organizations",
  "Health and human services organizations",
  "Animal welfare organizations",
  "Foundations",
  "Advocacy nonprofits",
  "Volunteer-led groups",
  "Donation-driven campaigns",
  "Grassroots causes",
  "Organizations ready to modernize their website",
];

/**
 * Audience — dual-track marquee.
 *  Two horizontal chip tracks scroll opposite directions in a slow
 *  loop. Each track is doubled (content + duplicate) so the modulo-
 *  wrapped translation reads as an infinite belt. Purely GSAP-driven
 *  linear tween — no scroll trigger, no snap, no jank.
 *  The audience list itself remains the same 14 items; halves are
 *  split evenly between the two tracks.
 */
export function Audience() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      // Each marquee has [data-marquee-track] containing two [data-marquee-half]
      // spans of equal width. Translate the whole track from 0 → -50% so the
      // duplicate half smoothly takes over.
      gsap.utils.toArray("[data-marquee-track]").forEach((track) => {
        const dir = track.dataset.dir === "reverse" ? 1 : -1;
        gsap.fromTo(
          track,
          { xPercent: dir === -1 ? 0 : -50 },
          {
            xPercent: dir === -1 ? -50 : 0,
            duration: 40,
            ease: "none",
            repeat: -1,
          }
        );
      });

      // Closing statement — directional word reveal (words slide in
      // alternately from left/right) on scroll into view.
      const words = rootRef.current.querySelectorAll(
        "[data-close] .rt-word"
      );
      if (words.length) {
        gsap.set(words, { opacity: 0 });
        words.forEach((w, i) => {
          gsap.set(w, { xPercent: i % 2 === 0 ? -20 : 20 });
        });
        gsap.to(words, {
          xPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-close]",
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Split the audience roughly in half for the two tracks.
  const half = Math.ceil(AUDIENCE.length / 2);
  const topRow = AUDIENCE.slice(0, half);
  const bottomRow = AUDIENCE.slice(half);

  return (
    <div ref={rootRef} className="relative overflow-hidden">
      <SectionShell
        id="audience"
        innerClassName="mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24"
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-center lg:gap-20">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <StarMark className="h-5 w-5 text-accent" />
              <SplitText
                as="p"
                className="text-[10px] uppercase tracking-[0.32em] text-accent"
                text="Who this is for"
              />
            </div>
            <SplitText
              as="h2"
              scrub
              className="text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.05] tracking-tight"
              text="Built for Organizations Doing Work That Deserves to Be Seen."
            />
          </div>

          {/* Ribbon marquee — dual-track infinite belt with edge-fade
              mask, plus a slim accent ribbon that threads across the
              full width behind the chip rows. Ribbon extends past both
              side edges so its endpoints stay off-screen. */}
          <div className="relative py-6">
            <Ribbon
              variant="flow"
              tone="accent"
              opacity={0.22}
              width={12}
              className="-left-[8%] top-[calc(50%-2.5rem)] h-20 w-[125%]"
            />
            <div className="marquee-fade relative overflow-hidden">
              <Marquee items={topRow} direction="forward" />
              <div className="mt-3">
                <Marquee items={bottomRow} direction="reverse" />
              </div>
            </div>
          </div>
        </div>

        {/* Closing statement — directional word reveal */}
        <div data-animate-seam className="mt-12 md:mt-16 tac-seam" />
        <div
          data-close
          className="mt-8 grid gap-8 md:mt-12 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-14"
        >
          <StarMark className="h-10 w-10 text-accent md:h-12 md:w-12" />
          <SplitText
            as="p"
            className="max-w-4xl text-[clamp(1.5rem,3.2vw,2.5rem)] font-semibold leading-snug tracking-tight text-foreground"
            text="Your work matters. The website should help people understand why."
          />
        </div>
      </SectionShell>
    </div>
  );
}

function Marquee({ items, direction }) {
  const chip = (item, keyPrefix, isLast) => (
    <li
      key={`${keyPrefix}-${item}`}
      className="flex items-center gap-3"
    >
      <span
        className="inline-flex items-center gap-3 whitespace-nowrap border border-foreground/20 bg-surface px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-foreground/80 backdrop-blur-[1px]"
        style={{
          clipPath:
            "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
        }}
      >
        <span aria-hidden="true" className="inline-block h-1 w-1 rotate-45 bg-accent" />
        {item}
      </span>
      {/* Star delimiter between chips — premium marquee signature */}
      <span aria-hidden="true" className="mx-1 text-accent/70">
        <svg viewBox="0 0 100 100" className="h-2.5 w-2.5" fill="currentColor">
          <polygon points="50,4 61,36 96,36 68,58 79,92 50,72 21,92 32,58 4,36 39,36" />
        </svg>
      </span>
    </li>
  );

  return (
    <div
      data-marquee-track
      data-dir={direction}
      className={cn("flex w-max flex-nowrap items-center")}
    >
      <ul data-marquee-half className="flex flex-nowrap items-center gap-1">
        {items.map((it, i) => chip(it, "a", i === items.length - 1))}
      </ul>
      <ul
        data-marquee-half
        aria-hidden="true"
        className="flex flex-nowrap items-center gap-1"
      >
        {items.map((it, i) => chip(it, "b", i === items.length - 1))}
      </ul>
    </div>
  );
}
