"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsap } from "@/animations/gsap";
import { cn } from "@/utils/cn";

const TABS = [
  { id: "business",    label: "Business",                  active: false, href: "https://agency-1776-business.vercel.app/" },
  { id: "politicians", label: "Politicians or Candidates", active: false, href: "https://agency-1776-politicians-or-candidat.vercel.app/" },
  { id: "nonprofit",   label: "Nonprofit",                 active: true,  href: "https://agency-1776-nonprofit.vercel.app/" },
];

// Locked palette — the top bar reads as a constant branded strip and
// must not respond to Light/Dark theme swaps. Every color that used to
// pull from a `--color-*` token is pinned to a literal value here so
// theme changes on <html data-theme> leave the strip untouched.
const TOPBAR_BG          = "#0c0b09";
const TOPBAR_BORDER      = "rgba(242, 239, 232, 0.14)";
const TOPBAR_FG          = "#f2efe8";
const TOPBAR_FG_DIM      = "rgba(242, 239, 232, 0.55)";
const TOPBAR_FG_FAINT    = "rgba(242, 239, 232, 0.30)";
const TOPBAR_FG_INACTIVE = "rgba(242, 239, 232, 0.45)";
const TOPBAR_ACCENT      = "#eb4b62";
const TOPBAR_ACCENT_BORDER = "rgba(235, 75, 98, 0.60)";
const TOPBAR_ACCENT_BG     = "rgba(235, 75, 98, 0.06)";

export default function TopBar() {
  const scopeRef = useRef(null);

  useLayoutEffect(() => {
    if (!scopeRef.current) return;
    registerGsap();
    const scope = scopeRef.current;
    const ctx = gsap.context(() => {
      const inactive = scope.querySelectorAll("[data-topbar-tab='inactive']");
      inactive.forEach((el) => {
        const hoverIn  = () => gsap.to(el, { color: TOPBAR_FG, duration: 0.35, ease: "power2.out" });
        const hoverOut = () => gsap.to(el, { color: TOPBAR_FG_INACTIVE, duration: 0.35, ease: "power2.out" });
        el.addEventListener("mouseenter", hoverIn);
        el.addEventListener("mouseleave", hoverOut);
      });
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={scopeRef}
      data-cursor="link"
      className="fixed inset-x-0 top-0 z-[60] backdrop-blur-md"
      style={{
        backgroundColor: TOPBAR_BG,
        borderBottom: `1px solid ${TOPBAR_BORDER}`,
        color: TOPBAR_FG,
      }}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-2 px-2 py-1.5 sm:gap-4 sm:px-4 sm:py-2 md:px-12">
        <div className="flex min-w-0 flex-1 items-center gap-0 overflow-x-auto no-scrollbar sm:gap-2 lg:flex-none lg:gap-4">
          {TABS.map((t) => (
            <TopBarTab key={t.id} tab={t} />
          ))}
        </div>

        <div
          className="hidden shrink-0 items-center gap-4 whitespace-nowrap text-[10px] uppercase tracking-[0.28em] lg:flex"
          style={{ color: TOPBAR_FG_DIM }}
        >
          <span className="inline-flex items-center gap-2">
            <span
              className="inline-block h-1 w-1 rounded-full"
              style={{ backgroundColor: TOPBAR_ACCENT }}
            />
            Nonprofit Division
          </span>
          <span style={{ color: TOPBAR_FG_FAINT }}>/</span>
          <span>Est. MMXXIV</span>
        </div>
      </div>
    </div>
  );
}

function TopBarTab({ tab }) {
  const isActive = tab.active;
  const Wrapper = tab.href ? "a" : "span";

  return (
    <Wrapper
      href={tab.href || undefined}
      data-topbar-tab={isActive ? "active" : "inactive"}
      data-cursor={tab.href ? "link" : "default"}
      aria-current={isActive ? "page" : undefined}
      aria-disabled={!isActive && !tab.href ? true : undefined}
      role={tab.href ? undefined : "presentation"}
      className={cn(
        "relative inline-flex select-none items-center whitespace-nowrap px-2 py-1.5 text-[9px] uppercase tracking-[0.22em] transition-opacity sm:px-3 sm:py-2 sm:text-[10px] sm:tracking-[0.28em] md:px-5 md:text-[11px]",
        tab.href ? "cursor-pointer" : "cursor-not-allowed"
      )}
      style={{ color: isActive ? TOPBAR_ACCENT : TOPBAR_FG_INACTIVE }}
      title={isActive || tab.href ? undefined : "Coming soon"}
    >
      {isActive && (
        <span
          aria-hidden
          className="chamfer chamfer-xs absolute inset-y-1 left-0 right-0 -z-0"
          style={{
            "--chamfer-border-color": TOPBAR_ACCENT_BORDER,
            "--chamfer-bg": TOPBAR_ACCENT_BG,
          }}
        />
      )}
      <span className="relative z-10">{tab.label}</span>
    </Wrapper>
  );
}
