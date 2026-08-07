// src/pages/CalculatePage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useCalculatorContent } from "./useCalculatorContent";
import { calculateEntitlement, isLinkedAbsence } from "./entitlement";
import { AcfPageGate } from "../shared/AcfPageGate";

import { HeroSection } from "./components/HeroSection";
import { CalculatorForm } from "./components/CalculatorForm";
import { ResultSummary } from "./components/ResultSummary";
import { CalculationInformatics } from "./components/CalculationInformatics";
import { HowItWorks } from "./components/HowItWorks";
import { useReport } from "@/context/ReportContext";
import { useRouter } from "@tanstack/react-router";

export function CalculatePage() {
  const { content, isLoading, error, endpoint } = useCalculatorContent();
  const { setReport, clearReport } = useReport();
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#calculator') {
      const element = document.getElementById('calculator');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [router.state.location.href]);

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [status, setStatus] = useState("");
  const [linked, setLinked] = useState(false);
  const [linkedFirstDay, setLinkedFirstDay] = useState("");
  const [linkedLastDay, setLinkedLastDay] = useState("");
  const [salary, setSalary] = useState("");
  const [firstDay, setFirstDay] = useState("");
  const [lastDay, setLastDay] = useState("");

  const prevDefaults = useRef({ salary: "", status: "" });

  useEffect(() => {
    if (!calc) return;
    const nextSalary = String(calc.salaryDefault ?? "");
    const nextStatus = calc.statusDefault ?? "";

    setSalary((current) =>
      current === prevDefaults.current.salary ? nextSalary : current,
    );
    setStatus((current) =>
      current === prevDefaults.current.status ? nextStatus : current,
    );

    prevDefaults.current = {
      salary: nextSalary,
      status: nextStatus,
    };
  }, [calc?.salaryDefault, calc?.statusDefault]);

  const linkedAbsenceFlag = useMemo(() => {
    if (!content || !linkedLastDay || !firstDay) return false;
    if (!linkedFirstDay) return false;
    return isLinkedAbsence(linkedLastDay, firstDay, content.rules);
  }, [content, linkedLastDay, firstDay, linkedFirstDay]);

  // This still recalculates as the person types — but that's fine, because
  // it's only ever used internally (to build the email payload when they
  // submit, and to snapshot into resultSnapshot once that email actually
  // sends). It is never rendered directly anymore; see resultSnapshot below.
  const estimate = useMemo(() => {
    if (!content) return null;
    return calculateEntitlement(
      {
        grossMonthlySalary: Number(salary) || 0,
        firstDay,
        lastDay,
        linked: linkedAbsenceFlag,
        linkedFirstDay: linkedAbsenceFlag ? linkedFirstDay : "",
        linkedLastDay: linkedAbsenceFlag ? linkedLastDay : "",
      },
      content.rules,
    );
  }, [
    content,
    salary,
    firstDay,
    lastDay,
    linkedAbsenceFlag,
    linkedFirstDay,
    linkedLastDay,
  ]);

  const linkNote = useMemo(() => {
    if (!content || !linkedFirstDay || !linkedLastDay || !firstDay) return null;
    const windowDays = content.rules?.linkedAbsenceWindowDays ?? 28;
    const prevEnd = new Date(linkedLastDay);
    const newStart = new Date(firstDay);
    const gapDays = Math.round((newStart - prevEnd) / (1000 * 60 * 60 * 24));
    const isLinked = gapDays >= 0 && gapDays <= windowDays;
    const linkType = isLinked ? "within" : "exceeds";
    const description = isLinked
      ? "treated as one continuous period"
      : "treated as separate periods";
    return `The gap between the previous sickness and this one is ${gapDays} day${gapDays !== 1 ? 's' : ''}, which ${linkType} the ${windowDays}-day legal window – they are ${description}.`;
  }, [content, linkedFirstDay, linkedLastDay, firstDay]);

  // ---------------------------------------------------------------------
  // Reveal gating
  // ---------------------------------------------------------------------
  // resultSnapshot is the ONLY thing ResultSummary is allowed to display,
  // and it is only ever written once: right after the entitlement email is
  // confirmed sent (see handleEstimateEmailed, passed to CalculatorForm as
  // onEmailSent). Nothing here recalculates live in front of the person —
  // editing any field after a snapshot exists just marks it stale below,
  // which locks the panel again until they resubmit + reconfirm the email.
  const [resultSnapshot, setResultSnapshot] = useState(null);

  const formSnapshotKey = useMemo(
    () =>
      JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        company: company.trim(),
        industry: industry.trim(),
        status: status.trim(),
        salary: Number(salary) || 0,
        firstDay: firstDay.trim(),
        lastDay: lastDay.trim(),
        linked,
        linkedFirstDay: linkedFirstDay.trim(),
        linkedLastDay: linkedLastDay.trim(),
      }),
    [
      name,
      email,
      company,
      industry,
      status,
      salary,
      firstDay,
      lastDay,
      linked,
      linkedFirstDay,
      linkedLastDay,
    ],
  );

  const isResultStale = Boolean(resultSnapshot) && resultSnapshot.key !== formSnapshotKey;
  const resultUnlocked = Boolean(resultSnapshot) && !isResultStale;

  // If the person edits anything after unlocking, the snapshot no longer
  // matches what's in the form, so drop it (and clear the report the "Full
  // report" button reads) until they submit + confirm the email again.
  useEffect(() => {
    if (isResultStale) {
      setResultSnapshot(null);
      clearReport();
    }
  }, [isResultStale, clearReport]);

  // Passed to CalculatorForm as onEmailSent — called only after
  // sendEntitlementEmail() resolves successfully.
  function handleEstimateEmailed() {
    if (!estimate) return;
    setResultSnapshot({
      key: formSnapshotKey,
      estimate,
      linkNote,
    });
    setReport({
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      industry: industry.trim(),
      status: status.trim(),
      salary: Number(salary),
      firstDay: firstDay.trim(),
      lastDay: lastDay.trim(),
      linked: linkedAbsenceFlag,
      linkedFirstDay: linkedAbsenceFlag ? linkedFirstDay.trim() : "",
      linkedLastDay: linkedAbsenceFlag ? linkedLastDay.trim() : "",
      estimate,
      generatedDate: new Date().toISOString(),
    });
  }

  const form = {
    name,
    setName,
    email,
    setEmail,
    company,
    setCompany,
    industry,
    setIndustry,
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
              <CalculatorForm
                content={content}
                form={form}
                estimate={estimate}
                onEmailSent={handleEstimateEmailed}
              />
              <ResultSummary
                content={content}
                estimate={resultUnlocked ? resultSnapshot.estimate : null}
                linkNote={resultUnlocked ? resultSnapshot.linkNote : null}
                unlocked={resultUnlocked}
              />
            </div>
          </section>

          <CalculationInformatics content={content} />


          <HowItWorks content={content} />
        </main>
      ) : null}
    </AcfPageGate>
  );
}

export default CalculatePage;