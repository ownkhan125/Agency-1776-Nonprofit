"use client";

import { useRef, useState } from "react";
import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { StarMark } from "@/components/StarMark";
import { StarField } from "@/components/StarField";
import { Ribbon } from "@/components/Ribbon";
import { GlowFrame } from "@/components/GlowFrame";
import { TacticalDivider } from "@/components/TacticalDivider";
import { ScrollSmoother } from "@/animations/gsap";
import { cn } from "@/utils/cn";

// ── Field option lists (verbatim from the brief) ──────────────────────

const ORG_TYPES = [
  "Local nonprofit",
  "Community organization",
  "Faith-based organization",
  "Education / youth nonprofit",
  "Health and human services nonprofit",
  "Veteran support organization",
  "Advocacy nonprofit",
  "Foundation",
  "Animal welfare organization",
  "Grassroots movement",
  "Other",
];

const MAIN_GOALS = [
  "Increase donations",
  "Recruit volunteers",
  "Build credibility",
  "Explain programs clearly",
  "Promote events",
  "Launch a fundraising campaign",
  "Grow email list",
  "Modernize outdated website",
  "Organize donors and volunteers",
  "Improve follow-up",
  "Not sure yet",
];

const SUPPORT_NEEDED = [
  "Mission website",
  "Donation page",
  "Volunteer signup path",
  "Fundraising campaign page",
  "Impact storytelling",
  "Supporter follow-up",
  "Donor thank-you messaging",
  "Volunteer reminders",
  "Social media assets",
  "Email / supporter copy",
  "Outreach campaign support",
  "Full supporter engagement build",
];

const DONATION_TOOLS = [
  "Yes, donation platform is ready",
  "Partially",
  "No, we need help planning the donation path",
  "Not sure",
];

const MONTHLY_SUPPORT = [
  "Around $1,000/month",
  "Around $1,500/month",
  "Around $2,000/month",
  "Custom / not sure",
];

// ── Recommendation scoring ────────────────────────────────────────────
// Each selected option contributes points to one or more of the three
// builds. The build with the highest total is recommended; ties break to
// the monthly-support range, then to "donor" (the middle path).

const SCORE = {
  organizationType: {
    "Local nonprofit": { essential: 1 },
    "Community organization": { essential: 1 },
    "Faith-based organization": { essential: 1 },
    "Education / youth nonprofit": { essential: 1 },
    "Health and human services nonprofit": { donor: 1 },
    "Veteran support organization": { donor: 1 },
    "Advocacy nonprofit": { full: 1 },
    Foundation: { full: 1 },
    "Animal welfare organization": { donor: 1 },
    "Grassroots movement": { full: 1 },
    Other: {},
  },
  mainGoal: {
    "Increase donations": { donor: 2 },
    "Recruit volunteers": { full: 2 },
    "Build credibility": { essential: 2 },
    "Explain programs clearly": { essential: 2 },
    "Promote events": { full: 1, donor: 1 },
    "Launch a fundraising campaign": { donor: 2 },
    "Grow email list": { full: 2 },
    "Modernize outdated website": { essential: 2 },
    "Organize donors and volunteers": { full: 2 },
    "Improve follow-up": { full: 2 },
    "Not sure yet": {},
  },
  supportNeeded: {
    "Mission website": { essential: 2 },
    "Donation page": { donor: 2 },
    "Volunteer signup path": { full: 1 },
    "Fundraising campaign page": { donor: 2 },
    "Impact storytelling": { donor: 1, essential: 1 },
    "Supporter follow-up": { full: 2 },
    "Donor thank-you messaging": { donor: 2 },
    "Volunteer reminders": { full: 2 },
    "Social media assets": { full: 1 },
    "Email / supporter copy": { full: 2 },
    "Outreach campaign support": { full: 2 },
    "Full supporter engagement build": { full: 3 },
  },
  donationTools: {
    "Yes, donation platform is ready": { donor: 1 },
    Partially: { donor: 1 },
    "No, we need help planning the donation path": { donor: 2 },
    "Not sure": {},
  },
  monthlySupport: {
    "Around $1,000/month": { essential: 3 },
    "Around $1,500/month": { donor: 3 },
    "Around $2,000/month": { full: 3 },
    "Custom / not sure": {},
  },
};

