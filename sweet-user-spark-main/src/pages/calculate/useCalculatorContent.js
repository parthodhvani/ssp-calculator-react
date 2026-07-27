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

import { useEffect, useState } from "react";

const WP_API_URL = import.meta.env.VITE_WP_API_URL;
const PAGE_ID = import.meta.env.VITE_WP_CALCULATE_PAGE_ID;
const PAGE_SLUG = import.meta.env.VITE_WP_CALCULATE_SLUG || "calculate";

function buildAcfEndpoint() {
  if (!WP_API_URL) return null;
  const base = WP_API_URL.replace(/\/$/, "");
  // Prefer exact page ID (e.g. /wp-json/wp/v2/pages/130)
  if (PAGE_ID) {
    return `${base}/wp-json/wp/v2/pages/${encodeURIComponent(String(PAGE_ID).trim())}`;
  }
  // Fallback: find by slug
  return `${base}/wp-json/wp/v2/pages?slug=${encodeURIComponent(PAGE_SLUG)}&_fields=id,slug,acf`;
}

const ACF_ENDPOINT = buildAcfEndpoint();

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

export function mapAcfResponseToContent(acf) {
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

  // ── Hero ────────────────────────────────────────────────────────────────
  if (
    heroG ||
    acf.hero_badge ||
    acf.hero_badge_1 ||
    acf.hero_title_line1 ||
    acf.hero_cta_label
  ) {
    const badge1 = first(
      heroG?.badge_1,
      acf.hero_badge_1,
      heroG?.badge,
      acf.hero_badge,
    );
    const badge2 = first(heroG?.badge_2, acf.hero_badge_2);
    content.hero = {
      badge1: str(badge1, ""),
      badge2: str(badge2, ""),
      titleLine1: str(first(heroG?.title_line1, acf.hero_title_line1), ""),
      titleHighlight: str(
        first(heroG?.title_highlight, acf.hero_title_highlight),
        d.titleHighlight,
      ),
      titleSuffix: str(first(heroG?.title_suffix, acf.hero_title_suffix), ""),
      description: str(first(heroG?.description, acf.hero_description), ""),
      ctaLabel: str(first(heroG?.cta_label, acf.hero_cta_label), ""),
      ctaLink: str(first(heroG?.cta_link, acf.hero_cta_link), ""),
      secondaryCtaLabel: str(
        first(heroG?.secondary_cta_label, acf.hero_secondary_cta_label),
        d.secondaryCtaLabel,
      ),
      secondaryCtaLink: str(
        first(heroG?.secondary_cta_link, acf.hero_secondary_cta_link),
        d.secondaryCtaLink,
      ),
    };
  }

  // ── Stats ───────────────────────────────────────────────────────────────
  if (Array.isArray(acf.stats) && acf.stats.length > 0) {
    content.stats = acf.stats.map((row) => ({
      value: first(row.value, row.stat_value) ?? "",
      label: first(row.label, row.stat_label) ?? "",
    }));
  }

  // ── Sample card ─────────────────────────────────────────────────────────
  if (sampleG || acf.sample_amount != null || acf.sample_title) {
    content.sampleResult = {
      title: str(first(sampleG?.title, acf.sample_title), ""),
      coveredLabel: str(
        first(sampleG?.covered_label, acf.sample_covered_label),
        d.coveredLabel,
      ),
      amount: num(first(sampleG?.amount, acf.sample_amount), 0),
      periodLabel: str(
        first(sampleG?.period_label, acf.sample_period_label),
        d.periodLabel,
      ),
      currentWeek: num(
        first(sampleG?.current_week, acf.sample_current_week),
        d.currentWeek,
      ),
      weekZeroLabel: str(
        first(sampleG?.week_zero_label, acf.sample_week_zero_label),
        d.weekZeroLabel,
      ),
      weekProgressLabel: str(
        first(sampleG?.week_progress_label, acf.sample_week_progress_label),
        d.weekProgressLabel,
      ),
      year1BoxLabel: str(
        first(sampleG?.year1_box_label, acf.sample_year1_box_label),
        d.year1BoxLabel,
      ),
      year2BoxLabel: str(
        first(sampleG?.year2_box_label, acf.sample_year2_box_label),
        d.year2BoxLabel,
      ),
      perMonthSuffix: str(
        first(sampleG?.per_month_suffix, acf.sample_per_month_suffix),
        d.perMonthSuffix,
      ),
    };
  }

  // ── Industries (lives inside Calculator Form tab) ───────────────────────
  if (Array.isArray(acf.industries) && acf.industries.length > 0) {
    content.industries = acf.industries
      .map((row) => first(row.name, row.industry_name))
      .filter(Boolean);
  }

  // ── Section ─────────────────────────────────────────────────────────────
  if (sectionG || acf.section_kicker || acf.section_title) {
    content.section = {
      kicker: str(first(sectionG?.kicker, acf.section_kicker), ""),
      title: str(first(sectionG?.title, acf.section_title), ""),
      description: str(
        first(sectionG?.description, acf.section_description),
        d.description,
      ),
    };
  }

  // ── Calculator form (flat line-by-line fields + legacy groups) ──────────
  const hasForm =
    formG ||
    salaryG ||
    hoursG ||
    acf.form_name_label ||
    acf.salary_label ||
    acf.hours_label ||
    acf.calculator_salary_label ||
    acf.form_submit_label ||
    acf.calculator_submit_label;

  if (hasForm) {

    let statusOptions = [];
    const rawStatus =
      acf.form_status_options ?? formG?.status_options ?? acf.calculator_status_options;
    if (Array.isArray(rawStatus) && rawStatus.length > 0) {
      const mapped = rawStatus
        .map((row) => ({
          value: first(row.value, row.status_value) ?? "",
          label: first(row.label, row.status_label) ?? "",
        }))
        .filter((o) => o.value && o.label);
      if (mapped.length) statusOptions = mapped;
    }

    content.calculator = {
      nameLabel: str(
        first(acf.form_name_label, formG?.name_label, acf.calculator_name_label),
        d.nameLabel,
      ),
      namePlaceholder: str(
        first(
          acf.form_name_placeholder,
          formG?.name_placeholder,
          acf.calculator_name_placeholder,
        ),
        d.namePlaceholder,
      ),
      companyLabel: str(
        first(
          acf.form_company_label,
          formG?.company_label,
          acf.calculator_company_label,
        ),
        d.companyLabel,
      ),
      companyPlaceholder: str(
        first(
          acf.form_company_placeholder,
          formG?.company_placeholder,
          acf.calculator_company_placeholder,
        ),
        d.companyPlaceholder,
      ),
      companyHint: str(
        first(acf.form_company_hint, formG?.company_hint, acf.calculator_company_hint),
        d.companyHint,
      ),
      industryLabel: str(
        first(
          acf.form_industry_label,
          formG?.industry_label,
          acf.calculator_industry_label,
        ),
        d.industryLabel,
      ),
      industryPlaceholder: str(
        first(
          acf.form_industry_placeholder,
          formG?.industry_placeholder,
          acf.calculator_industry_placeholder,
        ),
        d.industryPlaceholder,
      ),
      industryHint: str(
        first(
          acf.form_industry_hint,
          formG?.industry_hint,
          acf.calculator_industry_hint,
        ),
        d.industryHint,
      ),
      statusLabel: str(
        first(acf.form_status_label, formG?.status_label, acf.calculator_status_label),
        d.statusLabel,
      ),
      statusOptions,
      statusDefault: str(
        first(
          acf.form_status_default,
          formG?.status_default,
          acf.calculator_status_default,
        ),
        d.statusDefault,
      ),

      salaryLabel: str(
        first(acf.salary_label, salaryG?.label, acf.calculator_salary_label),
        d.salaryLabel,
      ),
      salaryPlaceholder: str(
        first(
          acf.salary_placeholder,
          salaryG?.placeholder,
          acf.calculator_salary_placeholder,
        ),
        d.salaryPlaceholder,
      ),
      salaryDefault: str(
        first(
          acf.salary_default,
          salaryG?.default_value,
          acf.calculator_salary_default,
        ),
        d.salaryDefault,
      ),
      salaryMin: num(
        first(acf.salary_min, salaryG?.min, acf.calculator_salary_min),
        d.salaryMin,
      ),
      salaryMax: num(
        first(acf.salary_max, salaryG?.max, acf.calculator_salary_max),
        d.salaryMax,
      ),
      salaryStep: num(
        first(acf.salary_step, salaryG?.step, acf.calculator_salary_step),
        d.salaryStep,
      ),

      hoursLabel: str(
        first(acf.hours_label, hoursG?.label, acf.calculator_hours_label),
        d.hoursLabel,
      ),
      hoursPlaceholder: str(
        first(
          acf.hours_placeholder,
          hoursG?.placeholder,
          acf.calculator_hours_placeholder,
        ),
        d.hoursPlaceholder,
      ),
      hoursDefault: str(
        first(acf.hours_default, hoursG?.default_value, acf.calculator_hours_default),
        d.hoursDefault,
      ),
      hoursMin: num(
        first(acf.hours_min, hoursG?.min, acf.calculator_hours_min),
        d.hoursMin,
      ),
      hoursMax: num(
        first(acf.hours_max, hoursG?.max, acf.calculator_hours_max),
        d.hoursMax,
      ),
      hoursStep: num(
        first(acf.hours_step, hoursG?.step, acf.calculator_hours_step),
        d.hoursStep,
      ),

      firstDayLabel: str(
        first(
          acf.form_first_day_label,
          formG?.first_day_label,
          acf.calculator_first_day_label,
        ),
        d.firstDayLabel,
      ),
      firstDayHint: str(
        first(
          acf.form_first_day_hint,
          formG?.first_day_hint,
          acf.calculator_first_day_hint,
        ),
        d.firstDayHint,
      ),
      lastDayLabel: str(
        first(
          acf.form_last_day_label,
          formG?.last_day_label,
          acf.calculator_last_day_label,
        ),
        d.lastDayLabel,
      ),
      linkedLabel: str(
        first(acf.form_linked_label, formG?.linked_label, acf.calculator_linked_label),
        d.linkedLabel,
      ),
      linkedDescription: str(
        first(
          acf.form_linked_description,
          formG?.linked_description,
          acf.calculator_linked_description,
        ),
        d.linkedDescription,
      ),
      linkedFirstDayLabel: str(
        first(
          acf.form_linked_first_day_label,
          formG?.linked_first_day_label,
          acf.calculator_linked_first_day_label,
        ),
        d.linkedFirstDayLabel,
      ),
      linkedLastDayLabel: str(
        first(
          acf.form_linked_last_day_label,
          formG?.linked_last_day_label,
          acf.calculator_linked_last_day_label,
        ),
        d.linkedLastDayLabel,
      ),
      linkedFlagMessage: str(
        first(
          acf.form_linked_flag_message,
          formG?.linked_flag_message,
          acf.calculator_linked_flag_message,
        ),
        d.linkedFlagMessage,
      ),
      submitLabel: str(
        first(
          acf.form_submit_label,
          formG?.submit_label,
          acf.calculator_submit_label,
        ),
        d.submitLabel,
      ),
      submitLink: str(
        first(acf.form_submit_link, formG?.submit_link, acf.calculator_submit_link),
        d.submitLink,
      ),
    };
  }

  // ── Pay rules ───────────────────────────────────────────────────────────
  if (
    rulesG ||
    acf.rules_year1_percent != null ||
    acf.year1_percentage != null ||
    acf.rules_max_weeks != null
  ) {
    content.rules = {
      year1Percent: num(
        first(rulesG?.year1_percent, acf.rules_year1_percent, acf.year1_percentage),
        d.year1Percent,
      ),
      year2Percent: num(
        first(rulesG?.year2_percent, acf.rules_year2_percent, acf.year2_percentage),
        d.year2Percent,
      ),
      maxWeeks: num(first(rulesG?.max_weeks, acf.rules_max_weeks), 0),
      waitingDays: num(
        first(rulesG?.waiting_days, acf.rules_waiting_days),
        d.waitingDays,
      ),
      minWageMonthly: num(
        first(rulesG?.min_wage_monthly, acf.rules_min_wage_monthly),
        d.minWageMonthly,
      ),
      linkedAbsenceWindowDays: num(
        first(rulesG?.linked_absence_days, acf.rules_linked_absence_days),
        d.linkedAbsenceWindowDays,
      ),
      fullTimeHours: num(
        first(rulesG?.full_time_hours, acf.rules_full_time_hours),
        d.fullTimeHours,
      ),
    };
  }

  // ── Result card (+ policy button living inside this tab) ────────────────
  if (resultG || acf.year1_result_title || acf.result_kicker || acf.result_total_label) {
    content.result = {
      kicker: str(first(resultG?.kicker, acf.result_kicker), ""),
      emptyAmount: str(
        first(resultG?.empty_amount, acf.result_empty_amount),
        d.emptyAmount,
      ),
      perMonthSuffix: str(
        first(resultG?.per_month_suffix, acf.result_per_month_suffix),
        d.perMonthSuffix,
      ),
      year1Title: str(
        first(resultG?.year1_title, acf.year1_result_title),
        d.year1Title,
      ),
      year2Title: str(
        first(resultG?.year2_title, acf.year2_result_title),
        d.year2Title,
      ),
      year2PayLabel: str(
        first(resultG?.year2_pay_label, acf.result_year2_pay_label),
        d.year2PayLabel,
      ),
      totalLabel: str(first(resultG?.total_label, acf.result_total_label), ""),
      monthlyLabel: str(
        first(resultG?.monthly_label, acf.result_monthly_label),
        d.monthlyLabel,
      ),
      maxWeeksLabel: str(
        first(resultG?.max_weeks_label, acf.result_max_weeks_label),
        d.maxWeeksLabel,
      ),
      waitingDaysLabel: str(
        first(resultG?.waiting_days_label, acf.result_waiting_days_label),
        d.waitingDaysLabel,
      ),
      waitingDaysValue: str(
        first(resultG?.waiting_days_value, acf.result_waiting_days_value),
        d.waitingDaysValue,
      ),
      linkedAbsenceLabel: str(
        first(resultG?.linked_absence_label, acf.result_linked_absence_label),
        d.linkedAbsenceLabel,
      ),
      hoursAdjustedLabel: str(
        first(resultG?.hours_adjusted_label, acf.result_hours_adjusted_label),
        d.hoursAdjustedLabel,
      ),
      footnote: str(first(resultG?.footnote, acf.result_footnote), ""),
    };

    // Policy CTA is edited inside the Result tab
    content.policyAnalyserCta = {
      title: str(
        first(
          resultG?.policy_title,
          policyG?.title,
          acf.policy_cta_title,
        ),
        "",
      ),
      description: str(
        first(
          resultG?.policy_description,
          policyG?.description,
          acf.policy_cta_description,
        ),
        "",
      ),
      link: str(
        first(resultG?.policy_link, policyG?.link, acf.policy_cta_link),
        "",
      ),
    };
  } else if (policyG || acf.policy_cta_title) {
    content.policyAnalyserCta = {
      title: str(first(policyG?.title, acf.policy_cta_title), ""),
      description: str(
        first(policyG?.description, acf.policy_cta_description),
        "",
      ),
      link: str(
        first(policyG?.link, acf.policy_cta_link),
        "",
      ),
    };
  }

  // ── How it works ────────────────────────────────────────────────────────
  if (howSecG || acf.how_it_works_kicker || acf.how_it_works_title) {
    content.howItWorksSection = {
      kicker: str(first(howSecG?.kicker, acf.how_it_works_kicker), ""),
      title: str(first(howSecG?.title, acf.how_it_works_title), ""),
    };
  }
  if (Array.isArray(acf.how_it_works) && acf.how_it_works.length > 0) {
    content.howItWorks = acf.how_it_works.map((row) => ({
      number: first(row.number, row.step_number) ?? "",
      title: first(row.title, row.step_title) ?? "",
      description: first(row.description, row.step_description) ?? "",
    }));
  }

  if (acf.disclaimer_text) {
    content.disclaimer = str(acf.disclaimer_text, "");
  }

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
      secondaryCtaLink: "",
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
      perMonthSuffix: "",
    },
    industries: mapped.industries ?? [],
    section: mapped.section ?? { kicker: "", title: "", description: "" },
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
      submitLink: "",
    },
    rules: mapped.rules ?? {
      year1Percent: 0,
      year2Percent: 0,
      maxWeeks: 0,
      waitingDays: 0,
      minWageMonthly: 0,
      linkedAbsenceWindowDays: 0,
      fullTimeHours: 0,
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
      footnote: "",
    },
    howItWorksSection: mapped.howItWorksSection ?? { kicker: "", title: "" },
    howItWorks: mapped.howItWorks ?? [],
    policyAnalyserCta: mapped.policyAnalyserCta ?? {
      title: "",
      description: "",
      link: "",
    },
    disclaimer: mapped.disclaimer ?? "",
  };
}

export function useCalculatorContent() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(ACF_ENDPOINT));
  const [error, setError] = useState(
    ACF_ENDPOINT ? null : "Missing VITE_WP_API_URL / VITE_WP_CALCULATE_PAGE_ID",
  );

  useEffect(() => {
    if (!ACF_ENDPOINT) {
      setIsLoading(false);
      console.warn(
        "[Calculate] WP fetch skipped — set VITE_WP_API_URL and VITE_WP_CALCULATE_PAGE_ID, then restart Vite.",
      );
      return;
    }

    let cancelled = false;

    async function load() {
      console.info("[Calculate] Fetching ACF from", ACF_ENDPOINT);
      try {
        const res = await fetch(ACF_ENDPOINT);
        if (!res.ok) throw new Error(`WP REST API responded ${res.status}`);
        const json = await res.json();
        const page = Array.isArray(json) ? json[0] : json;
        const acf = page?.acf;

        if (!acf || (typeof acf === "object" && Object.keys(acf).length === 0)) {
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
            acfKeys: Object.keys(acf),
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

  return { content, isLoading, error, endpoint: ACF_ENDPOINT };
}

export default useCalculatorContent;
