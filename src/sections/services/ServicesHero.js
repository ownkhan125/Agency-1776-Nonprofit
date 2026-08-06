"use client";

import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { StarMark } from "@/components/StarMark";
import { Ribbon } from "@/components/Ribbon";
import { TacticalButton } from "@/components/TacticalButton";

/**
 * Services Hero — centered editorial lede.
 * A single centered column carries the mission-critical text
 * (H1 + subtext + CTA), framed by ribbons and the tactical grid so the
 * page opens with the copy front and center.
 */
export function ServicesHero() {
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
        style={{ "--stage-x": "50%", "--stage-y": "50%" }}
      />

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <StarMark className="mb-6 h-4 w-4 text-accent" />

        <SplitText
          as="h1"
          scrub
          className="max-w-4xl text-balance text-[clamp(2.85rem,6.4vw,6.25rem)] font-semibold leading-[1.02] tracking-tight"
          text="Services for Nonprofits That Need Donors, Volunteers, Partners, and Community Trust."
        />

        <SplitText
          as="p"
          className="mt-8 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-lg"
          text="We help build the website, donation pages, volunteer paths, fundraising content, supporter follow-up, outreach assets, and ongoing creative support your organization needs to grow participation around the mission."
        />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <TacticalButton href="/contact" variant="primary">
            Grow Donor Support
          </TacticalButton>
        </div>
      </div>
    </SectionShell>
  );
}
