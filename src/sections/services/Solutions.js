"use client";

import { useLayoutEffect, useRef } from "react";
import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { StarMark } from "@/components/StarMark";
import { StarField } from "@/components/StarField";
import { Ribbon } from "@/components/Ribbon";
import { GlowFrame } from "@/components/GlowFrame";
import { gsap, registerGsap } from "@/animations/gsap";
import { applyStaggeredGrid } from "@/animations/staggeredGrid";
import { cn } from "@/utils/cn";

const SOLUTIONS = [
  {
    title: "Essential Nonprofit Website",
    body: "For organizations that need a clear digital home with mission, programs, donation, volunteer, and contact pages.",
  },
  {
    title: "Nonprofit Website + Donation Path",
    body: "For organizations that need stronger donation messaging, donor trust sections, giving pages, and recurring gift pathways.",
  },
  {
    title: "Nonprofit Website + Campaign Assets",
    body: "For organizations that need the website plus social posts, fundraising graphics, event assets, and supporter content.",
  },
  {
    title: "Fundraising Campaign Build",
    body: "For organizations launching a specific giving campaign, awareness push, event, drive, or seasonal fundraising effort.",
  },
  {
    title: "Full Supporter Engagement Build",
    body: "For nonprofits that need the website, donation pages, volunteer pages, campaign assets, email copy, and ongoing supporter communication built together.",
  },
];

/**
 * Solutions — layered depth wall of 5 chamfered plates. The middle
 * card lifts forward on desktop (translateY + brighter accent border)
 * so the eye lands there first, then reads outward. No invented body
 * copy — the title is the whole product.
 */
export function Solutions() {
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
    <div ref={rootRef} className="relative overflow-hidden">
      <Ribbon
        variant="flow"
        tone="accent"
        opacity={0.16}
        width={22}
        className="-right-[10%] top-[38%] h-[30vh] w-[130%]"
        reverse
      />
      <SectionShell
        id="services-solutions"
        innerClassName="relative mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24"
      >
        <div className="mb-10 max-w-3xl md:mb-14">
          <SplitText
            as="p"
            className="mb-5 text-[10px] uppercase tracking-[0.32em] text-accent"
            text="Solution Paths"
          />
          <SplitText
            as="h2"
            scrub
            className="text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.05] tracking-tight"
            text="Choose the Support That Fits the Mission."
          />
        </div>

        <ul
          data-staggered-grid
          className="grid gap-6 md:grid-cols-3 lg:gap-8 xl:grid-cols-5"
          style={{ perspective: "1200px" }}
        >
          {SOLUTIONS.map(({ title, body }, i) => {
            const featured = i === 2;
            return (
              <li
                key={title}
                data-col={i}
                data-cursor="card"
                className={cn(
                  "staggered-card relative flex",
                  featured && "xl:-translate-y-8"
                )}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlowFrame
                  as="div"
                  className="flex h-full w-full"
                  radius="26px"
                  opacity={featured ? 0.42 : 0.26}
                  opacityHover={featured ? 0.6 : 0.44}
                  duration={featured ? "12s" : "16s"}
                >
                  <div
                    className={cn(
                      "angular-panel relative flex h-full w-full flex-col gap-6 p-7 md:p-8",
                      featured &&
                        "shadow-[0_18px_60px_-30px_color-mix(in_srgb,var(--color-accent)_60%,transparent)]"
                    )}
                    style={{
                      "--ap-cut": "24px",
                      "--ap-bg": "var(--color-surface)",
                      "--ap-border-color": featured
                        ? "color-mix(in srgb, var(--color-accent) 55%, transparent)"
                        : "color-mix(in srgb, var(--color-foreground) 14%, transparent)",
                      minHeight: "300px",
                    }}
                  >
                    <span className="tac-bracket tac-bracket-tl" />
                    <span className="tac-bracket tac-bracket-br" />
                    {featured && (
                      <StarField
                        count={10}
                        seed={53}
                        className="absolute inset-0 opacity-[0.24]"
                      />
                    )}

                    <StarMark className="h-6 w-6 text-accent" />
                    <SplitText
                      as="h3"
                      className="text-xl font-semibold leading-tight tracking-tight md:text-2xl"
                      text={title}
                    />

                    <div data-animate-seam className="tac-seam" />

                    <SplitText
                      as="p"
                      className="text-sm leading-relaxed text-foreground/75"
                      text={body}
                    />
                  </div>
                </GlowFrame>
              </li>
            );
          })}
        </ul>
      </SectionShell>
    </div>
  );
}
