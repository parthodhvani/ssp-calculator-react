/**
 * content.js — Calculate page
 * ---------------------------------------------------------------------------
 * Single source of truth for every editable string/number on the Calculate
 * page. WordPress/ACF overlays these defaults at runtime via
 * useCalculatorContent(). If WP is unreachable, this object is used as-is.
 *
 * WordPress editors use 9 client-friendly ACF tabs/groups (see
 * /wp-acf/acf-field-group.json). mapAcfResponseToContent() maps those groups
 * onto this shape. Defaults below are used when WP is offline.
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
    secondaryCtaLabel: "Not sure you're covered? Eligibility guide →",
  },

  // ACF field: stats (repeater) — stat_value / stat_label
  stats: [
    { value: "104", label: "weeks max entitlement" },
    { value: "70%", label: "statutory floor" },
    { value: "€ 2,437", label: "min wage / month" },
  ],

  sampleResult: {
    title: "Sample entitlement",
    coveredLabel: "Covered",
    amount: 3200,
    periodLabel: "Year 1 · Weeks 1–52",
    currentWeek: 40,
    weekZeroLabel: "Week 0",
    weekProgressLabel: "Week {current} / {max}",
    year1BoxLabel: "Year 1",
    year2BoxLabel: "Year 2",
    perMonthSuffix: "/mo",
  },

  // ACF field: industries (repeater of industry_name)
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

  section: {
    kicker: "01 · Calculate",
    title: "Your entitlement",
    description:
      "Everything is computed in your browser — nothing is sent anywhere until you ask for the full report.",
  },

  /**
   * Form labels / defaults / constraints — all ACF-driven.
   * Salary & hours min/max/step control the HTML inputs.
   */
  calculator: {
    nameLabel: "Your name",
    namePlaceholder: "e.g. Jordan Vance",
    companyLabel: "Company name",
    companyPlaceholder: "e.g. Company B.V.",
    companyHint: "Used to label your result.",
    industryLabel: "Industry / sector",
    industryPlaceholder: "Select your industry",
    industryHint: "Flags if your sector typically has a CAO above the statutory minimum.",
    statusLabel: "Employment status",
    statusOptions: [
      { value: "employee", label: "Employee" },
      { value: "self", label: "Self-employed" },
    ],
    statusDefault: "employee",

    salaryLabel: "Gross monthly salary (€)",
    salaryPlaceholder: "3200",
    salaryDefault: "",
    salaryMin: 0,
    salaryMax: 100000,
    salaryStep: 1,

    hoursLabel: "Contracted hours / week",
    hoursPlaceholder: "40",
    hoursDefault: "40",
    hoursMin: 1,
    hoursMax: 60,
    hoursStep: 1,

    firstDayLabel: "First day of sick leave",
    firstDayHint: "We'll work out the week number for you.",
    lastDayLabel: "Last day (leave blank if still off)",

    linkedLabel: "Linked earlier absence?",
    // {weeks} = linkedAbsenceWindowDays / 7, {maxWeeks} = rules.maxWeeks
    linkedDescription:
      "A new absence within {weeks} weeks of the last one is legally linked — it counts toward the same {maxWeeks}-week limit.",
    linkedLastDayLabel: "Last day of that earlier sick leave",
    // {maxWeeks} = rules.maxWeeks
    linkedFlagMessage:
      "These absences are linked — they share one {maxWeeks}-week entitlement.",

    submitLabel: "Calculate my entitlement",
  },

  /**
   * Calculation rules — THE only place percentages / week limits live.
   * Display and maths both read from here. Never hardcode these in JSX.
   */
  rules: {
    year1Percent: 100,
    year2Percent: 70,
    maxWeeks: 104,
    waitingDays: 1,
    minWageMonthly: 2437,
    linkedAbsenceWindowDays: 28,
  },

  /**
   * Result card copy. Titles may include `{percent}` which is replaced with
   * the matching rules.yearNPercent at render time — one source of truth.
   */
  result: {
    kicker: "Your entitlement",
    emptyAmount: "€ —",
    perMonthSuffix: "/mo",
    // {percent} → content.rules.year1Percent
    year1Title: "Year 1 · {percent}% of gross (statutory)",
    // {percent} → content.rules.year2Percent
    year2Title: "Year 2 · {percent}% of gross",
    year2PayLabel: "Year 2 pay",
    totalLabel: "Cumulative (24 mo)",
    monthlyLabel: "Monthly",
    maxWeeksLabel: "Weeks remaining",
    waitingDaysLabel: "Waiting day(s)",
    // {days} → rules.waitingDays
    waitingDaysValue: "{days} day(s) (wachtdag)",
    linkedAbsenceLabel: "Linked absence window",
    footnote:
      "Based on Art. 7:629 of the Dutch Civil Code. CAO in your sector may raise the floor above statutory.",
  },

  howItWorksSection: {
    kicker: "02 · How it works",
    title: "Three tools, one source of truth.",
  },

  // ACF field: how_it_works (repeater)
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

/**
 * Replace `{token}` placeholders in an ACF-driven string.
 * e.g. formatTemplate("Year 1 · {percent}%", { percent: 75 })
 *   → "Year 1 · 75%"
 */
export function formatTemplate(template, vars = {}) {
  if (!template) return "";
  return String(template).replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] != null ? String(vars[key]) : `{${key}}`,
  );
}
