"use client";

import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { Ribbon } from "@/components/Ribbon";

export function Approach() {
  return (
    <div className="relative overflow-hidden">
      {/* Fabric fold ribbon — spans the whole section so it enters and
          exits off-screen instead of terminating mid-air. */}
      <Ribbon
        variant="fold"
        tone="accent"
        opacity={0.22}
        width={14}
        className="-left-[8%] top-[22%] h-[36vh] w-[130%] md:h-[32vh]"
      />
      <SectionShell
        id="approach"
        innerClassName="relative mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24"
      >
        <div
          data-animate-border
          className="angular-panel relative mx-auto max-w-4xl p-8 md:p-14"
          style={{
            "--ap-cut": "22px",
            "--ap-bg": "var(--color-surface)",
            "--ap-border-color":
              "color-mix(in srgb, var(--color-foreground) 12%, transparent)",
          }}
        >
          <span className="tac-bracket tac-bracket-tl" />
          <span className="tac-bracket tac-bracket-br" />

          <SplitText
            as="p"
            className="mb-6 text-[10px] uppercase tracking-[0.32em] text-accent"
            text="Why the website matters"
          />
          <SplitText
            as="h2"
            scrub
            className="text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.05] tracking-tight"
            text="Before People Give, They Need a Reason to Trust."
          />

          <div data-animate-seam className="mt-8 tac-seam" />

          <SplitText
            as="p"
            className="mt-8 max-w-2xl text-base leading-relaxed text-foreground/75 md:text-lg"
            text="A strong nonprofit website helps people understand your mission, gives them a platform to understand the message clearly, and helps a nonprofit earn support. Build it right."
          />
        </div>
      </SectionShell>
    </div>
  );
}
