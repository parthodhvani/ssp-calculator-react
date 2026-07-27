/**
 * CalculatePage.jsx
 * ---------------------------------------------------------------------------
 * The "/" route. Wires state + sections together — markup lives in
 * ./components/*. All copy, defaults, and calculation rules come from
 * `content` (ACF via useCalculatorContent / DEFAULT_CONTENT fallback).
 * ---------------------------------------------------------------------------
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useCalculatorContent } from "./useCalculatorContent";
import { calculateEntitlement, isLinkedAbsence } from "./entitlement";

import { HeroSection } from "./components/HeroSection";
import { CalculatorForm } from "./components/CalculatorForm";
import { ResultSummary } from "./components/ResultSummary";
import { HowItWorks } from "./components/HowItWorks";

export function CalculatePage() {
  const { content } = useCalculatorContent();

  const [status, setStatus] = useState(content.calculator.statusDefault);
  const [linked, setLinked] = useState(false);
  const [linkedLastDay, setLinkedLastDay] = useState("");
  const [salary, setSalary] = useState(String(content.calculator.salaryDefault ?? ""));
  const [hours, setHours] = useState(String(content.calculator.hoursDefault ?? ""));
  const [firstDay, setFirstDay] = useState("");
  const [lastDay, setLastDay] = useState("");

  // When WP defaults arrive (or change), apply them only if the field still
  // holds the previous default — never clobber something the user typed.
  const prevDefaults = useRef({
    salary: String(content.calculator.salaryDefault ?? ""),
    hours: String(content.calculator.hoursDefault ?? ""),
    status: content.calculator.statusDefault,
  });

  useEffect(() => {
    const nextSalary = String(content.calculator.salaryDefault ?? "");
    const nextHours = String(content.calculator.hoursDefault ?? "");
    const nextStatus = content.calculator.statusDefault;

    setSalary((current) =>
      current === prevDefaults.current.salary ? nextSalary : current,
    );
    setHours((current) =>
      current === prevDefaults.current.hours ? nextHours : current,
    );
    setStatus((current) =>
      current === prevDefaults.current.status ? nextStatus : current,
    );

    prevDefaults.current = {
      salary: nextSalary,
      hours: nextHours,
      status: nextStatus,
    };
  }, [
    content.calculator.salaryDefault,
    content.calculator.hoursDefault,
    content.calculator.statusDefault,
  ]);

  // Maths always reads percentages / limits from content.rules (ACF-driven).
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
              {content.section.kicker}
            </p>
            <h2 className="mt-2 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
              {content.section.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              {content.section.description}
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
