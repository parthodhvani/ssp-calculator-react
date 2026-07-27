/**
 * useCalculatorContent.js
 * ---------------------------------------------------------------------------
 * Fetches ACF fields from the WordPress "Calculate" page and merges them on
 * top of DEFAULT_CONTENT so the UI never breaks if WP is unreachable.
 *
 * Endpoint:
 *   GET {VITE_WP_API_URL}/wp-json/wp/v2/pages?slug=calculate&_fields=id,slug,acf
 *
 * Requires:
 *   - ACF Pro 6.1+ (or ACF to REST API) with the field group Show in REST API
 *   - A published WP Page with slug `calculate`
 *   - Field group location: Page == Calculate
 *
 * Returns the same shape as before:
 *   { content, isLoading, isFallback, error }
 * ---------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "./content";

const WP_API_URL = import.meta.env.VITE_WP_API_URL;
const PAGE_SLUG = import.meta.env.VITE_WP_CALCULATE_SLUG || "calculate";

const ACF_ENDPOINT = WP_API_URL
  ? `${WP_API_URL.replace(/\/$/, "")}/wp-json/wp/v2/pages?slug=${encodeURIComponent(PAGE_SLUG)}&_fields=id,slug,acf`
  : null;

function num(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function str(value, fallback) {
  if (value == null || value === "") return fallback;
  return String(value);
}

/**
 * Converts raw ACF JSON into the nested content shape used by the UI.
 * A renamed ACF field only needs updating here — never inside components.
 */
