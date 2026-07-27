/**
 * content.js — Eligibility helpers (no hardcoded page copy).
 */
export function resolveHref(link, fallback = "#") {
  if (link == null || String(link).trim() === "") return fallback;
  return String(link).trim();
}
