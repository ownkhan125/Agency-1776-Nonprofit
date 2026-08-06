"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, registerGsap } from "@/animations/gsap";
import { cn } from "@/utils/cn";

// Only real routes — every href resolves to a page that exists in
// `src/app`. Section anchors were removed alongside the same cleanup
// in the NavBar.
const PRIMARY_LINKS = [
  { href: "/",             label: "Home" },
  { href: "/services",     label: "Services" },
  { href: "/portfolio",    label: "Portfolio" },
  { href: "/build-finder", label: "Build Finder" },
  { href: "/contact",      label: "Contact" },
];

const EMAIL = "outdevelopment@op1776.com";

/**
 * Footer — grouped editorial plate.
 *
 * Redesigned from the earlier single-column stack to a three-group
 * layout that reads as a proper site foot:
 *   • Brand — glyph + name + division tag + one-line description
 *   • Navigate — real routes only (Home, Services, Portfolio, Contact)
 *   • Get in touch — the outdevelopment email; no social handles
 *     exist in the project so none are invented here
 *
 * GSAP owns two scoped timelines:
 *   1. Accent rule sweeps in horizontally (scaleX 0 → 1) once the
 *      footer enters the viewport.
 *   2. Every `[data-footer-reveal]` element lifts 14px + fades in on
 *      a 0.08s stagger with `power3.out` easing. The stagger reads
 *      column-by-column since column groups appear first in the DOM,
 *      then the signature line — giving a natural cascade.
 * Both reveals are one-shot (no scrub) with `toggleActions: play none
 * none reverse` so the footer resets if the reader scrolls back up.
 */
export function Footer() {
  const rootRef = useRef(null);
  const year = new Date().getFullYear();
  const pathname = usePathname();

  // A link is "active" when it points to the current page. Home ("/")
  // matches exactly; every other route also matches its subpaths.
  const isActive = (href) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || (pathname || "").startsWith(href + "/");

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      // Column cascade — subtle 14px lift + fade in on a 0.08s stagger.
      // Each column's headline + list arrives together, and the whole
      // footer body populates in one graceful pass.
      gsap.set("[data-footer-reveal]", { y: 14, opacity: 0 });
      gsap.to("[data-footer-reveal]", {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });

      // Signature bar draws in AFTER the columns settle — a tail-end
      // beat rather than another simultaneous stagger.
      gsap.set("[data-footer-signature]", { opacity: 0, y: 8 });
      gsap.to("[data-footer-signature]", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.35,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={rootRef}
      className="relative border-t border-foreground/10 bg-background"
    >
      <div className="mx-auto max-w-[1600px] px-6 py-12 md:px-10 md:py-14">
        {/* Three-group content — brand + navigate + contact. On tablet
            (md) contact needs enough room for the email so it doesn't
            truncate. On desktop (lg+) the brand block gets its wider
            ratio back. */}
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          {/* Brand column */}
          <div data-footer-reveal className="flex flex-col gap-5">
            <Link
              href="/"
              data-cursor="link"
              aria-label="Agency 1776 — home"
              className="inline-flex items-center"
            >
              {/* AGENCY 1776 lockup — light/dark variant swapped by theme */}
              <img
                src="/logo-agency.png"
                alt="Agency 1776"
                className="logo-light h-12 w-auto"
              />
              <img
                src="/logo-agency-dark.png"
                alt="Agency 1776"
                className="logo-dark h-12 w-auto"
              />
            </Link>
            <p className="max-w-xs text-base leading-relaxed text-foreground/60">
              Nonprofit websites that earn donor confidence and make it easier
              to give, volunteer, partner, and stay involved.
            </p>
          </div>

          {/* Navigate column */}
          <div data-footer-reveal className="flex flex-col gap-5">
            <span className="text-base font-semibold uppercase tracking-[0.24em] text-foreground">
              Navigate
            </span>
            <ul className="flex flex-col gap-2.5 text-base">
              {PRIMARY_LINKS.map((l) => {
                const active = isActive(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      data-cursor="link"
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "transition-colors",
                        active
                          ? "font-semibold text-foreground"
                          : "text-foreground/70 hover:text-accent"
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Get in touch column — email address shown as static text
              (not a mailto: link) so the mail client never opens.
              Every contact-related affordance routes through /contact. */}
          <div data-footer-reveal className="flex flex-col gap-5">
            <span className="text-base font-semibold uppercase tracking-[0.24em] text-foreground">
              Get in touch
            </span>
            <div className="flex flex-col gap-2.5 text-base">
              <span className="break-all text-foreground/85">
                {EMAIL}
              </span>
              <Link
                href="/contact"
                data-cursor="link"
                className="inline-flex items-center gap-2 whitespace-nowrap text-foreground transition-colors hover:text-accent"
              >
                Start a nonprofit brief
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Signature bar — appears after the columns settle */}
        <div
          data-footer-signature
          className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-foreground/10 pt-6 text-xs font-medium uppercase tracking-[0.28em] text-foreground/60 md:mt-12 md:flex-row md:items-center md:text-sm"
        >
          <span>© {year} Agency 1776 · Nonprofit Division</span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/privacy-policy"
              data-cursor="link"
              aria-current={isActive("/privacy-policy") ? "page" : undefined}
              className={cn(
                "transition-colors",
                isActive("/privacy-policy")
                  ? "font-semibold text-foreground"
                  : "hover:text-foreground"
              )}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              data-cursor="link"
              aria-current={
                isActive("/terms-and-conditions") ? "page" : undefined
              }
              className={cn(
                "transition-colors",
                isActive("/terms-and-conditions")
                  ? "font-semibold text-foreground"
                  : "hover:text-foreground"
              )}
            >
              Terms &amp; Conditions
            </Link>
            <span aria-hidden="true" className="text-foreground/25">
              ·
            </span>
            <span>Est. MMXXIV</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