function mapAcfResponseToContent(acf) {
  if (!acf || typeof acf !== "object") return {};

  const content = {};

  // ── Hero ──────────────────────────────────────────────────────────────
  if (
    acf.hero_badge ||
    acf.hero_title_line1 ||
    acf.hero_title_highlight ||
    acf.hero_title_suffix ||
    acf.hero_description ||
    acf.hero_cta_label ||
    acf.hero_secondary_cta_label
  ) {
    content.hero = {
      badge: str(acf.hero_badge, DEFAULT_CONTENT.hero.badge),
      titleLine1: str(acf.hero_title_line1, DEFAULT_CONTENT.hero.titleLine1),
      titleHighlight: str(
        acf.hero_title_highlight,
        DEFAULT_CONTENT.hero.titleHighlight,
      ),
      titleSuffix: str(acf.hero_title_suffix, DEFAULT_CONTENT.hero.titleSuffix),
      description: str(acf.hero_description, DEFAULT_CONTENT.hero.description),
      ctaLabel: str(acf.hero_cta_label, DEFAULT_CONTENT.hero.ctaLabel),
      secondaryCtaLabel: str(
        acf.hero_secondary_cta_label,
        DEFAULT_CONTENT.hero.secondaryCtaLabel,
      ),
    };
  }

  // ── Stats repeater ────────────────────────────────────────────────────
  if (Array.isArray(acf.stats) && acf.stats.length > 0) {
    content.stats = acf.stats.map((row) => ({
      value: row.stat_value ?? "",
      label: row.stat_label ?? "",
    }));
  }

  // ── Sample result ─────────────────────────────────────────────────────
  if (
    acf.sample_amount != null ||
    acf.sample_period_label ||
    acf.sample_current_week != null ||
    acf.sample_title ||
    acf.sample_covered_label
  ) {
    content.sampleResult = {
      title: str(acf.sample_title, DEFAULT_CONTENT.sampleResult.title),
      coveredLabel: str(
        acf.sample_covered_label,
        DEFAULT_CONTENT.sampleResult.coveredLabel,
      ),
      amount: num(acf.sample_amount, DEFAULT_CONTENT.sampleResult.amount),
      periodLabel: str(
        acf.sample_period_label,
        DEFAULT_CONTENT.sampleResult.periodLabel,
      ),
      currentWeek: num(
        acf.sample_current_week,
        DEFAULT_CONTENT.sampleResult.currentWeek,
      ),
      weekZeroLabel: str(
        acf.sample_week_zero_label,
        DEFAULT_CONTENT.sampleResult.weekZeroLabel,
      ),
      weekProgressLabel: str(
        acf.sample_week_progress_label,
        DEFAULT_CONTENT.sampleResult.weekProgressLabel,
      ),
      year1BoxLabel: str(
        acf.sample_year1_box_label,
        DEFAULT_CONTENT.sampleResult.year1BoxLabel,
      ),
      year2BoxLabel: str(
        acf.sample_year2_box_label,
        DEFAULT_CONTENT.sampleResult.year2BoxLabel,
      ),
      perMonthSuffix: str(
        acf.sample_per_month_suffix,
        DEFAULT_CONTENT.sampleResult.perMonthSuffix,
      ),
    };
  }

  // ── Industries repeater ───────────────────────────────────────────────
  if (Array.isArray(acf.industries) && acf.industries.length > 0) {
    content.industries = acf.industries
      .map((row) => row.industry_name)
      .filter(Boolean);
  }

  // ── Section heading (calculator block) ────────────────────────────────
  if (acf.section_kicker || acf.section_title || acf.section_description) {
    content.section = {
      kicker: str(acf.section_kicker, DEFAULT_CONTENT.section.kicker),
      title: str(acf.section_title, DEFAULT_CONTENT.section.title),
      description: str(
        acf.section_description,
        DEFAULT_CONTENT.section.description,
      ),
    };
  }

  // ── Calculator form fields (salary / hours + surrounding labels) ──────
  const hasCalculatorFields =
    acf.calculator_salary_label ||
    acf.calculator_salary_placeholder != null ||
    acf.calculator_salary_default != null ||
    acf.calculator_hours_label ||
    acf.calculator_hours_default != null ||
    acf.calculator_name_label ||
    acf.calculator_submit_label ||
    acf.calculator_status_label ||
    Array.isArray(acf.calculator_status_options);

  if (hasCalculatorFields) {
    const d = DEFAULT_CONTENT.calculator;
    content.calculator = {
      nameLabel: str(acf.calculator_name_label, d.nameLabel),
      namePlaceholder: str(acf.calculator_name_placeholder, d.namePlaceholder),
      companyLabel: str(acf.calculator_company_label, d.companyLabel),
      companyPlaceholder: str(
        acf.calculator_company_placeholder,
        d.companyPlaceholder,
      ),
      companyHint: str(acf.calculator_company_hint, d.companyHint),
      industryLabel: str(acf.calculator_industry_label, d.industryLabel),
      industryPlaceholder: str(
        acf.calculator_industry_placeholder,
        d.industryPlaceholder,
      ),
      industryHint: str(acf.calculator_industry_hint, d.industryHint),
      statusLabel: str(acf.calculator_status_label, d.statusLabel),
      statusOptions:
        Array.isArray(acf.calculator_status_options) &&
        acf.calculator_status_options.length > 0
          ? acf.calculator_status_options
              .map((row) => ({
                value: row.status_value ?? "",
                label: row.status_label ?? "",
              }))
              .filter((o) => o.value && o.label)
          : d.statusOptions,
      statusDefault: str(acf.calculator_status_default, d.statusDefault),

      salaryLabel: str(acf.calculator_salary_label, d.salaryLabel),
      salaryPlaceholder: str(
        acf.calculator_salary_placeholder,
        d.salaryPlaceholder,
      ),
      salaryDefault: str(acf.calculator_salary_default, d.salaryDefault),
      salaryMin: num(acf.calculator_salary_min, d.salaryMin),
      salaryMax: num(acf.calculator_salary_max, d.salaryMax),
      salaryStep: num(acf.calculator_salary_step, d.salaryStep),

      hoursLabel: str(acf.calculator_hours_label, d.hoursLabel),
      hoursPlaceholder: str(
        acf.calculator_hours_placeholder,
        d.hoursPlaceholder,
      ),
      hoursDefault: str(acf.calculator_hours_default, d.hoursDefault),
      hoursMin: num(acf.calculator_hours_min, d.hoursMin),
      hoursMax: num(acf.calculator_hours_max, d.hoursMax),
      hoursStep: num(acf.calculator_hours_step, d.hoursStep),

      firstDayLabel: str(acf.calculator_first_day_label, d.firstDayLabel),
      firstDayHint: str(acf.calculator_first_day_hint, d.firstDayHint),
      lastDayLabel: str(acf.calculator_last_day_label, d.lastDayLabel),

      linkedLabel: str(acf.calculator_linked_label, d.linkedLabel),
      linkedDescription: str(
        acf.calculator_linked_description,
        d.linkedDescription,
      ),
      linkedLastDayLabel: str(
        acf.calculator_linked_last_day_label,
        d.linkedLastDayLabel,
      ),
      linkedFlagMessage: str(
        acf.calculator_linked_flag_message,
        d.linkedFlagMessage,
      ),

      submitLabel: str(acf.calculator_submit_label, d.submitLabel),
    };
  }

  // ── Rules (canonical percentages + limits) ────────────────────────────
  // Prefer rules_* fields; accept year1_percentage / year2_percentage as
  // aliases so either ACF naming works — never duplicate the value in UI.
  const year1FromRules = acf.rules_year1_percent;
  const year1FromResult = acf.year1_percentage;
  const year2FromRules = acf.rules_year2_percent;
  const year2FromResult = acf.year2_percentage;

  if (
    year1FromRules != null ||
    year1FromResult != null ||
    year2FromRules != null ||
    year2FromResult != null ||
    acf.rules_max_weeks != null ||
    acf.rules_waiting_days != null ||
    acf.rules_min_wage_monthly != null ||
    acf.rules_linked_absence_days != null
  ) {
    content.rules = {
      year1Percent: num(
        year1FromRules ?? year1FromResult,
        DEFAULT_CONTENT.rules.year1Percent,
      ),
      year2Percent: num(
        year2FromRules ?? year2FromResult,
        DEFAULT_CONTENT.rules.year2Percent,
      ),
      maxWeeks: num(acf.rules_max_weeks, DEFAULT_CONTENT.rules.maxWeeks),
      waitingDays: num(
        acf.rules_waiting_days,
        DEFAULT_CONTENT.rules.waitingDays,
      ),
      minWageMonthly: num(
        acf.rules_min_wage_monthly,
        DEFAULT_CONTENT.rules.minWageMonthly,
      ),
      linkedAbsenceWindowDays: num(
        acf.rules_linked_absence_days,
        DEFAULT_CONTENT.rules.linkedAbsenceWindowDays,
      ),
    };
  }

  // ── Result card labels ────────────────────────────────────────────────
  if (
    acf.year1_result_title ||
    acf.year2_result_title ||
    acf.result_total_label ||
    acf.result_monthly_label ||
    acf.result_waiting_days_label ||
    acf.result_max_weeks_label ||
    acf.result_linked_absence_label ||
    acf.result_kicker ||
    acf.result_footnote ||
    acf.result_year2_pay_label ||
    acf.result_waiting_days_value
  ) {
    const d = DEFAULT_CONTENT.result;
    content.result = {
      kicker: str(acf.result_kicker, d.kicker),
      emptyAmount: str(acf.result_empty_amount, d.emptyAmount),
      perMonthSuffix: str(acf.result_per_month_suffix, d.perMonthSuffix),
      year1Title: str(acf.year1_result_title, d.year1Title),
      year2Title: str(acf.year2_result_title, d.year2Title),
      year2PayLabel: str(acf.result_year2_pay_label, d.year2PayLabel),
      totalLabel: str(acf.result_total_label, d.totalLabel),
      monthlyLabel: str(acf.result_monthly_label, d.monthlyLabel),
      maxWeeksLabel: str(acf.result_max_weeks_label, d.maxWeeksLabel),
      waitingDaysLabel: str(acf.result_waiting_days_label, d.waitingDaysLabel),
      waitingDaysValue: str(acf.result_waiting_days_value, d.waitingDaysValue),
      linkedAbsenceLabel: str(
        acf.result_linked_absence_label,
        d.linkedAbsenceLabel,
      ),
      footnote: str(acf.result_footnote, d.footnote),
    };
  }

  // ── How it works ──────────────────────────────────────────────────────
  if (
    acf.how_it_works_kicker ||
    acf.how_it_works_title ||
    (Array.isArray(acf.how_it_works) && acf.how_it_works.length > 0)
  ) {
    if (acf.how_it_works_kicker || acf.how_it_works_title) {
      content.howItWorksSection = {
        kicker: str(
          acf.how_it_works_kicker,
          DEFAULT_CONTENT.howItWorksSection.kicker,
        ),
        title: str(
          acf.how_it_works_title,
          DEFAULT_CONTENT.howItWorksSection.title,
        ),
      };
    }
    if (Array.isArray(acf.how_it_works) && acf.how_it_works.length > 0) {
      content.howItWorks = acf.how_it_works.map((row) => ({
        number: row.step_number ?? "",
        title: row.step_title ?? "",
        description: row.step_description ?? "",
      }));
    }
  }

  // ── Policy CTA + disclaimer ───────────────────────────────────────────
  if (acf.policy_cta_title || acf.policy_cta_description) {
    content.policyAnalyserCta = {
      title: str(acf.policy_cta_title, DEFAULT_CONTENT.policyAnalyserCta.title),
      description: str(
        acf.policy_cta_description,
        DEFAULT_CONTENT.policyAnalyserCta.description,
      ),
    };
  }

  if (acf.disclaimer_text) {
    content.disclaimer = str(acf.disclaimer_text, DEFAULT_CONTENT.disclaimer);
  }

  return content;
}

