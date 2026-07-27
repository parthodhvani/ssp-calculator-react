/**
 * ResultSummary.jsx — Calculate page
 * Sticky right-hand column: live entitlement result + policy analyser CTA.
 *
 * Percentages shown in titles come from content.rules (same source the maths
 * uses). Title templates may include `{percent}` — substituted at render time.
 */
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { StatRow } from "@/components/shared/StatRow";
import { formatTemplate } from "../content";

export function ResultSummary({ content, estimate }) {
  const result = content.result;
  const rules = content.rules;

  const year1Title = formatTemplate(result.year1Title, {
    percent: rules.year1Percent,
  });
  const year2Title = formatTemplate(result.year2Title, {
    percent: rules.year2Percent,
  });
  const waitingDaysValue = formatTemplate(result.waitingDaysValue, {
    days: rules.waitingDays,
  });

  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <div
        className="rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8"
        style={{ boxShadow: "var(--shadow-elegant)" }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground/60">
          {result.kicker}
        </p>
        <p className="mt-3 font-serif text-4xl leading-tight">
          {estimate
            ? `€ ${estimate.year1Monthly.toLocaleString("en")}`
            : result.emptyAmount}
          <span className="text-lg text-primary-foreground/60">
            {result.perMonthSuffix}
          </span>
        </p>
        <p className="mt-1 text-sm text-primary-foreground/70">{year1Title}</p>

        <div className="mt-6 space-y-3 border-t border-primary-foreground/10 pt-5 text-sm">
          <StatRow label={year2Title}>
            {estimate
              ? `€ ${estimate.year2Monthly.toLocaleString("en")}${result.perMonthSuffix}`
              : "—"}
          </StatRow>
          <StatRow label={result.totalLabel}>
            {estimate ? `€ ${estimate.totalOverMaxTerm.toLocaleString("en")}` : "—"}
          </StatRow>
          <StatRow label={result.maxWeeksLabel}>{rules.maxWeeks}</StatRow>
          <StatRow label={result.waitingDaysLabel}>{waitingDaysValue}</StatRow>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-primary-foreground/60">
          {result.footnote}
        </p>
      </div>

      <Link
        to="/policy-analyser"
        className="mt-4 flex items-center justify-between rounded-xl border border-border bg-card p-4 text-sm transition-colors hover:border-accent hover:bg-accent/5"
      >
        <div>
          <p className="font-medium text-foreground">{content.policyAnalyserCta.title}</p>
          <p className="text-xs text-muted-foreground">
            {content.policyAnalyserCta.description}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    </aside>
  );
}

export default ResultSummary;
