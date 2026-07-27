/**
 * entitlement.ts
 * ---------------------------------------------------------------------------
 * The maths, isolated from the UI on purpose.
 *
 * Before: the percentages (100% / 70%) were typed directly inside the React
 * component, so changing the law meant editing JSX.
 *
 * After: this function takes the salary AND a `CalculatorRules` object
 * (which comes from ACF via useCalculatorContent()) and returns the result.
 * No component code needs to change if the statutory rate ever changes —
 * just update the ACF field.
 * ---------------------------------------------------------------------------
 */

import { CalculatorRules } from "@/config/calculatorContent";

export interface EntitlementEstimate {
  /** Monthly pay in year 1 of illness */
  year1Monthly: number;
  /** Monthly pay in year 2 of illness */
  year2Monthly: number;
  /** Total paid out across the full 24-month (104-week) window */
  totalOverMaxTerm: number;
  maxWeeks: number;
  waitingDays: number;
}

export function calculateEntitlement(
  grossMonthlySalary: number,
  rules: CalculatorRules,
): EntitlementEstimate | null {
  if (!grossMonthlySalary || grossMonthlySalary <= 0) return null;

  const year1Monthly = Math.round(grossMonthlySalary * (rules.year1Percent / 100));
  const year2Monthly = Math.round(grossMonthlySalary * (rules.year2Percent / 100));

  return {
    year1Monthly,
    year2Monthly,
    totalOverMaxTerm: year1Monthly * 12 + year2Monthly * 12,
    maxWeeks: rules.maxWeeks,
    waitingDays: rules.waitingDays,
  };
}

/**
 * Given a first day of sick leave, returns how many whole weeks have
 * elapsed as of today. Used to show "week X of 104" once a date is entered.
 */
export function weeksElapsedSince(firstDayIso: string): number {
  if (!firstDayIso) return 0;
  const start = new Date(firstDayIso);
  if (Number.isNaN(start.getTime())) return 0;
  const diffMs = Date.now() - start.getTime();
  return Math.max(0, Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)));
}

/**
 * Two absences count as one continuous period under Art. 7:629 if the gap
 * between them is shorter than the linked-absence window (statutory: 4
 * weeks / 28 days). Exposed here so it's driven by rules.linkedAbsenceWindowDays
 * instead of a magic number.
 */
export function isLinkedAbsence(
  previousLastDayIso: string,
  newFirstDayIso: string,
  rules: CalculatorRules,
): boolean {
  const prev = new Date(previousLastDayIso);
  const next = new Date(newFirstDayIso);
  if (Number.isNaN(prev.getTime()) || Number.isNaN(next.getTime())) return false;
  const gapDays = (next.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000);
  return gapDays >= 0 && gapDays <= rules.linkedAbsenceWindowDays;
}
