import { cn } from "@/utils/cn";

/**
 * Splits text into word-level masks so GSAP can translate each word
 * independently. Whitespace is preserved so wrapped lines break at the
 * expected points.
 *
 * <SplitText text="Every act of care ripples further" as="h2" />
 *
 * Set `scrub` to true when the wrapping element should be picked up
 * by the scroll-scrubbed reveal in useSectionReveal (headings).
 * Otherwise the text runs on the section's timeline (body copy).
 */
export function SplitText({
  text,
  as: Tag = "span",
  className = "",
  scrub = false,
}) {
  const parts = String(text ?? "").split(/(\s+)/);

  return (
    <Tag
      className={cn("js-reveal-text", className)}
      data-scrub-text={scrub ? "" : undefined}
    >
      {parts.map((part, i) =>
        /^\s+$/.test(part) ? (
          <span key={i}>{part}</span>
        ) : (
          <span key={i} className="rt-word-mask">
            <span className="rt-word">{part}</span>
          </span>
        )
      )}
    </Tag>
  );
}
