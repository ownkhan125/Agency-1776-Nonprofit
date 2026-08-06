"use client";

import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { StarField } from "@/components/StarField";
import { Ribbon } from "@/components/Ribbon";
import { StarMark } from "@/components/StarMark";
import { TacticalDivider } from "@/components/TacticalDivider";

/**
 * Build Finder Hero — centered cinematic lede mirroring the other page
 * heroes (/contact, /portfolio). Typography-only: H1 + subtext, no CTA
 * (the reader scrolls straight into the finder below). One-shot reveal
 * so the hero doesn't replay in reverse on scroll-up.
 */
export function BuildFinderHero() {
  return (
    <SectionShell
      id="build-finder-hero"
      withBorder={false}
      revealMode="once"
      className="relative flex min-h-[max(680px,100svh)] items-center overflow-hidden scanlines"
      innerClassName="relative z-10 mx-auto w-full max-w-[1600px] px-6 pt-32 pb-16 sm:pt-36 md:px-10 md:pt-40 md:pb-20 lg:pt-44"
    >
      <div
        aria-hidden="true"
        className="tactical-grid pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="flag-stripe-bg pointer-events-none absolute inset-0 opacity-60"
      />
      <Ribbon
        variant="flow"
        tone="accent"
        opacity={0.32}
        width={24}
        className="-left-[10%] top-[62%] h-[26vh] w-[130%]"
      />
      <Ribbon
        variant="fold"
        tone="foreground"
        opacity={0.14}
        width={12}
        className="-right-[10%] top-[16%] h-[24vh] w-[130%]"
        reverse
      />
      <StarField
        count={22}
        seed={61}
        className="absolute inset-0 opacity-[0.32]"
      />
      <div
        aria-hidden="true"
        className="stage-light pointer-events-none absolute inset-0"
        style={{ "--stage-x": "50%", "--stage-y": "50%" }}
      />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <div className="mb-8 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-foreground/60 md:text-[13px]">
          <StarMark className="h-3 w-3 text-accent" />
          <span>Build Finder · Agency 1776</span>
          <span className="text-foreground/25">/</span>
          <span className="text-foreground/45">Nonprofit</span>
        </div>

        <SplitText
          as="h1"
          scrub
          className="text-balance text-[clamp(2.85rem,6.4vw,6.25rem)] font-semibold leading-[1.02] tracking-tight"
          text="Find the Right Support for Your Mission."
        />

        <SplitText
          as="p"
          className="mt-8 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-lg"
          text="Use the build finder to identify the website, giving path, fundraising content, volunteer support, outreach assets, and ongoing monthly support that fit your organization."
        />

        <div className="mt-10 w-full max-w-2xl md:mt-14">
          <TacticalDivider
            label="Sector 01 · Match the Mission"
            labelClassName="text-[11px] font-medium"
            accent
          />
        </div>
      </div>
    </SectionShell>
  );
}
