import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Info,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useCalculatorContent } from "@/hooks/useCalculatorContent";
import { calculateEntitlement, isLinkedAbsence } from "@/lib/entitlement";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // Everything under `content` comes from ACF (see src/config/calculatorContent.ts
  // for the full shape and src/hooks/useCalculatorContent.ts for how it's fetched).
  // If WP is unreachable, `content` quietly falls back to DEFAULT_CALCULATOR_CONTENT
  // so the page still works.
  const { content } = useCalculatorContent();

  const [status, setStatus] = useState<"employee" | "self">("employee");
  const [linked, setLinked] = useState(false);
  const [linkedLastDay, setLinkedLastDay] = useState("");
  const [salary, setSalary] = useState("");
  const [hours, setHours] = useState("40");
  const [firstDay, setFirstDay] = useState("");
  const [lastDay, setLastDay] = useState("");

  const estimate = useMemo(
    () => calculateEntitlement(Number(salary) || 0, content.rules),
    [salary, content.rules],
  );

  const linkedAbsenceFlag = useMemo(() => {
    if (!linked || !linkedLastDay || !firstDay) return false;
    return isLinkedAbsence(linkedLastDay, firstDay, content.rules);
  }, [linked, linkedLastDay, firstDay, content.rules]);

  return (
    <main className="flex-1">
      {/* HERO */}
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
                Not sure you're covered? Eligibility guide →
              </Link>
            </div>

            {/* Stat strip — comes from the ACF "stats" repeater (3 rows) */}
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

          {/* Sample result preview — from ACF "sample_*" fields, purely illustrative */}
          <div className="relative">
            <div
              className="rounded-2xl border border-border bg-card p-6"
              style={{ boxShadow: "var(--shadow-elegant)" }}
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Sample entitlement
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
                  <CheckCircle2 className="h-3 w-3" /> Covered
                </span>
              </div>
              <p className="mt-2 font-serif text-3xl text-foreground">
                € {content.sampleResult.amount.toLocaleString("en")}
                <span className="text-muted-foreground">/mo</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {content.sampleResult.periodLabel}
              </p>

              <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (content.sampleResult.currentWeek / content.rules.maxWeeks) * 100,
                      ),
                    )}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
                <span>Week 0</span>
                <span>
                  Week {content.sampleResult.currentWeek} / {content.rules.maxWeeks}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5">
                <div className="rounded-lg bg-secondary/60 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Year 1
                  </p>
                  <p className="mt-1 font-serif text-lg text-foreground">
                    {content.rules.year1Percent}%
                  </p>
                </div>
                <div className="rounded-lg bg-secondary/60 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Year 2
                  </p>
                  <p className="mt-1 font-serif text-lg text-foreground">
                    {content.rules.year2Percent}%
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl border border-border/70 bg-secondary/50" />
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
              01 · Calculate
            </p>
            <h2 className="mt-2 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
              Your entitlement
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Everything is computed in your browser — nothing is sent anywhere
              until you ask for the full report.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          {/* Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="rounded-2xl border border-border bg-card p-6 sm:p-8"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name">
                <Input placeholder="e.g. Jordan Vance" />
              </Field>
              <Field label="Company name" hint="Used to label your result.">
                <Input placeholder="e.g. Company B.V." />
              </Field>

              <Field
                label="Industry / sector"
                hint="Flags if your sector typically has a CAO above the statutory minimum."
                className="sm:col-span-2"
              >
                {/* Options come from the ACF "industries" repeater */}
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {content.industries.map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Employment status" className="sm:col-span-2">
                <RadioGroup
                  value={status}
                  onValueChange={(v) => setStatus(v as "employee" | "self")}
                  className="grid grid-cols-2 gap-2"
                >
                  {[
                    { v: "employee", l: "Employee" },
                    { v: "self", l: "Self-employed" },
                  ].map((o) => (
                    <label
                      key={o.v}
                      className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors ${
                        status === o.v
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-secondary"
                      }`}
                    >
                      <RadioGroupItem value={o.v} className="sr-only" />
                      {o.l}
                    </label>
                  ))}
                </RadioGroup>
              </Field>

              <Field label="Gross monthly salary (€)">
                <Input
                  inputMode="numeric"
                  placeholder="3200"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value.replace(/\D/g, ""))}
                />
              </Field>
              <Field label="Contracted hours / week">
                <Input
                  inputMode="numeric"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
              </Field>

              <Field
                label="First day of sick leave"
                hint="We'll work out the week number for you."
              >
                <div className="relative">
                  <Input
                    type="date"
                    value={firstDay}
                    onChange={(e) => setFirstDay(e.target.value)}
                  />
                  <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </Field>
              <Field label="Last day (leave blank if still off)">
                <Input
                  type="date"
                  value={lastDay}
                  onChange={(e) => setLastDay(e.target.value)}
                />
              </Field>

              <div className="sm:col-span-2">
                <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-secondary/40 p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Linked earlier absence?
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      A new absence within{" "}
                      {Math.round(content.rules.linkedAbsenceWindowDays / 7)} weeks of
                      the last one is legally linked — it counts toward the same{" "}
                      {content.rules.maxWeeks}-week limit.
                    </p>
                  </div>
                  <Switch checked={linked} onCheckedChange={setLinked} />
                </div>
                {linked && (
                  <div className="mt-4">
                    <Field label="Last day of that earlier sick leave">
                      <Input
                        type="date"
                        value={linkedLastDay}
                        onChange={(e) => setLinkedLastDay(e.target.value)}
                      />
                    </Field>
                    {linkedAbsenceFlag && (
                      <p className="mt-2 text-xs font-medium text-accent">
                        These absences are linked — they share one{" "}
                        {content.rules.maxWeeks}-week entitlement.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5" />
                {content.disclaimer}
              </p>
              <Button type="submit" size="lg" className="gap-2">
                Calculate my entitlement
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Live result */}
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
                <Row label="Year 2 pay">
                  {estimate ? `€ ${estimate.year2Monthly.toLocaleString("en")}/mo` : "—"}
                </Row>
                <Row label="Cumulative (24 mo)">
                  {estimate ? `€ ${estimate.totalOverMaxTerm.toLocaleString("en")}` : "—"}
                </Row>
                <Row label="Weeks remaining">{content.rules.maxWeeks}</Row>
                <Row label="Waiting day(s)">
                  {content.rules.waitingDays} day{content.rules.waitingDays === 1 ? "" : "s"}{" "}
                  (wachtdag)
                </Row>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-primary-foreground/60">
                Based on Art. 7:629 of the Dutch Civil Code. CAO in your sector
                may raise the floor above statutory.
              </p>
            </div>

            <Link
              to="/policy-analyser"
              className="mt-4 flex items-center justify-between rounded-xl border border-border bg-card p-4 text-sm transition-colors hover:border-accent hover:bg-accent/5"
            >
              <div>
                <p className="font-medium text-foreground">
                  {content.policyAnalyserCta.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {content.policyAnalyserCta.description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </aside>
        </div>
      </section>

      {/* HOW IT WORKS — cards come from the ACF "how_it_works" repeater */}
      <section className="border-t border-border/70 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
            02 · How it works
          </p>
          <h2 className="mt-2 max-w-2xl font-serif text-3xl tracking-tight sm:text-4xl">
            Three tools, one source of truth.
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {content.howItWorks.map((c) => (
              <div
                key={c.number}
                className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent"
              >
                <p className="font-mono text-xs tracking-wider text-muted-foreground">
                  {c.number}
                </p>
                <h3 className="mt-3 font-serif text-xl text-foreground">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {c.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  hint,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`grid gap-1.5 ${className}`}>
      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-primary-foreground/60">{label}</span>
      <span className="font-mono tabular-nums">{children}</span>
    </div>
  );
}
