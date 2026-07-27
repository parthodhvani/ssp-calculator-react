/**
 * useEligibilityContent.js — ACF only (no local default copy).
 */
import { useEffect, useState } from "react";

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

export function mapAcfResponseToContent(acf) {
  if (!acf || typeof acf !== "object") return null;

  const headerG = group(acf, "header");
  const answersG = group(acf, "answers");
  const outcomesG = group(acf, "outcomes");

  const rawQuestions = acf.questions || acf.eligibility_questions;
  const questions = Array.isArray(rawQuestions)
    ? rawQuestions
        .map((row, i) => ({
          id: str(first(row.id, row.question_id), `q${i + 1}`),
          q: str(first(row.question, row.q), ""),
          hint: str(first(row.hint, row.help_text), ""),
        }))
        .filter((row) => row.q)
    : [];

  return {
    kicker: str(first(headerG?.kicker, acf.kicker, acf.eligibility_kicker)),
    title: str(first(headerG?.title, acf.title, acf.eligibility_title)),
    description: str(
      first(headerG?.description, acf.description, acf.eligibility_description),
    ),
    yesLabel: str(first(answersG?.yes_label, acf.yes_label)),
    noLabel: str(first(answersG?.no_label, acf.no_label)),
    questions,
    outcomes: {
      allYesTitle: str(first(outcomesG?.all_yes_title, acf.all_yes_title)),
      notCoveredTitle: str(first(outcomesG?.not_covered_title, acf.not_covered_title)),
      allYesBody: str(first(outcomesG?.all_yes_body, acf.all_yes_body)),
      anyNoBody: str(first(outcomesG?.any_no_body, acf.any_no_body)),
      grayZoneBody: str(first(outcomesG?.gray_zone_body, acf.gray_zone_body)),
      primaryCtaLabel: str(first(outcomesG?.primary_cta_label, acf.primary_cta_label)),
      primaryCtaLink: str(first(outcomesG?.primary_cta_link, acf.primary_cta_link)),
      secondaryCtaLabel: str(
        first(outcomesG?.secondary_cta_label, acf.secondary_cta_label),
      ),
      secondaryCtaLink: str(
        first(outcomesG?.secondary_cta_link, acf.secondary_cta_link),
      ),
    },
  };
}

export function useEligibilityContent() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(ACF_ENDPOINT));
  const [error, setError] = useState(
    ACF_ENDPOINT ? null : "Missing VITE_WP_API_URL / VITE_WP_ELIGIBILITY_PAGE_ID",
  );

  useEffect(() => {
    if (!ACF_ENDPOINT) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(ACF_ENDPOINT);
        if (!res.ok) throw new Error(`WP REST API responded ${res.status}`);
        const json = await res.json();
        const page = Array.isArray(json) ? json[0] : json;
        const acf = page?.acf;

        if (!acf || Object.keys(acf).length === 0) {
          if (!cancelled) {
            setContent(null);
            setError("Eligibility page ACF fields are empty");
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

export default useEligibilityContent;
