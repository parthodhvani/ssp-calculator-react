import { n as __toESM } from "../_runtime.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as fetchWpJson, t as AcfPageGate } from "./AcfPageGate-Cd5taBmw.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { E as ArrowUpRight, g as Clock } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog-2aC1ofWv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* useBlogContent.js — ACF only (no local default copy).
* Relationship field `posts` on the Blog page.
*/
var WP_API_URL = "https://devwp1.websiteserverhost.biz/ssp-calculator";
var PAGE_ID = "189";
function buildAcfEndpoint() {
	return `${WP_API_URL.replace(/\/$/, "")}/wp-json/wp/v2/pages/${encodeURIComponent(String(PAGE_ID).trim())}`;
}
var ACF_ENDPOINT = buildAcfEndpoint();
function wpBase() {
	return WP_API_URL.replace(/\/$/, "");
}
function str(value, fallback = "") {
	if (value == null || value === "") return fallback;
	return String(value);
}
function first(...candidates) {
	for (const v of candidates) if (v != null && v !== "") return v;
}
function group(acf, name) {
	const g = acf?.[name];
	if (g && typeof g === "object" && !Array.isArray(g)) return g;
	return null;
}
function stripHtml(html) {
	return str(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function formatDate(raw) {
	if (!raw) return "";
	const d = new Date(raw);
	if (Number.isNaN(d.getTime())) return str(raw);
	return d.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric"
	});
}
function isPostObject(item) {
	return item && typeof item === "object" && !Array.isArray(item) && (item.title != null || item.post_title != null || item.slug != null);
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
	const titleRaw = first(typeof raw.title === "object" ? raw.title?.rendered : raw.title, raw.post_title);
	const excerptRaw = first(typeof raw.excerpt === "object" ? raw.excerpt?.rendered : raw.excerpt, raw.post_excerpt);
	const dateRaw = first(raw.date, raw.post_date);
	const acf = raw.acf && typeof raw.acf === "object" ? raw.acf : {};
	const categoryName = (raw._embedded?.["wp:term"]?.flat?.() || (Array.isArray(raw._embedded?.["wp:term"]) ? raw._embedded["wp:term"].flat() : []))?.find((t) => t?.taxonomy === "category" && t?.name)?.name;
	const title = stripHtml(titleRaw);
	if (!title) return null;
	return {
		id: postId(raw),
		slug: str(raw.slug || raw.post_name, ""),
		date: formatDate(dateRaw) || str(dateRaw),
		read: str(first(acf.read_time, acf.read, raw.read_time), ""),
		tag: str(first(acf.tag, categoryName), ""),
		title,
		excerpt: stripHtml(excerptRaw)
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
async function mapAcfResponseToContent(acf) {
	if (!acf || typeof acf !== "object") return null;
	const headerG = group(acf, "header");
	const posts = await resolvePosts(acf.posts || acf.related_posts || acf.blog_posts);
	return {
		kicker: str(first(headerG?.kicker, acf.kicker, acf.blog_kicker)),
		title: str(first(headerG?.title, acf.title, acf.blog_title)),
		description: str(first(headerG?.description, acf.description, acf.blog_description)),
		featuredQuote: str(first(acf.featured_quote, acf.featuredQuote)),
		posts
	};
}
function useBlogContent() {
	const [content, setContent] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(Boolean(ACF_ENDPOINT));
	const [error, setError] = (0, import_react.useState)(ACF_ENDPOINT ? null : "Missing VITE_WP_API_URL / VITE_WP_BLOG_PAGE_ID");
	(0, import_react.useEffect)(() => {
		if (!ACF_ENDPOINT) {
			setIsLoading(false);
			return;
		}
		let cancelled = false;
		async function load() {
			try {
				const json = await fetchWpJson(ACF_ENDPOINT);
				const acf = (Array.isArray(json) ? json[0] : json)?.acf;
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
	return {
		content,
		isLoading,
		error,
		endpoint: ACF_ENDPOINT
	};
}
/**
* FeaturedPost.jsx — Blog page
* The large "hero" article card at the top of the post list.
*/
function FeaturedPost({ post, quote }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group mt-12 grid gap-6 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/40 sm:grid-cols-[1.4fr_1fr] sm:p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md bg-accent/15 px-2 py-0.5 font-mono uppercase tracking-wider text-accent",
						children: post.tag
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: post.date
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
							" ",
							post.read
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 font-serif text-2xl leading-snug text-foreground sm:text-3xl",
				children: post.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted-foreground",
				children: post.excerpt
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent",
				children: [
					"Read the article",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: "hidden rounded-xl bg-gradient-to-br from-primary/90 via-primary to-accent/60 p-8 sm:flex sm:items-end",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
				className: "font-serif text-xl leading-snug text-primary-foreground",
				children: [
					"\"",
					quote,
					"\""
				]
			})
		})]
	});
}
/**
* PostCard.jsx — Blog page
* A single card in the post grid (everything except the featured post).
*/
function PostCard({ post }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/40",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-md bg-secondary px-2 py-0.5 font-mono uppercase tracking-wider text-secondary-foreground",
					children: post.tag
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: post.date
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-3 font-serif text-lg leading-snug text-foreground",
				children: post.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 flex-1 text-sm leading-relaxed text-muted-foreground",
				children: post.excerpt
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
						" ",
						post.read
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })]
			})
		]
	});
}
/**
* BlogPage.jsx — all copy from ACF (relationship posts).
*/
function BlogPage() {
	const { content, isLoading, error } = useBlogContent();
	const [featured, ...rest] = content?.posts ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AcfPageGate, {
		isLoading,
		error,
		label: "blog",
		children: content ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto w-full max-w-5xl px-6 py-16 sm:py-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.18em] text-accent",
					children: content.kicker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-serif text-4xl tracking-tight text-foreground sm:text-5xl",
					children: content.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground",
					children: content.description
				}),
				featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeaturedPost, {
					post: featured,
					quote: content.featuredQuote
				}) : null,
				rest.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 grid gap-4 sm:grid-cols-2",
					children: rest.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCard, { post }) }, post.id ?? post.slug ?? post.title))
				}) : null
			]
		}) : null
	});
}
var SplitComponent = BlogPage;
//#endregion
export { SplitComponent as component };
