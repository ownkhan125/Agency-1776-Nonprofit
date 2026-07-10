"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsap } from "@/animations/gsap";
import { cn } from "@/utils/cn";

const TABS = [
  { id: "business",    label: "Business",                  active: false, href: null },
  { id: "politicians", label: "Politicians or Candidates", active: false, href: null },
  { id: "nonprofit",   label: "Nonprofit",                 active: true,  href: null },
];

export default function TopBar() {
  const scopeRef = useRef(null);

  useLayoutEffect(() => {
    if (!scopeRef.current) return;
    registerGsap();
    const scope = scopeRef.current;
    const ctx = gsap.context(() => {
      const inactive = scope.querySelectorAll("[data-topbar-tab='inactive']");
      inactive.forEach((el) => {
        const hoverIn  = () => gsap.to(el, { color: "var(--color-foreground)", duration: 0.35, ease: "power2.out" });
        const hoverOut = () => gsap.to(el, { color: "color-mix(in srgb, var(--color-foreground) 45%, transparent)", duration: 0.35, ease: "power2.out" });
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
      className="fixed inset-x-0 top-0 z-[60] border-b border-muted/40 bg-background/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-2 px-2 py-1.5 sm:gap-4 sm:px-4 sm:py-2 md:px-12">
        <div className="flex min-w-0 flex-1 items-center gap-0 overflow-x-auto no-scrollbar sm:gap-2 lg:flex-none lg:gap-4">
          {TABS.map((t) => (
            <TopBarTab key={t.id} tab={t} />
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-4 whitespace-nowrap text-[10px] uppercase tracking-[0.28em] text-foreground/50 lg:flex">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-1 w-1 rounded-full bg-accent" />
            Nonprofit Division
          </span>
          <span className="text-foreground/30">/</span>
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
        isActive
          ? "text-accent"
          : "cursor-not-allowed text-foreground/45 hover:text-foreground",
        tab.href ? "cursor-pointer" : ""
      )}
      title={isActive ? undefined : "Coming soon"}
    >
      {isActive && (
        <span
          aria-hidden
          className="chamfer chamfer-xs absolute inset-y-1 left-0 right-0 -z-0"
          style={{
            "--chamfer-border-color":
              "color-mix(in srgb, var(--color-accent) 60%, transparent)",
            "--chamfer-bg": "color-mix(in srgb, var(--color-accent) 6%, transparent)",
          }}
        />
      )}
      <span className="relative z-10">{tab.label}</span>
    </Wrapper>
  );
}
