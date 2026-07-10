import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Extend Next.js core-web-vitals + surface the project code-style
// rules the repo committed to in `.claude/Rule Guide/code-style.md`.
// Existing files still use PascalCase filenames + semicolons, so the
// style rules run at "warn" — they'll flag new violations without
// turning the current codebase red on `next lint`.
const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // JavaScript hygiene
      "no-var": "error",
      "prefer-const": "warn",
      "no-console": ["warn", { allow: ["error"] }],
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Prefer Next.js primitives over raw <a>/<img>
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "warn",
    },
  },
];

export default eslintConfig;
