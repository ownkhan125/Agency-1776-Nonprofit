"use client";

import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { StarField } from "@/components/StarField";
import { Ribbon } from "@/components/Ribbon";
import { StarMark } from "@/components/StarMark";

/**
 * Portfolio Hero — centered cinematic composition. Big H1, single
 * subtext, no CTA (none in the provided copy). One-shot reveal so
 * the hero doesn't play in reverse when the reader scrolls back up.
 */
export function PortfolioHero() {
  return (
    <SectionShell
      id="portfolio-hero"
      withBorder={false}
      revealMode="once"
      className="relative flex min-h-[92svh] items-center overflow-hidden scanlines"
      innerClassName="relative z-10 mx-auto w-full max-w-[1600px] px-6 py-20 md:px-10 md:py-28"
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
        seed={37}
        className="absolute inset-0 opacity-[0.32]"
      />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <StarMark className="mb-6 h-4 w-4 text-accent" />
        <SplitText
          as="h1"
          scrub
          className="text-[clamp(4rem,11vw,10rem)] font-semibold uppercase leading-[0.92] tracking-tight"
          text="Our Work"
        />
        <SplitText
          as="p"
          className="mt-10 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-lg"
          text="Our work showcases nonprofit websites, donation pages, campaign pages, and digital assets designed to help organizations explain their mission and make support easier."
        />
      </div>
    </SectionShell>
  );
}
