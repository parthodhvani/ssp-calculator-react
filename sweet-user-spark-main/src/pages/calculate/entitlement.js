/**
 * entitlement.js - corrected version
 *
 * Changes:
 * - Applies minimum-wage top-up to both year1 and year2 monthly payments.
 * - belowMinWage now compares the RAW gross monthly salary directly against
 *   the exact rules.min_wage_monthly ACF value - no percentage or other
 *   calculation involved. gross >= minWageMonthly -> no warning.
 *   gross < minWageMonthly -> warning.
 * - Subtracts waiting days from the absence total (only for new sickness periods;
 *   linked absences inherit the waiting period from the previous sickness).
 * - Keeps all original date/week calculations.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const YEAR1_WEEKS_DEFAULT = 52;

/* ----- helper functions (unchanged) ----- */

function parseDate(iso) {
  if (!iso) return null;
  const parts = iso.split("-");
  if (parts.length !== 3) return null;
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function weeksBetween(fromIso, toIso) {
  const from = parseDate(fromIso);
  const to = parseDate(toIso);
  if (!from || !to) return 0;
  const diff = startOfDay(to).getTime() - startOfDay(from).getTime();
  if (diff < 0) return 0;
  return Math.floor(diff / (7 * MS_PER_DAY));
}

function resolveAsOfDate(lastDayIso, now = new Date()) {
  const last = parseDate(lastDayIso);
  const today = startOfDay(now);
  if (last && startOfDay(last).getTime() <= today.getTime()) {
    return last;
  }
  return today;
}

function weeksElapsedSince(startIso, lastDayIso) {
  const start = parseDate(startIso);
  if (!start) return 0;
  const end = resolveAsOfDate(lastDayIso);
  const diff = startOfDay(end).getTime() - startOfDay(start).getTime();
  if (diff < 0) return 0;
  return Math.floor(diff / (7 * MS_PER_DAY));
}

export function isLinkedAbsence(previousLastDayIso, newFirstDayIso, rules) {
  const prev = parseDate(previousLastDayIso);
  const next = parseDate(newFirstDayIso);
  if (!prev || !next) return false;
  const gapDays = (startOfDay(next).getTime() - startOfDay(prev).getTime()) / MS_PER_DAY;
  const allowed = Number(rules.linked_absence_days) || 28;
  return gapDays >= 0 && gapDays <= allowed;
}

/* ----- main calculation (corrected) ----- */

export function calculateEntitlement(input, rules) {
  const gross = Number(input?.grossMonthlySalary) || 0;
  if (gross <= 0) return null;

  const year1Pct = Number(rules.year1Percent) || 0;
  const year2Pct = Number(rules.year2Percent) || 0;
  const maxWeeks = Number(rules.maxWeeks) > 0 ? Number(rules.maxWeeks) : 104;
  const waitingDays = Number(rules.waitingDays) || 0;
  const minWageMonthly = Number(rules.minWageMonthly) || 0;

  // ---- 1. Raw monthly payments ----
  let year1Monthly = Math.round(gross * (year1Pct / 100));
  let year2Monthly = Math.round(gross * (year2Pct / 100));

  // ---- 2. Apply minimum-wage top-up ----
  // The law says: payment = max(70% of salary, minimum wage)
  // We assume full-time; for part-time, the minimum wage is proportional,
  // but we don't have hours, so this is a reasonable estimate.
  if (minWageMonthly > 0) {
    year1Monthly = Math.max(year1Monthly, minWageMonthly);
    year2Monthly = Math.max(year2Monthly, minWageMonthly);
  }

  // ---- 3. Determine year split ----
  const year1Weeks = Math.min(YEAR1_WEEKS_DEFAULT, maxWeeks);

  // ---- 4. Linked absence & clock start ----
  const userWantsLinked = Boolean(input?.linked);
  const effectiveLinked =
    userWantsLinked &&
    isLinkedAbsence(input?.linkedLastDay, input?.firstDay, rules);

  let clockStart = input?.firstDay || null;
  if (effectiveLinked && input?.linkedFirstDay) {
    const linkedStart = parseDate(input.linkedFirstDay);
    const currentStart = parseDate(input.firstDay);
    if (linkedStart && currentStart) {
      clockStart =
        linkedStart.getTime() <= currentStart.getTime()
          ? input.linkedFirstDay
          : input.firstDay;
    } else {
      clockStart = input.linkedFirstDay;
    }
  }

  // ---- 5. Weeks elapsed & remaining ----
  const weeksElapsed = clockStart
    ? weeksElapsedSince(clockStart, input?.lastDay)
    : 0;
  const weeksRemaining = Math.max(0, maxWeeks - weeksElapsed);

  // ---- 6. Current period ----
  const inYear2 = weeksElapsed >= year1Weeks;
  const currentMonthly = inYear2 ? year2Monthly : year1Monthly;
  const currentPercent = inYear2 ? year2Pct : year1Pct;
  const currentYear = inYear2 ? 2 : 1;

  // ---- 7. Absence duration (in weeks) ----
  let absenceWeeks = null;
  if (input?.firstDay && input?.lastDay) {
    absenceWeeks = weeksBetween(input.firstDay, input.lastDay);
  }

  // ---- 8. Total payment for this absence (with waiting-day deduction) ----
  let absenceTotal = null;
  if (absenceWeeks !== null) {
    // Daily rate: monthly * 12 / 52 / 7
    const dailyRate = (currentMonthly * 12) / 52 / 7;

    let totalDays = 0;
    if (input.firstDay && input.lastDay) {
      const from = parseDate(input.firstDay);
      const to = parseDate(input.lastDay);
      if (from && to) {
        totalDays =
          Math.floor((startOfDay(to).getTime() - startOfDay(from).getTime()) / MS_PER_DAY) + 1; // inclusive
      }
    }
    // Waiting days apply only if this is a new sickness (not linked)
    const effectiveWaitingDays = effectiveLinked ? 0 : waitingDays;
    const payableDays = Math.max(0, totalDays - effectiveWaitingDays);
    absenceTotal = Math.round(payableDays * dailyRate);
  }

  // ---- 9. Total possible payment over the full term (with top-up) ----
  const totalOverMaxTerm = year1Monthly * 12 + year2Monthly * 12;

  // ---- 10. Return result ----
  return {
    // Monthly payments (after top-up)
    year1Monthly,
    year2Monthly,
    currentMonthly,

    // Percentages
    year1Percent: year1Pct,
    year2Percent: year2Pct,
    currentPercent,
    currentYear,

    // Payment totals
    totalOverMaxTerm,
    absenceWeeks,
    absenceTotal, // corrected for waiting days

    // Timeline
    weeksElapsed,
    weeksRemaining,
    maxWeeks,
    year1Weeks,

    // Rules
    waitingDays,
    minWageMonthly, // exact ACF value, exposed as-is for display

    // Minimum-wage validation:
    // Direct comparison of the RAW gross monthly salary entered by the
    // user against the exact rules.min_wage_monthly value. No percentage,
    // no rounding, no other calculation.
    //   gross >= minWageMonthly  -> false (no warning)
    //   gross <  minWageMonthly  -> true  (show warning)
    belowMinWage: minWageMonthly > 0 && gross < minWageMonthly,

    // Dates
    clockStart,

    // Link status
    effectiveLinked,
  };
}