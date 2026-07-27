/**
 * CalculatePage.jsx — all copy from ACF (no local DEFAULT_CONTENT).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useCalculatorContent } from "./useCalculatorContent";
import { calculateEntitlement, isLinkedAbsence } from "./entitlement";
import { AcfPageGate } from "../shared/AcfPageGate";

import { HeroSection } from "./components/HeroSection";
import { CalculatorForm } from "./components/CalculatorForm";
import { ResultSummary } from "./components/ResultSummary";
import { HowItWorks } from "./components/HowItWorks";

export function CalculatePage() {
  const { content, isLoading, error, endpoint } = useCalculatorContent();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.info("[CalculatePage] content source:", {
        endpoint,
        isLoading,
        error,
        heroBadge1: content?.hero?.badge1,
        year1Percent: content?.rules?.year1Percent,
      });
    }
  }, [endpoint, isLoading, error, content?.hero?.badge1, content?.rules?.year1Percent]);

  const calc = content?.calculator;
  const [status, setStatus] = useState("");
  const [linked, setLinked] = useState(false);
  const [linkedFirstDay, setLinkedFirstDay] = useState("");
  const [linkedLastDay, setLinkedLastDay] = useState("");
  const [salary, setSalary] = useState("");
  const [hours, setHours] = useState("");
  const [firstDay, setFirstDay] = useState("");
  const [lastDay, setLastDay] = useState("");

  const prevDefaults = useRef({ salary: "", hours: "", status: "" });

  useEffect(() => {
    if (!calc) return;
    const nextSalary = String(calc.salaryDefault ?? "");
    const nextHours = String(calc.hoursDefault ?? "");
    const nextStatus = calc.statusDefault ?? "";

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
  }, [calc?.salaryDefault, calc?.hoursDefault, calc?.statusDefault]);

  const linkedAbsenceFlag = useMemo(() => {
    if (!content || !linked || !linkedLastDay || !firstDay) return false;
    return isLinkedAbsence(linkedLastDay, firstDay, content.rules);
  }, [content, linked, linkedLastDay, firstDay]);

  const estimate = useMemo(() => {
    if (!content) return null;
    return calculateEntitlement(
      {
        grossMonthlySalary: Number(salary) || 0,
        contractedHours: Number(hours) || 0,
        firstDay,
        lastDay,
        linked: linked && linkedAbsenceFlag,
        linkedFirstDay: linked ? linkedFirstDay : "",
        linkedLastDay: linked ? linkedLastDay : "",
      },
      content.rules,
    );
  }, [
    content,
    salary,
    hours,
    firstDay,
    lastDay,
    linked,
    linkedFirstDay,
    linkedLastDay,
    linkedAbsenceFlag,
  ]);

  const form = {
    status,
    setStatus,
    linked,
    setLinked,
    linkedFirstDay,
    setLinkedFirstDay,
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
    <AcfPageGate isLoading={isLoading} error={error} label="calculator">
      {content ? (
        <main className="flex-1">
          <HeroSection content={content} />

          <section id="calculator" className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-10">
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

            <div
              className="grid gap-8 rounded-2xl border border-border bg-card p-5 sm:p-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <CalculatorForm content={content} form={form} />
              <ResultSummary content={content} estimate={estimate} />
            </div>
          </section>

          <HowItWorks content={content} />
        </main>
      ) : null}
    </AcfPageGate>
  );
}

export default CalculatePage;
