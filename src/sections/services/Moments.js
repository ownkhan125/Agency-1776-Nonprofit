"use client";

import { useLayoutEffect, useRef } from "react";
import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { StarMark } from "@/components/StarMark";
import { StarField } from "@/components/StarField";
import { gsap, registerGsap, ScrollTrigger } from "@/animations/gsap";

const MOMENTS = [
  "The first website visit.",
  "The first donation.",
  "The first volunteer signup.",
  "The first event registration.",
  "The first monthly gift.",
  "The first partnership conversation.",
  "The first time someone shares your mission.",
];

/**
 * Moments — sticky storytelling.
 * Left column pins an image + H2. Right column is a vertical timeline
 * where each moment rides a per-line reveal as it enters the viewport.
 * A single connecting spine gradient links the seven moments so they
 * read as sequential rather than as an unordered list. Closing text
 * lands after the timeline as a full-width statement.
 */
export function Moments() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      const nodes = rootRef.current.querySelectorAll("[data-moment]");
      nodes.forEach((n) => {
        gsap.fromTo(
          n,
          { xPercent: 6, opacity: 0 },
          {
            xPercent: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: n,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Closing statement — word-level directional reveal
      const closingWords = rootRef.current.querySelectorAll(
        "[data-moments-close] .rt-word"
      );
      if (closingWords.length) {
        gsap.set(closingWords, { opacity: 0 });
        closingWords.forEach((w, i) => {
          gsap.set(w, { yPercent: 40 });
        });
        gsap.to(closingWords, {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.03,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-moments-close]",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative" style={{ overflowX: "clip" }}>
      <SectionShell
        id="services-moments"
        innerClassName="mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24"
      >
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-24">
          <div className="relative">
            <div className="relative lg:sticky lg:top-32 flex flex-col gap-8">
              <div
                className="angular-panel relative aspect-[4/5] overflow-hidden"
                style={{
                  "--ap-cut": "24px",
                  "--ap-bg": "var(--color-surface)",
                  "--ap-border-color":
                    "color-mix(in srgb, var(--color-accent) 42%, transparent)",
                }}
              >
                <img
                  src="https://picsum.photos/seed/agency1776-services-moments/900/1100"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity opacity-85"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--color-accent) 18%, transparent)",
                  }}
                />
                <StarField
                  count={12}
                  seed={83}
                  className="absolute inset-0 opacity-[0.28]"
                />
                <span className="tac-bracket tac-bracket-tl" />
                <span className="tac-bracket tac-bracket-br" />
              </div>

              <SplitText
                as="h2"
                scrub
                className="text-[clamp(1.75rem,3.6vw,3rem)] font-semibold uppercase leading-[1.05] tracking-tight"
                text="Built for Supporter Moments"
              />
            </div>
          </div>

          <div className="relative">
            <SplitText
              as="p"
              className="mb-8 max-w-xl text-lg leading-relaxed tracking-tight text-foreground/80 md:mb-10 md:text-xl"
              text="Nonprofits rely on moments of trust."
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-6 left-3 hidden w-px bg-accent/30 md:block"
            />
            <ul className="flex flex-col gap-6 md:gap-8">
              {MOMENTS.map((line) => (
                <li
                  key={line}
                  data-moment
                  data-cursor="card"
                  className="relative pl-10 md:pl-14"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-2 flex h-6 w-6 items-center justify-center"
                  >
                    <StarMark className="h-3.5 w-3.5 text-accent" />
                  </span>
                  <SplitText
                    as="p"
                    className="text-lg leading-snug tracking-tight text-foreground md:text-2xl"
                    text={line}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-animate-seam className="mt-12 tac-seam md:mt-16" />
        <div
          data-moments-close
          className="mt-8 grid gap-8 md:mt-12 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-14"
        >
          <StarMark className="h-10 w-10 text-accent md:h-12 md:w-12" />
          <SplitText
            as="p"
            className="max-w-4xl text-[clamp(1.25rem,2.4vw,2rem)] font-semibold leading-snug tracking-tight text-foreground"
            text="We build the digital foundation around those moments, so your organization can communicate clearly and make support easier."
          />
        </div>
      </SectionShell>
    </div>
  );
}
