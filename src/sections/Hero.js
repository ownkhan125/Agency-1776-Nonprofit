"use client";

import { useLayoutEffect, useRef } from "react";
import { SplitText } from "@/components/SplitText";
import { StarField } from "@/components/StarField";
import { Ribbon } from "@/components/Ribbon";
import { TacticalButton } from "@/components/TacticalButton";
import { WaveGridBackground } from "@/components/WaveGridBackground";
import { gsap, registerGsap } from "@/animations/gsap";
import { EASE, DUR, STAGGER } from "@/animations/presets";

/**
 * Hero — Agency 1776 nonprofit homepage lede.
 *
 * The Hero owns a bespoke cinematic entrance sequence played once per
 * component mount (fresh page load, hard refresh, or soft-nav to `/`).
 * We deliberately DON'T use `useSectionReveal` here — the standard
 * build-in fires immediately on IntersectionObserver entry, which
 * would race against the entrance timeline. Instead Hero drives every
 * reveal itself from a single master `gsap.timeline` scoped inside a
 * `gsap.context`, so:
 *
 *   1. Wave grid canvas starts fading in the moment it mounts (its own
 *      0.9s GSAP tween, handled inside WaveGridBackground).
 *   2. Ribbons drift + fade in from `y:24, opacity:0`.
 *   3. Star fields fade in slightly after the ribbons land, so the
 *      constellation feels like it "materialises" against the sweep.
 *   4. Wave grid's ambient ripple animation continues running behind
 *      everything (that's Three.js scene, independent of GSAP).
 *   5. H1 words rise from `yPercent:110, opacity:0` — the same mask
 *      metaphor SplitText uses everywhere else, so the entrance reads
 *      as consistent with the rest of the site.
 *   6. Body copy words follow with a tighter stagger.
 *   7. CTA rises + fades into place last.
 *
 * The whole sequence lives in the 1.4-1.8s budget so the hero is fully
 * legible well before 2s — the intent isn't to hold the reader hostage
 * but to make the composition feel curated and cinematic.
 *
 * `overwrite: "auto"` on every tween means later mounts (theme swap
 * causing a rerender) don't stack — the timeline replaces any prior
 * state cleanly.
 */
