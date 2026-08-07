"use client";

import { gsap, ScrollTrigger, isMobileViewport } from "@/animations/gsap";

/**
 * Vengence UI-style staggered-grid entrance.
 *
 * Faithful port of the animation from
 * https://www.vengenceui.com/r/staggered-grid.json — grouped column
 * timing where the middle column enters first and outer columns are
 * delayed by `|colIdx - middleColumnIndex| * 0.2` seconds. Cards fly
 * up from `yPercent: 450` with `autoAlpha: 0`, easing `sine.out`, and
 * the whole thing is scrubbed to scroll so the reveal feels bound to
 * the reader's velocity.
 *
 * Runs on top of the project's existing GSAP + ScrollTrigger stack —
 * no new controller is registered. Must be called from within a
 * `gsap.context()` so the returned tweens clean up when the section
 * unmounts.
 *
 * @param {HTMLElement} container   grid container element (also the
 *                                  ScrollTrigger `trigger`)
 * @param {object}      options
 * @param {string}      options.selector    CSS selector for the cards
 *                                          inside the container.
 *                                          Default: `.staggered-card`.
 * @param {number}      options.scrub       ScrollTrigger scrub value.
 * @param {number}      options.yPercent    Starting y offset (%).
 * @param {string}      options.ease        GSAP ease name.
 * @param {number}      options.delayStep   Seconds added per column
 *                                          away from center.
 * @param {string}      options.start       ScrollTrigger start.
 * @param {string}      options.end         ScrollTrigger end.
 */
export function applyStaggeredGrid(
  container,
  {
    selector = ".staggered-card",
    scrub = 1.5,
    yPercent = 450,
    ease = "sine.out",
    delayStep = 0.2,
    start = "top bottom",
    end = "center center",
  } = {}
) {
  if (!container) return;

  const items = Array.from(container.querySelectorAll(selector));
  if (!items.length) return;

  // ── Mobile: fast, one-shot reveal ───────────────────────────────────
  // The scrubbed column-staircase below is tuned for wide multi-column
  // desktop layouts. On phones the grid collapses to a single column, so
  // scrubbing a 450% fly-up over the whole section makes cards crawl in
  // late AND vanish when the reader scrolls back up. Instead: a quick,
  // once-only rise as the grid enters — cards appear promptly and stay.
  if (isMobileViewport()) {
    gsap.from(items, {
      yPercent: 40,
      autoAlpha: 0,
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
        once: true,
        invalidateOnRefresh: true,
      },
    });
    ScrollTrigger.refresh();
    return;
  }

  // Group by data-col so column ordering is deterministic and stable
  // across viewports (the grid may visually collapse to a single
  // column on mobile, but the animation still staircases per the
  // data-col value so the entrance feels intentional at every width).
  const columnsMap = new Map();
  items.forEach((item) => {
    const col = parseInt(item.getAttribute("data-col") || "0", 10);
    if (!columnsMap.has(col)) columnsMap.set(col, []);
    columnsMap.get(col).push(item);
  });

  const columnKeys = Array.from(columnsMap.keys()).sort((a, b) => a - b);
  const numColumns = columnKeys.length;
  const middleColumnIndex = Math.floor(numColumns / 2);

  columnKeys.forEach((colKey, colIdx) => {
    const columnItems = columnsMap.get(colKey);
    const delayFactor = Math.abs(colIdx - middleColumnIndex) * delayStep;

    gsap
      .timeline({
        scrollTrigger: {
          trigger: container,
          start,
          end,
          scrub,
          invalidateOnRefresh: true,
        },
      })
      .from(columnItems, {
        yPercent,
        autoAlpha: 0,
        delay: delayFactor,
        ease,
      });
  });

  // Ensure ScrollTrigger recomputes positions once fonts + images
  // settle in — otherwise the initial "top bottom" measurement can be
  // taken while section heights are still growing.
  ScrollTrigger.refresh();
}
