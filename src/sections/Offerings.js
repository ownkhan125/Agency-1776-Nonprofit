"use client";

import { useLayoutEffect, useRef } from "react";
import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { StarField } from "@/components/StarField";
import { Ribbon } from "@/components/Ribbon";
import { TacticalButton } from "@/components/TacticalButton";
import { GlowFrame } from "@/components/GlowFrame";
import { gsap, registerGsap } from "@/animations/gsap";
import { applyStaggeredGrid } from "@/animations/staggeredGrid";
import { cn } from "@/utils/cn";

const OFFERINGS = [
  {
    title: "Essential Nonprofit Website",
    body: "For organizations that need a clear digital home with mission, programs, donation, volunteer, and contact pages.",
  },
  {
    title: "Growth Nonprofit Website",
    body: "For nonprofits that need impact proof, campaign pages, supporter capture, event promotion, and stronger donor pathways.",
  },
  {
    title: "Full Supporter Engagement Build",
    body: "For organizations that need the website, donation campaign assets, social content, email copy, landing pages, and ongoing supporter communication.",
  },
];

export function Offerings() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      const grid = rootRef.current?.querySelector("[data-staggered-grid]");
      applyStaggeredGrid(grid);

      gsap.utils.toArray("[data-offer-card]").forEach((card) => {
        const el = card;
        const inner = el.querySelector("[data-offer-inner]");
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        tl.to(inner, { y: -6, rotationX: 4, duration: 0.5 }, 0);
        el.addEventListener("mouseenter", () => tl.play());
        el.addEventListener("mouseleave", () => tl.reverse());
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative overflow-hidden">
      {/* Quiet ribbon curving in from top-right — spans the full width
          so it never terminates mid-air behind the tier plates. */}
      <Ribbon
        variant="fold"
        tone="accent"
        opacity={0.14}
        width={12}
        className="-right-[10%] top-[8%] h-[28vh] w-[130%]"
      />
      <SectionShell
        id="options"
        innerClassName="relative mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24"
      >
        <div className="mb-10 flex flex-col gap-6 md:mb-14">
          <div className="max-w-3xl">
            <SplitText
              as="h2"
              scrub
              className="text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.05] tracking-tight"
              text="Find the Right Build"
            />
            <SplitText
              as="p"
              className="mt-6 text-xl font-medium leading-snug tracking-tight text-foreground/85 md:text-2xl"
              text="Choose the Website Support That Fits Your Mission."
            />
            <SplitText
              as="p"
              className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-lg"
              text="Every nonprofit is different. Agency 1776 helps you choose the website support that fits your organization's goals."
            />
          </div>
        </div>

        <ul
          data-staggered-grid
          className="grid gap-6 md:grid-cols-3 md:items-start lg:gap-10"
          style={{ perspective: "1200px" }}
        >
          {OFFERINGS.map((o, i) => {
            const lifted = i === 1;
            // Staircase composition — outer plates drop below the
            // baseline, middle plate sits highest. Reads as a tiered
            // display case rather than a flat three-up grid, without
            // affecting the mobile stack (offsets are md+ only).
            const offset =
              i === 0
                ? "md:translate-y-10"
                : i === 1
                ? "md:-translate-y-6"
                : "md:translate-y-4";
            return (
              <li
                key={o.title}
                data-offer-card
                data-col={i}
                data-cursor="card"
                className={cn("staggered-card relative", offset)}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlowFrame
                  as="div"
                  data-offer-inner
                  className="flex h-full w-full"
                  radius="26px"
                  opacity={lifted ? 0.42 : 0.28}
                  opacityHover={lifted ? 0.6 : 0.48}
                  duration={lifted ? "12s" : "16s"}
                >
                  <div
                    className={cn(
                      "angular-panel relative flex h-full w-full flex-col gap-8 p-8 md:p-10",
                      lifted && "shadow-[0_18px_60px_-30px_color-mix(in_srgb,var(--color-accent)_60%,transparent)]"
                    )}
                    style={{
                      "--ap-cut": "26px",
                      "--ap-bg": "var(--color-surface)",
                      "--ap-border-color": lifted
                        ? "color-mix(in srgb, var(--color-accent) 55%, transparent)"
                        : "color-mix(in srgb, var(--color-foreground) 14%, transparent)",
                    }}
                  >
                    <span className="tac-bracket tac-bracket-tl" />
                    <span className="tac-bracket tac-bracket-br" />
                    {lifted && (
                      <StarField
                        count={10}
                        seed={53}
                        className="absolute inset-0 opacity-[0.22]"
                      />
                    )}

                    <SplitText
                      as="h3"
                      className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl"
                      text={o.title}
                    />

                    <div data-animate-seam className="tac-seam" />

                    <SplitText
                      as="p"
                      className="text-base leading-relaxed text-foreground/75"
                      text={o.body}
                    />
                  </div>
                </GlowFrame>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 flex justify-center md:mt-16">
          <TacticalButton href="/contact" variant="primary">
            Find My Website Build
          </TacticalButton>
        </div>
      </SectionShell>
    </div>
  );
}
