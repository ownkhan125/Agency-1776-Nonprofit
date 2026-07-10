"use client";

import { useLayoutEffect, useRef } from "react";
import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { StarMark } from "@/components/StarMark";
import { Ribbon } from "@/components/Ribbon";
import { GlowFrame } from "@/components/GlowFrame";
import { gsap, registerGsap } from "@/animations/gsap";
import { applyStaggeredGrid } from "@/animations/staggeredGrid";
import { cn } from "@/utils/cn";

const CATEGORIES = [
  {
    title: "Community Nonprofits",
    blurb:
      "For organizations serving local needs, families, neighborhoods, and community programs.",
    items: [
      "Food assistance programs",
      "Housing support organizations",
      "Community outreach groups",
      "Local service nonprofits",
      "Neighborhood resource centers",
      "Crisis support organizations",
    ],
  },
  {
    title: "Faith-Based and Values-Led Organizations",
    blurb:
      "For organizations built around faith, service, family, community, and purpose.",
    items: [
      "Church ministries",
      "Faith-based nonprofits",
      "Religious community programs",
      "Family support groups",
      "Service missions",
      "Community care organizations",
    ],
  },
  {
    title: "Education and Youth Organizations",
    blurb:
      "For nonprofits helping children, students, families, schools, and young leaders.",
    items: [
      "Youth programs",
      "Mentorship organizations",
      "After-school programs",
      "Scholarship funds",
      "Education foundations",
      "Literacy programs",
    ],
  },
  {
    title: "Health, Human Services, and Veteran Support",
    blurb:
      "For organizations supporting health, recovery, care, dignity, and service.",
    items: [
      "Health nonprofits",
      "Mental health organizations",
      "Addiction recovery programs",
      "Veteran support groups",
      "Disability support organizations",
      "Family care nonprofits",
    ],
  },
  {
    title: "Advocacy and Cause-Based Organizations",
    blurb:
      "For nonprofits working to raise awareness, mobilize support, and create public action around a cause.",
    items: [
      "Issue advocacy nonprofits",
      "Public awareness campaigns",
      "Policy education groups",
      "Community action organizations",
      "Grassroots causes",
      "Volunteer-led movements",
    ],
  },
];

/**
 * Categories — editorial mixed-grid.
 * Top row splits into three narrower plates; bottom row widens into
 * two larger plates so the composition breathes and never repeats the
 * home page's rhythm. A full-bleed image band separates the two rows
 * — reads like a chapter break in an editorial spread.
 */
export function Categories() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      const grid = rootRef.current?.querySelector("[data-staggered-grid]");
      applyStaggeredGrid(grid);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const top = CATEGORIES.slice(0, 3);
  const bottom = CATEGORIES.slice(3);

  return (
    <div ref={rootRef} className="relative overflow-hidden">
      <Ribbon
        variant="fold"
        tone="accent"
        opacity={0.16}
        width={14}
        className="-left-[8%] top-[18%] h-[36vh] w-[130%]"
      />
      <SectionShell
        id="services-categories"
        innerClassName="relative mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24"
      >
        <div className="mb-10 max-w-4xl md:mb-14">
          <SplitText
            as="h2"
            scrub
            className="text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.05] tracking-tight"
            text="Built for Organizations Serving Real People and Real Causes."
          />
        </div>

        <ul
          data-staggered-grid
          className="grid gap-6 md:grid-cols-3 lg:gap-8"
        >
          {top.map((c, i) => (
            <CategoryCard key={c.title} category={c} col={i} alt={i === 1} />
          ))}
        </ul>

        <div className="relative my-12 md:my-16">
          <div
            className="angular-panel relative aspect-[16/5] overflow-hidden md:aspect-[21/6]"
            style={{
              "--ap-cut": "24px",
              "--ap-bg": "var(--color-surface)",
              "--ap-border-color":
                "color-mix(in srgb, var(--color-foreground) 14%, transparent)",
            }}
          >
            <img
              src="https://picsum.photos/seed/agency1776-services-community/2000/700"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity opacity-80"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-accent) 14%, transparent)",
              }}
            />
            <span className="tac-bracket tac-bracket-tl" />
            <span className="tac-bracket tac-bracket-br" />
          </div>
        </div>

        <ul className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {bottom.map((c, i) => (
            <CategoryCard
              key={c.title}
              category={c}
              col={i + 3}
              alt={i === 0}
              wide
            />
          ))}
        </ul>
      </SectionShell>
    </div>
  );
}

function CategoryCard({ category, col, alt, wide = false }) {
  return (
    <GlowFrame
      as="article"
      data-col={col}
      data-cursor="card"
      className="staggered-card"
      radius="24px"
      opacity={0.24}
      opacityHover={0.42}
      duration="18s"
    >
      <div
        className={cn(
          "angular-panel relative flex h-full flex-col gap-6 p-8 md:p-10",
          alt && "angular-panel-alt"
        )}
        style={{
          "--ap-cut": "22px",
          "--ap-bg": "var(--color-surface)",
          "--ap-border-color":
            "color-mix(in srgb, var(--color-foreground) 14%, transparent)",
        }}
      >
        <span className="tac-bracket tac-bracket-tl" />
        <span className="tac-bracket tac-bracket-br" />

        <div className="flex items-start gap-3">
          <StarMark className="mt-1 h-4 w-4 shrink-0 text-accent" />
          <SplitText
            as="h3"
            className="text-xl font-semibold leading-tight tracking-tight md:text-2xl"
            text={category.title}
          />
        </div>

        <SplitText
          as="p"
          className="text-sm leading-relaxed text-foreground/70 md:text-base"
          text={category.blurb}
        />

        <div data-animate-seam className="tac-seam" />

        <ul
          className={cn(
            "flex flex-col gap-3 text-sm leading-snug tracking-tight text-foreground/80 md:text-base",
            wide && "md:grid md:grid-cols-2 md:gap-x-8"
          )}
        >
          {category.items.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className="mt-2 inline-block h-1 w-1 shrink-0 rotate-45 bg-accent"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </GlowFrame>
  );
}
