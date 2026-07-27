/**
 * useBlogContent.js
 * ---------------------------------------------------------------------------
 * Fetches ACF from the WordPress Blog page (header + featured quote +
 * relationship field `posts`) and merges onto DEFAULT_CONTENT.
 *
 * Configure in `.env`:
 *   VITE_WP_API_URL=https://devwp1.websiteserverhost.biz/ssp-calculator
 *   VITE_WP_BLOG_PAGE_ID=<id>
 *
 * Endpoint:
 *   {VITE_WP_API_URL}/wp-json/wp/v2/pages/{ID}
 *
 * Relationship may return post objects or IDs. If IDs only, a follow-up
 * request loads /wp-json/wp/v2/posts?include=…&_embed.
 *
 * Returns: { content, isLoading, isFallback, error, endpoint }
 * ---------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "./content";

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
    read: str(first(acf.read_time, acf.read, raw.read_time), "5 min"),
    tag: str(first(acf.tag, categoryName), "Article"),
    title,
    excerpt: stripHtml(excerptRaw),
  };
}

async function resolvePosts(rawPosts) {
  if (!Array.isArray(rawPosts) || rawPosts.length === 0) return null;

  const objects = rawPosts.filter(isPostObject).map(mapPostObject).filter(Boolean);
  if (objects.length === rawPosts.length) return objects;

  const ids = rawPosts.map(postId).filter((id) => id != null && !Number.isNaN(id));
  if (ids.length === 0) return objects.length > 0 ? objects : null;

  const base = wpBase();
  if (!base) return objects.length > 0 ? objects : null;

  const url = `${base}/wp-json/wp/v2/posts?include=${ids.join(",")}&per_page=${ids.length}&_embed=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WP posts API responded ${res.status}`);
  const json = await res.json();
  if (!Array.isArray(json)) return objects.length > 0 ? objects : null;

  const byId = new Map(json.map((p) => [Number(p.id), mapPostObject(p)]));
  const ordered = ids.map((id) => byId.get(Number(id))).filter(Boolean);
  return ordered.length > 0 ? ordered : objects.length > 0 ? objects : null;
}

export async function mapAcfResponseToContent(acf) {
  if (!acf || typeof acf !== "object") return {};

  const content = {};
  const headerG = group(acf, "header");

  if (
    headerG ||
    acf.kicker ||
    acf.title ||
    acf.description ||
    acf.blog_kicker ||
    acf.blog_title
  ) {
    content.kicker = str(
      first(headerG?.kicker, acf.kicker, acf.blog_kicker),
      DEFAULT_CONTENT.kicker,
    );
    content.title = str(
      first(headerG?.title, acf.title, acf.blog_title),
      DEFAULT_CONTENT.title,
    );
    content.description = str(
      first(headerG?.description, acf.description, acf.blog_description),
      DEFAULT_CONTENT.description,
    );
  }

  if (acf.featured_quote != null || acf.featuredQuote != null) {
    content.featuredQuote = str(
      first(acf.featured_quote, acf.featuredQuote),
      DEFAULT_CONTENT.featuredQuote,
    );
  }

  const rawPosts = acf.posts || acf.related_posts || acf.blog_posts;
  const posts = await resolvePosts(rawPosts);
  if (posts && posts.length > 0) {
    content.posts = posts;
  }

  return content;
}

function mergeContent(mapped) {
  return {
    ...DEFAULT_CONTENT,
    ...mapped,
    posts: mapped.posts ?? DEFAULT_CONTENT.posts,
  };
}

export function useBlogContent() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState(Boolean(ACF_ENDPOINT));
  const [isFallback, setIsFallback] = useState(!ACF_ENDPOINT);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ACF_ENDPOINT) {
      console.warn(
        "[Blog] WP fetch skipped — VITE_WP_API_URL or page ID/slug missing.\n" +
          "Set VITE_WP_API_URL and VITE_WP_BLOG_PAGE_ID then restart Vite.",
      );
      return;
    }

    let cancelled = false;

    async function load() {
      console.info("[Blog] Fetching ACF from", ACF_ENDPOINT);
      try {
        const res = await fetch(ACF_ENDPOINT);
        if (!res.ok) throw new Error(`WP REST API responded ${res.status}`);
        const json = await res.json();
        const page = Array.isArray(json) ? json[0] : json;
        const acf = page?.acf;

        if (!acf || (typeof acf === "object" && Object.keys(acf).length === 0)) {
          if (!cancelled) {
            setIsFallback(true);
            setError("Blog page ACF fields are empty");
            console.warn("[Blog] Page loaded but acf is empty — using DEFAULT_CONTENT");
          }
          return;
        }

        const mapped = await mapAcfResponseToContent(acf);
        if (!cancelled) {
          setContent(mergeContent(mapped));
          setIsFallback(false);
          setError(null);
          console.info("[Blog] ACF loaded OK", {
            pageId: page?.id,
            slug: page?.slug,
            acfKeys: Object.keys(acf),
            postCount: mapped.posts?.length,
          });
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Failed to load WP content";
          setIsFallback(true);
          setError(message);
          console.error("[Blog] ACF fetch failed — using DEFAULT_CONTENT:", message);
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

export default useBlogContent;