const BUDGET_TO_KEY = {
  "Around $1,000/month": "essential",
  "Around $1,500/month": "donor",
  "Around $2,000/month": "full",
};

function recommend(values) {
  const scores = { essential: 0, donor: 0, full: 0 };
  let selectedCount = 0;

  for (const field of Object.keys(SCORE)) {
    const value = values[field];
    if (!value) continue;
    selectedCount += 1;
    const pts = SCORE[field][value] || {};
    for (const key of Object.keys(pts)) scores[key] += pts[key];
  }

  if (selectedCount === 0) return null;

  const order = ["essential", "donor", "full"];
  const max = Math.max(...order.map((k) => scores[k]));
  const leaders = order.filter((k) => scores[k] === max);

  if (leaders.length === 1) return leaders[0];

  // Tie-break 1: the chosen monthly-support range, if it's a leader.
  const budgetKey = BUDGET_TO_KEY[values.monthlySupport];
  if (budgetKey && leaders.includes(budgetKey)) return budgetKey;
  // Tie-break 2: prefer the middle path, else the first leader.
  return leaders.includes("donor") ? "donor" : leaders[0];
}

// ── Build definitions (Section 3 cards) ───────────────────────────────

const BUILDS = [
  {
    key: "essential",
    title: "Essential Mission Website",
    best: "Best for organizations that need a professional website with mission, programs, donation, volunteer, and contact pages.",
    recommendedFor: [
      "New nonprofits",
      "Small organizations",
      "Volunteer-led groups",
      "Local community programs",
      "Organizations that need a credible online presence",
    ],
  },
  {
    key: "donor",
    title: "Donor Confidence Build",
    best: "Best for organizations that need a stronger donation experience, donor trust sections, recurring giving paths, supporter signups, donor thank-you messaging, and fundraising campaign content.",
    recommendedFor: [
      "Donation-driven nonprofits",
      "Fundraising campaigns",
      "Organizations seeking recurring donors",
      "Nonprofits promoting giving days",
      "Groups with active donor outreach",
    ],
  },
  {
    key: "full",
    title: "Full Supporter Engagement Build",
    best: "Best for nonprofits that need website pages, donation paths, volunteer pages, fundraising assets, supporter follow-up, email copy, outreach content, and ongoing creative support built together.",
    recommendedFor: [
      "Growing nonprofits",
      "Organizations running campaigns",
      "Community movements",
      "Foundations",
      "Advocacy nonprofits",
      "Nonprofits with multiple programs or audiences",
      "Teams that need ongoing monthly support",
    ],
  },
];

// ── Shared control styling (mirrors the contact form) ─────────────────

const controlBase =
  "w-full appearance-none border border-foreground/15 bg-[color:var(--color-input)] px-4 py-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_18%,transparent)]";

const chamferClip = {
  clipPath:
    "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
};

