/**
 * useRulesContent.js — ACF only (no local default copy).
 */
import { useEffect, useState } from "react";
import { BookOpen, Scale, Clock, AlertTriangle } from "lucide-react";
import { fetchWpJson } from "../shared/fetchWpJson";

const WP_API_URL = import.meta.env.VITE_WP_API_URL;
const PAGE_ID = import.meta.env.VITE_WP_RULES_PAGE_ID;
const PAGE_SLUG = import.meta.env.VITE_WP_RULES_SLUG || "rules";

const ICON_MAP = {
  scale: Scale,
  clock: Clock,
  alert: AlertTriangle,
  book: BookOpen,
};

function buildAcfEndpoint() {
  if (!WP_API_URL) return null;
  const base = WP_API_URL.replace(/\/$/, "");
  if (PAGE_ID) {
    return `${base}/wp-json/wp/v2/pages/${encodeURIComponent(String(PAGE_ID).trim())}`;
  }
  return `${base}/wp-json/wp/v2/pages?slug=${encodeURIComponent(PAGE_SLUG)}&_fields=id,slug,acf`;
}

const ACF_ENDPOINT = buildAcfEndpoint();

function str(value, fallback = "") {
  if (value == null || value === "") return fallback;
  return String(value);
}

function first(...candidates) {
  for (const v of candidates) {
    if (v != null && v !== "") return v;
  }
  return undefined;
}

function group(acf, name) {
  const g = acf?.[name];
  if (g && typeof g === "object" && !Array.isArray(g)) return g;
  return null;
}

function resolveIcon(raw) {
  if (typeof raw === "function") return raw;
  const key = String(raw || "scale").toLowerCase().trim();
  return ICON_MAP[key] || Scale;
}

function mapRefs(rawRefs) {
  if (!Array.isArray(rawRefs)) return [];
  return rawRefs
    .map((row) => {
      if (typeof row === "string") return row.trim();
      if (row && typeof row === "object") {
        return str(first(row.text, row.ref, row.label), "").trim();
      }
      return "";
    })
    .filter(Boolean);
}

export function mapAcfResponseToContent(acf) {
  if (!acf || typeof acf !== "object") return null;

  const headerG = group(acf, "header");
  const ctaG = group(acf, "cta");
  const rawSections = acf.sections || acf.rules_sections;

  return {
    kicker: str(first(headerG?.kicker, acf.kicker, acf.rules_kicker)),
    title: str(first(headerG?.title, acf.title, acf.rules_title)),
    description: str(
      first(headerG?.description, acf.description, acf.rules_description),
    ),
    sections: Array.isArray(rawSections)
      ? rawSections
          .map((row) => ({
            icon: resolveIcon(row.icon),
            kicker: str(row.kicker),
            title: str(row.title),
            body: str(row.body),
            refs: mapRefs(row.refs),
          }))
          .filter((row) => row.title)
      : [],
    ctaTitle: str(first(ctaG?.title, acf.cta_title, acf.ctaTitle)),
    ctaBody: str(first(ctaG?.body, acf.cta_body, acf.ctaBody)),
    primaryCtaLabel: str(
      first(ctaG?.primary_label, acf.primary_cta_label, acf.cta_primary_label),
    ),
    primaryCtaLink: str(
      first(ctaG?.primary_link, acf.primary_cta_link, acf.cta_primary_link),
    ),
    secondaryCtaLabel: str(
      first(ctaG?.secondary_label, acf.secondary_cta_label, acf.cta_secondary_label),
    ),
    secondaryCtaLink: str(
      first(ctaG?.secondary_link, acf.secondary_cta_link, acf.cta_secondary_link),
    ),
  };
}

export function useRulesContent() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(ACF_ENDPOINT));
  const [error, setError] = useState(
    ACF_ENDPOINT ? null : "Missing VITE_WP_API_URL / VITE_WP_RULES_PAGE_ID",
  );

  useEffect(() => {
    if (!ACF_ENDPOINT) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const json = await fetchWpJson(ACF_ENDPOINT);
        const page = Array.isArray(json) ? json[0] : json;
        const acf = page?.acf;

        if (!acf || Object.keys(acf).length === 0) {
          if (!cancelled) {
            setContent(null);
            setError("Rules page ACF fields are empty");
          }
          return;
        }

        if (!cancelled) {
          setContent(mapAcfResponseToContent(acf));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setContent(null);
          setError(err instanceof Error ? err.message : "Failed to load WP content");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { content, isLoading, error, endpoint: ACF_ENDPOINT };
}

export default useRulesContent;
