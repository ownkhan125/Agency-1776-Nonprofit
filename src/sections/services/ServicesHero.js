"use client";

import { useLayoutEffect, useRef } from "react";
import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { StarMark } from "@/components/StarMark";
import { StarField } from "@/components/StarField";
import { Ribbon } from "@/components/Ribbon";
import { TacticalButton } from "@/components/TacticalButton";
import { gsap, registerGsap } from "@/animations/gsap";

/**
 * Services Hero — asymmetric editorial spread.
 * Left column carries the mission-critical text (H1 + subtext + CTA).
 * Right column is a chamfered photographic plate framed by ribbons + a
 * StarField, so the page opens with an image the reader feels before
 * they parse the copy. The composition tilts left so the text weight
 * anchors the fold, then relaxes into the image on the right.
 */
export function ServicesHero() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-plate]",
        { yPercent: 6, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          delay: 0.35,
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <SectionShell
      id="services-hero"
      withBorder={false}
      revealMode="once"
      // `pt-*` clears the fixed TopBar + NavBar chrome (~104 px) with a
      // comfortable breathing gap; `pb-*` matches for symmetric
      // centering. `items-center` still centers the content wrapper.
      className="relative flex min-h-[max(680px,100svh)] items-center overflow-hidden scanlines"
      innerClassName="relative z-10 mx-auto w-full max-w-[1600px] px-6 pt-32 pb-16 sm:pt-36 md:px-10 md:pt-40 md:pb-20 lg:pt-44"
    >
      <div
        aria-hidden="true"
        className="tactical-grid pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="flag-stripe-bg pointer-events-none absolute inset-0"
      />
      <Ribbon
        variant="flow"
        tone="accent"
        opacity={0.32}
        width={24}
        className="-left-[10%] top-[68%] h-[26vh] w-[130%]"
      />
      <Ribbon
        variant="fold"
        tone="foreground"
        opacity={0.14}
        width={12}
        className="-right-[10%] top-[10%] h-[24vh] w-[130%]"
        reverse
      />
      <div
        aria-hidden="true"
        className="stage-light pointer-events-none absolute inset-0"
        style={{ "--stage-x": "22%", "--stage-y": "50%" }}
      />

      <div
        ref={rootRef}
        className="grid w-full items-center gap-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-20"
      >
        <div className="relative max-w-3xl">
          <StarMark className="mb-6 h-4 w-4 text-accent" />

          <SplitText
            as="h1"
            scrub
            className="max-w-3xl text-balance text-[clamp(2.85rem,6.4vw,6.25rem)] font-semibold leading-[1.02] tracking-tight"
            text="Services for Nonprofits That Need Donors, Volunteers, Partners, and Community Trust."
          />

          <SplitText
            as="p"
            className="mt-8 max-w-xl text-base leading-relaxed text-foreground/70 md:text-lg"
            text="Agency 1776 helps nonprofits build the website, messaging, donation pages, volunteer paths, campaign pages, and digital assets needed to grow support around the mission."
          />

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <TacticalButton href="/contact" variant="primary">
              Grow Donor Support
            </TacticalButton>
          </div>
        </div>

        <div
          data-hero-plate
          className="relative mx-auto w-full max-w-[520px] lg:mx-0 lg:justify-self-end"
        >
          <StarField
            count={16}
            seed={41}
            className="absolute -inset-6 opacity-[0.32]"
          />
          <div
            className="angular-panel relative overflow-hidden"
            data-animate-border
            style={{
              "--ap-cut": "28px",
              "--ap-bg": "var(--color-surface)",
              "--ap-border-color":
                "color-mix(in srgb, var(--color-accent) 45%, transparent)",
              aspectRatio: "3 / 4",
            }}
          >
            <img
              src="https://picsum.photos/seed/agency1776-services-hero/900/1200"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity opacity-90"
              loading="eager"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-accent) 18%, transparent)",
              }}
            />
            <span className="tac-bracket tac-bracket-tl" />
            <span className="tac-bracket tac-bracket-br" />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
