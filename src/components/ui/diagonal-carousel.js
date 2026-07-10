"use client";

/**
 * Diagonal Carousel — vengenceui/r/diagonal-carousel.json
 * Adapted to this project:
 *   • Converted from TSX to JS (project style)
 *   • framer-motion → motion/react (project uses the "motion" package)
 *   • lucide-react → inline SVG chevrons (no new dep)
 *   • @/lib/utils → @/utils/cn (project path)
 *
 * Signature and behavior are otherwise faithful to the upstream
 * component: items rotate along a diagonal fan, active slide sits at
 * center, previous/next slides tilt off. Keyboard, controlled +
 * uncontrolled activeIndex, loop, dots and controls all preserved.
 *
 * Additional touches for this project:
 *   • Swipe/drag on the sliding rail (pointer-driven, not framer drag)
 *     so mobile users can flick through slides.
 *   • Callback `onInteract` fires on any user interaction (click,
 *     drag, keyboard) so a parent can pause its autoplay timer.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/utils/cn";

const DEFAULT_TRANSITION = {
  type: "spring",
  bounce: 0.16,
  duration: 0.85,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function ChevronLeft({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function DiagonalCarousel({
  items,
  activeIndex,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  onInteract,
  loop = false,
  slideSize = 260,
  rotationStep = 30,
  verticalStep = 120,
  inactiveScale = 0.6,
  transition = DEFAULT_TRANSITION,
  showControls = true,
  showDots = true,
  viewportClassName,
  slideClassName,
  imageClassName,
  labelClassName,
  controlsClassName,
  className,
  onKeyDown,
  tabIndex,
  ...props
}) {
  const maxIndex = Math.max(0, items.length - 1);
  const [uncontrolledIndex, setUncontrolledIndex] = useState(() =>
    clamp(defaultActiveIndex, 0, maxIndex)
  );
  const currentIndex = clamp(activeIndex ?? uncontrolledIndex, 0, maxIndex);
  const safeSlideSize = Math.max(120, slideSize);
  const safeInactiveScale = clamp(inactiveScale, 0.35, 1);

  const selectSlide = useCallback(
    (nextIndex) => {
      if (!items.length) return;
      const resolvedIndex = loop
        ? (nextIndex + items.length) % items.length
        : clamp(nextIndex, 0, maxIndex);
      if (activeIndex === undefined) {
        setUncontrolledIndex(resolvedIndex);
      }
      onActiveIndexChange?.(resolvedIndex);
    },
    [activeIndex, items.length, loop, maxIndex, onActiveIndexChange]
  );

  const handleKeyDown = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onInteract?.();
      selectSlide(currentIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      onInteract?.();
      selectSlide(currentIndex + 1);
    }
  };

  // Pointer-driven swipe on the rail — records pointerdown x, on
  // pointerup measures delta and advances/retreats when past a
  // threshold. Chosen over framer's drag prop because our animate={x}
  // is state-derived and would fight a drag transform.
  const railRef = useRef(null);
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let startX = null;
    let startY = null;
    let dragged = false;

    const onDown = (e) => {
      startX = e.clientX;
      startY = e.clientY;
      dragged = false;
    };
    const onMove = (e) => {
      if (startX == null) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        dragged = true;
      }
    };
    const onUp = (e) => {
      if (startX == null) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      startX = null;
      startY = null;
      if (!dragged) return;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        onInteract?.();
        if (dx < 0) selectSlide(currentIndex + 1);
        else selectSlide(currentIndex - 1);
      }
    };

    rail.addEventListener("pointerdown", onDown);
    rail.addEventListener("pointermove", onMove);
    rail.addEventListener("pointerup", onUp);
    rail.addEventListener("pointercancel", () => {
      startX = null;
      startY = null;
    });
    return () => {
      rail.removeEventListener("pointerdown", onDown);
      rail.removeEventListener("pointermove", onMove);
      rail.removeEventListener("pointerup", onUp);
    };
  }, [currentIndex, selectSlide, onInteract]);

  if (!items.length) return null;

  const isPreviousDisabled = !loop && currentIndex === 0;
  const isNextDisabled = !loop && currentIndex === maxIndex;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Portfolio carousel"
      tabIndex={tabIndex ?? 0}
      onKeyDown={handleKeyDown}
      className={cn("relative isolate h-full w-full overflow-hidden", className)}
      {...props}
    >
      <div
        ref={railRef}
        className={cn(
          "absolute inset-0 overflow-hidden touch-pan-y",
          viewportClassName
        )}
      >
        <motion.div
          className="absolute left-1/2 top-[30%] flex w-fit"
          animate={{ x: -(currentIndex * safeSlideSize + safeSlideSize / 2) }}
          transition={transition}
        >
          {items.map((item, index) => {
            const isActive = currentIndex === index;
            const distance = index - currentIndex;

            return (
              <motion.div
                key={`${item.src}-${index}`}
                className={cn(
                  "flex shrink-0 flex-col items-center gap-2 will-change-transform",
                  slideClassName
                )}
                style={{ width: safeSlideSize }}
                animate={{
                  rotate: distance * rotationStep,
                  scale: isActive ? 1 : safeInactiveScale,
                  y: distance * verticalStep,
                }}
                transition={transition}
              >
                {item.title ? (
                  <motion.p
                    className={cn("whitespace-nowrap text-sm", labelClassName)}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      scale: isActive ? 1 : 0.7,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.title}
                  </motion.p>
                ) : null}

                <button
                  type="button"
                  aria-label={item.title ? `Show ${item.title}` : `Show slide ${index + 1}`}
                  aria-current={isActive ? "true" : undefined}
                  className="aspect-square w-full cursor-pointer"
                  onClick={() => {
                    onInteract?.();
                    selectSlide(index);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.alt ?? item.title ?? ""}
                    draggable={false}
                    className={cn(
                      "h-full w-full select-none rounded-2xl object-cover shadow-xl",
                      imageClassName
                    )}
                  />
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {showControls && (
        <div
          className={cn(
            "absolute inset-x-4 bottom-5 z-10 mx-auto flex w-fit items-center justify-center gap-3 rounded-full border border-foreground/15 bg-surface/85 px-2 text-foreground shadow-sm backdrop-blur-sm",
            controlsClassName
          )}
        >
          <button
            type="button"
            aria-label="Show previous slide"
            data-cursor="button"
            disabled={isPreviousDisabled}
            className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-accent/15 hover:text-accent disabled:cursor-not-allowed disabled:opacity-35"
            onClick={() => {
              onInteract?.();
              selectSlide(currentIndex - 1);
            }}
          >
            <ChevronLeft className="size-5" />
          </button>

          {showDots && (
            <div className="flex items-center justify-center gap-2">
              {items.map((item, index) => (
                <button
                  key={`${item.title || "slide"}-${index}`}
                  type="button"
                  aria-label={
                    item.title
                      ? `Show slide ${index + 1}: ${item.title}`
                      : `Show slide ${index + 1}`
                  }
                  aria-current={currentIndex === index ? "true" : undefined}
                  className={cn(
                    "h-2 rounded-full transition-[width,opacity,background-color] duration-300",
                    currentIndex === index
                      ? "w-7 bg-accent opacity-100"
                      : "w-2 bg-foreground opacity-30"
                  )}
                  onClick={() => {
                    onInteract?.();
                    selectSlide(index);
                  }}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            aria-label="Show next slide"
            data-cursor="button"
            disabled={isNextDisabled}
            className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-accent/15 hover:text-accent disabled:cursor-not-allowed disabled:opacity-35"
            onClick={() => {
              onInteract?.();
              selectSlide(currentIndex + 1);
            }}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default DiagonalCarousel;
