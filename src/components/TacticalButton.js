"use client";

import { useLayoutEffect, useRef } from "react";
import NextLink from "next/link";
import { gsap, registerGsap } from "@/animations/gsap";
import { cn } from "@/utils/cn";

/**
 * Chamfered tactical button. Two visual layers — the base plate and a
 * hover sweep (CSS pseudo). GSAP owns two interactions on top:
 *   1. arrow glyph slides forward on hover (letters stay pinned so the
 *      label reads as a fixed callsign, not a shifted string)
 *   2. label letter-spacing widens a hair on hover — reads as the
 *      plate "engaging" without any color change
 * All timings share a single GSAP timeline so entering/leaving is
 * fully reversible under rapid pointer moves.
 */
export function TacticalButton({
  href,
  onClick,
  variant = "primary", // "primary" | "ghost"
  className = "",
  children,
  as,
  ariaLabel,
  ...rest
}) {
  const rootRef = useRef(null);
  const labelRef = useRef(null);
  const arrowRef = useRef(null);
  const tlRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.to(rootRef.current, { y: -2, duration: 0.35 }, 0);
      if (labelRef.current) {
        tl.to(labelRef.current, { letterSpacing: "0.3em", duration: 0.42 }, 0);
      }
      if (arrowRef.current) {
        tl.to(arrowRef.current, { x: 5, duration: 0.4 }, 0);
      }
      tlRef.current = tl;
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const handleEnter = () => tlRef.current?.play();
  const handleLeave = () => tlRef.current?.reverse();

  const Tag = as || (href ? "a" : "button");

  return (
    <Tag
      ref={rootRef}
      href={href}
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      data-cursor="button"
      aria-label={ariaLabel}
      className={cn(
        "tac-btn",
        variant === "primary" ? "tac-btn-primary" : "tac-btn-ghost",
        className
      )}
      {...rest}
    >
      <span ref={labelRef} className="relative z-10 inline-block">
        {children}
      </span>
      <span ref={arrowRef} aria-hidden="true" className="relative z-10 inline-block">
        →
      </span>
    </Tag>
  );
}
