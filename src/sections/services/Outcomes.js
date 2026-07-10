"use client";

import { useLayoutEffect, useRef } from "react";
import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { StarMark } from "@/components/StarMark";
import { Ribbon } from "@/components/Ribbon";
import { gsap, registerGsap } from "@/animations/gsap";
import { applyStaggeredGrid } from "@/animations/staggeredGrid";
import { cn } from "@/utils/cn";

const OUTCOMES = [
  "Clarify the mission",
  "Explain programs clearly",
  "Show impact",
  "Build donor confidence",
  "Improve donation paths",
  "Recruit volunteers",
  "Grow email lists",
  "Promote events",
  "Support fundraising campaigns",
  "Create consistent social content",
  "Strengthen community credibility",
  "Give supporters a clear next step",
];

/**
 * Outcomes — asymmetric tile grid. The 12 outcomes sit in a 6-column
 * layout on desktop with a few tiles spanning two columns so the grid
 * reads as a handcrafted composition rather than a uniform table.
 * Each tile is a small chamfered plate with a star marker and the
 * outcome as its whole voice.
 */
export function Outcomes() {
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

  // Explicit span layout keeps the composition intentional at md+.
  // On mobile every tile is single-column.
  const spanMap = [
    "md:col-span-2",
    "md:col-span-2",
    "md:col-span-2",
    "md:col-span-3",
    "md:col-span-3",
    "md:col-span-2",
    "md:col-span-2",
    "md:col-span-2",
    "md:col-span-2",
    "md:col-span-2",
    "md:col-span-2",
    "md:col-span-2",
  ];

  return (
    <div ref={rootRef} className="relative overflow-hidden">
      <Ribbon
        variant="fold"
        tone="accent"
        opacity={0.14}
        width={14}
        className="-left-[8%] top-[30%] h-[32vh] w-[130%]"
      />
      <SectionShell
        id="services-outcomes"
        innerClassName="relative mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24"
      >
        <div className="mb-10 max-w-3xl md:mb-14">
          <SplitText
            as="h2"
            scrub
            className="text-[clamp(2rem,4.6vw,3.75rem)] font-semibold uppercase leading-[1.05] tracking-tight"
            text="Nonprofit Outcomes"
          />
          <SplitText
            as="p"
            className="mt-6 text-base leading-relaxed text-foreground/75 md:text-lg"
            text="Agency 1776 nonprofit solutions are designed to help organizations:"
          />
        </div>

        <ul
          data-staggered-grid
          className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5"
        >
          {OUTCOMES.map((outcome, i) => {
            const alt = (i + 1) % 3 === 0;
            return (
              <li
                key={outcome}
                data-col={i % 6}
                data-cursor="card"
                className={cn("staggered-card", spanMap[i])}
              >
                <div
                  className={cn(
                    "angular-panel relative flex h-full items-center gap-4 p-6 md:p-7",
                    alt && "angular-panel-alt"
                  )}
                  style={{
                    "--ap-cut": "18px",
                    "--ap-bg": "var(--color-surface)",
                    "--ap-border-color":
                      "color-mix(in srgb, var(--color-foreground) 14%, transparent)",
                    minHeight: "104px",
                  }}
                >
                  <span className="tac-bracket tac-bracket-tl" />
                  <span className="tac-bracket tac-bracket-br" />
                  <StarMark className="h-4 w-4 shrink-0 text-accent" />
                  <SplitText
                    as="p"
                    className="text-base font-medium leading-tight tracking-tight text-foreground md:text-lg"
                    text={outcome}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </SectionShell>
    </div>
  );
}
