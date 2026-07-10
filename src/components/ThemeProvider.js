"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  toggle: () => {},
});

const STORAGE_KEY = "theme";

/**
 * Reads the current theme without triggering a hydration mismatch.
 * The inline init script (see themeInitScript below) is already set
 * data-theme on <html> before React ran, so this is the authoritative
 * source for the initial value on the client.
 */
function readInitialTheme() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/**
 * Wraps the app in a theme context. Persists user choice to
 * localStorage and syncs data-theme on <html>. Adds a short
 * `theme-swapping` class to synchronise transitions during a swap.
 */
export function ThemeProvider({ children }) {
  // Both server and first client render start at "light" — the inline
  // script has already applied the correct theme to <html>, so any
  // visual output that depends on CSS custom properties is already
  // correct. Components that render differently by theme should read
  // via useTheme() after mount (see ThemeToggle).
  const [theme, setThemeState] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setThemeState(readInitialTheme());
    setMounted(true);
  }, []);

  const setTheme = useCallback((next) => {
    const value = next === "dark" ? "dark" : "light";
    const root = document.documentElement;

    // Guard against unrelated transitions firing mid-swap.
    root.classList.add("theme-swapping");
    root.dataset.theme = value;
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // localStorage may be blocked (private mode, quota) — non-fatal.
    }
    setThemeState(value);

    // Remove the guard once the CSS transition completes.
    window.setTimeout(() => {
      root.classList.remove("theme-swapping");
    }, 320);
  }, []);

  const toggle = useCallback(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  }, [setTheme]);

  // Respond to system preference changes IF the user hasn't picked
  // a preference yet. If they have, their explicit choice wins.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      try {
        if (window.localStorage.getItem(STORAGE_KEY)) return;
      } catch {
        return;
      }
      setTheme(e.matches ? "dark" : "light");
    };
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * Inline script content. Injected into <head> in app/layout.js via
 * dangerouslySetInnerHTML so it runs BEFORE React hydrates and before
 * any body markup paints — this is the no-flash guarantee. Never
 * import this into a client bundle; it's meant to run raw.
 */
export const themeInitScript = `
(function(){try{
  var stored = window.localStorage.getItem("${STORAGE_KEY}");
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var theme = stored === "dark" || stored === "light" ? stored : (prefersDark ? "dark" : "light");
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}catch(e){
  document.documentElement.dataset.theme = "light";
  document.documentElement.style.colorScheme = "light";
}})();
`;
