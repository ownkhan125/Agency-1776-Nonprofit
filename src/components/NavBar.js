"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ScrollTrigger, registerGsap } from "@/animations/gsap";
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
  { href: "/services",     label: "Services",     match: /^\/services(\/|$)/ },
  { href: "/portfolio",    label: "Portfolio",    match: /^\/portfolio(\/|$)/ },
  { href: "/build-finder", label: "Build Finder", match: /^\/build-finder(\/|$)/ },
  { href: "/contact",      label: "Contact",      match: /^\/contact(\/|$)/ },
];

function NavLink({ href, label, active }) {
  return (
    <Link
      href={href}
      data-cursor="link"
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative isolate inline-flex rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] outline-none transition-colors duration-300 md:text-xs",
        active
          ? "font-semibold text-white"
          : "font-medium text-foreground/70 hover:text-foreground"
      )}
    >
      {/* Hover pill — mirrors the active pill's look (faint accent fill +
          hairline border) so hovering an item previews its active state.
          Fades in place: nothing shifts, lifts, or resizes on hover.
          Skipped on the active item, which already shows the shared
          layout pill rendered by the parent. */}
      {!active && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-full border border-accent/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "color-mix(in srgb, var(--color-accent) 10%, transparent)",
          }}
        />
      )}

      <span className="relative">{label}</span>
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
          className="relative flex min-w-0 shrink items-center"
        >
          {/* AGENCY 1776 lockup — light/dark variant swapped by theme */}
          <img
            src="/logo-agency.png"
            alt="Agency 1776"
            className="logo-light h-9 w-auto md:h-10"
          />
          <img
            src="/logo-agency-dark.png"
            alt="Agency 1776"
            className="logo-dark h-9 w-auto md:h-10"
          />
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
                    className="pointer-events-none absolute inset-0 -z-10 rounded-full border border-accent"
                    style={{ background: "var(--color-accent)" }}
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
                            ? "border border-accent font-semibold text-white"
                            : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                        )}
                        style={
                          isActive
                            ? { background: "var(--color-accent)" }
                            : undefined
                        }
                      >
                        <span>{l.label}</span>
                        <span
                          aria-hidden="true"
                          className={isActive ? "text-white" : "text-accent"}
                        >
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
