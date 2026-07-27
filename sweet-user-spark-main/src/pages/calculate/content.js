/**
 * content.js — Calculate page
 * ---------------------------------------------------------------------------
 * Fallback content when WordPress is offline. Editors manage the live values
 * via the step-by-step ACF tabs on the Calculate page
 * (see /wp-acf/acf-field-group.json).
 * ---------------------------------------------------------------------------
 */

export const DEFAULT_CONTENT = {
  hero: {
    // Two pills as on the design (ART. 7:629 | MINIMUM WAGE JULY 2026)
    badge1: "ART. 7:629",
    badge2: "MINIMUM WAGE JULY 2026",
    titleLine1: "Netherlands sick leave,",
    titleHighlight: "calculated properly",
    titleSuffix: "— and explained.",
    description:
      "Enter a few details from any industry and get a real euro estimate of continued pay during illness, an AI assistant for follow-up questions, and a tool that reads your own policy against Dutch law.",
    ctaLabel: "Start calculating",
    ctaLink: "#calculator",
    secondaryCtaLabel: "Not sure you're covered? Eligibility guide →",
    secondaryCtaLink: "/eligibility",
  },

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
    linkedDescription:
      "A new absence within {weeks} weeks of the last one is legally linked — it counts toward the same {maxWeeks}-week limit.",
    linkedFirstDayLabel: "First day of that earlier sick leave",
    linkedLastDayLabel: "Last day of that earlier sick leave",
    linkedFlagMessage:
      "These absences are linked — they share one {maxWeeks}-week entitlement.",

    submitLabel: "Calculate my entitlement",
    submitLink: "",
  },

  rules: {
    year1Percent: 100,
    year2Percent: 70,
    maxWeeks: 104,
    waitingDays: 1,
    minWageMonthly: 2437,
    linkedAbsenceWindowDays: 28,
    /** Full-time baseline used to prorate contracted hours */
    fullTimeHours: 40,
  },

  result: {
    kicker: "Your entitlement",
    emptyAmount: "€ —",
    perMonthSuffix: "/mo",
    year1Title: "Year 1 · {percent}% of gross (statutory)",
    year2Title: "Year 2 · {percent}% of gross (statutory)",
    year2PayLabel: "Year 2 pay",
    totalLabel: "Cumulative (24 mo)",
    monthlyLabel: "Monthly",
    maxWeeksLabel: "Weeks remaining",
    waitingDaysLabel: "Waiting day(s)",
    waitingDaysValue: "{days} day(s) (wachtdag)",
    linkedAbsenceLabel: "Linked absence window",
    hoursAdjustedLabel: "Hours-adjusted salary",
    footnote:
      "Based on Art. 7:629 of the Dutch Civil Code. CAO in your sector may raise the floor above statutory.",
  },

  howItWorksSection: {
    kicker: "02 · How it works",
    title: "Three tools, one source of truth.",
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
    link: "/policy-analyser",
  },

  disclaimer: "Illustrative estimate — not legal advice.",
};

export function formatTemplate(template, vars = {}) {
  if (!template) return "";
  return String(template).replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] != null ? String(vars[key]) : `{${key}}`,
  );
}

/**
 * Render an ACF-driven link: internal paths use <a href>, hashes stay on-page,
 * absolute URLs open normally.
 */
export function resolveHref(link, fallback = "#") {
  if (link == null || String(link).trim() === "") return fallback;
  return String(link).trim();
}
