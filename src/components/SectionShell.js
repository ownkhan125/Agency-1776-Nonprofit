"use client";

import { cn } from "@/utils/cn";
import { useSectionReveal } from "@/hooks/useSectionReveal";

/**
 * Section wrapper that:
 *   - attaches useSectionReveal's scope ref
 *   - draws an animated SVG border rect that fills the container
 *   - provides consistent vertical rhythm + max width
 *
 * `borderInset` controls how the outline sits relative to the section.
 * `bare` skips the border for sections where a full-bleed hero owns
 * the space (like the hero — passed as `withBorder={false}`).
 */
export function SectionShell({
  id,
  className = "",
  innerClassName = "",
  withBorder = true,
  cornerRadius = 24,
  revealMode,
  children,
  as: Tag = "section",
}) {
  const scope = useSectionReveal();

  return (
    <Tag
      id={id}
      ref={scope}
      data-reveal-mode={revealMode || undefined}
      className={cn("relative isolate", className)}
    >
      {withBorder ? (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <rect
            className="js-section-border"
            x="0.25"
            y="0.25"
            width="99.5"
            height="99.5"
            rx={cornerRadius / 20}
            ry={cornerRadius / 20}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="0.08"
            pathLength="1"
            vectorEffect="non-scaling-stroke"
            style={{ color: "var(--color-muted)" }}
          />
        </svg>
      ) : null}
      <div className={cn("relative", innerClassName)}>{children}</div>
    </Tag>
  );
}
