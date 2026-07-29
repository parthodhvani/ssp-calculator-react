import { n as __toESM } from "../_runtime.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as fetchWpJson, t as AcfPageGate } from "./AcfPageGate-Cd5taBmw.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { C as CalendarDays, D as ArrowRight, S as Check, _ as Circle, b as ChevronUp, p as Info, x as ChevronDown, y as CircleCheck } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as Input, r as cn, t as Button } from "./input-jnPTuD2M.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
import { n as RadioGroupIndicator, r as RadioGroupItem$1, t as RadioGroup$1 } from "../_libs/@radix-ui/react-radio-group+[...].mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Da7_rkMD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* useCalculatorContent.js
* ---------------------------------------------------------------------------
* Fetches ACF from the WordPress Calculate page (dynamic only — no local DEFAULT_CONTENT).
*
* Configure in `.env`:
*   VITE_WP_API_URL=https://devwp1.websiteserverhost.biz/ssp-calculator
*   VITE_WP_CALCULATE_PAGE_ID=130
*
* Prefer page ID when set (exact page). Otherwise falls back to slug query.
* Example resolved URL:
*   {VITE_WP_API_URL}/wp-json/wp/v2/pages/130
*
* Returns: { content, isLoading, error, endpoint }
* ---------------------------------------------------------------------------
*/
var WP_API_URL = "https://devwp1.websiteserverhost.biz/ssp-calculator";
var PAGE_ID = "130";
function buildAcfEndpoint() {
	return `${WP_API_URL.replace(/\/$/, "")}/wp-json/wp/v2/pages/${encodeURIComponent(String(PAGE_ID).trim())}`;
}
var ACF_ENDPOINT = buildAcfEndpoint();
function num(value, fallback) {
	if (value === "" || value == null) return fallback;
	const n = Number(value);
	return Number.isFinite(n) ? n : fallback;
}
function str(value, fallback) {
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
	if (!acf || typeof acf !== "object") return {};
	const content = {};
	const heroG = group(acf, "hero");
	const sampleG = group(acf, "sample");
	const sectionG = group(acf, "section");
	const formG = group(acf, "form");
	const salaryG = group(acf, "salary");
	const hoursG = group(acf, "hours");
	const rulesG = group(acf, "rules");
	const resultG = group(acf, "result");
	const howSecG = group(acf, "how_it_works_section");
	const policyG = group(acf, "policy_cta");
	if (heroG || acf.hero_badge || acf.hero_badge_1 || acf.hero_title_line1 || acf.hero_cta_label) {
		const badge1 = first(heroG?.badge_1, acf.hero_badge_1, heroG?.badge, acf.hero_badge);
		const badge2 = first(heroG?.badge_2, acf.hero_badge_2);
		content.hero = {
			badge1: str(badge1, ""),
			badge2: str(badge2, ""),
			titleLine1: str(first(heroG?.title_line1, acf.hero_title_line1), ""),
			titleHighlight: str(first(heroG?.title_highlight, acf.hero_title_highlight), ""),
			titleSuffix: str(first(heroG?.title_suffix, acf.hero_title_suffix), ""),
			description: str(first(heroG?.description, acf.hero_description), ""),
			ctaLabel: str(first(heroG?.cta_label, acf.hero_cta_label), ""),
			ctaLink: str(first(heroG?.cta_link, acf.hero_cta_link), ""),
			secondaryCtaLabel: str(first(heroG?.secondary_cta_label, acf.hero_secondary_cta_label), ""),
			secondaryCtaLink: str(first(heroG?.secondary_cta_link, acf.hero_secondary_cta_link), "")
		};
	}
	if (Array.isArray(acf.stats) && acf.stats.length > 0) content.stats = acf.stats.map((row) => ({
		value: first(row.value, row.stat_value) ?? "",
		label: first(row.label, row.stat_label) ?? ""
	}));
	if (sampleG || acf.sample_amount != null || acf.sample_title) content.sampleResult = {
		title: str(first(sampleG?.title, acf.sample_title), ""),
		coveredLabel: str(first(sampleG?.covered_label, acf.sample_covered_label), ""),
		amount: num(first(sampleG?.amount, acf.sample_amount), 0),
		periodLabel: str(first(sampleG?.period_label, acf.sample_period_label), ""),
		currentWeek: num(first(sampleG?.current_week, acf.sample_current_week), 0),
		weekZeroLabel: str(first(sampleG?.week_zero_label, acf.sample_week_zero_label), ""),
		weekProgressLabel: str(first(sampleG?.week_progress_label, acf.sample_week_progress_label), ""),
		year1BoxLabel: str(first(sampleG?.year1_box_label, acf.sample_year1_box_label), ""),
		year2BoxLabel: str(first(sampleG?.year2_box_label, acf.sample_year2_box_label), ""),
		perMonthSuffix: str(first(sampleG?.per_month_suffix, acf.sample_per_month_suffix), "")
	};
	if (Array.isArray(acf.industries) && acf.industries.length > 0) content.industries = acf.industries.map((row) => first(row.name, row.industry_name)).filter(Boolean);
	if (sectionG || acf.section_kicker || acf.section_title) content.section = {
		kicker: str(first(sectionG?.kicker, acf.section_kicker), ""),
		title: str(first(sectionG?.title, acf.section_title), ""),
		description: str(first(sectionG?.description, acf.section_description), "")
	};
	if (formG || salaryG || hoursG || acf.form_name_label || acf.salary_label || acf.hours_label || acf.calculator_salary_label || acf.form_submit_label || acf.calculator_submit_label) {
		let statusOptions = [];
		const rawStatus = acf.form_status_options ?? formG?.status_options ?? acf.calculator_status_options;
		if (Array.isArray(rawStatus) && rawStatus.length > 0) {
			const mapped = rawStatus.map((row) => ({
				value: first(row.value, row.status_value) ?? "",
				label: first(row.label, row.status_label) ?? ""
			})).filter((o) => o.value && o.label);
			if (mapped.length) statusOptions = mapped;
		}
		content.calculator = {
			nameLabel: str(first(acf.form_name_label, formG?.name_label, acf.calculator_name_label), ""),
			namePlaceholder: str(first(acf.form_name_placeholder, formG?.name_placeholder, acf.calculator_name_placeholder), ""),
			companyLabel: str(first(acf.form_company_label, formG?.company_label, acf.calculator_company_label), ""),
			companyPlaceholder: str(first(acf.form_company_placeholder, formG?.company_placeholder, acf.calculator_company_placeholder), ""),
			companyHint: str(first(acf.form_company_hint, formG?.company_hint, acf.calculator_company_hint), ""),
			industryLabel: str(first(acf.form_industry_label, formG?.industry_label, acf.calculator_industry_label), ""),
			industryPlaceholder: str(first(acf.form_industry_placeholder, formG?.industry_placeholder, acf.calculator_industry_placeholder), ""),
			industryHint: str(first(acf.form_industry_hint, formG?.industry_hint, acf.calculator_industry_hint), ""),
			statusLabel: str(first(acf.form_status_label, formG?.status_label, acf.calculator_status_label), ""),
			statusOptions,
			statusDefault: str(first(acf.form_status_default, formG?.status_default, acf.calculator_status_default), ""),
			salaryLabel: str(first(acf.salary_label, salaryG?.label, acf.calculator_salary_label), ""),
			salaryPlaceholder: str(first(acf.salary_placeholder, salaryG?.placeholder, acf.calculator_salary_placeholder), ""),
			salaryDefault: str(first(acf.salary_default, salaryG?.default_value, acf.calculator_salary_default), ""),
			salaryMin: num(first(acf.salary_min, salaryG?.min, acf.calculator_salary_min), 0),
			salaryMax: num(first(acf.salary_max, salaryG?.max, acf.calculator_salary_max), 0),
			salaryStep: num(first(acf.salary_step, salaryG?.step, acf.calculator_salary_step), 0),
			hoursLabel: str(first(acf.hours_label, hoursG?.label, acf.calculator_hours_label), ""),
			hoursPlaceholder: str(first(acf.hours_placeholder, hoursG?.placeholder, acf.calculator_hours_placeholder), ""),
			hoursDefault: str(first(acf.hours_default, hoursG?.default_value, acf.calculator_hours_default), ""),
			hoursMin: num(first(acf.hours_min, hoursG?.min, acf.calculator_hours_min), 0),
			hoursMax: num(first(acf.hours_max, hoursG?.max, acf.calculator_hours_max), 0),
			hoursStep: num(first(acf.hours_step, hoursG?.step, acf.calculator_hours_step), 0),
			firstDayLabel: str(first(acf.form_first_day_label, formG?.first_day_label, acf.calculator_first_day_label), ""),
			firstDayHint: str(first(acf.form_first_day_hint, formG?.first_day_hint, acf.calculator_first_day_hint), ""),
			lastDayLabel: str(first(acf.form_last_day_label, formG?.last_day_label, acf.calculator_last_day_label), ""),
			linkedLabel: str(first(acf.form_linked_label, formG?.linked_label, acf.calculator_linked_label), ""),
			linkedDescription: str(first(acf.form_linked_description, formG?.linked_description, acf.calculator_linked_description), ""),
			linkedFirstDayLabel: str(first(acf.form_linked_first_day_label, formG?.linked_first_day_label, acf.calculator_linked_first_day_label), ""),
			linkedLastDayLabel: str(first(acf.form_linked_last_day_label, formG?.linked_last_day_label, acf.calculator_linked_last_day_label), ""),
			linkedFlagMessage: str(first(acf.form_linked_flag_message, formG?.linked_flag_message, acf.calculator_linked_flag_message), ""),
			submitLabel: str(first(acf.form_submit_label, formG?.submit_label, acf.calculator_submit_label), ""),
			submitLink: str(first(acf.form_submit_link, formG?.submit_link, acf.calculator_submit_link), "")
		};
	}
	if (rulesG || acf.rules_year1_percent != null || acf.year1_percentage != null || acf.rules_max_weeks != null) content.rules = {
		year1Percent: num(first(rulesG?.year1_percent, acf.rules_year1_percent, acf.year1_percentage), 0),
		year2Percent: num(first(rulesG?.year2_percent, acf.rules_year2_percent, acf.year2_percentage), 0),
		maxWeeks: num(first(rulesG?.max_weeks, acf.rules_max_weeks), 0),
		waitingDays: num(first(rulesG?.waiting_days, acf.rules_waiting_days), 0),
		minWageMonthly: num(first(rulesG?.min_wage_monthly, acf.rules_min_wage_monthly), 0),
		linkedAbsenceWindowDays: num(first(rulesG?.linked_absence_days, acf.rules_linked_absence_days), 0),
		fullTimeHours: num(first(rulesG?.full_time_hours, acf.rules_full_time_hours), 0)
	};
	if (resultG || acf.year1_result_title || acf.result_kicker || acf.result_total_label) {
		content.result = {
			kicker: str(first(resultG?.kicker, acf.result_kicker), ""),
			emptyAmount: str(first(resultG?.empty_amount, acf.result_empty_amount), ""),
			perMonthSuffix: str(first(resultG?.per_month_suffix, acf.result_per_month_suffix), ""),
			year1Title: str(first(resultG?.year1_title, acf.year1_result_title), ""),
			year2Title: str(first(resultG?.year2_title, acf.year2_result_title), ""),
			year2PayLabel: str(first(resultG?.year2_pay_label, acf.result_year2_pay_label), ""),
			totalLabel: str(first(resultG?.total_label, acf.result_total_label), ""),
			monthlyLabel: str(first(resultG?.monthly_label, acf.result_monthly_label), ""),
			maxWeeksLabel: str(first(resultG?.max_weeks_label, acf.result_max_weeks_label), ""),
			waitingDaysLabel: str(first(resultG?.waiting_days_label, acf.result_waiting_days_label), ""),
			waitingDaysValue: str(first(resultG?.waiting_days_value, acf.result_waiting_days_value), ""),
			linkedAbsenceLabel: str(first(resultG?.linked_absence_label, acf.result_linked_absence_label), ""),
			hoursAdjustedLabel: str(first(resultG?.hours_adjusted_label, acf.result_hours_adjusted_label), ""),
			footnote: str(first(resultG?.footnote, acf.result_footnote), "")
		};
		content.policyAnalyserCta = {
			title: str(first(resultG?.policy_title, policyG?.title, acf.policy_cta_title), ""),
			description: str(first(resultG?.policy_description, policyG?.description, acf.policy_cta_description), ""),
			link: str(first(resultG?.policy_link, policyG?.link, acf.policy_cta_link), "")
		};
	} else if (policyG || acf.policy_cta_title) content.policyAnalyserCta = {
		title: str(first(policyG?.title, acf.policy_cta_title), ""),
		description: str(first(policyG?.description, acf.policy_cta_description), ""),
		link: str(first(policyG?.link, acf.policy_cta_link), "")
	};
	if (howSecG || acf.how_it_works_kicker || acf.how_it_works_title) content.howItWorksSection = {
		kicker: str(first(howSecG?.kicker, acf.how_it_works_kicker), ""),
		title: str(first(howSecG?.title, acf.how_it_works_title), "")
	};
	if (Array.isArray(acf.how_it_works) && acf.how_it_works.length > 0) content.howItWorks = acf.how_it_works.map((row) => ({
		number: first(row.number, row.step_number) ?? "",
		title: first(row.title, row.step_title) ?? "",
		description: first(row.description, row.step_description) ?? ""
	}));
	if (acf.disclaimer_text) content.disclaimer = str(acf.disclaimer_text, "");
	return content;
}
/** Ensure nested objects exist so the UI never crashes; values come only from ACF. */
function finalizeContent(mapped) {
	return {
		hero: mapped.hero ?? {
			badge1: "",
			badge2: "",
			titleLine1: "",
			titleHighlight: "",
			titleSuffix: "",
			description: "",
			ctaLabel: "",
			ctaLink: "",
			secondaryCtaLabel: "",
			secondaryCtaLink: ""
		},
		stats: mapped.stats ?? [],
		sampleResult: mapped.sampleResult ?? {
			title: "",
			coveredLabel: "",
			amount: 0,
			periodLabel: "",
			currentWeek: 0,
			weekZeroLabel: "",
			weekProgressLabel: "",
			year1BoxLabel: "",
			year2BoxLabel: "",
			perMonthSuffix: ""
		},
		industries: mapped.industries ?? [],
		section: mapped.section ?? {
			kicker: "",
			title: "",
			description: ""
		},
		calculator: mapped.calculator ?? {
			nameLabel: "",
			namePlaceholder: "",
			companyLabel: "",
			companyPlaceholder: "",
			companyHint: "",
			industryLabel: "",
			industryPlaceholder: "",
			industryHint: "",
			statusLabel: "",
			statusOptions: [],
			statusDefault: "",
			salaryLabel: "",
			salaryPlaceholder: "",
			salaryDefault: "",
			salaryMin: 0,
			salaryMax: 0,
			salaryStep: 0,
			hoursLabel: "",
			hoursPlaceholder: "",
			hoursDefault: "",
			hoursMin: 0,
			hoursMax: 0,
			hoursStep: 0,
			firstDayLabel: "",
			firstDayHint: "",
			lastDayLabel: "",
			linkedLabel: "",
			linkedDescription: "",
			linkedFirstDayLabel: "",
			linkedLastDayLabel: "",
			linkedFlagMessage: "",
			submitLabel: "",
			submitLink: ""
		},
		rules: mapped.rules ?? {
			year1Percent: 0,
			year2Percent: 0,
			maxWeeks: 0,
			waitingDays: 0,
			minWageMonthly: 0,
			linkedAbsenceWindowDays: 0,
			fullTimeHours: 0
		},
		result: mapped.result ?? {
			kicker: "",
			emptyAmount: "",
			perMonthSuffix: "",
			year1Title: "",
			year2Title: "",
			year2PayLabel: "",
			totalLabel: "",
			monthlyLabel: "",
			maxWeeksLabel: "",
			waitingDaysLabel: "",
			waitingDaysValue: "",
			linkedAbsenceLabel: "",
			hoursAdjustedLabel: "",
			footnote: ""
		},
		howItWorksSection: mapped.howItWorksSection ?? {
			kicker: "",
			title: ""
		},
		howItWorks: mapped.howItWorks ?? [],
		policyAnalyserCta: mapped.policyAnalyserCta ?? {
			title: "",
			description: "",
			link: ""
		},
		disclaimer: mapped.disclaimer ?? ""
	};
}
function useCalculatorContent() {
	const [content, setContent] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(Boolean(ACF_ENDPOINT));
	const [error, setError] = (0, import_react.useState)(ACF_ENDPOINT ? null : "Missing VITE_WP_API_URL / VITE_WP_CALCULATE_PAGE_ID");
	(0, import_react.useEffect)(() => {
		if (!ACF_ENDPOINT) {
			setIsLoading(false);
			console.warn("[Calculate] WP fetch skipped — set VITE_WP_API_URL and VITE_WP_CALCULATE_PAGE_ID, then restart Vite.");
			return;
		}
		let cancelled = false;
		async function load() {
			console.info("[Calculate] Fetching ACF from", ACF_ENDPOINT);
			try {
				const json = await fetchWpJson(ACF_ENDPOINT);
				const page = Array.isArray(json) ? json[0] : json;
				const acf = page?.acf;
				if (!acf || typeof acf === "object" && Object.keys(acf).length === 0) {
					if (!cancelled) {
						setContent(null);
						setError("Calculate page ACF fields are empty");
					}
					return;
				}
				if (!cancelled) {
					setContent(finalizeContent(mapAcfResponseToContent(acf)));
					setError(null);
					console.info("[Calculate] ACF loaded OK", {
						pageId: page?.id,
						slug: page?.slug,
						acfKeys: Object.keys(acf)
					});
				}
			} catch (err) {
				if (!cancelled) {
					const message = err instanceof Error ? err.message : "Failed to load WP content";
					setContent(null);
					setError(message);
					console.error("[Calculate] ACF fetch failed:", message);
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
* entitlement.js
* ---------------------------------------------------------------------------
* Proper Dutch sick-leave (Art. 7:629) estimate — all numbers from ACF rules.
*
* Inputs that affect the result:
*   - gross monthly salary
*   - contracted hours / week  → prorated vs rules.fullTimeHours
*   - first day of sick leave  → weeks elapsed / remaining
*   - last day (optional)      → caps the “as of” date when absence has ended
*   - linked earlier absence   → continues the same maxWeeks clock when a
*                                previous first-day is provided
*
* Rules (WordPress / ACF):
*   year1Percent, year2Percent, maxWeeks, waitingDays,
*   minWageMonthly, linkedAbsenceWindowDays, fullTimeHours
* ---------------------------------------------------------------------------
*/
var MS_PER_DAY = 1440 * 60 * 1e3;
var YEAR1_WEEKS_DEFAULT = 52;
function parseDate(iso) {
	if (!iso) return null;
	const d = new Date(iso);
	return Number.isNaN(d.getTime()) ? null : d;
}
function startOfDay(d) {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
/** Whole weeks between two dates (floor, never negative). */
function weeksBetween(fromIso, toIso) {
	const from = parseDate(fromIso);
	const to = parseDate(toIso);
	if (!from || !to) return 0;
	const diff = startOfDay(to).getTime() - startOfDay(from).getTime();
	if (diff < 0) return 0;
	return Math.floor(diff / (7 * MS_PER_DAY));
}
/**
* “As of” date for counting elapsed weeks:
* - if last day is set and already passed → use last day
* - otherwise → today
*/
function resolveAsOfDate(lastDayIso, now = /* @__PURE__ */ new Date()) {
	const last = parseDate(lastDayIso);
	const today = startOfDay(now);
	if (last && startOfDay(last).getTime() < today.getTime()) return last;
	return today;
}
/**
* Clock start for the 104-week entitlement window.
* Linked absences share one clock — prefer the earlier linked first day.
*/
function resolveClockStart(firstDayIso, linked, linkedFirstDayIso) {
	if (linked && linkedFirstDayIso) {
		const linkedStart = parseDate(linkedFirstDayIso);
		const currentStart = parseDate(firstDayIso);
		if (linkedStart && currentStart) return linkedStart.getTime() <= currentStart.getTime() ? linkedFirstDayIso : firstDayIso;
		if (linkedStart) return linkedFirstDayIso;
	}
	return firstDayIso;
}
function weeksElapsedSince(firstDayIso, lastDayIso, now = /* @__PURE__ */ new Date()) {
	if (!firstDayIso) return 0;
	return weeksBetween(firstDayIso, resolveAsOfDate(lastDayIso, now).toISOString().slice(0, 10));
}
/**
* Two absences count as one continuous period if the gap is within
* rules.linkedAbsenceWindowDays (statutory default: 28).
*/
function isLinkedAbsence(previousLastDayIso, newFirstDayIso, rules) {
	const prev = parseDate(previousLastDayIso);
	const next = parseDate(newFirstDayIso);
	if (!prev || !next) return false;
	const gapDays = (startOfDay(next).getTime() - startOfDay(prev).getTime()) / MS_PER_DAY;
	return gapDays >= 0 && gapDays <= rules.linkedAbsenceWindowDays;
}
/**
* Full entitlement estimate.
*
* @param {object} input
* @param {number} input.grossMonthlySalary
* @param {number} input.contractedHours
* @param {string} [input.firstDay] ISO date
* @param {string} [input.lastDay] ISO date
* @param {boolean} [input.linked]
* @param {string} [input.linkedFirstDay]
* @param {string} [input.linkedLastDay]
* @param {object} rules ACF-driven rules
*/
function calculateEntitlement(input, rules) {
	const gross = Number(input?.grossMonthlySalary) || 0;
	if (gross <= 0) return null;
	const fullTimeHours = Number(rules.fullTimeHours) > 0 ? Number(rules.fullTimeHours) : 40;
	const hoursRaw = Number(input?.contractedHours);
	const contractedHours = Number.isFinite(hoursRaw) && hoursRaw > 0 ? hoursRaw : fullTimeHours;
	const hourFactor = Math.min(contractedHours / fullTimeHours, 1.5);
	const effectiveMonthly = gross * hourFactor;
	const year1Percent = Number(rules.year1Percent) || 0;
	const year2Percent = Number(rules.year2Percent) || 0;
	const maxWeeks = Number(rules.maxWeeks) > 0 ? Number(rules.maxWeeks) : 104;
	const waitingDays = Number(rules.waitingDays) || 0;
	const year1Weeks = Math.min(YEAR1_WEEKS_DEFAULT, maxWeeks);
	const year1Monthly = Math.round(effectiveMonthly * (year1Percent / 100));
	const year2Monthly = Math.round(effectiveMonthly * (year2Percent / 100));
	const year1Months = Math.round(year1Weeks / 52 * 12);
	const year2Months = Math.round((maxWeeks - year1Weeks) / 52 * 12);
	const totalOverMaxTerm = year1Monthly * year1Months + year2Monthly * year2Months;
	const clockStart = resolveClockStart(input?.firstDay, Boolean(input?.linked), input?.linkedFirstDay);
	const weeksElapsed = clockStart ? weeksElapsedSince(clockStart, input?.lastDay) : 0;
	const weeksRemaining = Math.max(0, maxWeeks - weeksElapsed);
	const inYear2 = weeksElapsed >= year1Weeks;
	const currentMonthly = inYear2 ? year2Monthly : year1Monthly;
	const currentPercent = inYear2 ? year2Percent : year1Percent;
	const currentYear = inYear2 ? 2 : 1;
	let absenceWeeks = null;
	if (input?.firstDay && input?.lastDay) absenceWeeks = weeksBetween(input.firstDay, input.lastDay);
	let absenceTotal = null;
	if (absenceWeeks != null && absenceWeeks >= 0) {
		const absenceMonths = absenceWeeks / (52 / 12);
		absenceTotal = Math.round(currentMonthly * absenceMonths);
	}
	const minWageMonthly = Number(rules.minWageMonthly) || 0;
	const belowMinWage = minWageMonthly > 0 && year1Monthly < Math.round(minWageMonthly * (year1Percent / 100));
	return {
		grossMonthlySalary: gross,
		contractedHours,
		fullTimeHours,
		hourFactor,
		effectiveMonthly: Math.round(effectiveMonthly),
		year1Monthly,
		year2Monthly,
		currentMonthly,
		currentPercent,
		currentYear,
		year1Percent,
		year2Percent,
		totalOverMaxTerm,
		absenceWeeks,
		absenceTotal,
		weeksElapsed,
		weeksRemaining,
		maxWeeks,
		year1Weeks,
		waitingDays,
		minWageMonthly,
		belowMinWage,
		clockStart: clockStart || null
	};
}
/**
* content.js — Calculate page helpers (no hardcoded page copy).
*/
function formatTemplate(template, vars = {}) {
	if (!template) return "";
	return String(template).replace(/\{(\w+)\}/g, (_, key) => vars[key] != null ? String(vars[key]) : `{${key}}`);
}
function resolveHref(link, fallback = "#") {
	if (link == null || String(link).trim() === "") return fallback;
	return String(link).trim();
}
/**
* HeroSection.jsx — Calculate page
* Left: badges + headline + buttons (with ACF links)
* Right: sample entitlement card (Year 1/2 % from content.rules)
*/
function SmartLink({ href, className, children }) {
	const to = resolveHref(href, "#");
	const isHash = to.startsWith("#");
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
		...isHash ? {} : {},
		children
	});
}
function HeroSection({ content }) {
	const hero = content.hero;
	const sample = content.sampleResult;
	const rules = content.rules;
	const weekProgress = formatTemplate(sample.weekProgressLabel, {
		current: sample.currentWeek,
		max: rules.maxWeeks
	});
	const badges = [hero.badge1, hero.badge2].filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative overflow-hidden border-b border-border/70",
		style: { background: "var(--gradient-hero)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:py-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col justify-center",
				children: [
					badges.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: badges.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex w-fit items-center rounded-full border border-border/80 bg-background/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground",
							children: b
						}, b))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-5 font-serif text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-[3.4rem]",
						children: [
							hero.titleLine1,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
								className: "text-accent not-italic underline decoration-accent/30 decoration-[6px] underline-offset-[10px]",
								children: hero.titleHighlight
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [" ", hero.titleSuffix]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground",
						children: hero.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartLink, {
							href: hero.ctaLink,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								className: "gap-2",
								children: [
									hero.ctaLabel,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartLink, {
							href: hero.secondaryCtaLink,
							className: "text-sm font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-accent",
							children: hero.secondaryCtaLabel
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border/70 pt-6",
						children: content.stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "font-serif text-2xl text-foreground",
							children: s.value
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 text-xs uppercase tracking-wider text-muted-foreground",
							children: s.label
						})] }, s.label))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6",
					style: { boxShadow: "var(--shadow-elegant)" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
								children: sample.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }),
									" ",
									sample.coveredLabel
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 font-serif text-3xl text-foreground",
							children: [
								"€ ",
								sample.amount.toLocaleString("en"),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: sample.perMonthSuffix
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: sample.periodLabel
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 h-2 w-full overflow-hidden rounded-full bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-accent",
								style: { width: `${Math.min(100, Math.round(sample.currentWeek / rules.maxWeeks * 100))}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex justify-between font-mono text-[11px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sample.weekZeroLabel }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: weekProgress })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-secondary/60 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground",
									children: sample.year1BoxLabel
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 font-serif text-lg text-foreground",
									children: [rules.year1Percent, "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-secondary/60 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground",
									children: sample.year2BoxLabel
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 font-serif text-lg text-foreground",
									children: [rules.year2Percent, "%"]
								})]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl border border-border/70 bg-secondary/50" })]
			})]
		})
	});
}
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var RadioGroup = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup$1, {
		className: cn("grid gap-2", className),
		...props,
		ref
	});
});
RadioGroup.displayName = RadioGroup$1.displayName;
var RadioGroupItem = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem$1, {
		ref,
		className: cn("aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupIndicator, {
			className: "flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-3.5 w-3.5 fill-primary" })
		})
	});
});
RadioGroupItem.displayName = RadioGroupItem$1.displayName;
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
/**
* FormField.jsx
* ---------------------------------------------------------------------------
* Small layout wrapper used by every form on the site (label + input + hint).
* Was previously duplicated/inlined inside each page file — pulled out here
* so it's a single, reusable component.
* ---------------------------------------------------------------------------
*/
function FormField({ label, hint, className = "", children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `grid gap-1.5 ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
				children: label
			}),
			children,
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
/**
* CalculatorForm.jsx — Calculate page
* Two-column field grid inside the shared outer card:
*   Name | Company
*   Industry (full)
*   Status (full)
*   Salary | Hours
*   First day | Last day
*   Linked absence (full)
*/
function CalculatorForm({ content, form }) {
	const { status, setStatus, linked, setLinked, linkedFirstDay, setLinkedFirstDay, linkedLastDay, setLinkedLastDay, salary, setSalary, hours, setHours, firstDay, setFirstDay, lastDay, setLastDay, linkedAbsenceFlag } = form;
	const calc = content.calculator;
	const rules = content.rules;
	const linkedDescription = formatTemplate(calc.linkedDescription, {
		weeks: Math.round(rules.linkedAbsenceWindowDays / 7),
		maxWeeks: rules.maxWeeks
	});
	const linkedFlagMessage = formatTemplate(calc.linkedFlagMessage, { maxWeeks: rules.maxWeeks });
	function handleSubmit(e) {
		e.preventDefault();
		const link = resolveHref(calc.submitLink, "");
		if (link) if (link.startsWith("#")) document.querySelector(link)?.scrollIntoView({ behavior: "smooth" });
		else if (/^https?:\/\//i.test(link)) window.open(link, "_blank", "noopener,noreferrer");
		else window.location.href = link;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-5 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: calc.nameLabel,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { placeholder: calc.namePlaceholder })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: calc.companyLabel,
					hint: calc.companyHint,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { placeholder: calc.companyPlaceholder })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: calc.industryLabel,
					hint: calc.industryHint,
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: calc.industryPlaceholder }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: content.industries.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: i,
						children: i
					}, i)) })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: calc.statusLabel,
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
						value: status,
						onValueChange: (v) => setStatus(v),
						className: "grid grid-cols-2 gap-2",
						children: calc.statusOptions.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: `flex cursor-pointer items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors ${status === o.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-secondary"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
								value: o.value,
								className: "sr-only"
							}), o.label]
						}, o.value))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: calc.salaryLabel,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						inputMode: "numeric",
						placeholder: calc.salaryPlaceholder,
						value: salary,
						min: calc.salaryMin,
						max: calc.salaryMax,
						step: calc.salaryStep,
						onChange: (e) => setSalary(e.target.value.replace(/[^\d.]/g, ""))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: calc.hoursLabel,
					hint: `Full-time baseline: ${rules.fullTimeHours || 40} hrs (from Pay Rules)`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						inputMode: "numeric",
						placeholder: calc.hoursPlaceholder,
						value: hours,
						min: calc.hoursMin,
						max: calc.hoursMax,
						step: calc.hoursStep,
						onChange: (e) => setHours(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: calc.firstDayLabel,
					hint: calc.firstDayHint,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: firstDay,
							onChange: (e) => setFirstDay(e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: calc.lastDayLabel,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: lastDay,
							onChange: (e) => setLastDay(e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-4 rounded-lg border border-border bg-secondary/40 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-foreground",
							children: calc.linkedLabel
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: linkedDescription
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: linked,
							onCheckedChange: setLinked
						})]
					}), linked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-5 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
								label: calc.linkedFirstDayLabel,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: linkedFirstDay,
										onChange: (e) => setLinkedFirstDay(e.target.value)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
								label: calc.linkedLastDayLabel,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: linkedLastDay,
										onChange: (e) => setLinkedLastDay(e.target.value)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" })]
								})
							}),
							linkedAbsenceFlag && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "sm:col-span-2 text-xs font-medium text-accent",
								children: linkedFlagMessage
							})
						]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-center gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5 shrink-0" }), content.disclaimer]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				size: "lg",
				className: "gap-2",
				children: [calc.submitLabel, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
			})]
		})]
	});
}
/**
* StatRow.jsx
* ---------------------------------------------------------------------------
* Label/value row used inside result & summary cards (e.g. the entitlement
* result card on the Calculate page).
* ---------------------------------------------------------------------------
*/
function StatRow({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-primary-foreground/60",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono tabular-nums",
			children
		})]
	});
}
/**
* ResultSummary.jsx — Calculate page
* Live blue “Your entitlement” card.
* Updates from salary, contracted hours, and sick-leave dates.
*/
function PolicyLink({ href, className, children }) {
	const to = resolveHref(href, "/policy-analyser");
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
function ResultSummary({ content, estimate }) {
	const result = content.result;
	const cta = content.policyAnalyserCta;
	const percent = estimate?.currentPercent ?? content.rules.year1Percent;
	const year1Title = formatTemplate(result.year1Title, { percent });
	const headlineTitle = estimate?.currentYear === 2 ? formatTemplate(result.year2Title, { percent }) : year1Title;
	const waitingDaysValue = formatTemplate(result.waitingDaysValue, { days: estimate?.waitingDays ?? content.rules.waitingDays });
	const mainAmount = estimate?.currentMonthly ?? estimate?.year1Monthly;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "min-w-0 lg:sticky lg:top-20 lg:self-start",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8",
			style: { boxShadow: "var(--shadow-elegant)" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground/60",
					children: result.kicker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 font-serif text-4xl leading-tight",
					children: [mainAmount != null ? `€ ${mainAmount.toLocaleString("en")}` : result.emptyAmount, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg text-primary-foreground/60",
						children: result.perMonthSuffix
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-primary-foreground/70",
					children: headlineTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-3 border-t border-primary-foreground/10 pt-5 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
							label: result.year2PayLabel,
							children: estimate ? `€ ${estimate.year2Monthly.toLocaleString("en")}${result.perMonthSuffix}` : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
							label: result.totalLabel,
							children: estimate ? `€ ${estimate.totalOverMaxTerm.toLocaleString("en")}` : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
							label: result.maxWeeksLabel,
							children: estimate ? estimate.weeksRemaining : content.rules.maxWeeks
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
							label: result.waitingDaysLabel,
							children: waitingDaysValue
						}),
						estimate?.contractedHours != null && estimate.hourFactor !== 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
							label: result.hoursAdjustedLabel,
							children: `€ ${estimate.effectiveMonthly.toLocaleString("en")}${result.perMonthSuffix}`
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-xs leading-relaxed text-primary-foreground/60",
					children: result.footnote
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PolicyLink, {
			href: cta.link,
			className: "mt-4 flex items-center justify-between rounded-xl border border-border bg-background p-4 text-sm transition-colors hover:border-accent hover:bg-accent/5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium text-foreground",
				children: cta.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: cta.description
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 shrink-0 text-muted-foreground" })]
		})]
	});
}
/**
* HowItWorks.jsx — Calculate page
* Section heading + step cards — all from ACF (`how_it_works` repeater +
* how_it_works_kicker / how_it_works_title).
*/
function HowItWorks({ content }) {
	const section = content.howItWorksSection;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-t border-border/70 bg-secondary/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-6 py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.18em] text-accent",
					children: section.kicker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 max-w-2xl font-serif text-3xl tracking-tight sm:text-4xl",
					children: section.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-4 md:grid-cols-3",
					children: content.howItWorks.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs tracking-wider text-muted-foreground",
								children: c.number
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 font-serif text-xl text-foreground",
								children: c.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground",
								children: c.description
							})
						]
					}, c.number))
				})
			]
		})
	});
}
/**
* CalculatePage.jsx — all copy from ACF (no local DEFAULT_CONTENT).
*/
function CalculatePage() {
	const { content, isLoading, error, endpoint } = useCalculatorContent();
	(0, import_react.useEffect)(() => {}, [
		endpoint,
		isLoading,
		error,
		content?.hero?.badge1,
		content?.rules?.year1Percent
	]);
	const calc = content?.calculator;
	const [status, setStatus] = (0, import_react.useState)("");
	const [linked, setLinked] = (0, import_react.useState)(false);
	const [linkedFirstDay, setLinkedFirstDay] = (0, import_react.useState)("");
	const [linkedLastDay, setLinkedLastDay] = (0, import_react.useState)("");
	const [salary, setSalary] = (0, import_react.useState)("");
	const [hours, setHours] = (0, import_react.useState)("");
	const [firstDay, setFirstDay] = (0, import_react.useState)("");
	const [lastDay, setLastDay] = (0, import_react.useState)("");
	const prevDefaults = (0, import_react.useRef)({
		salary: "",
		hours: "",
		status: ""
	});
	(0, import_react.useEffect)(() => {
		if (!calc) return;
		const nextSalary = String(calc.salaryDefault ?? "");
		const nextHours = String(calc.hoursDefault ?? "");
		const nextStatus = calc.statusDefault ?? "";
		setSalary((current) => current === prevDefaults.current.salary ? nextSalary : current);
		setHours((current) => current === prevDefaults.current.hours ? nextHours : current);
		setStatus((current) => current === prevDefaults.current.status ? nextStatus : current);
		prevDefaults.current = {
			salary: nextSalary,
			hours: nextHours,
			status: nextStatus
		};
	}, [
		calc?.salaryDefault,
		calc?.hoursDefault,
		calc?.statusDefault
	]);
	const linkedAbsenceFlag = (0, import_react.useMemo)(() => {
		if (!content || !linked || !linkedLastDay || !firstDay) return false;
		return isLinkedAbsence(linkedLastDay, firstDay, content.rules);
	}, [
		content,
		linked,
		linkedLastDay,
		firstDay
	]);
	const estimate = (0, import_react.useMemo)(() => {
		if (!content) return null;
		return calculateEntitlement({
			grossMonthlySalary: Number(salary) || 0,
			contractedHours: Number(hours) || 0,
			firstDay,
			lastDay,
			linked: linked && linkedAbsenceFlag,
			linkedFirstDay: linked ? linkedFirstDay : "",
			linkedLastDay: linked ? linkedLastDay : ""
		}, content.rules);
	}, [
		content,
		salary,
		hours,
		firstDay,
		lastDay,
		linked,
		linkedFirstDay,
		linkedLastDay,
		linkedAbsenceFlag
	]);
	const form = {
		status,
		setStatus,
		linked,
		setLinked,
		linkedFirstDay,
		setLinkedFirstDay,
		linkedLastDay,
		setLinkedLastDay,
		salary,
		setSalary,
		hours,
		setHours,
		firstDay,
		setFirstDay,
		lastDay,
		setLastDay,
		linkedAbsenceFlag
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AcfPageGate, {
		isLoading,
		error,
		label: "calculator",
		children: content ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroSection, { content }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					id: "calculator",
					className: "mx-auto max-w-6xl px-6 py-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[11px] uppercase tracking-[0.18em] text-accent",
								children: content.section.kicker
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 font-serif text-3xl tracking-tight text-foreground sm:text-4xl",
								children: content.section.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-xl text-sm text-muted-foreground",
								children: content.section.description
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-8 rounded-2xl border border-border bg-card p-5 sm:p-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10",
						style: { boxShadow: "var(--shadow-card)" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalculatorForm, {
							content,
							form
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultSummary, {
							content,
							estimate
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, { content })
			]
		}) : null
	});
}
var SplitComponent = CalculatePage;
//#endregion
export { SplitComponent as component };
