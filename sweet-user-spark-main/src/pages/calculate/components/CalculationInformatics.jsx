/**
 * CalculationInformatics.jsx — Calculate page
 * "How we calculate your entitlement" — fully driven by ACF via
 * useCalculatorContent.js (mapAcfResponseToContent → finalizeContent),
 * which now includes the informatics_* fields:
 *
 *   content.informaticsSection      { kicker, title, description }
 *   content.informaticsSteps        [{ icon, title, description }]
 *   content.informaticsExample      { heading, sampleSalary, intro, totalLabel }
 *   content.informaticsTableLabels  { colPeriod, colDuration, colPay }
 *   content.informaticsFaqHeading   string
 *   content.informaticsFaqs         [{ question, answer }]
 *   content.informaticsFooterText   string
 *   content.rules                   { year1Percent, year2Percent, maxWeeks,
 *                                      waitingDays, minWageMonthly,
 *                                      linkedAbsenceWindowDays }
 */
import { useState } from "react";
import {
    Euro,
    Percent,
    CalendarClock,
    Link2,
    Timer,
    ShieldCheck,
    BookOpenCheck,
    ChevronDown,
} from "lucide-react";
import { StatRow } from "@/components/shared/StatRow";
import { formatTemplate } from "../content";

const ICON_MAP = {
    euro: Euro,
    percent: Percent,
    "calendar-clock": CalendarClock,
    link: Link2,
    timer: Timer,
    "shield-check": ShieldCheck,
};

function asArray(value) {
    return Array.isArray(value) ? value : [];
}

function FaqItem({ question, answer, open, onToggle }) {
    return (
        <div className="border-b border-border last:border-b-0">
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
                aria-expanded={open}
            >
                <span className="text-sm font-medium text-foreground">{question}</span>
                <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>
            {open && (
                <p className="pb-4 text-sm leading-relaxed text-muted-foreground">
                    {answer}
                </p>
            )}
        </div>
    );
}

