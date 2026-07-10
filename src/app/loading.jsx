/**
 * Root-segment loading UI shown by React Suspense while the tree
 * hydrates or a subtree throws to a boundary. Kept intentionally
 * minimal — a centered accent glyph pulse — so it matches the site's
 * chrome-first style and avoids CLS on interrupt/resume.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-background"
    >
      <span className="sr-only">Loading</span>
      <span className="relative inline-flex h-10 w-10 items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-accent/25 blur-md"
          style={{ animation: "loading-pulse 1.4s ease-in-out infinite" }}
        />
        <svg
          viewBox="0 0 40 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="relative h-8 w-8 text-accent"
          aria-hidden="true"
        >
          <circle cx="14" cy="18" r="10" />
          <circle cx="26" cy="18" r="10" />
          <circle cx="20" cy="28" r="10" />
        </svg>
      </span>
      <style>
        {`@keyframes loading-pulse {
            0%, 100% { transform: scale(0.9); opacity: 0.55; }
            50%      { transform: scale(1.15); opacity: 0.9; }
          }`}
      </style>
    </div>
  );
}
