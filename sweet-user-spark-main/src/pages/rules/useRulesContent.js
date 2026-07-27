/**
 * useRulesContent.js
 * ---------------------------------------------------------------------------
 * Fetches ACF from the WordPress Rules page and merges onto DEFAULT_CONTENT
 * so the page never breaks if WP is unreachable.
 *
 * Configure in `.env`:
 *   VITE_WP_API_URL=https://devwp1.websiteserverhost.biz/ssp-calculator
 *   VITE_WP_RULES_PAGE_ID=<id>
 *
 * Endpoint:
 *   {VITE_WP_API_URL}/wp-json/wp/v2/pages/{ID}
 *
 * Returns: { content, isLoading, isFallback, error, endpoint }
 * ---------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";
import { BookOpen, Scale, Clock, AlertTriangle } from "lucide-react";
import { DEFAULT_CONTENT } from "./content";

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

function str(value, fallback) {
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
  if (!acf || typeof acf !== "object") return {};

  const content = {};
  const headerG = group(acf, "header");
  const ctaG = group(acf, "cta");

  if (
    headerG ||
    acf.kicker ||
    acf.title ||
    acf.description ||
    acf.rules_kicker ||
    acf.rules_title
  ) {
    content.kicker = str(
      first(headerG?.kicker, acf.kicker, acf.rules_kicker),
      DEFAULT_CONTENT.kicker,
    );
    content.title = str(
      first(headerG?.title, acf.title, acf.rules_title),
      DEFAULT_CONTENT.title,
    );
    content.description = str(
      first(headerG?.description, acf.description, acf.rules_description),
      DEFAULT_CONTENT.description,
    );
  }

  const rawSections = acf.sections || acf.rules_sections;
  if (Array.isArray(rawSections) && rawSections.length > 0) {
    content.sections = rawSections
      .map((row) => ({
        icon: resolveIcon(row.icon),
        kicker: str(row.kicker, ""),
        title: str(row.title, ""),
        body: str(row.body, ""),
        refs: mapRefs(row.refs),
      }))
      .filter((row) => row.title);
  }

  if (
    ctaG ||
    acf.cta_title ||
    acf.ctaTitle ||
    acf.primary_cta_label ||
    acf.cta_body
  ) {
    content.ctaTitle = str(
      first(ctaG?.title, acf.cta_title, acf.ctaTitle),
      DEFAULT_CONTENT.ctaTitle,
    );
    content.ctaBody = str(
      first(ctaG?.body, acf.cta_body, acf.ctaBody),
      DEFAULT_CONTENT.ctaBody,
    );
    content.primaryCtaLabel = str(
      first(ctaG?.primary_label, acf.primary_cta_label, acf.cta_primary_label),
      DEFAULT_CONTENT.primaryCtaLabel,
    );
    content.primaryCtaLink = str(
      first(ctaG?.primary_link, acf.primary_cta_link, acf.cta_primary_link),
      DEFAULT_CONTENT.primaryCtaLink,
    );
    content.secondaryCtaLabel = str(
      first(
        ctaG?.secondary_label,
        acf.secondary_cta_label,
        acf.cta_secondary_label,
      ),
      DEFAULT_CONTENT.secondaryCtaLabel,
    );
    content.secondaryCtaLink = str(
      first(
        ctaG?.secondary_link,
        acf.secondary_cta_link,
        acf.cta_secondary_link,
      ),
      DEFAULT_CONTENT.secondaryCtaLink,
    );
  }

  return content;
}

function mergeContent(mapped) {
  return {
    ...DEFAULT_CONTENT,
    ...mapped,
    sections: mapped.sections ?? DEFAULT_CONTENT.sections,
  };
}

export function useRulesContent() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState(Boolean(ACF_ENDPOINT));
  const [isFallback, setIsFallback] = useState(!ACF_ENDPOINT);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ACF_ENDPOINT) {
      console.warn(
        "[Rules] WP fetch skipped — VITE_WP_API_URL or page ID/slug missing.\n" +
          "Set VITE_WP_API_URL and VITE_WP_RULES_PAGE_ID then restart Vite.",
      );
      return;
    }

    let cancelled = false;

    async function load() {
      console.info("[Rules] Fetching ACF from", ACF_ENDPOINT);
      try {
        const res = await fetch(ACF_ENDPOINT);
        if (!res.ok) throw new Error(`WP REST API responded ${res.status}`);
        const json = await res.json();
        const page = Array.isArray(json) ? json[0] : json;
        const acf = page?.acf;

        if (!acf || (typeof acf === "object" && Object.keys(acf).length === 0)) {
          if (!cancelled) {
            setIsFallback(true);
            setError("Rules page ACF fields are empty");
            console.warn("[Rules] Page loaded but acf is empty — using DEFAULT_CONTENT");
          }
          return;
        }

        if (!cancelled) {
          setContent(mergeContent(mapAcfResponseToContent(acf)));
          setIsFallback(false);
          setError(null);
          console.info("[Rules] ACF loaded OK", {
            pageId: page?.id,
            slug: page?.slug,
            acfKeys: Object.keys(acf),
          });
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Failed to load WP content";
          setIsFallback(true);
          setError(message);
          console.error("[Rules] ACF fetch failed — using DEFAULT_CONTENT:", message);
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

  return { content, isLoading, isFallback, error, endpoint: ACF_ENDPOINT };
}

export default useRulesContent;
