"use client";

import { useLayoutEffect, useRef } from "react";
import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { StarMark } from "@/components/StarMark";
import { StarField } from "@/components/StarField";
import { Ribbon } from "@/components/Ribbon";
import { TacticalButton } from "@/components/TacticalButton";
import { gsap, registerGsap } from "@/animations/gsap";

/**
 * Portfolio Final CTA — cinematic closer with H2, paragraph, and a
 * single CTA. The H2 uses a directional word reveal keyed to scroll
 * arrival; the paragraph rides the shared section reveal.
 */
export function PortfolioCTA() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      const words = rootRef.current.querySelectorAll(
        "[data-portfolio-cta-h2] .rt-word"
      );
      if (words.length) {
        gsap.set(words, { opacity: 0 });
        words.forEach((w, i) => {
          gsap.set(w, { xPercent: i % 2 === 0 ? -28 : 28, y: 22 });
        });
        gsap.to(words, {
          xPercent: 0,
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.03,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-portfolio-cta-h2]",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="flag-stripe-bg pointer-events-none absolute inset-0 opacity-70"
      />
      <Ribbon
        variant="flow"
        tone="accent"
        opacity={0.3}
        width={26}
        className="-left-[10%] top-[24%] h-[46vh] w-[130%]"
      />
      <Ribbon
        variant="fold"
        tone="foreground"
        opacity={0.14}
        width={12}
        className="-right-[10%] top-[54%] h-[36vh] w-[130%]"
        reverse
      />
      <StarField
        count={24}
        seed={149}
        className="absolute inset-0 opacity-[0.32]"
      />
      <SectionShell
        id="portfolio-contact"
        innerClassName="relative mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-28"
      >
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-10 text-center md:gap-14">
          <StarMark className="h-4 w-4 text-accent" />

          <SplitText
            as="h2"
            data-portfolio-cta-h2
            className="text-[clamp(2.25rem,5.6vw,4.75rem)] font-semibold leading-[1.02] tracking-tight"
            text="Want Your Mission Featured Here?"
          />

          <SplitText
            as="p"
            className="max-w-2xl text-base leading-relaxed text-foreground/75 md:text-lg"
            text="Let's build a nonprofit website and digital asset system that helps more people understand the mission, trust the work, and support the cause."
          />

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <TacticalButton href="/contact" variant="primary">
              Start Your Nonprofit Build
            </TacticalButton>
          </div>
        </div>
      </SectionShell>
    </div>
  );
}
