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
 * Build Finder Final CTA — cinematic closer mirroring the other page
 * finales. Directional word reveal on the H2, slow star rotation on the
 * backdrop, single conversion action into /contact.
 */
export function BuildFinderCTA() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      const words = rootRef.current.querySelectorAll(
        "[data-bf-cta-h2] .rt-word"
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
          duration: 0.85,
          stagger: 0.045,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-bf-cta-h2]",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });
      }

      gsap.to("[data-bf-cta-star]", {
        rotate: 10,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
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
        className="-left-[10%] top-[22%] h-[46vh] w-[130%]"
      />
      <Ribbon
        variant="fold"
        tone="foreground"
        opacity={0.14}
        width={12}
        className="-right-[10%] top-[54%] h-[38vh] w-[130%]"
        reverse
      />
      <StarField
        count={26}
        seed={113}
        className="absolute inset-0 opacity-[0.35]"
      />
      <SectionShell
        id="build-finder-contact"
        innerClassName="relative mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-28"
      >
        <div
          data-bf-cta-star
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <StarMark
            variant="outline"
            strokeWidth={0.35}
            className="h-[46vw] w-[46vw] max-h-[360px] max-w-[360px] text-accent/28"
          />
        </div>

        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-10 text-center md:gap-14">
          <StarMark className="h-4 w-4 text-accent" />

          <SplitText
            as="h2"
            data-bf-cta-h2
            className="text-[clamp(2.25rem,5.6vw,4.75rem)] font-semibold leading-[1.02] tracking-tight"
            text="Start With the Mission. Build the Support Around It."
          />

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <TacticalButton href="/contact" variant="primary">
              Contact Us
            </TacticalButton>
          </div>
        </div>
      </SectionShell>
    </div>
  );
}
