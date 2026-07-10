"use client";

import { useLayoutEffect, useRef } from "react";
import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { StarMark } from "@/components/StarMark";
import { Ribbon } from "@/components/Ribbon";
import { GlowFrame } from "@/components/GlowFrame";
import { gsap, registerGsap } from "@/animations/gsap";
import { applyStaggeredGrid } from "@/animations/staggeredGrid";
import { cn } from "@/utils/cn";

const DELIVERABLES = [
  {
    title: "Nonprofit Websites",
    body: "A mission-focused website built to explain the work, show credibility, and guide donors, volunteers, and partners toward action.",
  },
  {
    title: "Mission Messaging",
    body: "Clear language that explains the problem, the people served, the impact created, and why support matters.",
  },
  {
    title: "Donation Pages",
    body: "Giving pages built to reduce friction, build confidence, and make one-time or recurring donations easier to complete.",
  },
  {
    title: "Volunteer Signup Pages",
    body: "Clear volunteer pathways that explain who can help, what they can do, and how to get involved.",
  },
  {
    title: "Program and Impact Pages",
    body: "Pages that organize your services, initiatives, outcomes, stories, and proof of progress.",
  },
  {
    title: "Fundraising Campaign Pages",
    body: "Focused pages for seasonal drives, emergency campaigns, giving days, sponsorship pushes, and awareness campaigns.",
  },
  {
    title: "Social Media and Fundraising Assets",
    body: "Digital graphics, captions, campaign content, donor appeals, thank-you posts, event promotions, and supporter updates.",
  },
  {
    title: "Email and Supporter Copy",
    body: "Messages for donors, volunteers, partners, event attendees, newsletter subscribers, and recurring supporters.",
  },
];

/**
 * Deliverables — asymmetric wall of chamfered plates. Cards are laid
 * across a 4-column grid on desktop but each row alternates its
 * vertical offset so the wall reads as a slightly staggered display
 * case rather than a flat table. No card carries invented body copy;
 * the title is the whole product.
 */
export function Deliverables() {
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
        opacity={0.18}
        width={20}
        className="-right-[10%] top-[26%] h-[36vh] w-[130%]"
        reverse
      />
      <SectionShell
        id="services-deliverables"
        innerClassName="relative mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24"
      >
        <div className="mb-10 max-w-3xl md:mb-14">
          <SplitText
            as="h2"
            scrub
            className="text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.05] tracking-tight"
            text="We Build The Digital Pieces That Help Supporters Say Yes."
          />
        </div>

        <ul
          data-staggered-grid
          className="grid gap-5 sm:grid-cols-2 md:grid-cols-4 md:gap-6 lg:gap-7"
          style={{ perspective: "1200px" }}
        >
          {DELIVERABLES.map(({ title, body }, i) => {
            const col = i % 4;
            const raised = i % 2 === 0;
            const alt = (i + 1) % 3 === 0;
            return (
              <li
                key={title}
                data-col={col}
                data-cursor="card"
                className={cn(
                  "staggered-card relative flex",
                  raised && "md:-translate-y-4",
                  !raised && "md:translate-y-4"
                )}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlowFrame
                  as="div"
                  className="flex h-full w-full"
                  radius="24px"
                  opacity={raised ? 0.34 : 0.24}
                  opacityHover={raised ? 0.5 : 0.4}
                  duration={raised ? "13s" : "17s"}
                >
                  <div
                    className={cn(
                      "angular-panel relative flex h-full w-full flex-col gap-5 p-6 md:p-7",
                      alt && "angular-panel-alt"
                    )}
                    style={{
                      "--ap-cut": "20px",
                      "--ap-bg": "var(--color-surface)",
                      "--ap-border-color":
                        "color-mix(in srgb, var(--color-foreground) 14%, transparent)",
                      minHeight: "260px",
                    }}
                  >
                    <span className="tac-bracket tac-bracket-tl" />
                    <span className="tac-bracket tac-bracket-br" />

                    <StarMark className="h-5 w-5 text-accent" />

                    <SplitText
                      as="h3"
                      className="text-lg font-semibold leading-tight tracking-tight md:text-xl"
                      text={title}
                    />

                    <div data-animate-seam className="tac-seam" />

                    <SplitText
                      as="p"
                      className="text-sm leading-relaxed text-foreground/70"
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
