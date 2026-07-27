/**
 * ResultSummary.jsx — Calculate page
 * Sticky right-hand column: the live entitlement result + the link to the
 * policy analyser tool.
 */
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { StatRow } from "@/components/shared/StatRow";

export function ResultSummary({ content, estimate }) {
  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <div
        className="rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8"
        style={{ boxShadow: "var(--shadow-elegant)" }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground/60">
          Your entitlement
        </p>
        <p className="mt-3 font-serif text-4xl leading-tight">
          {estimate ? `€ ${estimate.year1Monthly.toLocaleString("en")}` : "€ —"}
          <span className="text-lg text-primary-foreground/60">/mo</span>
        </p>
        <p className="mt-1 text-sm text-primary-foreground/70">
          Year 1 · {content.rules.year1Percent}% of gross (statutory)
        </p>

        <div className="mt-6 space-y-3 border-t border-primary-foreground/10 pt-5 text-sm">
          <StatRow label="Year 2 pay">
            {estimate ? `€ ${estimate.year2Monthly.toLocaleString("en")}/mo` : "—"}
          </StatRow>
          <StatRow label="Cumulative (24 mo)">
            {estimate ? `€ ${estimate.totalOverMaxTerm.toLocaleString("en")}` : "—"}
          </StatRow>
          <StatRow label="Weeks remaining">{content.rules.maxWeeks}</StatRow>
          <StatRow label="Waiting day(s)">
            {content.rules.waitingDays} day{content.rules.waitingDays === 1 ? "" : "s"}{" "}
            (wachtdag)
          </StatRow>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-primary-foreground/60">
          Based on Art. 7:629 of the Dutch Civil Code. CAO in your sector may raise the
          floor above statutory.
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
