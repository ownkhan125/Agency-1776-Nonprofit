"use client";

import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { StarMark } from "@/components/StarMark";
import { StarField } from "@/components/StarField";
import { Ribbon } from "@/components/Ribbon";
import { TacticalDivider } from "@/components/TacticalDivider";

/**
 * Contact Close — closing beat that carries only the user's supplied
 * H2 ("Start With the Mission."). The brief was explicit: no extra
 * paragraphs, no CTA, no cards, no marketing copy — just the heading.
 *
 * Visual composition matches the site's other cinematic outro beats
 * (FinalCTA on home, ServicesFinalCTA on /services): a centered
 * heading over a starfield + crossing ribbons, so the /contact page
 * ends in the same register even though the content itself is a
 * single line.
 */
export function ContactClose() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="flag-stripe-bg pointer-events-none absolute inset-0 opacity-60"
      />
      <Ribbon
        variant="flow"
        tone="accent"
        opacity={0.3}
        width={22}
        className="-left-[10%] top-[28%] h-[38vh] w-[125%]"
      />
      <Ribbon
        variant="fold"
        tone="foreground"
        opacity={0.14}
        width={12}
        className="-right-[10%] top-[52%] h-[34vh] w-[125%]"
        reverse
      />
      <StarField
        count={26}
        seed={107}
        className="absolute inset-0 opacity-[0.35]"
      />

      <SectionShell
        id="contact-close"
        innerClassName="relative mx-auto max-w-[1600px] px-6 py-24 text-center md:px-10 md:py-32"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <StarMark
            variant="outline"
            strokeWidth={0.35}
            className="h-[46vw] w-[46vw] max-h-[360px] max-w-[360px] text-accent/30"
          />
        </div>

        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-10 md:gap-14">
          <StarMark className="h-4 w-4 text-accent" />

          <SplitText
            as="h2"
            scrub
            className="text-[clamp(2.25rem,5.6vw,4.75rem)] font-semibold leading-[1.02] tracking-tight"
            text="Start With the Mission."
          />

          <div className="w-full max-w-2xl">
            <TacticalDivider label="End of Brief · Agency 1776" accent />
          </div>
        </div>
      </SectionShell>
    </div>
  );
}
