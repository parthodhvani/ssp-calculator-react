/**
 * calculatorContent.ts
 * ---------------------------------------------------------------------------
 * This file is the "map" between the React UI and WordPress/ACF.
 *
 * Every value the calculator displays (headline text, stat numbers, the
 * industry dropdown, the legal percentages used in the maths) lives in the
 * `CalculatorContent` shape below instead of being typed directly into JSX.
 *
 * How it works:
 *   1. `DEFAULT_CALCULATOR_CONTENT` = safe fallback values. The site works
 *      even if WordPress is down or a field is empty.
 *   2. `useCalculatorContent()` (see src/hooks/useCalculatorContent.ts) fetches
 *      the real values from the WP REST API and overlays them on top of the
 *      defaults.
 *   3. Every key name below matches an ACF field name 1:1 (see
 *      /wp-acf/acf-field-group.json and /wp-acf/ACF-INTEGRATION.md).
 *
 * As a WP dev: create the ACF field group from the JSON export, fill it in,
 * and you don't need to touch any .tsx file to change copy or numbers.
 * ---------------------------------------------------------------------------
 */

export interface CalculatorStat {
  /** ACF field: stat_value  (e.g. "104") */
  value: string;
  /** ACF field: stat_label (e.g. "weeks max entitlement") */
  label: string;
}

export interface CalculatorHowItWorksStep {
  /** ACF field: step_number (e.g. "01") */
  number: string;
  /** ACF field: step_title */
  title: string;
  /** ACF field: step_description */
  description: string;
}

export interface CalculatorRules {
  /** ACF field: rules_year1_percent — % of gross pay in year 1 (default 100) */
  year1Percent: number;
  /** ACF field: rules_year2_percent — % of gross pay in year 2 (default 70) */
  year2Percent: number;
  /** ACF field: rules_max_weeks — statutory max entitlement in weeks (default 104) */
  maxWeeks: number;
  /** ACF field: rules_waiting_days — unpaid waiting day(s) at the start (default 1) */
  waitingDays: number;
  /** ACF field: rules_min_wage_monthly — statutory monthly minimum wage in EUR */
  minWageMonthly: number;
  /** ACF field: rules_linked_absence_days — window (days) that links two absences (default 28) */
  linkedAbsenceWindowDays: number;
}

export interface CalculatorContent {
  hero: {
    /** ACF field: hero_badge */
    badge: string;
    /** ACF field: hero_title_line1 */
    titleLine1: string;
    /** ACF field: hero_title_highlight */
    titleHighlight: string;
    /** ACF field: hero_title_suffix */
    titleSuffix: string;
    /** ACF field: hero_description */
    description: string;
    /** ACF field: hero_cta_label */
    ctaLabel: string;
  };
  /** ACF field: stats (repeater, 3 rows) */
  stats: CalculatorStat[];
  sampleResult: {
    /** ACF field: sample_amount */
    amount: number;
    /** ACF field: sample_period_label */
    periodLabel: string;
    /** ACF field: sample_current_week */
    currentWeek: number;
  };
  /** ACF field: industries (repeater of single "industry_name" text rows) */
  industries: string[];
  /** ACF field group: rules */
  rules: CalculatorRules;
  /** ACF field: how_it_works (repeater, 3 rows) */
  howItWorks: CalculatorHowItWorksStep[];
  policyAnalyserCta: {
    /** ACF field: policy_cta_title */
    title: string;
    /** ACF field: policy_cta_description */
    description: string;
  };
  /** ACF field: disclaimer_text */
  disclaimer: string;
}

export const DEFAULT_CALCULATOR_CONTENT: CalculatorContent = {
  hero: {
    badge: "Art. 7:629 · minimum wage July 2026",
    titleLine1: "Netherlands sick leave,",
    titleHighlight: "calculated properly",
    titleSuffix: "— and explained.",
    description:
      "Enter a few details from any industry and get a real euro estimate of continued pay during illness, an AI assistant for follow-up questions, and a tool that reads your own policy against Dutch law.",
    ctaLabel: "Start calculating",
  },
  stats: [
    { value: "104", label: "weeks max entitlement" },
    { value: "70%", label: "statutory floor" },
    { value: "€ 2,437", label: "min wage / month" },
  ],
  sampleResult: {
    amount: 3200,
    periodLabel: "Year 1 · Weeks 1–52",
    currentWeek: 40,
  },
  industries: [
    "IT & Software",
    "Manufacturing & Industrial",
    "Healthcare & Care",
    "Retail & Hospitality",
    "Construction",
    "Logistics & Transport",
    "Finance & Insurance",
    "Education",
    "Agriculture",
    "Other",
  ],
  rules: {
    year1Percent: 100,
    year2Percent: 70,
    maxWeeks: 104,
    waitingDays: 1,
    minWageMonthly: 2437,
    linkedAbsenceWindowDays: 28,
  },
  howItWorks: [
    {
      number: "01",
      title: "Statutory calculator",
      description:
        "Real euro estimate of continued pay across the full 104-week window.",
    },
    {
      number: "02",
      title: "AI follow-up",
      description: "Ask questions about your situation in plain English or Dutch.",
    },
    {
      number: "03",
      title: "Policy analyser",
      description:
        "Upload your CAO or contract — we flag anything below the statutory floor.",
    },
  ],
  policyAnalyserCta: {
    title: "Check your own policy",
    description: "Upload contract / CAO — AI checks it against Dutch rules.",
  },
  disclaimer: "Illustrative estimate — not legal advice.",
};
