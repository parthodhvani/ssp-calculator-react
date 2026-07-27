/**
 * entitlement.js
 * ---------------------------------------------------------------------------
 * Pure maths — no UI, no hardcoded legal numbers.
 *
 * calculateEntitlement(salary, rules) reads EVERY configurable number from
 * the `rules` object supplied by ACF via useCalculatorContent():
 *   rules.year1Percent
 *   rules.year2Percent
 *   rules.maxWeeks
 *   rules.waitingDays
 *   rules.minWageMonthly
 *   rules.linkedAbsenceWindowDays
 *
 * Change a percentage in WordPress → calculation and display both update.
 * ---------------------------------------------------------------------------
 */

export function calculateEntitlement(grossMonthlySalary, rules) {
  if (!grossMonthlySalary || grossMonthlySalary <= 0) return null;

  const year1Monthly = Math.round(grossMonthlySalary * (rules.year1Percent / 100));
  const year2Monthly = Math.round(grossMonthlySalary * (rules.year2Percent / 100));

  return {
    year1Monthly,
    year2Monthly,
    // 12 months at year-1 rate + 12 months at year-2 rate (104-week / 2-year window)
    totalOverMaxTerm: year1Monthly * 12 + year2Monthly * 12,
    maxWeeks: rules.maxWeeks,
    waitingDays: rules.waitingDays,
    minWageMonthly: rules.minWageMonthly,
    year1Percent: rules.year1Percent,
    year2Percent: rules.year2Percent,
  };
}

/**
 * Whole weeks elapsed since first day of sick leave (as of today).
 */
export function weeksElapsedSince(firstDayIso) {
  if (!firstDayIso) return 0;
  const start = new Date(firstDayIso);
  if (Number.isNaN(start.getTime())) return 0;
  const diffMs = Date.now() - start.getTime();
  return Math.max(0, Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)));
}

/**
 * Two absences count as one continuous period if the gap between them is
 * shorter than rules.linkedAbsenceWindowDays (statutory default: 28).
 */
export function isLinkedAbsence(previousLastDayIso, newFirstDayIso, rules) {
  const prev = new Date(previousLastDayIso);
  const next = new Date(newFirstDayIso);
  if (Number.isNaN(prev.getTime()) || Number.isNaN(next.getTime())) return false;
  const gapDays = (next.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000);
  return gapDays >= 0 && gapDays <= rules.linkedAbsenceWindowDays;
}
