"use client";

import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { StarMark } from "@/components/StarMark";
import { StarField } from "@/components/StarField";
import { Ribbon } from "@/components/Ribbon";
import { TacticalButton } from "@/components/TacticalButton";
import { TacticalDivider } from "@/components/TacticalDivider";
import { ScrollSmoother } from "@/animations/gsap";

// Smooth-scroll to the form on the same page without setting a URL
// hash — keeps navigation strictly page-based (audit rule) while still
// giving the reader the "jump to the form" affordance they expect.
function scrollToForm() {
  if (typeof window === "undefined") return;
  const target = document.getElementById("contact-form");
  if (!target) return;
  const smoother = ScrollSmoother.get?.();
  if (smoother) {
    smoother.scrollTo(target, true, "top 100px");
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * Contact Hero — typography-only editorial spread.
 *
 * Image plate dropped per the latest brief; the page now leans on
 * headline weight, subtext rhythm, and the site's ambient backdrop
 * (tactical grid, flag stripes, crossing ribbons, starfields, stage
 * light). Centered composition inside a max-w-4xl column mirrors the
 * homepage Hero so /contact opens in the same visual register as the
 * other primary sections.
 *
 * Vertical rhythm matches the site: `min-h-[100svh]` outer, `py-24
 * md:py-32` inner, top-offset absorbs the fixed TopBar + NavBar (56px
 * TopBar area + ~60px navbar pill + breathing room). Uses SectionShell
 * to inherit the standard reveal scope.
 */
export function ContactHero() {
  return (
    <SectionShell
      id="contact-hero"
      withBorder={false}
      revealMode="once"
      className="relative flex min-h-[100svh] items-center overflow-hidden scanlines"
      innerClassName="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col justify-center px-6 pb-24 pt-40 md:px-10 md:pb-32 md:pt-44"
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
        opacity={0.28}
        width={22}
        className="-left-[10%] top-[60%] h-[24vh] w-[130%] md:top-[66%] md:h-[22vh]"
      />
      <Ribbon
        variant="fold"
        tone="foreground"
        opacity={0.12}
        width={10}
        className="-right-[10%] top-[14%] h-[22vh] w-[120%]"
        reverse
      />
      <StarField
        count={18}
        seed={53}
        className="absolute right-6 top-24 z-[1] h-40 w-56 opacity-[0.3] md:right-14 md:top-32 md:h-56 md:w-72"
      />
      <StarField
        count={14}
        seed={71}
        className="absolute bottom-24 left-6 z-[1] h-32 w-44 opacity-[0.24] md:bottom-32 md:left-12 md:h-40 md:w-56"
      />
      <div
        aria-hidden="true"
        className="stage-light pointer-events-none absolute inset-0"
        style={{ "--stage-x": "50%", "--stage-y": "50%" }}
      />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <div className="mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-foreground/60 md:text-xs">
          <StarMark className="h-3 w-3 text-accent" />
          <span>Contact · Agency 1776</span>
          <span className="text-foreground/25">/</span>
          <span className="text-foreground/45">Nonprofit</span>
        </div>

        <SplitText
          as="h1"
          scrub
          className="text-[clamp(3.4rem,8.6vw,8rem)] font-semibold leading-[0.93] tracking-tight"
          text="Tell Us About the Mission."
        />

        <SplitText
          as="p"
          className="mt-8 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-lg"
          text="Need a nonprofit website, donation page, volunteer path, fundraising campaign, social assets, or full digital support?"
        />
        <SplitText
          as="p"
          className="mt-5 max-w-2xl text-lg font-medium leading-snug tracking-tight text-foreground md:text-xl"
          text="Start here."
        />
        <SplitText
          as="p"
          className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-lg"
          text="Tell us what your organization does, who you serve, and what kind of support you need. Agency 1776 will help identify the right next step for your nonprofit."
        />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <TacticalButton onClick={scrollToForm} variant="primary">
            Submit Nonprofit Inquiry
          </TacticalButton>
        </div>

        <div className="mt-10 w-full max-w-2xl md:mt-14">
          <TacticalDivider label="Sector 01 · Start the Brief" accent />
        </div>
      </div>
    </SectionShell>
  );
}