function mergeContent(mapped) {
  return {
    ...DEFAULT_CONTENT,
    ...mapped,
    hero: { ...DEFAULT_CONTENT.hero, ...mapped.hero },
    sampleResult: { ...DEFAULT_CONTENT.sampleResult, ...mapped.sampleResult },
    section: { ...DEFAULT_CONTENT.section, ...mapped.section },
    calculator: { ...DEFAULT_CONTENT.calculator, ...mapped.calculator },
    rules: { ...DEFAULT_CONTENT.rules, ...mapped.rules },
    result: { ...DEFAULT_CONTENT.result, ...mapped.result },
    howItWorksSection: {
      ...DEFAULT_CONTENT.howItWorksSection,
      ...mapped.howItWorksSection,
    },
    policyAnalyserCta: {
      ...DEFAULT_CONTENT.policyAnalyserCta,
      ...mapped.policyAnalyserCta,
    },
    // arrays: prefer mapped when present
    stats: mapped.stats ?? DEFAULT_CONTENT.stats,
    industries: mapped.industries ?? DEFAULT_CONTENT.industries,
    howItWorks: mapped.howItWorks ?? DEFAULT_CONTENT.howItWorks,
  };
}

export function useCalculatorContent() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState(Boolean(ACF_ENDPOINT));
  const [isFallback, setIsFallback] = useState(!ACF_ENDPOINT);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ACF_ENDPOINT) {
      // No WP URL configured — silently use defaults.
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(ACF_ENDPOINT);
        if (!res.ok) throw new Error(`WP REST API responded ${res.status}`);
        const json = await res.json();

        // wp/v2/pages?slug=… returns an array — take the first page
        const page = Array.isArray(json) ? json[0] : json;
        const acf = page?.acf;

        if (!acf || (typeof acf === "object" && Object.keys(acf).length === 0)) {
          // Empty ACF payload → keep defaults, mark as fallback
          if (!cancelled) {
            setIsFallback(true);
            setError("Calculate page ACF fields are empty");
          }
          return;
        }

        const mapped = mapAcfResponseToContent(acf);

        if (!cancelled) {
          setContent(mergeContent(mapped));
          setIsFallback(false);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setIsFallback(true);
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

  return { content, isLoading, isFallback, error };
}

export default useCalculatorContent;
