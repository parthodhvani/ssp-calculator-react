/**
 * CalculatePage.jsx
 * ---------------------------------------------------------------------------
 * The "/" route. This file only wires state + sections together — all the
 * actual markup lives in ./components/*. This is the page router files
 * (src/routes/index.tsx) should import and render.
 * ---------------------------------------------------------------------------
 */
import { useMemo, useState } from "react";
import { useCalculatorContent } from "./useCalculatorContent";
import { calculateEntitlement, isLinkedAbsence } from "./entitlement";

import { HeroSection } from "./components/HeroSection";
import { CalculatorForm } from "./components/CalculatorForm";
import { ResultSummary } from "./components/ResultSummary";
import { HowItWorks } from "./components/HowItWorks";

export function CalculatePage() {
  // Everything under `content` comes from ACF (see ./content.js for the full
  // shape and ./useCalculatorContent.js for how it's fetched). If WP is
  // unreachable, `content` quietly falls back to DEFAULT_CONTENT so the page
  // still works.
  const { content } = useCalculatorContent();

  const [status, setStatus] = useState("employee");
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

  const form = {
    status,
    setStatus,
    linked,
    setLinked,
    linkedLastDay,
    setLinkedLastDay,
    salary,
    setSalary,
    hours,
    setHours,
    firstDay,
    setFirstDay,
    lastDay,
    setLastDay,
    linkedAbsenceFlag,
  };

  return (
    <main className="flex-1">
      <HeroSection content={content} />

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
              Everything is computed in your browser — nothing is sent anywhere until
              you ask for the full report.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          <CalculatorForm content={content} form={form} />
          <ResultSummary content={content} estimate={estimate} />
        </div>
      </section>

      <HowItWorks content={content} />
    </main>
  );
}

export default CalculatePage;
