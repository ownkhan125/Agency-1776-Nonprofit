"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsap } from "@/animations/gsap";
import { cn } from "@/utils/cn";

const TABS = [
  { id: "business",    label: "Business",                  active: false, href: "https://www.agency1776.com" },
  { id: "politicians", label: "Politicians or Candidates", active: false, href: "https://politicians.agency1776.com" },
  { id: "nonprofit",   label: "Nonprofit",                 active: true,  href: "https://nonprofits.agency1776.com" },
];

// Top Bar palette is intentionally frozen to the dark-theme values and
// applied via inline styles / literal colors — so this shared division
// switcher reads identically across every 1776 site and in both light
// and dark mode. Mirrors the Business site's TopBar exactly.
const TOPBAR_BG      = "rgba(0, 0, 0, 0.95)";
const TOPBAR_BORDER  = "rgba(74, 74, 74, 0.4)";
const TOPBAR_WHITE   = "#ffffff";                    // division tabs — full white for readability
const TOPBAR_ACCENT  = "#bf0a30";                    // brand crimson (hover feedback)

export default function TopBar() {
  const scopeRef = useRef(null);

  useLayoutEffect(() => {
    if (!scopeRef.current) return;
    registerGsap();
    const scope = scopeRef.current;
    const ctx = gsap.context(() => {
      const inactive = scope.querySelectorAll("[data-topbar-tab='inactive']");
      inactive.forEach((el) => {
        const hoverIn  = () => gsap.to(el, { color: TOPBAR_ACCENT, duration: 0.35, ease: "power2.out" });
        const hoverOut = () => gsap.to(el, { color: TOPBAR_WHITE,  duration: 0.35, ease: "power2.out" });
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
      data-topbar-root
      className="fixed inset-x-0 top-0 z-[60] border-b backdrop-blur-md"
      style={{ backgroundColor: TOPBAR_BG, borderBottomColor: TOPBAR_BORDER }}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-2 md:px-12">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto no-scrollbar sm:gap-2 lg:flex-none lg:gap-4">
          {TABS.map((t) => (
            <TopBarTab key={t.id} tab={t} />
          ))}
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
      // Division sites are separate deployments — open them in a new tab
      // rather than replacing the current one.
      target={tab.href ? "_blank" : undefined}
      rel={tab.href ? "noopener noreferrer" : undefined}
      data-topbar-tab={isActive ? "active" : "inactive"}
      data-cursor={tab.href ? "link" : "default"}
      aria-current={isActive ? "page" : undefined}
      role={tab.href ? undefined : "presentation"}
      className={cn(
        "relative inline-flex select-none items-center whitespace-nowrap px-3 py-2 text-[13px] font-semibold uppercase tracking-[0.2em] md:px-5 md:text-sm",
        tab.href ? "cursor-pointer" : "cursor-not-allowed"
      )}
      style={{ color: TOPBAR_WHITE }}
      title={!isActive && !tab.href ? "Coming soon" : undefined}
    >
      {isActive && (
        <span
          aria-hidden
          className="chamfer chamfer-xs absolute inset-y-1 left-0 right-0 -z-0"
          style={{
            "--chamfer-border-color": "rgba(191, 10, 48, 0.6)",
            "--chamfer-bg": "rgba(191, 10, 48, 0.06)",
          }}
        />
      )}
      <span className="relative z-10">{tab.label}</span>
    </Wrapper>
  );
}
