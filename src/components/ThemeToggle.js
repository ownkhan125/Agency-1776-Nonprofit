"use client";

import { motion } from "motion/react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/utils/cn";

/**
 * Sun / moon icons drawn to sit within a shared 20x20 canvas so the
 * swap is centered and any rotation feels balanced. The moon uses a
 * clip-path via a mask circle so it looks like a crescent instead of a
 * flat circle — feels intentional rather than emoji-y.
 */
function SunIcon({ className }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="3.4" />
      <path d="M10 2.2v1.6M10 16.2v1.6M2.2 10h1.6M16.2 10h1.6M4.5 4.5l1.15 1.15M14.35 14.35l1.15 1.15M15.5 4.5l-1.15 1.15M5.65 14.35l-1.15 1.15" />
    </svg>
  );
}

function MoonIcon({ className }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Crescent traced by two arcs — no mask needed, works everywhere. */}
      <path d="M15.5 12.2A6.6 6.6 0 0 1 7.8 4.5a6.6 6.6 0 1 0 7.7 7.7z" />
    </svg>
  );
}

/**
 * Premium theme toggle. Two stacked icons crossfade + rotate with a
 * soft accent glow that blooms behind on hover. On theme swap the
 * button itself lifts subtly — the same "cinematic depth" language the
 * nav links use, so it feels like it belongs to the design system
 * rather than being bolted on.
 *
 * Renders as a fixed-height slot on the server (no icon) and mounts
 * the animated icons only after the client has confirmed the theme,
 * which prevents any hydration mismatch on the icon itself.
 */
export function ThemeToggle({ className = "" }) {
  const { theme, toggle, mounted } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      data-cursor="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      className={cn(
        "group relative isolate inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-surface/60 text-foreground outline-none backdrop-blur-md",
        "transition-colors hover:border-foreground/35 hover:bg-surface",
        className
      )}
    >
      {/* Soft accent glow — matches the NavLink hover glow language. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--color-accent) 28%, transparent), transparent 72%)",
          filter: "blur(10px)",
        }}
      />

      <span className="relative block h-5 w-5">
        {mounted ? (
          <>
            <motion.span
              className="absolute inset-0 flex items-center justify-center"
              initial={false}
              animate={{
                opacity: isDark ? 0 : 1,
                rotate: isDark ? -55 : 0,
                scale: isDark ? 0.55 : 1,
              }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <SunIcon className="h-5 w-5" />
            </motion.span>
            <motion.span
              className="absolute inset-0 flex items-center justify-center"
              initial={false}
              animate={{
                opacity: isDark ? 1 : 0,
                rotate: isDark ? 0 : 55,
                scale: isDark ? 1 : 0.55,
              }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <MoonIcon className="h-5 w-5" />
            </motion.span>
          </>
        ) : null}
      </span>
    </motion.button>
  );
}
