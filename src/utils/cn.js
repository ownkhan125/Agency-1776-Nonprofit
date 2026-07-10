/**
 * Dependency-free classname joiner.
 * Accepts strings, arrays, objects — filters out falsy values.
 *
 * cn("btn", isActive && "btn-active", { "btn-lg": size === "lg" })
 */
export function cn(...inputs) {
  const out = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string" || typeof input === "number") {
      out.push(input);
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else if (typeof input === "object") {
      for (const key in input) {
        if (input[key]) out.push(key);
      }
    }
  }

  return out.join(" ");
}
