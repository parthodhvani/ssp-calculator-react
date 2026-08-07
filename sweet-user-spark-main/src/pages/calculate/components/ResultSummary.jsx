/**
 * ResultSummary.jsx - Calculate page
 *
 * `estimate` / `linkNote` are now only ever the SNAPSHOT captured at the
 * moment the entitlement email was sent — CalculatePage no longer feeds this
 * component live, as-you-type values. `unlocked` tells this component
 * whether that snapshot exists yet; while it doesn't, a locked/teaser panel
 * is shown instead of any numbers.
 */
import { ArrowRight, Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { StatRow } from "@/components/shared/StatRow";
import { formatTemplate, resolveHref } from "../content";

const LOCKED_ROW_LABELS = [
  "Total entitlement period",
  "Used so far",
  "Remaining entitlement",
  "Current payment period",
  "Waiting period",
];

function LockedResultPanel({ kicker }) {
  return (
    <div
      className="rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8"
      style={{ boxShadow: "var(--shadow-elegant)" }}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground/60">
        {kicker}
      </p>

      <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-primary-foreground/20 bg-primary-foreground/5 px-6 py-10 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-foreground/10">
          <Lock className="h-5 w-5 text-primary-foreground/70" />
        </div>
        <p className="mt-4 text-sm font-medium text-primary-foreground">
         Your personalized entitlement estimate will appear here.</p>
        <p className="mt-1.5 max-w-[26ch] text-xs leading-relaxed text-primary-foreground/70">
        To view your results, complete all required fields, click <b>"Calculate My Entitlement," </b>and confirm that you'd like to receive your estimate by email.
        </p>
      </div>

      <div className="mt-6 space-y-3 border-t border-primary-foreground/10 pt-5 text-sm">
        {LOCKED_ROW_LABELS.map((label) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-primary-foreground/50">{label}</span>
            <span className="h-3 w-16 rounded-full bg-primary-foreground/10" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PolicyLink({ href, className, children }) {
  const to = resolveHref(href, "/policy-analyser");
  const isExternal = /^https?:\/\//i.test(to);
  const isInternal = to.startsWith("/") && !isExternal;

  if (isInternal) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={to}
      className={className}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export function ResultSummary({ content, estimate, linkNote, unlocked = false }) {
  // Guard against missing content
  if (!content) {
    return (
      <div className="rounded-2xl bg-primary p-8 text-primary-foreground">
        <p className="text-sm opacity-70">Calculating your estimate...</p>
      </div>
    );
  }

  // ---- SAFE DEFAULTS ----
  const result = content.result || {};
  const cta = content.policyAnalyserCta || {};
  const rules = content.rules || {};

  // Locked state: nothing has been submitted + emailed yet, so no numbers
  // are rendered at all — just the teaser panel below.
  if (!unlocked || !estimate) {
    return (
      <aside className="min-w-0 lg:sticky lg:top-20 lg:self-start">
        <LockedResultPanel kicker={result.kicker || "Estimated sick pay entitlement"} />

        <PolicyLink
          href={cta.link || "#"}
          className="mt-4 flex items-center justify-between rounded-xl border border-border bg-background p-4 text-sm transition-colors hover:border-accent hover:bg-accent/5"
        >
          <div>
            <p className="font-medium text-foreground">{cta.title || "Policy Analyser"}</p>
            <p className="text-xs text-muted-foreground">
              {cta.description || "See how your CAO affects your sick pay."}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </PolicyLink>
      </aside>
    );
  }

  const formatCurrency = (value) =>
    value != null ? `EUR ${value.toLocaleString("en")}` : "-";

  const formatWeeks = (value) =>
    value != null ? `${value} week${value !== 1 ? "s" : ""}` : "-";

  // Main amount
  const mainAmount = estimate?.currentMonthly ?? estimate?.year1Monthly;

  // Subtitle with cap note
  const percent = estimate?.currentPercent ?? rules.year1Percent;
  let subtitle = percent != null ? `Based on ${percent}% of your gross salary` : "";
  if (estimate?.wageCapApplied && estimate?.wageCapMonthly) {
    subtitle += ` (capped at EUR ${estimate.wageCapMonthly.toLocaleString("en")}/month)`;
  }

  // Entitlement breakdown
  const maxWeeks = estimate?.maxWeeks;
  const usedWeeks = estimate?.weeksElapsed;
  const remainingWeeks = estimate?.weeksRemaining;
  const absenceWeeks = estimate?.absenceWeeks;
  const effectiveLinked = estimate?.effectiveLinked;

  let previousWeeks = null;
  let currentWeeks = null;

  if (effectiveLinked && absenceWeeks != null && usedWeeks != null) {
    previousWeeks = Math.max(0, usedWeeks - absenceWeeks);
    currentWeeks = absenceWeeks;
  } else {
    currentWeeks = usedWeeks;
  }

  const usedTotalPayment =
    usedWeeks != null && usedWeeks > 0 && estimate?.currentMonthly != null
      ? Math.round(estimate.currentMonthly * (usedWeeks / (52 / 12)))
      : null;

  const waitingDaysValue =
    estimate?.waitingDays != null
      ? estimate.waitingDays === 0
        ? "No waiting days"
        : `${estimate.waitingDays} waiting day${estimate.waitingDays !== 1 ? "s" : ""}`
      : "-";

  const linkedValue =
    effectiveLinked != null
      ? effectiveLinked
        ? "Yes - included in calculation"
        : "No"
      : "-";

  const footerText =
    result.footnote ||
    "Based on Article 7:629 of the Dutch Civil Code. CAO agreements may provide higher benefits.";

  return (
    <aside className="min-w-0 lg:sticky lg:top-20 lg:self-start">
      <div
        className="rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8"
        style={{ boxShadow: "var(--shadow-elegant)" }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground/60">
          {result.kicker || "Estimated sick pay entitlement"}
        </p>

        <p className="mt-4 font-serif text-4xl leading-tight">
          {mainAmount != null ? `EUR ${mainAmount.toLocaleString("en")}` : result.emptyAmount || "-"}
          <span className="text-lg text-primary-foreground/60"> /month</span>
        </p>
        {subtitle && <p className="mt-1 text-sm text-primary-foreground/70">{subtitle}</p>}

        {/* Entitlement breakdown */}
        <div className="mt-6 space-y-3 border-t border-primary-foreground/10 pt-5 text-sm">
          {maxWeeks != null && <StatRow label="Total entitlement period">{formatWeeks(maxWeeks)}</StatRow>}
          {previousWeeks != null && previousWeeks > 0 && (
            <StatRow label="Previous sickness period">{formatWeeks(previousWeeks)} used</StatRow>
          )}
          {currentWeeks != null && (
            <StatRow label={previousWeeks != null ? "Current sickness period" : "Used so far"}>
              {formatWeeks(currentWeeks)} {previousWeeks != null ? "used" : ""}
            </StatRow>
          )}
          {usedTotalPayment != null && (
            <StatRow label="Total payment for used weeks">{formatCurrency(usedTotalPayment)}</StatRow>
          )}
          {remainingWeeks != null && (
            <StatRow label="Remaining entitlement">{formatWeeks(remainingWeeks)} remaining</StatRow>
          )}
        </div>

        {/* Payment details */}
        <div className="mt-4 space-y-3 border-t border-primary-foreground/10 pt-5 text-sm">
          {estimate?.currentYear != null && (
            <StatRow label="Current payment period">
              {estimate.currentYear === 1
                ? `Year 1 (weeks 1-${estimate.year1Weeks ?? 52})`
                : `Year 2 (after ${estimate.year1Weeks ?? 52} weeks)`}
            </StatRow>
          )}
          {estimate?.year2Monthly != null && (
            <StatRow label="Year 2 payment">{formatCurrency(estimate.year2Monthly)} /month</StatRow>
          )}
          {estimate?.totalOverMaxTerm != null && (
            <StatRow label="Maximum estimated payment">{formatCurrency(estimate.totalOverMaxTerm)}</StatRow>
          )}
          <StatRow label="Waiting period">{waitingDaysValue}</StatRow>
          <StatRow label="Previous sickness linked">{linkedValue}</StatRow>
          {linkNote && <div className="mt-1 text-xs text-primary-foreground/70 leading-relaxed">{linkNote}</div>}
        </div>

        {/* Minimum-wage validation warning - now driven by the actual
            comparison result (estimate.belowMinWage), not just whether
            rules.min_wage_monthly happens to have a value. */}
        {estimate?.belowMinWage && (
          <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <p className="font-medium">
              Warning: your gross monthly salary is below the legal minimum wage of{" "}
              {formatCurrency(estimate?.minWageMonthly)}. Please review your entry.
            </p>
          </div>
        )}

        <p className="mt-6 text-xs leading-relaxed text-primary-foreground/60">{footerText}</p>
      </div>

      {/* Policy CTA - safe fallback */}
      <PolicyLink
        href={cta.link || "#"}
        className="mt-4 flex items-center justify-between rounded-xl border border-border bg-background p-4 text-sm transition-colors hover:border-accent hover:bg-accent/5"
      >
        <div>
          <p className="font-medium text-foreground">{cta.title || "Policy Analyser"}</p>
          <p className="text-xs text-muted-foreground">
            {cta.description || "See how your CAO affects your sick pay."}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      </PolicyLink>
    </aside>
  );
}

export default ResultSummary;