import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AcfPageGate-Cd5taBmw.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Shared WP page fetch with in-flight dedupe (stops React Strict Mode /
* remounts from firing the same URL twice at once).
*/
var inflight = /* @__PURE__ */ new Map();
async function fetchWpJson(url) {
	if (!url) throw new Error("Missing WP URL");
	if (inflight.has(url)) return inflight.get(url);
	const promise = (async () => {
		const res = await fetch(url);
		if (!res.ok) throw new Error(`WP REST API responded ${res.status}`);
		return res.json();
	})().finally(() => {
		inflight.delete(url);
	});
	inflight.set(url, promise);
	return promise;
}
/**
* Shared loading / error UI when ACF content is not ready.
*/
function AcfPageGate({ isLoading, error, children, label = "content" }) {
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto flex w-full max-w-4xl items-center justify-center px-6 py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground",
			children: [
				"Loading ",
				label,
				"…"
			]
		})
	});
	if (error || !children) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-2 px-6 py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "font-serif text-2xl text-foreground",
			children: ["Couldn’t load ", label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-md text-sm text-muted-foreground",
			children: error || "No content returned from WordPress. Check ACF fields and page ID in .env."
		})]
	});
	return children;
}
//#endregion
export { fetchWpJson as n, AcfPageGate as t };
