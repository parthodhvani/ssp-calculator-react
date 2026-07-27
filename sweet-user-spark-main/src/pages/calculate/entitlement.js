/**
 * entitlement.js
 * ---------------------------------------------------------------------------
 * The maths, isolated from the UI on purpose.
 *
 * calculateEntitlement() takes the salary AND a `rules` object (which comes
 * from ACF via useCalculatorContent()) and returns the result. No component
 * code needs to change if the statutory rate ever changes — just update the
 * ACF field.
 * ---------------------------------------------------------------------------
 */

export function calculateEntitlement(grossMonthlySalary, rules) {
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
export function weeksElapsedSince(firstDayIso) {
  if (!firstDayIso) return 0;
  const start = new Date(firstDayIso);
  if (Number.isNaN(start.getTime())) return 0;
  const diffMs = Date.now() - start.getTime();
  return Math.max(0, Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)));
}

/**
 * Two absences count as one continuous period under Art. 7:629 if the gap
 * between them is shorter than the linked-absence window (statutory: 4
 * weeks / 28 days). Driven by rules.linkedAbsenceWindowDays instead of a
 * magic number.
 */
export function isLinkedAbsence(previousLastDayIso, newFirstDayIso, rules) {
  const prev = new Date(previousLastDayIso);
  const next = new Date(newFirstDayIso);
  if (Number.isNaN(prev.getTime()) || Number.isNaN(next.getTime())) return false;
  const gapDays = (next.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000);
  return gapDays >= 0 && gapDays <= rules.linkedAbsenceWindowDays;
}
