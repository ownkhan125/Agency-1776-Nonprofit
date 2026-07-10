"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";

/**
 * Wraps content with a subtle rotating accent halo behind it.
 *
 * The halo's rotation is a CSS `@property --glow-angle` conic-gradient
 * animation. Cheap on the GPU when running, but 26 continuously
 * rotating halos across a long page still burned frame budget on
 * /services. To keep only the halos the reader can actually see doing
 * work, we attach an IntersectionObserver here that flips the
 * wrapper's `data-anim-visible` attribute on/off — the CSS pauses the
 * animation by default and only un-pauses when this attribute is set.
 * Off-screen halos then cost nothing.
 *
 * Skipped when `prefers-reduced-motion` is set (the CSS already stops
 * the animation there too, but we avoid churning DOM attrs).
 *
 * Tuning props map to CSS custom properties on the wrapper. Leave
 * unset to inherit defaults from globals.css. Every dimension is
 * length-string (e.g. "-10px", "0.9rem"); opacities are numbers.
 */
export function GlowFrame({
  as: Tag = "div",
  className,
  style,
  inset,
  radius,
  blur,
  opacity,
  opacityHover,
  duration,
  haloClassName,
  children,
  ...rest
}) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.setAttribute("data-anim-visible", "");
          } else {
            el.removeAttribute("data-anim-visible");
          }
        });
      },
      { rootMargin: "10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cssVars = {};
  if (inset != null) cssVars["--glow-inset"] = inset;
  if (radius != null) cssVars["--glow-radius"] = radius;
  if (blur != null) cssVars["--glow-blur"] = blur;
  if (opacity != null) cssVars["--glow-opacity"] = opacity;
  if (opacityHover != null) cssVars["--glow-opacity-hover"] = opacityHover;
  if (duration != null) cssVars["--glow-duration"] = duration;

  return (
    <Tag
      ref={wrapperRef}
      className={cn("glow-frame", className)}
      style={{ ...cssVars, ...style }}
      {...rest}
    >
      <span aria-hidden="true" className={cn("glow-frame__halo", haloClassName)} />
      {children}
    </Tag>
  );
}
