"use client";

import { cn } from "@/utils/cn";

/**
 * 5-point tactical star — SVG so it accepts stroke, fill, and
 * animation without CSS clip-path quirks. Two treatments:
 *   variant="fill"     → solid filled star (bold accent)
 *   variant="outline"  → hairline outline star (subtle motif)
 * Sizing via className (`h-*, w-*`). Color inherits currentColor.
 */
export function StarMark({ variant = "fill", className = "", strokeWidth = 1.4 }) {
  const isOutline = variant === "outline";
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("js-reveal-icon", className)}
      fill={isOutline ? "none" : "currentColor"}
      stroke={isOutline ? "currentColor" : "none"}
      strokeWidth={isOutline ? strokeWidth : 0}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="50,4 61,36 96,36 68,58 79,92 50,72 21,92 32,58 4,36 39,36" />
    </svg>
  );
}
