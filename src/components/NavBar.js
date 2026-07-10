"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { gsap, ScrollTrigger, registerGsap } from "@/animations/gsap";
import { cn } from "@/utils/cn";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TacticalButton } from "@/components/TacticalButton";

/**
 * NavBar links — every href points to a real route that exists in
 * `src/app`. Section anchors (`#approach`, `#process`, etc.) were
 * removed from the top nav because they're not pages — they belong in
 * the on-page reading flow, not the site chrome.
 *
 * `match` is a RegExp so `/services` highlights active on `/services`
 * and any `/services/*` subroute (in case we add nested docs later).
 */
const LINKS = [
  { href: "/services",  label: "Services",  match: /^\/services(\/|$)/ },
  { href: "/portfolio", label: "Portfolio", match: /^\/portfolio(\/|$)/ },
  { href: "/contact",   label: "Contact",   match: /^\/contact(\/|$)/ },
];

function NavLink({ href, label, active, onHover }) {
  const labelRef = useRef(null);
  const glowRef = useRef(null);
  const underlineRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    if (!labelRef.current) return;
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    tl.to(
      labelRef.current,
      { y: -3, letterSpacing: "0.02em", duration: 0.42 },
      0
    )
      .to(
        glowRef.current,
        { opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" },
        0
      )
      .to(
        underlineRef.current,
        { scaleX: 1, duration: 0.45, ease: "power2.inOut" },
        0.05
      );
    tlRef.current = tl;
    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, []);

  const handleEnter = () => {
    onHover?.(href);
    tlRef.current?.play();
  };
  const handleLeave = () => {
    tlRef.current?.reverse();
  };

  return (
    <Link
      href={href}
      data-cursor="link"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative isolate inline-flex px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] outline-none md:text-xs",
        active ? "text-foreground" : "text-foreground/60"
      )}
    >
      {/* Soft accent glow behind the label */}
      <span
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-0"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 70%)",
          filter: "blur(10px)",
          transform: "scale(0.6)",
        }}
      />

      <span ref={labelRef} className="relative inline-block">
        {label}
      </span>

      {/* Thin accent underline — draws in from center on hover */}
      <span
        ref={underlineRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-3 bottom-0 h-px origin-center bg-accent"
        style={{ transform: "scaleX(0)" }}
      />
    </Link>
  );
}

/**
 * Compact hamburger toggle — animates between menu / close icons via
 * two GSAP-tweened bars. Only rendered below `md`.
 */
function MenuToggle({ open, onClick }) {
  return (
    <button
      type="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={onClick}
      data-cursor="button"
      className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-background/70 text-foreground transition-colors hover:border-accent/50 hover:text-accent md:hidden"
    >
      <span aria-hidden="true" className="relative block h-3 w-4">
        <span
          className={cn(
            "absolute left-0 top-0 h-[2px] w-full rounded bg-current transition-transform duration-300",
            open ? "translate-y-[5px] rotate-45" : ""
          )}
        />
        <span
          className={cn(
            "absolute bottom-0 left-0 h-[2px] w-full rounded bg-current transition-transform duration-300",
            open ? "-translate-y-[5px] -rotate-45" : ""
          )}
        />
      </span>
    </button>
  );
}

/**
 * NavBar — floating pill plate.
 *
 * Links restricted to real routes (`/services`, `/portfolio`,
 * `/contact`). Active state is derived from `usePathname()` — the
 * current page's link gets the tinted+bordered pill, everything
 * else stays neutral.
 *
 * Responsive:
 *   • desktop / laptop / lg tablet (md+): pill nav with inline links
 *   • below md: brand + hamburger + compact CTA. Tapping the
 *     hamburger reveals a slide-down panel with the same three links
 *     plus a duplicate CTA for a large tap target. Panel closes on
 *     link click, on outside-click, and on Escape.
 *
 * The `Grow Support` CTA points to `/contact` so it works from any
 * page.
 */
