/**
 * content.js — Calculate page helpers (no hardcoded page copy).
 */
export function formatTemplate(template, vars = {}) {
  if (!template) return "";
  return String(template).replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] != null ? String(vars[key]) : `{${key}}`,
  );
}

export function resolveHref(link, fallback = "#") {
  if (link == null || String(link).trim() === "") return fallback;
  return String(link).trim();
}
