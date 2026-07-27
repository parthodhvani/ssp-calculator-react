/**
 * useContactContent.js
 * ---------------------------------------------------------------------------
 * Fetches ACF from the WordPress Contact page and merges onto DEFAULT_CONTENT.
 *
 * Configure in `.env`:
 *   VITE_WP_API_URL=…
 *   VITE_WP_CONTACT_PAGE_ID=<id>
 *
 * Form submissions use Contact Form 7 separately (see submitContactForm.js).
 *
 * Returns: { content, isLoading, isFallback, error, endpoint }
 * ---------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { DEFAULT_CONTENT } from "./content";

const WP_API_URL = import.meta.env.VITE_WP_API_URL;
const PAGE_ID = import.meta.env.VITE_WP_CONTACT_PAGE_ID;
const PAGE_SLUG = import.meta.env.VITE_WP_CONTACT_SLUG || "contact";

const ICON_MAP = {
  mail: Mail,
  message: MessageSquare,
  map: MapPin,
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
  const key = String(raw || "mail").toLowerCase().trim();
  return ICON_MAP[key] || Mail;
}

export function mapAcfResponseToContent(acf) {
  if (!acf || typeof acf !== "object") return {};

  const content = {};
  const headerG = group(acf, "header");

  if (
    headerG ||
    acf.kicker ||
    acf.title ||
    acf.description ||
    acf.contact_kicker
  ) {
    content.kicker = str(
      first(headerG?.kicker, acf.kicker, acf.contact_kicker),
      DEFAULT_CONTENT.kicker,
    );
    content.title = str(
      first(headerG?.title, acf.title, acf.contact_title),
      DEFAULT_CONTENT.title,
    );
    content.description = str(
      first(headerG?.description, acf.description, acf.contact_description),
      DEFAULT_CONTENT.description,
    );
  }

  const rawInfo = acf.info_items || acf.contact_info;
  if (Array.isArray(rawInfo) && rawInfo.length > 0) {
    content.infoItems = rawInfo
      .map((row) => ({
        icon: resolveIcon(row.icon),
        label: str(row.label, ""),
        value: str(row.value, ""),
        href: str(first(row.href, row.link), "") || undefined,
      }))
      .filter((row) => row.label && row.value);
  }

  if (acf.legal_note != null || acf.contact_legal_note != null) {
    content.legalNote = str(
      first(acf.legal_note, acf.contact_legal_note),
      DEFAULT_CONTENT.legalNote,
    );
  }

  const rawTopics = acf.topics || acf.contact_topics;
  if (Array.isArray(rawTopics) && rawTopics.length > 0) {
    content.topics = rawTopics
      .map((row) =>
        typeof row === "string"
          ? row.trim()
          : str(first(row.label, row.topic_label, row.value), "").trim(),
      )
      .filter(Boolean);
  }

  if (
    acf.success_title != null ||
    acf.success_body != null ||
    acf.contact_success_title != null ||
    acf.submit_label != null
  ) {
    content.successTitle = str(
      first(acf.success_title, acf.contact_success_title),
      DEFAULT_CONTENT.successTitle,
    );
    content.successBody = str(
      first(acf.success_body, acf.contact_success_body),
      DEFAULT_CONTENT.successBody,
    );
    content.submitLabel = str(
      first(acf.submit_label, acf.contact_submit_label),
      DEFAULT_CONTENT.submitLabel,
    );
  }

  return content;
}

function mergeContent(mapped) {
  return {
    ...DEFAULT_CONTENT,
    ...mapped,
    infoItems: mapped.infoItems ?? DEFAULT_CONTENT.infoItems,
    topics: mapped.topics ?? DEFAULT_CONTENT.topics,
  };
}

export function useContactContent() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState(Boolean(ACF_ENDPOINT));
  const [isFallback, setIsFallback] = useState(!ACF_ENDPOINT);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ACF_ENDPOINT) {
      console.warn(
        "[Contact] WP fetch skipped — set VITE_WP_API_URL and VITE_WP_CONTACT_PAGE_ID (or slug), then restart Vite.",
      );
      return;
    }

    let cancelled = false;

    async function load() {
      console.info("[Contact] Fetching ACF from", ACF_ENDPOINT);
      try {
        const res = await fetch(ACF_ENDPOINT);
        if (!res.ok) throw new Error(`WP REST API responded ${res.status}`);
        const json = await res.json();
        const page = Array.isArray(json) ? json[0] : json;
        const acf = page?.acf;

        if (!acf || (typeof acf === "object" && Object.keys(acf).length === 0)) {
          if (!cancelled) {
            setIsFallback(true);
            setError("Contact page ACF fields are empty");
            console.warn("[Contact] Page loaded but acf is empty — using DEFAULT_CONTENT");
          }
          return;
        }

        if (!cancelled) {
          setContent(mergeContent(mapAcfResponseToContent(acf)));
          setIsFallback(false);
          setError(null);
          console.info("[Contact] ACF loaded OK", {
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
          console.error("[Contact] ACF fetch failed — using DEFAULT_CONTENT:", message);
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

export default useContactContent;
