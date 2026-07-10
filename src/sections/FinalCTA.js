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
 * FinalCTA — cinematic finale.
 *  Oversized outline star anchors the composition, sitting behind
 *  the H2. The H2 words slide in from alternating sides on scroll
 *  arrival (directional reveal). A single primary CTA completes the
 *  conversion — the earlier ghost secondary was removed to keep the
 *  finale focused on the one action worth taking.
 */
export function FinalCTA() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      // Directional word reveal on H2 — words come in from alternating
      // sides, opacity fade, then settle. Reads as pieces of a
      // classified doc snapping into place.
      const words = rootRef.current.querySelectorAll(
        "[data-cinematic-h2] .rt-word"
      );
      if (words.length) {
        gsap.set(words, { opacity: 0 });
        words.forEach((w, i) => {
          gsap.set(w, { xPercent: i % 2 === 0 ? -30 : 30, y: 20 });
        });
        gsap.to(words, {
          xPercent: 0,
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-cinematic-h2]",
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // Slow rotation on the backdrop star — depth cue without noise.
      gsap.to("[data-cinematic-star]", {
        rotate: 12,
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
      {/* Full-bleed fabric stripes at ambient alpha */}
      <div
        aria-hidden="true"
        className="flag-stripe-bg pointer-events-none absolute inset-0 opacity-70"
      />
      {/* Two crossing cinematic ribbons behind the finale — both extend
          past the viewport edges so nothing terminates mid-section. */}
      <Ribbon
        variant="flow"
        tone="accent"
        opacity={0.3}
        width={24}
        className="-left-[10%] top-[22%] h-[42vh] w-[125%]"
      />
      <Ribbon
        variant="fold"
        tone="foreground"
        opacity={0.14}
        width={12}
        className="-right-[10%] top-[54%] h-[38vh] w-[125%]"
        reverse
      />
      {/* Constellation backdrop replacing the plain outline star */}
      <StarField
        count={28}
        seed={101}
        className="absolute inset-0 opacity-[0.35]"
      />
      <SectionShell
        id="contact"
        innerClassName="relative mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-28"
      >
        {/* Backdrop star anchor — smaller, sits centered but no longer
            the only cinematic element. */}
        <div
          data-cinematic-star
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <StarMark
            variant="outline"
            strokeWidth={0.35}
            className="h-[50vw] w-[50vw] max-h-[380px] max-w-[380px] text-accent/30"
          />
        </div>

        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-10 text-center md:gap-14">
          <StarMark className="h-4 w-4 text-accent" />

          <SplitText
            as="h2"
            data-cinematic-h2
            className="text-[clamp(2.25rem,5.6vw,4.75rem)] font-semibold leading-[1.02] tracking-tight"
            text="Ready to Move Forward With Your Mission?"
          />

          <div className="flex items-center justify-center pt-2">
            <TacticalButton href="/contact" variant="primary">
              Build Your Nonprofit Website
            </TacticalButton>
          </div>
        </div>
      </SectionShell>
    </div>
  );
}
