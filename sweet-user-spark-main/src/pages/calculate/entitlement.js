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

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const YEAR1_WEEKS_DEFAULT = 52;

function parseDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Whole weeks between two dates (floor, never negative). */
export function weeksBetween(fromIso, toIso) {
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
function resolveAsOfDate(lastDayIso, now = new Date()) {
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
    if (linkedStart && currentStart) {
      return linkedStart.getTime() <= currentStart.getTime()
        ? linkedFirstDayIso
        : firstDayIso;
    }
    if (linkedStart) return linkedFirstDayIso;
  }
  return firstDayIso;
}

export function weeksElapsedSince(firstDayIso, lastDayIso, now = new Date()) {
  if (!firstDayIso) return 0;
  const asOf = resolveAsOfDate(lastDayIso, now);
  return weeksBetween(firstDayIso, asOf.toISOString().slice(0, 10));
}

/**
 * Two absences count as one continuous period if the gap is within
 * rules.linkedAbsenceWindowDays (statutory default: 28).
 */
export function isLinkedAbsence(previousLastDayIso, newFirstDayIso, rules) {
  const prev = parseDate(previousLastDayIso);
  const next = parseDate(newFirstDayIso);
  if (!prev || !next) return false;
  const gapDays =
    (startOfDay(next).getTime() - startOfDay(prev).getTime()) / MS_PER_DAY;
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
export function calculateEntitlement(input, rules) {
  const gross = Number(input?.grossMonthlySalary) || 0;
  if (gross <= 0) return null;

  const fullTimeHours = Number(rules.fullTimeHours) > 0 ? Number(rules.fullTimeHours) : 40;
  const hoursRaw = Number(input?.contractedHours);
  const contractedHours =
    Number.isFinite(hoursRaw) && hoursRaw > 0 ? hoursRaw : fullTimeHours;

  // Prorate salary by contracted hours vs full-time baseline (ACF: fullTimeHours)
  const hourFactor = Math.min(contractedHours / fullTimeHours, 1.5); // soft cap
  const effectiveMonthly = gross * hourFactor;

  const year1Percent = Number(rules.year1Percent) || 0;
  const year2Percent = Number(rules.year2Percent) || 0;
  const maxWeeks = Number(rules.maxWeeks) > 0 ? Number(rules.maxWeeks) : 104;
  const waitingDays = Number(rules.waitingDays) || 0;
  const year1Weeks = Math.min(YEAR1_WEEKS_DEFAULT, maxWeeks);

  const year1Monthly = Math.round(effectiveMonthly * (year1Percent / 100));
  const year2Monthly = Math.round(effectiveMonthly * (year2Percent / 100));

  // Statutory cumulative across the full max window (≈ 12 mo + 12 mo when 104 weeks)
  const year1Months = Math.round((year1Weeks / 52) * 12);
  const year2Months = Math.round(((maxWeeks - year1Weeks) / 52) * 12);
  const totalOverMaxTerm = year1Monthly * year1Months + year2Monthly * year2Months;

  const clockStart = resolveClockStart(
    input?.firstDay,
    Boolean(input?.linked),
    input?.linkedFirstDay,
  );

  const weeksElapsed = clockStart
    ? weeksElapsedSince(clockStart, input?.lastDay)
    : 0;
  const weeksRemaining = Math.max(0, maxWeeks - weeksElapsed);

  // Which statutory year the employee is currently in
  const inYear2 = weeksElapsed >= year1Weeks;
  const currentMonthly = inYear2 ? year2Monthly : year1Monthly;
  const currentPercent = inYear2 ? year2Percent : year1Percent;
  const currentYear = inYear2 ? 2 : 1;

  // Length of this absence spell (if both dates set)
  let absenceWeeks = null;
  if (input?.firstDay && input?.lastDay) {
    absenceWeeks = weeksBetween(input.firstDay, input.lastDay);
  }

  // Rough pay for this absence (uses current year’s rate × absence weeks → months)
  let absenceTotal = null;
  if (absenceWeeks != null && absenceWeeks >= 0) {
    const absenceMonths = absenceWeeks / (52 / 12);
    absenceTotal = Math.round(currentMonthly * absenceMonths);
  }

  // Floor check vs statutory minimum wage (informational)
  const minWageMonthly = Number(rules.minWageMonthly) || 0;
  const belowMinWage =
    minWageMonthly > 0 && year1Monthly < Math.round(minWageMonthly * (year1Percent / 100));

  return {
    // Basis
    grossMonthlySalary: gross,
    contractedHours,
    fullTimeHours,
    hourFactor,
    effectiveMonthly: Math.round(effectiveMonthly),

    // Monthly rates
    year1Monthly,
    year2Monthly,
    currentMonthly,
    currentPercent,
    currentYear,
    year1Percent,
    year2Percent,

    // Totals
    totalOverMaxTerm,
    absenceWeeks,
    absenceTotal,

    // Time window
    weeksElapsed,
    weeksRemaining,
    maxWeeks,
    year1Weeks,
    waitingDays,
    minWageMonthly,
    belowMinWage,
    clockStart: clockStart || null,
  };
}
