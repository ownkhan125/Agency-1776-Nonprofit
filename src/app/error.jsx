"use client";

import { useEffect } from "react";

/**
 * Root error boundary. App Router calls this for any uncaught error
 * inside the route tree. Logs the error with a stable prefix so it's
 * easy to grep in production logs, and offers a `reset()` retry.
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("[app/error]:", error);
  }, [error]);

  return (
    <div
      role="alert"
      className="mx-auto flex min-h-[60svh] max-w-xl flex-col items-center justify-center gap-6 px-6 py-24 text-center"
    >
      <h2 className="text-2xl font-semibold uppercase tracking-tight text-foreground">
        Something went sideways.
      </h2>
      <p className="text-sm leading-relaxed text-foreground/70">
        We hit an unexpected error rendering this page. It has been logged.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full border border-accent/40 bg-accent px-6 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--color-accent-contrast)] transition-colors hover:bg-accent-hover"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