function SelectField({ label, id, name, options }) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[10px] uppercase tracking-[0.28em] text-foreground/60"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue=""
        className={cn(controlBase, "themed-select")}
        style={chamferClip}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function scrollToResults() {
  if (typeof window === "undefined") return;
  const target = document.getElementById("build-finder-results");
  if (!target) return;
  const smoother = ScrollSmoother.get?.();
  if (smoother) {
    smoother.scrollTo(target, true, "top 110px");
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * BuildFinderExperience — the interactive core (Section 2) plus the
 * build cards (Section 3), kept in one client component so the live
 * recommendation state is shared: submitting the finder computes a
 * recommended build key, highlights the matching card, and smooth-
 * scrolls the reader down to it.
 */
export function BuildFinderExperience() {
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(false);
  const formRef = useRef(null);

  const recommendedBuild = recommendation
    ? BUILDS.find((b) => b.key === recommendation)
    : null;

  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const values = {
      organizationType: (data.get("organizationType") || "").toString(),
      mainGoal: (data.get("mainGoal") || "").toString(),
      supportNeeded: (data.get("supportNeeded") || "").toString(),
      donationTools: (data.get("donationTools") || "").toString(),
      monthlySupport: (data.get("monthlySupport") || "").toString(),
    };

    const result = recommend(values);
    if (!result) {
      setError(true);
      setRecommendation(null);
      return;
    }
    setError(false);
    setRecommendation(result);
    // Let the highlight paint, then glide down to the result.
    requestAnimationFrame(() => scrollToResults());
  };

  return (
    <>
      {/* ===== SECTION 2 — the finder ===== */}
      <div className="relative overflow-hidden">
        <Ribbon
          variant="fold"
          tone="accent"
          opacity={0.16}
          width={14}
          className="-left-[8%] top-[18%] h-[36vh] w-[130%]"
        />
        <SectionShell
          id="build-finder"
          revealMode="once"
          innerClassName="relative mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-28"
        >
          <TacticalDivider
            label="Doctrine 02 · Build Finder"
            className="mb-14 md:mb-20"
          />

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-20">
            <div className="max-w-xl">
              <SplitText
                as="p"
                className="mb-5 text-[10px] uppercase tracking-[0.32em] text-accent"
                text="Monthly support for the mission"
              />
              <SplitText
                as="h2"
                scrub
                className="text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.05] tracking-tight"
                text="A Stronger Mission Needs More Than a One-Time Website."
              />
              <SplitText
                as="p"
                className="mt-8 text-base leading-relaxed text-foreground/70 md:text-lg"
                text="Most nonprofit partnerships are expected to range around $1,000–$2,000 per month, depending on scope, campaign needs, creative volume, supporter follow-up needs, promotion support, and ongoing monthly support."
              />
            </div>

            <div
              className="angular-panel relative p-8 md:p-12"
              data-animate-border
              style={{
                "--ap-cut": "22px",
                "--ap-bg": "var(--color-surface)",
                "--ap-border-color":
                  "color-mix(in srgb, var(--color-foreground) 12%, transparent)",
              }}
            >
              <span className="tac-bracket tac-bracket-tl" />
              <span className="tac-bracket tac-bracket-br" />

              <form
                ref={formRef}
                onSubmit={onSubmit}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-6 md:gap-y-7"
              >
                <SelectField
                  label="Organization Type"
                  id="bf-org-type"
                  name="organizationType"
                  options={ORG_TYPES}
                />
                <SelectField
                  label="Main Goal"
                  id="bf-main-goal"
                  name="mainGoal"
                  options={MAIN_GOALS}
                />
                <SelectField
                  label="Support Needed"
                  id="bf-support"
                  name="supportNeeded"
                  options={SUPPORT_NEEDED}
                />
                <SelectField
                  label="Do You Already Have Donation Tools?"
                  id="bf-donation-tools"
                  name="donationTools"
                  options={DONATION_TOOLS}
                />
                <div className="md:col-span-2">
                  <SelectField
                    label="Monthly Support Range"
                    id="bf-monthly"
                    name="monthlySupport"
                    options={MONTHLY_SUPPORT}
                  />
                </div>

                <p className="md:col-span-2 mt-1 text-sm leading-relaxed text-foreground/65">
                  Based on your organization type, goals, donation setup,
                  support needs, and monthly support range, Agency 1776 will
                  recommend the nonprofit build and support path that best fits
                  your mission.
                </p>

                <div className="md:col-span-2 mt-2 flex flex-col items-start gap-4">
                  <button
                    type="submit"
                    className="tac-btn tac-btn-primary"
                    data-cursor="button"
                  >
                    <span className="relative z-10 inline-block">
                      Get My Nonprofit Recommendation
                    </span>
                    <span
                      aria-hidden="true"
                      className="relative z-10 inline-block"
                    >
                      →
                    </span>
                  </button>

                  {error && (
                    <p
                      role="status"
                      className="text-[11px] uppercase tracking-[0.28em] text-red-500"
                    >
                      Select at least one option to get a recommendation.
                    </p>
                  )}

                  {recommendedBuild && (
                    <button
                      type="button"
                      onClick={scrollToResults}
                      data-cursor="link"
                      className="group inline-flex items-center gap-2 text-left text-[11px] uppercase tracking-[0.24em] text-accent"
                    >
                      <StarMark className="h-3.5 w-3.5 text-accent" />
                      <span>
                        Recommended: {recommendedBuild.title}
                      </span>
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-y-0.5"
                      >
                        ↓
                      </span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </SectionShell>
      </div>

      {/* ===== SECTION 3 — the build cards ===== */}
      <div className="relative overflow-hidden">
        <Ribbon
          variant="flow"
          tone="accent"
          opacity={0.16}
          width={20}
          className="-right-[10%] top-[30%] h-[34vh] w-[130%]"
          reverse
        />
        <SectionShell
          id="build-finder-results"
          innerClassName="relative mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24"
        >
          <div className="mb-10 flex flex-col items-center gap-6 text-center md:mb-16">
            <StarMark className="h-4 w-4 text-accent" />
            <SplitText
              as="h2"
              scrub
              className="max-w-3xl text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.05] tracking-tight"
              text="What Your Organization May Need."
            />
          </div>

          <ul
            className="grid gap-6 md:grid-cols-3 md:items-start lg:gap-8"
            style={{ perspective: "1200px" }}
          >
            {BUILDS.map((b) => {
              const isRecommended = b.key === recommendation;
              return (
                <li key={b.key} data-cursor="card" className="relative flex">
                  <GlowFrame
                    as="div"
                    className="flex h-full w-full"
                    radius="26px"
                    opacity={isRecommended ? 0.5 : 0.26}
                    opacityHover={isRecommended ? 0.68 : 0.46}
                    duration={isRecommended ? "11s" : "16s"}
                  >
                    <div
                      className={cn(
                        "angular-panel relative flex h-full w-full flex-col gap-6 p-8 md:p-10",
                        isRecommended &&
                          "shadow-[0_18px_60px_-30px_color-mix(in_srgb,var(--color-accent)_60%,transparent)]"
                      )}
                      style={{
                        "--ap-cut": "26px",
                        "--ap-bg": "var(--color-surface)",
                        "--ap-border-color": isRecommended
                          ? "color-mix(in srgb, var(--color-accent) 60%, transparent)"
                          : "color-mix(in srgb, var(--color-foreground) 14%, transparent)",
                      }}
                    >
                      <span className="tac-bracket tac-bracket-tl" />
                      <span className="tac-bracket tac-bracket-br" />
                      {isRecommended && (
                        <StarField
                          count={10}
                          seed={53}
                          className="absolute inset-0 opacity-[0.22]"
                        />
                      )}

                      {isRecommended && (
                        <span className="inline-flex w-fit items-center gap-2 bg-accent px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-white">
                          <span
                            aria-hidden="true"
                            className="inline-block h-1 w-1 rotate-45 bg-white"
                          />
                          Recommended for you
                        </span>
                      )}

                      <SplitText
                        as="h3"
                        className="text-2xl font-semibold leading-tight tracking-tight md:text-[1.7rem]"
                        text={b.title}
                      />

                      <p className="text-sm leading-relaxed text-foreground/75">
                        {b.best}
                      </p>

                      <div data-animate-seam className="tac-seam" />

                      <div className="flex flex-col gap-3">
                        <span className="text-[10px] uppercase tracking-[0.28em] text-foreground/45">
                          Recommended for
                        </span>
                        <ul className="flex flex-col gap-2.5 text-sm leading-snug text-foreground/80">
                          {b.recommendedFor.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2.5"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-2 inline-block h-1 w-1 shrink-0 rotate-45 bg-accent"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </GlowFrame>
                </li>
              );
            })}
          </ul>
        </SectionShell>
      </div>
    </>
  );
}
