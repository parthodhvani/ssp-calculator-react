import { n as __toESM } from "../_runtime.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as fetchWpJson, t as AcfPageGate } from "./AcfPageGate-Cd5taBmw.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { D as ArrowRight, r as TriangleAlert, v as CircleX, y as CircleCheck } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/eligibility-DMcMoey6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* useEligibilityContent.js — ACF only (no local default copy).
*/
var WP_API_URL = "https://devwp1.websiteserverhost.biz/ssp-calculator";
var PAGE_ID = "149";
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
function mapAcfResponseToContent(acf) {
	if (!acf || typeof acf !== "object") return null;
	const headerG = group(acf, "header");
	const answersG = group(acf, "answers");
	const outcomesG = group(acf, "outcomes");
	const rawQuestions = acf.questions || acf.eligibility_questions;
	const questions = Array.isArray(rawQuestions) ? rawQuestions.map((row, i) => ({
		id: str(first(row.id, row.question_id), `q${i + 1}`),
		q: str(first(row.question, row.q), ""),
		hint: str(first(row.hint, row.help_text), "")
	})).filter((row) => row.q) : [];
	return {
		kicker: str(first(headerG?.kicker, acf.kicker, acf.eligibility_kicker)),
		title: str(first(headerG?.title, acf.title, acf.eligibility_title)),
		description: str(first(headerG?.description, acf.description, acf.eligibility_description)),
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
			secondaryCtaLabel: str(first(outcomesG?.secondary_cta_label, acf.secondary_cta_label)),
			secondaryCtaLink: str(first(outcomesG?.secondary_cta_link, acf.secondary_cta_link))
		}
	};
}
function useEligibilityContent() {
	const [content, setContent] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(Boolean(ACF_ENDPOINT));
	const [error, setError] = (0, import_react.useState)(ACF_ENDPOINT ? null : "Missing VITE_WP_API_URL / VITE_WP_ELIGIBILITY_PAGE_ID");
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
	return {
		content,
		isLoading,
		error,
		endpoint: ACF_ENDPOINT
	};
}
/**
* QuestionItem.jsx — Eligibility page
* A single numbered yes/no question card. Labels from ACF.
*/
function QuestionItem({ index, item, value, onAnswer, yesLabel = "Yes", noLabel = "No" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-border bg-card p-5 sm:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary font-mono text-xs text-secondary-foreground",
				children: index + 1
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-lg leading-snug text-foreground",
						children: item.q
					}),
					item.hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: item.hint
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex gap-2",
						children: [{
							opt: "yes",
							label: yesLabel
						}, {
							opt: "no",
							label: noLabel
						}].map(({ opt, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onAnswer(item.id, opt),
							className: `inline-flex items-center gap-1.5 rounded-md border px-4 py-1.5 text-sm font-medium transition-colors ${value === opt ? opt === "yes" ? "border-primary bg-primary text-primary-foreground" : "border-destructive bg-destructive text-destructive-foreground" : "border-border bg-background text-foreground hover:bg-secondary"}`,
							children: [opt === "yes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3.5 w-3.5" }), label]
						}, opt))
					})
				]
			})]
		})
	});
}
/**
* content.js — Eligibility helpers (no hardcoded page copy).
*/
function resolveHref(link, fallback = "#") {
	if (link == null || String(link).trim() === "") return fallback;
	return String(link).trim();
}
/**
* ResultBanner.jsx — Eligibility page
* Shown once all questions are answered. Copy + CTA links from ACF.
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
function ResultBanner({ allYes, anyNo, outcomes }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `mt-8 rounded-2xl border p-6 sm:p-8 ${allYes ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [allYes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-5 w-5 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-5 w-5 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl text-foreground",
					children: allYes ? outcomes.allYesTitle : outcomes.notCoveredTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted-foreground",
					children: allYes ? outcomes.allYesBody : anyNo ? outcomes.anyNoBody : outcomes.grayZoneBody
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SmartLink, {
						href: outcomes.primaryCtaLink,
						className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: [
							outcomes.primaryCtaLabel,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartLink, {
						href: outcomes.secondaryCtaLink,
						className: "inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary",
						children: outcomes.secondaryCtaLabel
					})]
				})
			] })]
		})
	});
}
/**
* EligibilityPage.jsx — all copy from ACF.
*/
function EligibilityPage() {
	const { content, isLoading, error } = useEligibilityContent();
	const [answers, setAnswers] = (0, import_react.useState)({});
	function handleAnswer(id, opt) {
		setAnswers((a) => ({
			...a,
			[id]: opt
		}));
	}
	const questions = content?.questions ?? [];
	const answered = questions.filter((q) => answers[q.id]).length;
	const allYes = questions.length > 0 && answered === questions.length && questions.every((q) => answers[q.id] === "yes");
	const anyNo = questions.some((q) => answers[q.id] === "no");
	const done = questions.length > 0 && answered === questions.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AcfPageGate, {
		isLoading,
		error,
		label: "eligibility",
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
					className: "mt-10 space-y-4",
					children: questions.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionItem, {
						index: i,
						item,
						value: answers[item.id],
						onAnswer: handleAnswer,
						yesLabel: content.yesLabel,
						noLabel: content.noLabel
					}, item.id))
				}),
				done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultBanner, {
					allYes,
					anyNo,
					outcomes: content.outcomes
				})
			]
		}) : null
	});
}
var SplitComponent = EligibilityPage;
//#endregion
export { SplitComponent as component };
