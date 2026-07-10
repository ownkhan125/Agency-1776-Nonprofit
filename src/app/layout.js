import "./globals.css";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import { ThemeProvider, themeInitScript } from "@/components/ThemeProvider";

// Editorial display face — all-caps by nature, best at large sizes with
// a touch of tracking. Exposed as --font-heading; base rules in
// globals.css route h1-h6 through it.
const bebasNeue = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

// Body workhorse — geometric with wide counters, reads well from tiny
// captions to 20px+ subheads. Exposed as --font-body; --font-sans in
// the @theme block resolves to this so every default text element
// (paragraphs, buttons, form fields, footer) inherits it.
const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Agency 1776 · Nonprofit Websites",
  description:
    "Agency 1776 builds nonprofit websites that earn donor confidence and make it easier for people to give, volunteer, partner, and stay involved.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bebasNeue.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        {/*
          Blocking inline script — runs BEFORE React hydrates, before any
          body markup paints. Reads localStorage + prefers-color-scheme
          and sets data-theme on <html> so the CSS custom properties
          resolve correctly on first paint. Prevents FOUC and hydration
          mismatch (suppressHydrationWarning above covers the data
          attribute the script mutates).
        */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
