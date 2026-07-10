"use client";

import { useLayoutEffect, useRef } from "react";
import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { Ribbon } from "@/components/Ribbon";
import { gsap, registerGsap } from "@/animations/gsap";
import { cn } from "@/utils/cn";

const STEPS = [
  {
    title: "Understand the Mission",
    body: "We learn what your organization does, who it serves, what support you need, and what people must understand before they act.",
  },
  {
    title: "Organize the Story",
    body: "We shape the mission message, program structure, donation language, volunteer path, and trust-building content.",
  },
  {
    title: "Build the Website",
    body: "We create a nonprofit website designed to explain the work, show credibility, and guide people toward support.",
  },
  {
    title: "Prepare Supporter Assets",
    body: "We create digital content your organization can use for fundraising, volunteer recruitment, events, updates, and awareness.",
  },
  {
    title: "Launch With a Clear Giving Path",
    body: "Your organization launches with a website that helps people understand the mission, trust the work, and take the next step.",
  },
];

export function Process() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-process-row]").forEach((row) => {
        const titleEl = row.querySelector("[data-process-title]");
        const bodyEl = row.querySelector("[data-process-body]");
        const dir = row.dataset.dir === "rtl" ? -1 : 1;

        gsap.fromTo(
          titleEl,
          { xPercent: 12 * dir, opacity: 0 },
          {
            xPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
        gsap.fromTo(
          bodyEl,
          { xPercent: -8 * dir, opacity: 0 },
          {
            xPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: 0.12,
            scrollTrigger: {
              trigger: row,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative overflow-hidden">
      {/* Long horizontal ribbon threading behind the phases — spans the
          full width so both ends live off-screen. */}
      <Ribbon
        variant="flow"
        tone="accent"
        opacity={0.16}
        width={18}
        className="-left-[10%] top-[36%] h-[30vh] w-[130%]"
        reverse
      />
      <SectionShell
        id="process"
        innerClassName="relative mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24"
      >
        <div className="mb-10 max-w-2xl md:mb-14">
          <SplitText
            as="h2"
            scrub
            className="text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.05] tracking-tight"
            text="The Build Experience"
          />
        </div>

        <div className="flex flex-col">
          {STEPS.map(({ title, body }, i) => {
            const isRTL = i % 2 === 1;
            return (
              <div key={title} className="relative">
                <div
                  data-process-row
                  data-dir={isRTL ? "rtl" : "ltr"}
                  className={cn(
                    "grid items-center gap-8 py-8 md:gap-16 md:py-12",
                    isRTL
                      ? "md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
                      : "md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]"
                  )}
                >
                  <div
                    data-process-title
                    className={cn(
                      "relative flex items-center",
                      isRTL ? "md:order-2 md:justify-end" : "md:order-1"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 -left-1 hidden w-0.5 bg-accent md:block"
                      style={{ [isRTL ? "left" : "right"]: "auto" }}
                    />
                    <SplitText
                      as="h3"
                      className="text-[clamp(1.75rem,3.6vw,3rem)] font-semibold leading-[1.05] tracking-tight text-foreground"
                      text={title}
                    />
                  </div>

                  <div
                    data-process-body
                    className={cn(
                      "flex flex-col gap-4",
                      isRTL ? "md:order-1" : "md:order-2"
                    )}
                  >
                    <SplitText
                      as="p"
                      className="text-base leading-relaxed text-foreground/75 md:text-lg"
                      text={body}
                    />
                    <div data-animate-seam className="tac-seam md:max-w-md" />
                  </div>
                </div>

                {i < STEPS.length - 1 && <div data-animate-seam className="tac-seam" />}
              </div>
            );
          })}
        </div>
      </SectionShell>
    </div>
  );
}
