"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsap } from "@/animations/gsap";
import { cn } from "@/utils/cn";

// Only real routes — every href resolves to a page that exists in
// `src/app`. Section anchors were removed alongside the same cleanup
// in the NavBar.
const PRIMARY_LINKS = [
  { href: "/",          label: "Home" },
  { href: "/services",  label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact",   label: "Contact" },
];

const EMAIL = "outdevelopment@op1776.com";

function BrandGlyph({ className = "" }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={cn("text-accent", className)}
      aria-hidden="true"
    >
      <circle cx="14" cy="18" r="10" />
      <circle cx="26" cy="18" r="10" />
      <circle cx="20" cy="28" r="10" />
    </svg>
  );
}

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

      // Accent rule sweep-in — anchors the footer without dominating.
      gsap.set("[data-footer-rule]", { scaleX: 0, transformOrigin: "left center" });
      gsap.to("[data-footer-rule]", {
        scaleX: 1,
        duration: 1.1,
        ease: "power3.inOut",
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
        {/* Accent rule — sweeps in from the left */}
        <span
          data-footer-rule
          aria-hidden="true"
          className="mb-10 block h-px w-24 bg-accent/70 md:mb-12"
        />

        {/* Three-group content — brand + navigate + contact. On tablet
            (md) contact needs enough room for the email so it doesn't
            truncate. On desktop (lg+) the brand block gets its wider
            ratio back. */}
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          {/* Brand column */}
          <div data-footer-reveal className="flex flex-col gap-5">
            <a
              href="/"
              data-cursor="link"
              className="inline-flex items-center gap-3"
            >
              <BrandGlyph className="h-8 w-8" />
              <span className="flex flex-col leading-none">
                <span className="text-sm font-medium tracking-tight text-foreground">
                  Agency 1776
                </span>
                <span className="mt-1 text-[9px] uppercase tracking-[0.28em] text-foreground/40">
                  Nonprofit Division
                </span>
              </span>
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-foreground/60">
              Nonprofit websites that earn donor confidence and make it easier
              to give, volunteer, partner, and stay involved.
            </p>
          </div>

          {/* Navigate column */}
          <div data-footer-reveal className="flex flex-col gap-5">
            <span className="text-[10px] uppercase tracking-[0.28em] text-foreground/45">
              Navigate
            </span>
            <ul className="flex flex-col gap-2.5 text-sm">
              {PRIMARY_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    data-cursor="link"
                    className="text-foreground/70 transition-colors hover:text-accent"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch column — email address shown as static text
              (not a mailto: link) so the mail client never opens.
              Every contact-related affordance routes through /contact. */}
          <div data-footer-reveal className="flex flex-col gap-5">
            <span className="text-[10px] uppercase tracking-[0.28em] text-foreground/45">
              Get in touch
            </span>
            <div className="flex flex-col gap-2.5 text-sm">
              <span className="break-all text-foreground/85">
                {EMAIL}
              </span>
              <a
                href="/contact"
                data-cursor="link"
                className="inline-flex items-center gap-2 whitespace-nowrap text-foreground transition-colors hover:text-accent"
              >
                Start a nonprofit brief
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Signature bar — appears after the columns settle */}
        <div
          data-footer-signature
          className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-foreground/10 pt-6 text-[10px] uppercase tracking-[0.28em] text-foreground/45 md:mt-12 md:flex-row md:items-center"
        >
          <span>© {year} Agency 1776 · Nonprofit Division</span>
          <span
            aria-hidden="true"
            className="hidden h-1 w-1 rotate-45 bg-accent/60 md:block"
          />
          <span>Est. MMXXIV</span>
        </div>
      </div>
    </footer>
  );
}
