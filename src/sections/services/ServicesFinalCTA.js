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
 * Services Final CTA — cinematic closer. Wide horizontal composition
 * with a constellation backdrop, two crossing ribbons, and the H2's
 * words riding a directional scroll reveal. Single conversion action.
 */
export function ServicesFinalCTA() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      const words = rootRef.current.querySelectorAll(
        "[data-services-cta-h2] .rt-word"
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
            trigger: "[data-services-cta-h2]",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });
      }

      gsap.to("[data-services-cta-star]", {
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
        className="-left-[10%] top-[20%] h-[46vh] w-[130%]"
      />
      <Ribbon
        variant="fold"
        tone="foreground"
        opacity={0.14}
        width={12}
        className="-right-[10%] top-[52%] h-[38vh] w-[130%]"
        reverse
      />
      <StarField
        count={28}
        seed={131}
        className="absolute inset-0 opacity-[0.35]"
      />
      <SectionShell
        id="services-contact"
        innerClassName="relative mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-28"
      >
        <div
          data-services-cta-star
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
            data-services-cta-h2
            className="text-[clamp(2.25rem,5.6vw,4.75rem)] font-semibold leading-[1.02] tracking-tight"
            text="Let's Help More People Support Your Work."
          />

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <TacticalButton href="/contact" variant="primary">
              Start the Conversation
            </TacticalButton>
          </div>
        </div>
      </SectionShell>
    </div>
  );
}
