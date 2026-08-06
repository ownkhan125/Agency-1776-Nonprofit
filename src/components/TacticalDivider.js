"use client";

import { cn } from "@/utils/cn";

/**
 * Segmented tactical hairline — reads as a mission-briefing fold
 * seam. Optional label sits centered over the line with negative
 * margins so it interrupts the seam like a stamped classification.
 */
export function TacticalDivider({
  label,
  className = "",
  labelClassName = "",
  accent = false,
}) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <span className={cn("tac-seam flex-1", accent && "tac-seam-accent")} />
      {label ? (
        <span
          className={cn(
            "mx-4 whitespace-nowrap uppercase tracking-[0.32em]",
            accent ? "text-accent" : "text-foreground/55",
            labelClassName || "text-[10px]"
          )}
        >
          {label}
        </span>
      ) : null}
      {label ? (
        <span className={cn("tac-seam flex-1", accent && "tac-seam-accent")} />
      ) : null}
    </div>
  );
}
