/**
 * useEligibilityContent.js
 * ---------------------------------------------------------------------------
 * Fetches ACF from the WordPress Eligibility page (ID 149) and merges onto
 * DEFAULT_CONTENT so the page never breaks if WP is unreachable.
 *
 * Configure in `.env`:
 *   VITE_WP_API_URL=https://devwp1.websiteserverhost.biz/ssp-calculator
 *   VITE_WP_ELIGIBILITY_PAGE_ID=149
 *
 * Endpoint:
 *   {VITE_WP_API_URL}/wp-json/wp/v2/pages/149
 *
 * Returns: { content, isLoading, isFallback, error, endpoint }
 * ---------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "./content";

const WP_API_URL = import.meta.env.VITE_WP_API_URL;
const PAGE_ID = import.meta.env.VITE_WP_ELIGIBILITY_PAGE_ID;
const PAGE_SLUG = import.meta.env.VITE_WP_ELIGIBILITY_SLUG || "eligibility";

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

export function mapAcfResponseToContent(acf) {
  if (!acf || typeof acf !== "object") return {};

  const content = {};
  const headerG = group(acf, "header");
  const answersG = group(acf, "answers");
  const outcomesG = group(acf, "outcomes");

  // ── Header ──────────────────────────────────────────────────────────────
  if (
    headerG ||
    acf.kicker ||
    acf.title ||
    acf.description ||
    acf.eligibility_kicker ||
    acf.eligibility_title
  ) {
    content.kicker = str(
      first(headerG?.kicker, acf.kicker, acf.eligibility_kicker),
      DEFAULT_CONTENT.kicker,
    );
    content.title = str(
      first(headerG?.title, acf.title, acf.eligibility_title),
      DEFAULT_CONTENT.title,
    );
    content.description = str(
      first(headerG?.description, acf.description, acf.eligibility_description),
      DEFAULT_CONTENT.description,
    );
  }

  // ── Yes / No labels ─────────────────────────────────────────────────────
  if (answersG || acf.yes_label || acf.no_label) {
    content.yesLabel = str(
      first(answersG?.yes_label, acf.yes_label),
      DEFAULT_CONTENT.yesLabel,
    );
    content.noLabel = str(
      first(answersG?.no_label, acf.no_label),
      DEFAULT_CONTENT.noLabel,
    );
  }

  // ── Questions repeater ──────────────────────────────────────────────────
  const rawQuestions = acf.questions || acf.eligibility_questions;
  if (Array.isArray(rawQuestions) && rawQuestions.length > 0) {
    content.questions = rawQuestions
      .map((row, i) => ({
        id: str(first(row.id, row.question_id), `q${i + 1}`),
        q: str(first(row.question, row.q), ""),
        hint: str(first(row.hint, row.help_text), ""),
      }))
      .filter((row) => row.q);
  }

  // ── Outcomes + CTAs ─────────────────────────────────────────────────────
  if (
    outcomesG ||
    acf.all_yes_title ||
    acf.not_covered_title ||
    acf.primary_cta_label
  ) {
    const d = DEFAULT_CONTENT.outcomes;
    content.outcomes = {
      allYesTitle: str(
        first(outcomesG?.all_yes_title, acf.all_yes_title),
        d.allYesTitle,
      ),
      notCoveredTitle: str(
        first(outcomesG?.not_covered_title, acf.not_covered_title),
        d.notCoveredTitle,
      ),
      allYesBody: str(
        first(outcomesG?.all_yes_body, acf.all_yes_body),
        d.allYesBody,
      ),
      anyNoBody: str(first(outcomesG?.any_no_body, acf.any_no_body), d.anyNoBody),
      grayZoneBody: str(
        first(outcomesG?.gray_zone_body, acf.gray_zone_body),
        d.grayZoneBody,
      ),
      primaryCtaLabel: str(
        first(outcomesG?.primary_cta_label, acf.primary_cta_label),
        d.primaryCtaLabel,
      ),
      primaryCtaLink: str(
        first(outcomesG?.primary_cta_link, acf.primary_cta_link),
        d.primaryCtaLink,
      ),
      secondaryCtaLabel: str(
        first(outcomesG?.secondary_cta_label, acf.secondary_cta_label),
        d.secondaryCtaLabel,
      ),
      secondaryCtaLink: str(
        first(outcomesG?.secondary_cta_link, acf.secondary_cta_link),
        d.secondaryCtaLink,
      ),
    };
  }

  return content;
}

function mergeContent(mapped) {
  return {
    ...DEFAULT_CONTENT,
    ...mapped,
    outcomes: { ...DEFAULT_CONTENT.outcomes, ...mapped.outcomes },
    questions: mapped.questions ?? DEFAULT_CONTENT.questions,
  };
}

export function useEligibilityContent() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState(Boolean(ACF_ENDPOINT));
  const [isFallback, setIsFallback] = useState(!ACF_ENDPOINT);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ACF_ENDPOINT) {
      console.warn(
        "[Eligibility] WP fetch skipped — VITE_WP_API_URL or page ID missing.\n" +
          "Set VITE_WP_API_URL and VITE_WP_ELIGIBILITY_PAGE_ID=149 then restart Vite.",
      );
      return;
    }

    let cancelled = false;

    async function load() {
      console.info("[Eligibility] Fetching ACF from", ACF_ENDPOINT);
      try {
        const res = await fetch(ACF_ENDPOINT);
        if (!res.ok) throw new Error(`WP REST API responded ${res.status}`);
        const json = await res.json();
        const page = Array.isArray(json) ? json[0] : json;
        const acf = page?.acf;

        if (!acf || (typeof acf === "object" && Object.keys(acf).length === 0)) {
          if (!cancelled) {
            setIsFallback(true);
            setError("Eligibility page ACF fields are empty");
            console.warn("[Eligibility] Page loaded but acf is empty — using DEFAULT_CONTENT");
          }
          return;
        }

        if (!cancelled) {
          setContent(mergeContent(mapAcfResponseToContent(acf)));
          setIsFallback(false);
          setError(null);
          console.info("[Eligibility] ACF loaded OK", {
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
          console.error("[Eligibility] ACF fetch failed — using DEFAULT_CONTENT:", message);
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

export default useEligibilityContent;
