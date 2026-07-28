/**
 * useBlogContent.js — ACF only (no local default copy).
 * Relationship field `posts` on the Blog page.
 */
import { useEffect, useState } from "react";
import { fetchWpJson } from "../shared/fetchWpJson";

const WP_API_URL = import.meta.env.VITE_WP_API_URL;
const PAGE_ID = import.meta.env.VITE_WP_BLOG_PAGE_ID;
const PAGE_SLUG = import.meta.env.VITE_WP_BLOG_SLUG || "blog";

function buildAcfEndpoint() {
  if (!WP_API_URL) return null;
  const base = WP_API_URL.replace(/\/$/, "");
  if (PAGE_ID) {
    return `${base}/wp-json/wp/v2/pages/${encodeURIComponent(String(PAGE_ID).trim())}`;
  }
  return `${base}/wp-json/wp/v2/pages?slug=${encodeURIComponent(PAGE_SLUG)}&_fields=id,slug,acf`;
}

const ACF_ENDPOINT = buildAcfEndpoint();

function wpBase() {
  return WP_API_URL ? WP_API_URL.replace(/\/$/, "") : "";
}

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

function stripHtml(html) {
  return str(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(raw) {
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return str(raw);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isPostObject(item) {
  return (
    item &&
    typeof item === "object" &&
    !Array.isArray(item) &&
    (item.title != null || item.post_title != null || item.slug != null)
  );
}

function postId(item) {
  if (typeof item === "number") return item;
  if (typeof item === "string" && /^\d+$/.test(item)) return Number(item);
  if (item && typeof item === "object") {
    const id = first(item.ID, item.id);
    return id != null ? Number(id) : null;
  }
  return null;
}

function mapPostObject(raw) {
  if (!raw || typeof raw !== "object") return null;

  const titleRaw = first(
    typeof raw.title === "object" ? raw.title?.rendered : raw.title,
    raw.post_title,
  );
  const excerptRaw = first(
    typeof raw.excerpt === "object" ? raw.excerpt?.rendered : raw.excerpt,
    raw.post_excerpt,
  );
  const dateRaw = first(raw.date, raw.post_date);
  const acf = raw.acf && typeof raw.acf === "object" ? raw.acf : {};

  const embeddedTerms =
    raw._embedded?.["wp:term"]?.flat?.() ||
    (Array.isArray(raw._embedded?.["wp:term"])
      ? raw._embedded["wp:term"].flat()
      : []);
  const categoryName = embeddedTerms?.find(
    (t) => t?.taxonomy === "category" && t?.name,
  )?.name;

  const title = stripHtml(titleRaw);
  if (!title) return null;

  return {
    id: postId(raw),
    slug: str(raw.slug || raw.post_name, ""),
    date: formatDate(dateRaw) || str(dateRaw),
    read: str(first(acf.read_time, acf.read, raw.read_time), ""),
    tag: str(first(acf.tag, categoryName), ""),
    title,
    excerpt: stripHtml(excerptRaw),
  };
}

async function resolvePosts(rawPosts) {
  if (!Array.isArray(rawPosts) || rawPosts.length === 0) return [];

  const objects = rawPosts.filter(isPostObject).map(mapPostObject).filter(Boolean);
  if (objects.length === rawPosts.length) return objects;

  const ids = rawPosts.map(postId).filter((id) => id != null && !Number.isNaN(id));
  if (ids.length === 0) return objects;

  const base = wpBase();
  if (!base) return objects;

  const url = `${base}/wp-json/wp/v2/posts?include=${ids.join(",")}&per_page=${ids.length}&_embed=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WP posts API responded ${res.status}`);
  const json = await res.json();
  if (!Array.isArray(json)) return objects;

  const byId = new Map(json.map((p) => [Number(p.id), mapPostObject(p)]));
  return ids.map((id) => byId.get(Number(id))).filter(Boolean);
}

export async function mapAcfResponseToContent(acf) {
  if (!acf || typeof acf !== "object") return null;

  const headerG = group(acf, "header");
  const rawPosts = acf.posts || acf.related_posts || acf.blog_posts;
  const posts = await resolvePosts(rawPosts);

  return {
    kicker: str(first(headerG?.kicker, acf.kicker, acf.blog_kicker)),
    title: str(first(headerG?.title, acf.title, acf.blog_title)),
    description: str(
      first(headerG?.description, acf.description, acf.blog_description),
    ),
    featuredQuote: str(first(acf.featured_quote, acf.featuredQuote)),
    posts,
  };
}

export function useBlogContent() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(ACF_ENDPOINT));
  const [error, setError] = useState(
    ACF_ENDPOINT ? null : "Missing VITE_WP_API_URL / VITE_WP_BLOG_PAGE_ID",
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
            setError("Blog page ACF fields are empty");
          }
          return;
        }

        const mapped = await mapAcfResponseToContent(acf);
        if (!cancelled) {
          setContent(mapped);
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

export default useBlogContent;
