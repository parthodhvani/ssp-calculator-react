import { n as __toESM } from "../_runtime.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as fetchWpJson, t as AcfPageGate } from "./AcfPageGate-Cd5taBmw.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as Send, d as Mail, f as LoaderCircle, l as MessageSquare, u as MapPin, y as CircleCheck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-C1PjdQip.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* useContactContent.js — ACF only (no local default copy).
*/
var WP_API_URL$1 = "https://devwp1.websiteserverhost.biz/ssp-calculator";
var PAGE_ID = "247";
var ICON_MAP = {
	mail: Mail,
	message: MessageSquare,
	map: MapPin
};
function buildAcfEndpoint() {
	return `${WP_API_URL$1.replace(/\/$/, "")}/wp-json/wp/v2/pages/${encodeURIComponent(String(PAGE_ID).trim())}`;
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
	return ICON_MAP[String(raw || "mail").toLowerCase().trim()] || Mail;
}
function mapAcfResponseToContent(acf) {
	if (!acf || typeof acf !== "object") return null;
	const headerG = group(acf, "header");
	const rawInfo = acf.info_items || acf.contact_info;
	const rawTopics = acf.topics || acf.contact_topics;
	return {
		kicker: str(first(headerG?.kicker, acf.kicker, acf.contact_kicker)),
		title: str(first(headerG?.title, acf.title, acf.contact_title)),
		description: str(first(headerG?.description, acf.description, acf.contact_description)),
		infoItems: Array.isArray(rawInfo) ? rawInfo.map((row) => ({
			icon: resolveIcon(row.icon),
			label: str(row.label),
			value: str(row.value),
			href: str(first(row.href, row.link)) || void 0
		})).filter((row) => row.label && row.value) : [],
		legalNote: str(first(acf.legal_note, acf.contact_legal_note)),
		topics: Array.isArray(rawTopics) ? rawTopics.map((row) => typeof row === "string" ? row.trim() : str(first(row.label, row.topic_label, row.value)).trim()).filter(Boolean) : [],
		successTitle: str(first(acf.success_title, acf.contact_success_title)),
		successBody: str(first(acf.success_body, acf.contact_success_body)),
		submitLabel: str(first(acf.submit_label, acf.contact_submit_label))
	};
}
function useContactContent() {
	const [content, setContent] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(Boolean(ACF_ENDPOINT));
	const [error, setError] = (0, import_react.useState)(ACF_ENDPOINT ? null : "Missing VITE_WP_API_URL / VITE_WP_CONTACT_PAGE_ID");
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
	return {
		content,
		isLoading,
		error,
		endpoint: ACF_ENDPOINT
	};
}
/**
* ContactInfoList.jsx — Contact page
* Left column: email / press / location cards + legal disclaimer.
*/
function ContactInfoList({ items, legalNote }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "space-y-5",
		children: [items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-3.5 w-3.5 text-accent" }), item.label]
			}), item.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: item.href,
				className: "mt-2 block font-serif text-lg text-foreground hover:text-accent",
				children: item.value
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-serif text-lg text-foreground",
				children: item.value
			})]
		}, item.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-1 text-xs leading-relaxed text-muted-foreground",
			children: legalNote
		})]
	});
}
/**
* submitContactForm.js
* ---------------------------------------------------------------------------
* Posts to the custom WordPress route in functions.php:
*   POST {VITE_WP_API_URL}/wp-json/recura/v1/contact
*
* Submissions appear as private posts titled "Contact: …"
* ---------------------------------------------------------------------------
*/
var WP_API_URL = "https://devwp1.websiteserverhost.biz/ssp-calculator";
function getContactEndpoint() {
	return `${WP_API_URL.replace(/\/$/, "")}/wp-json/recura/v1/contact`;
}
/**
* @param {{ name: string, email: string, topic: string, message: string }} fields
* @returns {Promise<{ ok: boolean, status: string, message: string, raw?: object }>}
*/
async function submitContactForm(fields) {
	const endpoint = getContactEndpoint();
	if (!endpoint) return {
		ok: false,
		status: "config_error",
		message: "Set VITE_WP_API_URL in .env and restart Vite."
	};
	const res = await fetch(endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({
			name: fields.name ?? "",
			email: fields.email ?? "",
			topic: fields.topic ?? "",
			message: fields.message ?? ""
		})
	});
	let json = null;
	try {
		json = await res.json();
	} catch {}
	if (!res.ok) return {
		ok: false,
		status: json?.code || "http_error",
		message: json?.message || `WordPress responded ${res.status}.`,
		raw: json ?? void 0
	};
	return {
		ok: true,
		status: json?.status || "saved",
		message: json?.message || "Message received.",
		raw: json ?? void 0
	};
}
/**
* ContactForm.jsx — Contact page
* Submits to WordPress:
*   POST …/wp-json/recura/v1/contact
*/
function ContactForm({ topics, successTitle, successBody, submitLabel = "" }) {
	const [sent, setSent] = (0, import_react.useState)(false);
	const [topic, setTopic] = (0, import_react.useState)(topics?.[0] || "");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!topics?.length) return;
		if (!topics.includes(topic)) setTopic(topics[0]);
	}, [topics, topic]);
	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		const form = e.currentTarget;
		const data = new FormData(form);
		setSubmitting(true);
		try {
			const result = await submitContactForm({
				name: String(data.get("name") || ""),
				email: String(data.get("email") || ""),
				topic,
				message: String(data.get("message") || "")
			});
			if (result.ok) {
				setSent(true);
				form.reset();
			} else {
				setError(result.message || "Could not send your message. Please try again.");
				console.error("[Contact] submit failed", result);
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : "Network error — could not reach WordPress.";
			setError(message);
			console.error("[Contact] submit error", err);
		} finally {
			setSubmitting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "rounded-2xl border border-border bg-card p-6 sm:p-8",
		children: sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center gap-3 py-12 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-10 w-10 text-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl text-foreground",
					children: successTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-md text-sm text-muted-foreground",
					children: successBody
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setSent(false);
						setError(null);
					},
					className: "mt-2 inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary",
					children: "Send another message"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
						children: "Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "text",
						name: "name",
						autoComplete: "name",
						disabled: submitting,
						className: "mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none disabled:opacity-60",
						placeholder: "Anna de Vries"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "email",
						name: "email",
						autoComplete: "email",
						disabled: submitting,
						className: "mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none disabled:opacity-60",
						placeholder: "you@company.nl"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
					children: "Topic"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: topics.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: submitting,
						onClick: () => setTopic(t),
						className: `rounded-md border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${topic === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:bg-secondary"}`,
						children: t
					}, t))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
					children: "Message"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					required: true,
					rows: 6,
					name: "message",
					disabled: submitting,
					className: "mt-2 w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none disabled:opacity-60",
					placeholder: "Tell us what you're trying to figure out…"
				})] }),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "submit",
					disabled: submitting,
					className: "inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60",
					children: [submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), submitting ? "Sending…" : submitLabel]
				})
			]
		})
	});
}
/**
* ContactPage.jsx — all copy from ACF; form posts to WP REST.
*/
function ContactPage() {
	const { content, isLoading, error } = useContactContent();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AcfPageGate, {
		isLoading,
		error,
		label: "contact",
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 grid gap-8 lg:grid-cols-[1fr_1.4fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactInfoList, {
						items: content.infoItems,
						legalNote: content.legalNote
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactForm, {
						topics: content.topics,
						successTitle: content.successTitle,
						successBody: content.successBody,
						submitLabel: content.submitLabel
					})]
				})
			]
		}) : null
	});
}
var SplitComponent = ContactPage;
//#endregion
export { SplitComponent as component };
