/**
 * HeroSection.jsx — Calculate page
 * Top banner: headline, stats strip and the sample-result preview card.
 * All copy comes from `content` (ACF-backed) — nothing is hardcoded here.
 */
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { formatTemplate } from "../content";

export function HeroSection({ content }) {
  const sample = content.sampleResult;
  const rules = content.rules;

  const weekProgress = formatTemplate(sample.weekProgressLabel, {
    current: sample.currentWeek,
    max: rules.maxWeeks,
  });

  return (
    <section
      className="relative overflow-hidden border-b border-border/70"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:py-20">
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
            <Sparkles className="h-3 w-3" />
            {content.hero.badge}
          </span>
          <h1 className="mt-5 font-serif text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-[3.4rem]">
            {content.hero.titleLine1}
            <br />
            <em className="text-accent not-italic underline decoration-accent/30 decoration-[6px] underline-offset-[10px]">
              {content.hero.titleHighlight}
            </em>
            <span className="text-muted-foreground"> {content.hero.titleSuffix}</span>
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            {content.hero.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#calculator">
              <Button size="lg" className="gap-2">
                {content.hero.ctaLabel} <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <Link
              to="/eligibility"
              className="text-sm font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-accent"
            >
              {content.hero.secondaryCtaLabel}
            </Link>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border/70 pt-6">
            {content.stats.map((s) => (
              <div key={s.label}>
                <dt className="font-serif text-2xl text-foreground">{s.value}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div
            className="rounded-2xl border border-border bg-card p-6"
            style={{ boxShadow: "var(--shadow-elegant)" }}
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {sample.title}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
                <CheckCircle2 className="h-3 w-3" /> {sample.coveredLabel}
              </span>
            </div>
            <p className="mt-2 font-serif text-3xl text-foreground">
              € {sample.amount.toLocaleString("en")}
              <span className="text-muted-foreground">{sample.perMonthSuffix}</span>
            </p>
            <p className="text-sm text-muted-foreground">{sample.periodLabel}</p>

            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-accent"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((sample.currentWeek / rules.maxWeeks) * 100),
                  )}%`,
                }}
              />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
              <span>{sample.weekZeroLabel}</span>
              <span>{weekProgress}</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5">
              <div className="rounded-lg bg-secondary/60 p-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {sample.year1BoxLabel}
                </p>
                <p className="mt-1 font-serif text-lg text-foreground">
                  {rules.year1Percent}%
                </p>
              </div>
              <div className="rounded-lg bg-secondary/60 p-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {sample.year2BoxLabel}
                </p>
                <p className="mt-1 font-serif text-lg text-foreground">
                  {rules.year2Percent}%
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl border border-border/70 bg-secondary/50" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
