"use client";

import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { StarField } from "@/components/StarField";
import { Ribbon } from "@/components/Ribbon";
import { StarMark } from "@/components/StarMark";
import { TacticalDivider } from "@/components/TacticalDivider";

/**
 * LegalDocument — shared editorial layout for text-heavy legal pages
 * (Privacy Policy, Terms & Conditions). A centered cinematic hero over
 * the site's ambient backdrop, then a single readable column of
 * numbered sections. Content is passed in as data so each legal page
 * stays a thin wrapper around this one component.
 *
 * @param {object}   props
 * @param {string}   props.eyebrow   small label above the title
 * @param {string}   props.title     page H1
 * @param {string}   props.updated   "Last updated" date string
 * @param {string[]} props.intro     intro paragraphs (below the title)
 * @param {Array<{heading:string, body?:React.ReactNode[], list?:React.ReactNode[], content?:Array<{type:"p"|"list", text?:React.ReactNode, items?:React.ReactNode[]}>}>} props.sections
 *
 * A section may use `body`/`list` for simple text, or `content` — an ordered
 * list of blocks — when paragraphs and lists need to interleave. Any text
 * value may be a React node, so inline links render inside a paragraph.
 */
export function LegalDocument({ eyebrow, title, updated, intro = [], sections = [] }) {
  return (
    <>
      {/* ===== Hero ===== */}
      <SectionShell
        id="legal-hero"
        withBorder={false}
        revealMode="once"
        className="relative flex min-h-[60svh] items-center overflow-hidden scanlines"
        innerClassName="relative z-10 mx-auto w-full max-w-[1600px] px-6 pt-40 pb-16 sm:pt-44 md:px-10 md:pt-48 md:pb-20"
      >
        <div
          aria-hidden="true"
          className="tactical-grid pointer-events-none absolute inset-0"
        />
        <div
          aria-hidden="true"
          className="flag-stripe-bg pointer-events-none absolute inset-0 opacity-50"
        />
        <Ribbon
          variant="flow"
          tone="accent"
          opacity={0.26}
          width={20}
          className="-left-[10%] top-[64%] h-[22vh] w-[130%]"
        />
        <StarField
          count={16}
          seed={29}
          className="absolute inset-0 opacity-[0.28]"
        />

        <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-foreground/60 md:text-xs">
            <StarMark className="h-3 w-3 text-accent" />
            <span>{eyebrow}</span>
          </div>

          <SplitText
            as="h1"
            scrub
            className="text-balance text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.02] tracking-tight"
            text={title}
          />

          {updated ? (
            <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-foreground/45">
              Last updated · {updated}
            </p>
          ) : null}
        </div>
      </SectionShell>

      {/* ===== Body ===== */}
      <SectionShell
        id="legal-body"
        revealMode="once"
        innerClassName="relative mx-auto max-w-[1600px] px-6 pb-24 pt-4 md:px-10 md:pb-32"
      >
        <div className="mx-auto max-w-3xl">
          {intro.length ? (
            <div className="flex flex-col gap-5">
              {intro.map((p, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed text-foreground/75 md:text-lg"
                >
                  {p}
                </p>
              ))}
            </div>
          ) : null}

          <div data-animate-seam className="mt-10 tac-seam md:mt-12" />

          <div className="mt-10 flex flex-col gap-12 md:mt-12">
            {sections.map((s, i) => (
              <section key={i} className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold leading-tight tracking-tight text-foreground md:text-2xl">
                  {s.heading}
                </h2>
                {(s.body || []).map((p, j) => (
                  <p
                    key={j}
                    className="text-base leading-relaxed text-foreground/75"
                  >
                    {p}
                  </p>
                ))}
                {s.list ? (
                  <ul className="flex flex-col gap-2.5 pl-1 text-base leading-relaxed text-foreground/75">
                    {s.list.map((item, k) => (
                      <li key={k} className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2.5 inline-block h-1 w-1 shrink-0 rotate-45 bg-accent"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {(s.content || []).map((block, j) =>
                  block.type === "list" ? (
                    <ul
                      key={j}
                      className="flex flex-col gap-2.5 pl-1 text-base leading-relaxed text-foreground/75"
                    >
                      {block.items.map((item, k) => (
                        <li key={k} className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-2.5 inline-block h-1 w-1 shrink-0 rotate-45 bg-accent"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      key={j}
                      className="text-base leading-relaxed text-foreground/75"
                    >
                      {block.text}
                    </p>
                  )
                )}
              </section>
            ))}
          </div>

          <div className="mt-14 md:mt-16">
            <TacticalDivider label="Agency 1776 · Nonprofit Division" accent />
          </div>
        </div>
      </SectionShell>
    </>
  );
}
