import { n as __toESM } from "../_runtime.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as LoaderCircle, m as FileText, n as Upload, r as TriangleAlert, v as CircleX, y as CircleCheck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/policy-analyser-DtxIfkFE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* content.js — Policy Analyser page
* ---------------------------------------------------------------------------
* `demoFindings` stands in for the real analysis result. Wire the analysis
* itself up in useAnalysis.js (or directly in PolicyAnalyserPage) by
* replacing the setTimeout with a call to your AI/analysis endpoint.
* ---------------------------------------------------------------------------
*/
var DEFAULT_CONTENT = {
	kicker: "Tool · Beta",
	title: "Policy analyser",
	description: "Upload your sick-leave policy, contract or CAO excerpt. We compare every clause against Dutch statutory rules and flag anything that falls below the floor.",
	demoFindings: [
		{
			status: "pass",
			clause: "Year 1 continued pay set at 100% of gross salary",
			detail: "Well above the statutory floor of 70% (Art. 7:629)."
		},
		{
			status: "pass",
			clause: "Year 2 continued pay set at 80%",
			detail: "Above the 70% minimum."
		},
		{
			status: "warn",
			clause: "2 waiting days per illness",
			detail: "Legally allowed, but many CAOs waive this. Worth negotiating."
		},
		{
			status: "fail",
			clause: "Pay suspended after 5 late notifications in 12 months",
			detail: "Blanket suspension is not enforceable — pay may only be suspended after a formal reintegration warning."
		}
	]
};
/**
* UploadPanel.jsx — Policy Analyser page
* Left column: file drop zone + paste-text fallback + "Analyse" trigger.
*/
function UploadPanel({ fileName, text, setText, analyzing, onFile, onAnalyze }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border bg-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-lg text-foreground",
				children: "1. Provide the document"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				htmlFor: "policy-file",
				className: "mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/30 px-4 py-10 text-center transition-colors hover:border-accent hover:bg-secondary/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6 text-accent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium text-foreground",
						children: fileName ?? "Drop a PDF or DOCX, or click to select"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Max 10 MB · nothing leaves your browser in demo mode"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "policy-file",
						type: "file",
						accept: ".pdf,.doc,.docx,.txt",
						className: "sr-only",
						onChange: (e) => onFile(e.target.files?.[0] ?? null)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: "Or paste the text"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: text,
						onChange: (e) => setText(e.target.value),
						rows: 6,
						placeholder: "Paste the sick-leave clauses from your contract or handbook…",
						className: "mt-2 w-full resize-y rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onAnalyze,
						disabled: !text && !fileName,
						className: "mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40",
						children: [analyzing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }), "Analyse"]
					})
				]
			})
		]
	});
}
/**
* FindingsPanel.jsx — Policy Analyser page
* Right column: empty state, loading state, and the list of findings.
*/
function FindingsPanel({ findings, analyzing }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border bg-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-lg text-foreground",
					children: "2. Findings"
				}), findings && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-[11px] uppercase tracking-wider text-muted-foreground",
					children: [findings.length, " clauses checked"]
				})]
			}),
			!findings && !analyzing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-col items-center justify-center gap-2 rounded-xl bg-secondary/40 py-12 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-6 w-6 text-muted-foreground/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Findings will appear here once you upload or paste a policy."
				})]
			}),
			analyzing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-col items-center justify-center gap-2 py-12 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Comparing against Art. 7:629 and common CAO benchmarks…"
				})]
			}),
			findings && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 space-y-3",
				children: findings.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3 rounded-lg border border-border bg-background p-4",
					children: [
						f.status === "pass" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }),
						f.status === "warn" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-4 w-4 shrink-0 text-accent" }),
						f.status === "fail" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mt-0.5 h-4 w-4 shrink-0 text-destructive" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-foreground",
								children: f.clause
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-relaxed text-muted-foreground",
								children: f.detail
							})]
						})
					]
				}, i))
			})
		]
	});
}
/**
* PolicyAnalyserPage.jsx
* ---------------------------------------------------------------------------
* The "/policy-analyser" route. Import and render this from
* src/routes/policy-analyser.tsx.
*
* NOTE for WP dev: `runAnalysis` currently fakes a result after 900ms with
* `content.demoFindings`. Replace the body of runAnalysis with a real call
* to your analysis/AI endpoint, passing `text` (or the uploaded file).
* ---------------------------------------------------------------------------
*/
function PolicyAnalyserPage() {
	const content = DEFAULT_CONTENT;
	const [fileName, setFileName] = (0, import_react.useState)(null);
	const [analyzing, setAnalyzing] = (0, import_react.useState)(false);
	const [findings, setFindings] = (0, import_react.useState)(null);
	const [text, setText] = (0, import_react.useState)("");
	function handleFile(f) {
		if (!f) return;
		setFileName(f.name);
		runAnalysis();
	}
	function runAnalysis() {
		setAnalyzing(true);
		setFindings(null);
		setTimeout(() => {
			setFindings(content.demoFindings);
			setAnalyzing(false);
		}, 900);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
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
				className: "mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadPanel, {
					fileName,
					text,
					setText,
					analyzing,
					onFile: handleFile,
					onAnalyze: runAnalysis
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FindingsPanel, {
					findings,
					analyzing
				})]
			})
		]
	});
}
var SplitComponent = PolicyAnalyserPage;
//#endregion
export { SplitComponent as component };
