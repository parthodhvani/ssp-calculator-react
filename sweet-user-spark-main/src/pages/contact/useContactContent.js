/**
 * useContactContent.js — ACF only (no local default copy).
 */
import { useEffect, useState } from "react";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { fetchWpJson } from "../shared/fetchWpJson";

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
  const key = String(raw || "mail").toLowerCase().trim();
  return ICON_MAP[key] || Mail;
}

export function mapAcfResponseToContent(acf) {
  if (!acf || typeof acf !== "object") return null;

  const headerG = group(acf, "header");
  const rawInfo = acf.info_items || acf.contact_info;
  const rawTopics = acf.topics || acf.contact_topics;

  return {
    kicker: str(first(headerG?.kicker, acf.kicker, acf.contact_kicker)),
    title: str(first(headerG?.title, acf.title, acf.contact_title)),
    description: str(
      first(headerG?.description, acf.description, acf.contact_description),
    ),
    infoItems: Array.isArray(rawInfo)
      ? rawInfo
          .map((row) => ({
            icon: resolveIcon(row.icon),
            label: str(row.label),
            value: str(row.value),
            href: str(first(row.href, row.link)) || undefined,
          }))
          .filter((row) => row.label && row.value)
      : [],
    legalNote: str(first(acf.legal_note, acf.contact_legal_note)),
    topics: Array.isArray(rawTopics)
      ? rawTopics
          .map((row) =>
            typeof row === "string"
              ? row.trim()
              : str(first(row.label, row.topic_label, row.value)).trim(),
          )
          .filter(Boolean)
      : [],
    successTitle: str(first(acf.success_title, acf.contact_success_title)),
    successBody: str(first(acf.success_body, acf.contact_success_body)),
    submitLabel: str(first(acf.submit_label, acf.contact_submit_label)),
  };
}

export function useContactContent() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(ACF_ENDPOINT));
  const [error, setError] = useState(
    ACF_ENDPOINT ? null : "Missing VITE_WP_API_URL / VITE_WP_CONTACT_PAGE_ID",
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
            setError("Contact page ACF fields are empty");
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

export default useContactContent;
