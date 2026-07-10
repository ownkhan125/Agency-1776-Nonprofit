"use client";

import { useLayoutEffect, useRef } from "react";
import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { StarMark } from "@/components/StarMark";
import { StarField } from "@/components/StarField";
import { GlowFrame } from "@/components/GlowFrame";
import { gsap, registerGsap } from "@/animations/gsap";
import { applyStaggeredGrid } from "@/animations/staggeredGrid";
import { cn } from "@/utils/cn";

const SUPPORTER_LINES = [
  "A new visitor should be able to understand the mission quickly.",
  "A donor should feel confident before giving.",
  "A volunteer should know where they fit.",
  "A partner should see the value of getting involved.",
  "A returning supporter should know what is happening next.",
];

export function Journey() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      const grid = rootRef.current?.querySelector("[data-staggered-grid]");
      applyStaggeredGrid(grid);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative" style={{ overflowX: "clip" }}>
      <SectionShell
        id="journey"
        innerClassName="mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24"
      >
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-24">
          <div className="relative">
            <div
              aria-hidden="true"
              className="flag-stripe-v pointer-events-none absolute inset-y-0 left-0 w-full opacity-70"
            />
            <StarField
              count={12}
              seed={9}
              className="absolute -left-2 top-8 h-32 w-32 opacity-[0.32]"
            />
            <div className="relative lg:sticky lg:top-32 flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <StarMark className="h-5 w-5 text-accent" />
              </div>

              <SplitText
                as="h2"
                scrub
                className="text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.05] tracking-tight"
                text="Built Around Supporter Decisions."
              />

              <SplitText
                as="p"
                className="max-w-md text-base leading-relaxed text-foreground/70"
                text="People do not support a mission just because a donate button exists. They support when they understand the need, connect with the story, trust the organization, and feel that their action can make a difference."
              />
              <SplitText
                as="p"
                className="max-w-md text-base leading-relaxed text-foreground/85"
                text="Agency 1776 builds nonprofit websites around that journey."
              />
            </div>
          </div>

          <div
            data-staggered-grid
            className="relative flex flex-col gap-8 md:gap-12"
          >
            {/* Journey spine — subtle vertical gradient line running
                behind the cards, reads as a supporter trail linking
                the five decisions together. Only shown at md+ so it
                doesn't fight the mobile stack. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-8 left-[2%] hidden w-px bg-accent/30 md:block"
            />
            {SUPPORTER_LINES.map((line, i) => {
              const alt = i % 2 === 1;
              const col = i % 3;
              // Alternate cards nudge right + trim narrower — creates
              // a trail feel down the column while keeping the tallest
              // cards (odd) hugging the panel's outer edge. On mobile
              // the offset collapses so cards remain full-width.
              const layout = alt
                ? "md:ml-auto md:w-[92%] lg:w-[88%]"
                : "md:mr-auto md:w-[97%] lg:w-full";
              return (
                <GlowFrame
                  as="article"
                  key={line}
                  data-col={col}
                  data-cursor="card"
                  className={cn("staggered-card", layout)}
                  radius="24px"
                >
                  <div
                    className={cn(
                      "angular-panel relative flex flex-col gap-6 p-8 md:p-10",
                      alt && "angular-panel-alt"
                    )}
                    style={{
                      "--ap-cut": "24px",
                      "--ap-bg": "var(--color-surface)",
                      "--ap-border-color":
                        "color-mix(in srgb, var(--color-foreground) 14%, transparent)",
                    }}
                  >
                    <span className="tac-bracket tac-bracket-tl" />
                    <span className="tac-bracket tac-bracket-br" />

                    <SplitText
                      as="p"
                      className="text-lg leading-snug tracking-tight text-foreground md:text-xl"
                      text={line}
                    />
                  </div>
                </GlowFrame>
              );
            })}
          </div>
        </div>
      </SectionShell>
    </div>
  );
}
