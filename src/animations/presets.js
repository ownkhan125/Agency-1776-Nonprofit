/**
 * Shared animation tuning for scroll-triggered reveals.
 *
 * 2026-07-10 (v3): tightened for a faster, "professional scroll"
 * cadence. Text now clears its enter animation well before the
 * section reaches viewport center — readers no longer sail past
 * mid-flight animations. Reversal on scroll-up is enabled via
 * toggleActions in the section-reveal hook, so headings replay in
 * reverse instead of sitting static after they leave the viewport.
 */

export const EASE = {
  border: "power3.inOut",
  icon: "expo.out",
  text: "power3.out",
  scrub: "power1.out",
  parallax: "none",
};

export const DUR = {
  border: 1.0,
  icon: 0.5,
  text: 0.55,
};

export const STAGGER = {
  icon: 0.06,
  textWord: 0.012,
  scrubWord: 0.016,
};

/**
 * Trigger positions.
 *  - buildIn starts as soon as the top of the section clears the
 *    bottom of the viewport (`top 92%`) and toggles reverse on
 *    scroll-up (`onLeaveBack`).
 *  - scrubText mirrors buildIn — a single tuned reveal, no
 *    scroll-linked scrub. The scrub-flagged headings play through
 *    quickly on enter and replay in reverse on exit.
 *  - parallax stays scroll-linked; only decorative motion.
 */
export const TRIGGER = {
  buildIn: { start: "top 92%", toggleActions: "play none none reverse" },
  scrubText: { start: "top 92%", toggleActions: "play none none reverse" },
  parallax: { start: "top bottom", end: "bottom top", scrub: 0.9 },
};