export function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    registerGsap();
    // Scroll-linked density — the pill tightens after 40px of scroll.
    const trigger = ScrollTrigger.create({
      start: 40,
      end: 41,
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });
    return () => trigger.kill();
  }, []);

  // Close the mobile menu on route change (usePathname re-runs).
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-14 z-50 flex justify-center px-3 sm:px-4 md:top-16 md:px-6">
      <nav
        className={cn(
          "pointer-events-auto relative flex w-full max-w-[1400px] items-center justify-between gap-3 rounded-full border transition-[background-color,border-color,box-shadow] duration-300 sm:gap-4 md:gap-8",
          "px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3.5",
          scrolled
            ? "border-foreground/15 bg-background/78 shadow-[0_18px_50px_-24px_color-mix(in_srgb,var(--color-foreground)_35%,transparent)]"
            : "border-foreground/[0.08] bg-background/55 shadow-[0_10px_30px_-20px_color-mix(in_srgb,var(--color-foreground)_25%,transparent)]",
          "backdrop-blur-md"
        )}
      >
        {/* Bottom accent hairline — an ultra-thin gradient rail. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 -bottom-px h-px rounded-full"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, color-mix(in srgb, var(--color-accent) 40%, transparent) 50%, transparent 100%)",
          }}
        />

        {/* Brand — logo + name/division. Name+division hidden on the
            narrowest widths so the pill never crowds. */}
        <Link
          href="/"
          data-cursor="link"
          aria-label="Agency 1776 — home"
          className="group relative flex min-w-0 shrink items-center gap-2 sm:gap-3"
        >
          <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center md:h-9 md:w-9">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in srgb, var(--color-accent) 32%, transparent), transparent 72%)",
                filter: "blur(8px)",
              }}
            />
            <svg
              viewBox="0 0 40 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="relative h-7 w-7 text-accent md:h-8 md:w-8"
              aria-hidden="true"
            >
              <circle cx="14" cy="18" r="10" />
              <circle cx="26" cy="18" r="10" />
              <circle cx="20" cy="28" r="10" />
            </svg>
          </span>
          <span className="hidden min-w-0 flex-col leading-none lg:flex">
            <span className="truncate text-[13px] font-medium tracking-tight text-foreground">
              Agency 1776
            </span>
            <span className="mt-0.5 truncate text-[9px] uppercase tracking-[0.28em] text-foreground/40">
              Nonprofit
            </span>
          </span>
        </Link>

        {/* Nav — hidden on mobile. Active state driven by pathname. */}
        <ul className="hidden items-center gap-1 md:flex lg:gap-3">
          {LINKS.map((l) => {
            const isActive = l.match.test(pathname || "");
            return (
              <li key={l.href} className="relative">
                {isActive ? (
                  <motion.span
                    layoutId="nav-active-pill"
                    transition={{ type: "spring", stiffness: 360, damping: 30 }}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 rounded-full border border-accent/25"
                    style={{
                      background:
                        "color-mix(in srgb, var(--color-accent) 10%, transparent)",
                    }}
                  />
                ) : null}
                <NavLink href={l.href} label={l.label} active={isActive} />
              </li>
            );
          })}
        </ul>

        {/* Right cluster — theme toggle + CTA (hidden below sm, use
            hamburger instead) + mobile hamburger. */}
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <ThemeToggle />
          {/* CTA — only rendered at md+ where the desktop nav lives.
              Below md the hamburger owns the space and the CTA lives
              inside the mobile menu panel for a large tap target. */}
          <div className="hidden md:block">
            <TacticalButton
              href="/contact"
              variant="primary"
              className="nav-cta"
            >
              Grow Support
            </TacticalButton>
          </div>
          <MenuToggle open={menuOpen} onClick={() => setMenuOpen((v) => !v)} />
        </div>
      </nav>

      {/* MOBILE MENU PANEL — slide-down beneath the pill. Only rendered
          below md. Backdrop dims the page and closes on tap. */}
      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.div
              key="nav-mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={() => setMenuOpen(false)}
              className="pointer-events-auto fixed inset-0 top-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
              aria-hidden="true"
            />
            <motion.div
              key="nav-mobile-panel"
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto absolute inset-x-3 top-[64px] z-50 rounded-3xl border border-foreground/12 bg-background/95 p-6 shadow-[0_28px_60px_-20px_color-mix(in_srgb,var(--color-foreground)_35%,transparent)] backdrop-blur-md md:hidden"
            >
              <ul className="flex flex-col gap-1">
                {LINKS.map((l) => {
                  const isActive = l.match.test(pathname || "");
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        data-cursor="link"
                        onClick={() => setMenuOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between rounded-2xl px-4 py-3 text-sm uppercase tracking-[0.22em] transition-colors",
                          isActive
                            ? "border border-accent/25 text-foreground"
                            : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                        )}
                        style={
                          isActive
                            ? {
                                background:
                                  "color-mix(in srgb, var(--color-accent) 10%, transparent)",
                              }
                            : undefined
                        }
                      >
                        <span>{l.label}</span>
                        <span aria-hidden="true" className="text-accent">
                          →
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Full-width CTA inside the panel — big tap target for
                  the primary conversion action on mobile. */}
              <div className="mt-4 md:hidden">
                <TacticalButton
                  href="/contact"
                  variant="primary"
                  className="w-full justify-center"
                >
                  Grow Support
                </TacticalButton>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
