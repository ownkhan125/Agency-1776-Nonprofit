"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { StarMark } from "@/components/StarMark";
import { Ribbon } from "@/components/Ribbon";
import { gsap, registerGsap } from "@/animations/gsap";
import { cn } from "@/utils/cn";

/**
 * Portfolio placeholders. Dummy website mockups until real projects
 * land — swap the `src`/`title`/`categories` at that point.
 */
const PROJECTS = [
  {
    title: "Community Food Bank",
    categories: ["Website", "Donation Path", "Volunteer"],
    src: "https://picsum.photos/seed/agency1776-portfolio-01/1400/1000",
  },
  {
    title: "Youth Mentorship Alliance",
    categories: ["Website", "Program Pages", "Email"],
    src: "https://picsum.photos/seed/agency1776-portfolio-02/1400/1000",
  },
  {
    title: "Veterans Reintegration Fund",
    categories: ["Campaign", "Social Assets", "Donation"],
    src: "https://picsum.photos/seed/agency1776-portfolio-03/1400/1000",
  },
  {
    title: "Hope Health Coalition",
    categories: ["Website", "Impact Pages", "Fundraising"],
    src: "https://picsum.photos/seed/agency1776-portfolio-04/1400/1000",
  },
  {
    title: "Literacy for All Foundation",
    categories: ["Website", "Volunteer", "Newsletter"],
    src: "https://picsum.photos/seed/agency1776-portfolio-05/1400/1000",
  },
  {
    title: "Grassroots Justice Project",
    categories: ["Campaign", "Advocacy", "Awareness"],
    src: "https://picsum.photos/seed/agency1776-portfolio-06/1400/1000",
  },
];

/**
 * PortfolioShowcase — responsive dual-layout showcase.
 *
 *   • Desktop (lg+):  editorial row list. Hovering a row lights up
 *     three synchronised layers — cursor-follow preview (portalled
 *     to <body>, tracks the mouse via GSAP quickTo), right-side
 *     preview inside the row, and a padding-right shrink on the
 *     row's content grid to make room for that preview. Each row's
 *     images are the row's OWN project, so switching rows swaps to
 *     the correct project image everywhere at once.
 *
 *   • Tablet + Mobile (<lg): a fully scannable card grid. Each of
 *     the six projects renders its own always-visible mockup plate
 *     with the browser-chrome header, the project title, index, and
 *     category tags. Two-column at md, single-column below. No
 *     hover dependence, no tap required — every project is legible
 *     the moment the reader arrives at the section.
 *
 * The scroll reveal (GSAP + ScrollTrigger with reverse toggleActions)
 * runs on BOTH the desktop rows and the tablet/mobile cards via a
 * shared selector list, so animation cadence is consistent regardless
 * of viewport.
 */