export function CalculationInformatics({ content }) {
    const rules = content?.rules || {};
    const informatics = content?.informaticsSection || {};
    const example = content?.informaticsExample || {};
    const tableLabels = content?.informaticsTableLabels || {};
    const steps = asArray(content?.informaticsSteps);
    const faqs = asArray(content?.informaticsFaqs);
    const footerText = content?.informaticsFooterText;
    const faqHeading = content?.informaticsFaqHeading;

    // Live values from Pay Rules (camelCase, from useCalculatorContent.js)
    const year1Percent = rules.year1Percent ?? 70;
    const year2Percent = rules.year2Percent ?? 70;
    const maxWeeks = rules.maxWeeks ?? 104;
    const year1Weeks = Math.min(52, maxWeeks);
    const year2Weeks = Math.max(0, maxWeeks - year1Weeks);
    const waitingDays = rules.waitingDays ?? 0;
    const linkWindow = rules.linkedAbsenceWindowDays ?? 28;
    const linkWindowWeeks = Math.round(linkWindow / 7);
    const minWageMonthly = rules.minWageMonthly ?? 2437;

    // All placeholder tokens used by {curly} templates coming from ACF text
    const tokens = {
        year1Percent,
        year2Percent,
        maxWeeks,
        year1Weeks,
        year2Weeks,
        waitingDays,
        linkWindow,
        linkWindowWeeks,
        minWageMonthly,
    };

    const t = (text) => (text ? formatTemplate(text, tokens) : "");

    // Worked example
    const sampleSalary = Number(example.sampleSalary) || 2500;
    const sampleYear1 = Math.round(sampleSalary * (year1Percent / 100));
    const sampleYear2 = Math.round(sampleSalary * (year2Percent / 100));
    const sampleTotal = sampleYear1 * 12 + sampleYear2 * 12;

    const exampleTokens = { ...tokens, sampleSalary: sampleSalary.toLocaleString() };
    const exampleIntro = example.intro
        ? formatTemplate(example.intro, exampleTokens)
        : "";
    const exampleTotalLabel = example.totalLabel
        ? formatTemplate(example.totalLabel, tokens)
        : "";

    const [openFaq, setOpenFaq] = useState(0);

    return (
        <section id="how-we-calculate" className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-10 max-w-2xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                    {informatics.kicker || "Transparency"}
                </p>
                <h2 className="mt-2 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
                    {informatics.title || "How we calculate your entitlement"}
                </h2>
                {informatics.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                        {t(informatics.description)}
                    </p>
                )}
            </div>

            <div
                className="rounded-2xl border border-border bg-card p-5 sm:p-8"
                style={{ boxShadow: "var(--shadow-card)" }}
            >
                {/* ---- Numbered timeline ---- */}
                {steps.length > 0 && (
                    <ol className="relative space-y-8 sm:space-y-10">
                        {steps.map((step, i) => {
                            const Icon = ICON_MAP[step.icon] || Euro;
                            const isLast = i === steps.length - 1;
                            return (
                                <li key={i} className="relative flex gap-4 sm:gap-5">
                                    <div className="flex flex-col items-center">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        {!isLast && (
                                            <div className="mt-2 w-px flex-1 bg-border" aria-hidden="true" />
                                        )}
                                    </div>
                                    <div className="pb-2">
                                        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                                            Step {i + 1}
                                        </p>
                                        <p className="mt-1 text-sm font-medium text-foreground">
                                            {t(step.title)}
                                        </p>
                                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                            {t(step.description)}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                )}

                {/* ---- Worked example ---- */}
               {/* ---- Worked example ---- */}
{(example.heading || exampleIntro) && (
    <div className="mt-10 rounded-xl border border-border bg-secondary/40 p-5 sm:p-6">

        {/* Example title */}
        {example.heading && (
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {example.heading}
            </p>
        )}

        {/* Example introduction */}
        {exampleIntro && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {exampleIntro}
            </p>
        )}

        {/* Year 1 / Year 2 */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">

            {/* Year 1 */}
            <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-xs font-medium text-muted-foreground">
                    Year 1 (Weeks 1 to {year1Weeks})
                </p>

                <p className="mt-1 font-mono text-sm text-foreground">
                    € {sampleSalary.toLocaleString()} × {year1Percent}% statutory baseline
                </p>

                <p className="mt-1 font-serif text-2xl text-foreground">
                    € {sampleYear1.toLocaleString()}
                    <span className="text-sm text-muted-foreground">
                        {" "} / mo
                    </span>
                </p>
            </div>

            {/* Year 2 */}
            <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-xs font-medium text-muted-foreground">
                    Year 2 (Weeks {year1Weeks + 1} to {maxWeeks})
                </p>

                <p className="mt-1 font-mono text-sm text-foreground">
                    € {sampleSalary.toLocaleString()} × {year2Percent}% statutory baseline
                </p>

                <p className="mt-1 font-serif text-2xl text-foreground">
                    € {sampleYear2.toLocaleString()}
                    <span className="text-sm text-muted-foreground">
                        {" "} / mo
                    </span>
                </p>
            </div>
        </div>

        {/* Total projected aggregate value */}
        {exampleTotalLabel && (
            <div className="mt-4 flex justify-end">
                <div className="space-y-1 text-right">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {exampleTotalLabel}
                    </p>

                    <p className="font-serif text-2xl text-foreground">
                        € {sampleTotal.toLocaleString()}
                    </p>
                </div>
            </div>
        )}
    </div>
)}

                {/* ---- Year 1 vs Year 2 table ---- */}
                {/* ---- Direct Summary Breakdown Table ---- */}
<div className="mt-8 overflow-hidden rounded-xl border border-border">
    <table className="w-full text-left text-sm">
        <thead>
            <tr className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">
                    {tableLabels.colPeriod || "Timeline Phase"}
                </th>

                <th className="px-4 py-3 font-medium">
                    {tableLabels.colDuration || "Exact Week Range"}
                </th>

                <th className="px-4 py-3 font-medium">
                    {tableLabels.colPay || "Your Statutory Pay Rate"}
                </th>
            </tr>
        </thead>

        <tbody>
            {/* Year 1 */}
            <tr className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">
                    Year 1 Protection
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                    Weeks 1–{year1Weeks}
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                    {year1Percent}% of your gross baseline salary
                </td>
            </tr>

            {/* Year 2 */}
            <tr className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">
                    Year 2 Protection
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                    {year2Weeks > 0
                        ? `Weeks ${year1Weeks + 1}–${maxWeeks}`
                        : "—"}
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                    {year2Percent}% of your gross baseline salary
                </td>
            </tr>
        </tbody>
    </table>
</div>

                {/* ---- FAQ ---- */}
                {faqs.length > 0 && (
                    <div className="mt-10">
                        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                            {faqHeading || "Questions people often ask"}
                        </p>
                        <div className="rounded-xl border border-border px-4">
                            {faqs.map((faq, i) => (
                                <FaqItem
                                    key={i}
                                    question={t(faq.question)}
                                    answer={t(faq.answer)}
                                    open={openFaq === i}
                                    onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* ---- Legal basis / footer ---- */}
                {footerText && (
                    <div className="mt-8 flex items-start gap-2 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
                        <BookOpenCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                        <p>{t(footerText)}</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default CalculationInformatics;