export function Hero() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const root = rootRef.current;
      // Query all elements the entrance drives.
      const ribbons = root.querySelectorAll("[data-hero-enter='ribbon']");
      const stars = root.querySelectorAll("[data-hero-enter='stars']");
      const cta = root.querySelectorAll("[data-hero-enter='cta']");
      // SplitText renders `.rt-word` spans inside `.rt-word-mask` overflow
      // masks. Separate the scrub-flagged H1 from the body paragraphs so
      // we can stagger them independently.
      const scrubWords = root.querySelectorAll(
        "[data-scrub-text] .rt-word"
      );
      const bodyWords = root.querySelectorAll(
        ".js-reveal-text:not([data-scrub-text]) .rt-word"
      );

      // Baseline hidden states — set immediately so the first paint has
      // nothing in view, then the timeline reveals each element in turn.
      gsap.set(ribbons, { opacity: 0, y: 24, force3D: true });
      gsap.set(stars, { opacity: 0, scale: 0.94, force3D: true });
      gsap.set(cta, { opacity: 0, y: 10, force3D: true });
      gsap.set(scrubWords, { yPercent: 110, y: 0, opacity: 0 });
      gsap.set(bodyWords, { yPercent: 110, y: 0, opacity: 0 });

      // Master timeline — every step slots into the 1.4-1.8s budget.
      const tl = gsap.timeline({
        defaults: { overwrite: "auto", force3D: true },
      });

      // 1) Ribbons — slow, cinematic sweep. Slight per-ribbon stagger
      //    so they don't fire in lockstep.
      tl.to(
        ribbons,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
        },
        0.15
      );

      // 2) Stars — softer overlap so the constellation catches light
      //    while ribbons are still settling. Small scale-up reads as
      //    a twinkle rather than a punch-in.
      tl.to(
        stars,
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.08,
        },
        0.55
      );

      // 3) H1 words — same mask-based rise the rest of the site uses.
      //    Scrub words get a slightly wider stagger for that "editorial
      //    heavyweight" tempo, matching the presets.
      tl.to(
        scrubWords,
        {
          yPercent: 0,
          opacity: 1,
          duration: DUR.text,
          ease: EASE.text,
          stagger: STAGGER.scrubWord,
        },
        0.7
      );

      // 4) Body copy words — faster stagger, slightly later start so the
      //    H1 gets to establish weight before support copy chases it.
      tl.to(
        bodyWords,
        {
          yPercent: 0,
          opacity: 1,
          duration: DUR.text,
          ease: EASE.text,
          stagger: STAGGER.textWord,
        },
        1.0
      );

      // 5) CTA — arrives last, quiet lift + fade. Doesn't oversell.
      tl.to(
        cta,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        },
        1.25
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={rootRef}
      data-reveal-mode="once"
      className="relative isolate flex h-[100svh] min-h-[680px] overflow-hidden bg-background"
    >
      {/* z-0 — wave grid canvas fills the full section. Its own GSAP
          fade-in (inside WaveGridBackground) is the FIRST beat of the
          entrance, running in parallel with our timeline. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <WaveGridBackground className="h-full w-full" />
      </div>

      {/* z-2 — light content-legibility wash centred on the H1. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 50% 50%, color-mix(in srgb, var(--color-background) 22%, transparent) 0%, transparent 60%)",
        }}
      />

      {/* z-4 — ribbons + stars. Each gets a `data-hero-enter` tag so
          the entrance timeline can target them by role, not by index. */}
      <div data-hero-enter="ribbon">
        <Ribbon
          variant="flow"
          tone="accent"
          opacity={0.28}
          width={22}
          className="z-[4] -left-[10%] top-[60%] h-[24vh] w-[125%] md:top-[66%] md:h-[22vh]"
        />
      </div>
      <div data-hero-enter="ribbon">
        <Ribbon
          variant="fold"
          tone="foreground"
          opacity={0.12}
          width={10}
          className="z-[4] -right-[10%] top-[16%] h-[22vh] w-[120%]"
          reverse
        />
      </div>
      {/* StarField ignores extra props, so the entrance tag lives on a
          wrapping div that carries the absolute positioning. */}
      <div
        data-hero-enter="stars"
        aria-hidden="true"
        className="absolute right-4 top-16 z-[4] h-40 w-56 opacity-[0.3] md:right-10 md:top-24 md:h-56 md:w-72"
      >
        <StarField count={18} seed={17} className="h-full w-full" />
      </div>
      <div
        data-hero-enter="stars"
        aria-hidden="true"
        className="absolute bottom-24 left-6 z-[4] h-32 w-44 opacity-[0.24] md:bottom-32 md:left-10 md:h-40 md:w-56"
      >
        <StarField count={14} seed={71} className="h-full w-full" />
      </div>

      {/* z-10 — content, max-w'd in its own wrapper so the wave grid
          above stays edge-to-edge regardless of monitor width. */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col justify-center px-6 md:px-10">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <SplitText
            as="h1"
            scrub
            className="max-w-6xl text-[clamp(3.1rem,10.25vw,9.2rem)] font-semibold leading-[0.92] tracking-tight"
            text="We Help More People Believe in Your Mission"
          />

          <SplitText
            as="p"
            className="mt-8 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-lg"
            text="Agency 1776 builds nonprofit websites for organizations that need to earn donor confidence and make it easier for people to give, volunteer, partner, and stay involved."
          />

          <div
            data-hero-enter="cta"
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <TacticalButton href="/contact" variant="primary">
              Grow Support
            </TacticalButton>
          </div>
        </div>
      </div>
    </section>
  );
}
