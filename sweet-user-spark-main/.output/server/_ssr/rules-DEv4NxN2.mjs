import { n as __toESM } from "../_runtime.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as fetchWpJson, t as AcfPageGate } from "./AcfPageGate-Cd5taBmw.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { D as ArrowRight, T as BookOpen, g as Clock, o as Scale, r as TriangleAlert } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rules-DEv4NxN2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* useRulesContent.js — ACF only (no local default copy).
*/
var WP_API_URL = "https://devwp1.websiteserverhost.biz/ssp-calculator";
var PAGE_ID = "191";
var ICON_MAP = {
	scale: Scale,
	clock: Clock,
	alert: TriangleAlert,
	book: BookOpen
};
function buildAcfEndpoint() {
	return `${WP_API_URL.replace(/\/$/, "")}/wp-json/wp/v2/pages/${encodeURIComponent(String(PAGE_ID).trim())}`;
}
var ACF_ENDPOINT = buildAcfEndpoint();
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
function resolveIcon(raw) {
	if (typeof raw === "function") return raw;
	return ICON_MAP[String(raw || "scale").toLowerCase().trim()] || Scale;
}
function mapRefs(rawRefs) {
	if (!Array.isArray(rawRefs)) return [];
	return rawRefs.map((row) => {
		if (typeof row === "string") return row.trim();
		if (row && typeof row === "object") return str(first(row.text, row.ref, row.label), "").trim();
		return "";
	}).filter(Boolean);
}
function mapAcfResponseToContent(acf) {
	if (!acf || typeof acf !== "object") return null;
	const headerG = group(acf, "header");
	const ctaG = group(acf, "cta");
	const rawSections = acf.sections || acf.rules_sections;
	return {
		kicker: str(first(headerG?.kicker, acf.kicker, acf.rules_kicker)),
		title: str(first(headerG?.title, acf.title, acf.rules_title)),
		description: str(first(headerG?.description, acf.description, acf.rules_description)),
		sections: Array.isArray(rawSections) ? rawSections.map((row) => ({
			icon: resolveIcon(row.icon),
			kicker: str(row.kicker),
			title: str(row.title),
			body: str(row.body),
			refs: mapRefs(row.refs)
		})).filter((row) => row.title) : [],
		ctaTitle: str(first(ctaG?.title, acf.cta_title, acf.ctaTitle)),
		ctaBody: str(first(ctaG?.body, acf.cta_body, acf.ctaBody)),
		primaryCtaLabel: str(first(ctaG?.primary_label, acf.primary_cta_label, acf.cta_primary_label)),
		primaryCtaLink: str(first(ctaG?.primary_link, acf.primary_cta_link, acf.cta_primary_link)),
		secondaryCtaLabel: str(first(ctaG?.secondary_label, acf.secondary_cta_label, acf.cta_secondary_label)),
		secondaryCtaLink: str(first(ctaG?.secondary_link, acf.secondary_cta_link, acf.cta_secondary_link))
	};
}
function useRulesContent() {
	const [content, setContent] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(Boolean(ACF_ENDPOINT));
	const [error, setError] = (0, import_react.useState)(ACF_ENDPOINT ? null : "Missing VITE_WP_API_URL / VITE_WP_RULES_PAGE_ID");
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
	return {
		content,
		isLoading,
		error,
		endpoint: ACF_ENDPOINT
	};
}
/**
* RuleCard.jsx — Rules page
* A single statutory-rule card (icon, kicker, title, body, reference tags).
*/
function RuleCard({ section }) {
	const Icon = section.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "flex flex-col rounded-2xl border border-border bg-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
					children: section.kicker
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 font-serif text-xl leading-snug text-foreground",
				children: section.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 flex-1 text-sm leading-relaxed text-muted-foreground",
				children: section.body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex flex-wrap gap-1.5 border-t border-border/60 pt-4",
				children: section.refs.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-md bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-secondary-foreground",
					children: r
				}, r))
			})
		]
	});
}
/**
* content.js — Rules helpers (no hardcoded page copy).
*/
function resolveHref(link, fallback = "#") {
	if (link == null || String(link).trim() === "") return fallback;
	return String(link).trim();
}
/**
* CtaBanner.jsx — Rules page
* Bottom call-to-action; labels/links come from ACF (with defaults).
*/
function SmartLink({ href, className, children }) {
	const to = resolveHref(href, "/");
	const isExternal = /^https?:\/\//i.test(to);
	if (to.startsWith("/") && !isExternal) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		className,
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: to,
		className,
		...isExternal ? {
			target: "_blank",
			rel: "noopener noreferrer"
		} : {},
		children
	});
}
function CtaBanner({ title, body, primaryLabel = "", primaryLink = "", secondaryLabel = "", secondaryLink = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-12 rounded-2xl border border-border bg-secondary/40 p-6 sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl text-foreground",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-sm text-muted-foreground",
				children: body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap gap-2",
				children: [primaryLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SmartLink, {
					href: primaryLink,
					className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
					children: [
						primaryLabel,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
					]
				}) : null, secondaryLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartLink, {
					href: secondaryLink,
					className: "inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary",
					children: secondaryLabel
				}) : null]
			})
		]
	});
}
/**
* RulesPage.jsx — all copy from ACF.
*/
function RulesPage() {
	const { content, isLoading, error } = useRulesContent();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AcfPageGate, {
		isLoading,
		error,
		label: "rules",
		children: content ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto w-full max-w-4xl px-6 py-16 sm:py-20",
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid gap-5 sm:grid-cols-2",
					children: content.sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCard, { section }, section.title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtaBanner, {
					title: content.ctaTitle,
					body: content.ctaBody,
					primaryLabel: content.primaryCtaLabel,
					primaryLink: content.primaryCtaLink,
					secondaryLabel: content.secondaryCtaLabel,
					secondaryLink: content.secondaryCtaLink
				})
			]
		}) : null
	});
}
var SplitComponent = RulesPage;
//#endregion
export { SplitComponent as component };
