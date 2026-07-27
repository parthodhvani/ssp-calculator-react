/**
 * content.js — Calculate page
 * ---------------------------------------------------------------------------
 * This is the "map" between the React UI and WordPress/ACF for the
 * Calculate page. Every value the calculator displays (headline text, stat
 * numbers, the industry dropdown, the legal percentages used in the maths)
 * lives in this object instead of being typed directly into JSX.
 *
 * How it works:
 *   1. DEFAULT_CONTENT below = safe fallback values. The page still works
 *      even if WordPress is down or a field is empty.
 *   2. useCalculatorContent() (see ./useCalculatorContent.js) fetches the
 *      real values from the WP REST API and overlays them on top of this.
 *   3. Every key name matches an ACF field name 1:1 (see
 *      /wp-acf/acf-field-group.json and /wp-acf/ACF-INTEGRATION.md).
 *
 * As a WP dev: create the ACF field group from the JSON export, fill it in,
 * and you don't need to touch a single component file to change copy or
 * numbers.
 * ---------------------------------------------------------------------------
 */

export const DEFAULT_CONTENT = {
  hero: {
    badge: "Art. 7:629 · minimum wage July 2026",
    titleLine1: "Netherlands sick leave,",
    titleHighlight: "calculated properly",
    titleSuffix: "— and explained.",
    description:
      "Enter a few details from any industry and get a real euro estimate of continued pay during illness, an AI assistant for follow-up questions, and a tool that reads your own policy against Dutch law.",
    ctaLabel: "Start calculating",
  },
  // ACF field: stats (repeater, 3 rows) — stat_value / stat_label
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
  // ACF field: industries (repeater of single "industry_name" text rows)
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
  // ACF field group: rules
  rules: {
    year1Percent: 100,
    year2Percent: 70,
    maxWeeks: 104,
    waitingDays: 1,
    minWageMonthly: 2437,
    linkedAbsenceWindowDays: 28,
  },
  // ACF field: how_it_works (repeater, 3 rows)
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