export function PortfolioShowcase() {
  const rootRef = useRef(null);
  const cursorImgRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);
  const [hoveringRow, setHoveringRow] = useState(false);
  const [supportsHover, setSupportsHover] = useState(true);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mm = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setSupportsHover(mm.matches);
    update();
    mm.addEventListener?.("change", update);
    return () => mm.removeEventListener?.("change", update);
  }, []);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      const rows = rootRef.current.querySelectorAll("[data-portfolio-row]");
      if (rows.length) {
        gsap.set(rows, { y: 24, opacity: 0 });
        gsap.to(rows, {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: rows[0],
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      }

      const cards = rootRef.current.querySelectorAll("[data-portfolio-card]");
      if (cards.length) {
        gsap.set(cards, { y: 24, opacity: 0 });
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: cards[0],
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Cursor-follow: wire up quickTo tweens + mousemove listener AFTER
  // the portal mounts (cursorImgRef.current is a live DOM node then).
  useEffect(() => {
    if (!mounted || !supportsHover) return;
    const el = cursorImgRef.current;
    if (!el) return;
    registerGsap();
    gsap.set(el, {
      xPercent: -50,
      yPercent: -50,
      x: -9999,
      y: -9999,
      opacity: 0,
      scale: 0.7,
    });
    const qX = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const qY = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    const onMove = (e) => {
      qX(e.clientX);
      qY(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mounted, supportsHover]);

  useEffect(() => {
    if (!mounted) return;
    const el = cursorImgRef.current;
    if (!el) return;
    gsap.to(el, {
      opacity: hoveringRow ? 1 : 0,
      scale: hoveringRow ? 1 : 0.7,
      duration: 0.4,
      ease: "power3.out",
    });
  }, [mounted, hoveringRow]);

  const cursorFollow = (
    <div
      ref={cursorImgRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9998] hidden h-[240px] w-[320px] lg:block"
      style={{ willChange: "transform, opacity" }}
    >
      <div
        className="angular-panel relative h-full w-full overflow-hidden"
        data-animate-border
        style={{
          "--ap-cut": "18px",
          "--ap-bg": "var(--color-surface)",
          "--ap-border-color":
            "color-mix(in srgb, var(--color-accent) 55%, transparent)",
        }}
      >
        <BrowserChrome />
        <div className="absolute inset-x-0 bottom-0 top-[32px]">
          {PROJECTS.map((p, i) => (
            <img
              key={p.title}
              src={p.src}
              alt=""
              aria-hidden="true"
              loading={i === 0 ? "eager" : "lazy"}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out",
                i === active ? "opacity-100" : "opacity-0"
              )}
            />
          ))}
        </div>
        <span className="tac-bracket tac-bracket-tl" />
        <span className="tac-bracket tac-bracket-br" />
      </div>
    </div>
  );

  return (
    <div ref={rootRef} className="relative overflow-hidden">
      <Ribbon
        variant="fold"
        tone="accent"
        opacity={0.14}
        width={14}
        className="-left-[8%] top-[22%] h-[36vh] w-[130%]"
      />

      {/* Portal cursor-follow to <body> so `fixed` positioning
          resolves against the viewport, NOT against SmoothScrollProvider's
          transformed #smooth-content wrapper. */}
      {mounted && supportsHover
        ? createPortal(cursorFollow, document.body)
        : null}

      <SectionShell
        id="portfolio-showcase"
        innerClassName="relative mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24"
      >
        <div className="mb-12 flex flex-col items-center gap-6 text-center md:mb-16">
          <StarMark className="h-4 w-4 text-accent" />
          <SplitText
            as="h2"
            scrub
            className="max-w-4xl text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.05] tracking-tight"
            text="Digital Work Built Around Mission, Impact, and Supporter Action."
          />
        </div>

        {/* ===== DESKTOP (lg+) — editorial row list ===== */}
        <div
          data-portfolio-list
          onMouseLeave={supportsHover ? () => setHoveringRow(false) : undefined}
          className="relative hidden lg:block"
        >
          <div data-animate-seam className="tac-seam" />

          {PROJECTS.map((p, i) => {
            const isActive = i === active;
            const showRowPreview = hoveringRow && isActive;
            return (
              <div
                key={p.title}
                data-portfolio-row
                data-portfolio-active={showRowPreview ? "true" : "false"}
                data-cursor={supportsHover ? "hidden" : undefined}
                onMouseEnter={
                  supportsHover
                    ? () => {
                        setActive(i);
                        setHoveringRow(true);
                      }
                    : undefined
                }
                onClick={() => setActive(i)}
                className={cn(
                  "group relative border-b border-foreground/10 py-14 transition-opacity duration-400",
                  hoveringRow && !isActive && "opacity-45"
                )}
              >
                <div
                  className={cn(
                    "grid grid-cols-[auto_1fr_auto] items-center gap-x-8",
                    "transition-[padding-right] duration-500 ease-out",
                    showRowPreview && "pr-[300px] xl:pr-[360px]"
                  )}
                >
                  <span className="col-start-1 text-xs uppercase tracking-[0.32em] text-foreground/45">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3
                    className={cn(
                      "col-start-2 flex items-center gap-4 text-[clamp(2rem,5vw,4.5rem)] font-semibold uppercase leading-[0.92] transition-transform duration-500 ease-out",
                      showRowPreview && "translate-x-4"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "inline-block h-2 w-2 shrink-0 rotate-45 bg-accent transition-opacity duration-300",
                        showRowPreview ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>{p.title}</span>
                  </h3>

                  <span className="col-start-3 text-xs uppercase tracking-[0.28em] text-foreground/60">
                    {p.categories.join(" · ")}
                  </span>
                </div>

                {/* Right-side preview — absolute inside the row */}
                <div
                  className={cn(
                    "pointer-events-none absolute right-0 top-1/2 -translate-y-1/2",
                    "h-[220px] w-[280px] xl:h-[260px] xl:w-[340px]",
                    "transition-[opacity,transform] duration-500 ease-out"
                  )}
                  style={{
                    opacity: showRowPreview ? 1 : 0,
                    transform: showRowPreview
                      ? "translate3d(0, -50%, 0) scale(1)"
                      : "translate3d(24px, -50%, 0) scale(0.94)",
                  }}
                >
                  <div
                    className="angular-panel relative h-full w-full overflow-hidden"
                    style={{
                      "--ap-cut": "16px",
                      "--ap-bg": "var(--color-surface)",
                      "--ap-border-color":
                        "color-mix(in srgb, var(--color-accent) 55%, transparent)",
                    }}
                  >
                    <BrowserChrome />
                    <img
                      src={p.src}
                      alt={p.title}
                      loading={i === 0 ? "eager" : "lazy"}
                      className={cn(
                        "absolute inset-x-0 bottom-0 top-[32px] h-[calc(100%-32px)] w-full object-cover transition-transform duration-500 ease-out",
                        showRowPreview ? "scale-105" : "scale-100"
                      )}
                    />
                    <span className="tac-bracket tac-bracket-tl" />
                    <span className="tac-bracket tac-bracket-br" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ===== TABLET + MOBILE (<lg) — always-visible card grid ===== */}
        <div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-2 md:gap-8 lg:hidden">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </SectionShell>
    </div>
  );
}

/**
 * Tablet/mobile project card — the mockup image is the visual focus,
 * with the browser-chrome header selling "this is a website" at a
 * glance. Title + index + categories sit below the plate in a tight
 * editorial stack.
 */
function ProjectCard({ project, index }) {
  return (
    <article
      data-portfolio-card
      data-cursor="card"
      className="group flex flex-col gap-6"
    >
      <div
        className="angular-panel relative aspect-[16/10] w-full overflow-hidden"
        style={{
          "--ap-cut": "20px",
          "--ap-bg": "var(--color-surface)",
          "--ap-border-color":
            "color-mix(in srgb, var(--color-foreground) 14%, transparent)",
        }}
      >
        <BrowserChrome />
        <img
          src={project.src}
          alt={project.title}
          loading={index < 2 ? "eager" : "lazy"}
          className="absolute inset-x-0 bottom-0 top-[32px] h-[calc(100%-32px)] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <span className="tac-bracket tac-bracket-tl" />
        <span className="tac-bracket tac-bracket-br" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline gap-3 md:gap-4">
          <span className="text-[10px] uppercase tracking-[0.32em] text-foreground/45 md:text-xs">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-xl font-semibold uppercase leading-none tracking-tight md:text-2xl">
            {project.title}
          </h3>
        </div>
        <span className="text-[10px] uppercase tracking-[0.28em] text-foreground/60 md:text-xs">
          {project.categories.join(" · ")}
        </span>
      </div>
    </article>
  );
}

/**
 * Tiny browser-chrome header inside each preview plate — three
 * neutral dots + a short accent URL rail. Sells "this is a website
 * mockup" at a glance without any traffic-light colors.
 */
function BrowserChrome() {
  return (
    <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-1.5 border-b border-foreground/10 bg-background/85 px-3 py-2 backdrop-blur-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
      <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
      <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
      <span aria-hidden="true" className="ml-2 h-1 w-20 rounded-full bg-accent/50" />
    </div>
  );
}
