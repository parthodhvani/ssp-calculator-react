/**
 * CalculationInformatics.jsx — Calculate page
 * "How we calculate your entitlement" — fully driven by ACF,
 * but falls back to defaults if fields are empty.
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
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""
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
    const informatics = content?.informatics_section || {};
    const example = content?.informatics_example || {};
    const tableLabels = content?.informatics_table_labels || {};
    const steps = content?.informatics_steps || [];
    const faqs = content?.informatics_faqs || [];
    const footerText = content?.informatics_footer_text;
    const faqHeading = content?.informatics_faq_heading;

    // Live values from Pay Rules (snake_case)
    const year1Percent = rules.year1_percent ?? 70;
    const year2Percent = rules.year2_percent ?? 70;
    const maxWeeks = rules.max_weeks ?? 104;
    const year1Weeks = Math.min(52, maxWeeks);
    const year2Weeks = Math.max(0, maxWeeks - year1Weeks);
    const waitingDays = rules.waiting_days ?? 0;
    const linkWindow = rules.linked_absence_days ?? 28;
    const linkWindowWeeks = Math.round(linkWindow / 7);

    // All placeholder tokens
    const tokens = {
        year1Percent,
        year2Percent,
        maxWeeks,
        year1Weeks,
        year2Weeks,
        waitingDays,
        linkWindow,
        linkWindowWeeks,
    };

    const t = (text) => (text ? formatTemplate(text, tokens) : "");

    // Worked example
    const sampleSalary = Number(example.sample_salary) || 2500;
    const sampleYear1 = Math.round(sampleSalary * (year1Percent / 100));
    const sampleYear2 = Math.round(sampleSalary * (year2Percent / 100));
    const sampleTotal = sampleYear1 * 12 + sampleYear2 * 12;
    const weeklyRate = Math.round((sampleYear1 * 12) / 52);
    const totalUsed = Math.round(weeklyRate * 8); // Example with 8 weeks

    const exampleTokens = { ...tokens, sampleSalary: sampleSalary.toLocaleString() };
    const exampleIntro = example.intro
        ? formatTemplate(example.intro, exampleTokens)
        : `Let's say someone earns € ${sampleSalary.toLocaleString()} gross per month. Here's what they'd receive:`;
    const exampleTotalLabel = example.total_label
        ? formatTemplate(example.total_label, tokens)
        : `Most they could receive in total over ${maxWeeks} weeks`;

    const [openFaq, setOpenFaq] = useState(faqs.length > 0 ? 0 : -1);

    // --- FALLBACK CONTENT with formulas ---
    const defaultSteps = [
        {
            icon: "euro",
            title: "We start with your salary",
            description: "Everything on this page is based on the gross monthly salary you entered. The calculator uses that number directly — no hidden adjustments.",
        },
        {
            icon: "percent",
            title: "Apply the statutory percentages",
            description: `Your pay during sickness is ${year1Percent}% of your gross salary for the first ${year1Weeks} weeks, and ${year2Percent}% for the remaining ${year2Weeks} weeks (if applicable).`,
        },
        {
            icon: "calendar-clock",
            title: "Check the 104‑week clock",
            description: `The total entitlement period is ${maxWeeks} weeks. The clock starts on your first sick day and keeps running even if you return to work for a while.`,
        },
        {
            icon: "timer",
            title: "Apply waiting days (if any)",
            description: waitingDays > 0
                ? `The first ${waitingDays} day${waitingDays > 1 ? "s" : ""} of your sickness are unpaid (waiting period).`
                : "There is no statutory waiting period in your situation.",
        },
        {
            icon: "link",
            title: "Link previous absences",
            description: `If you were sick before and returned, a new sickness within ${linkWindow} days is legally considered a continuation — it shares the same ${maxWeeks}-week limit.`,
        },
        {
            icon: "shield-check",
            title: "Check the minimum wage floor",
            description: `If your calculated sick pay is below the statutory minimum wage (€${rules.min_wage_monthly?.toLocaleString() ?? "2,437"} per month for full‑time), the law may require a higher payment.`,
        },
        {
            icon: "percent",
            title: "Calculate your total payment for used weeks",
            description: `We take your monthly sick pay (gross salary × applicable percentage) and divide it by the average number of weeks per month (52/12 ≈ 4.33) to get your weekly sick pay. Then we multiply that weekly rate by the number of weeks you've been off. This gives the total amount you would have received for the used weeks.`,
        },
    ];

    const defaultFaqs = [
        {
            question: "Why might my year 2 payment be lower?",
            answer: `In year 2, the statutory percentage drops to ${year2Percent}% (unless your CAO says otherwise). The calculator shows exactly what you'd receive based on the Dutch Civil Code.`,
        },
        {
            question: "What if my CAO offers more than the law?",
            answer: `The calculator gives the statutory minimum. Your CAO or employment contract may provide better terms — always check your own policy for the exact amount.`,
        },
        {
            question: "Does this include holiday pay?",
            answer: `No — this estimate covers only the continued payment of wages during sickness. Holiday pay and other allowances are separate.`,
        },
        {
            question: "How is the 'Total payment for used weeks' calculated?",
            answer: `We take your monthly sick pay (gross salary × percentage) and divide it by the average number of weeks per month (52/12 ≈ 4.33) to get your weekly sick pay. Then we multiply that weekly rate by the number of weeks you've been off. For instance, if your monthly sick pay is € ${sampleYear1.toLocaleString()}, your weekly rate is € ${sampleYear1.toLocaleString()} × 12 / 52 ≈ € ${weeklyRate.toLocaleString()} (rounded). If you've been off for 8 weeks, your total payment for used weeks is € ${weeklyRate.toLocaleString()} × 8 ≈ € ${totalUsed.toLocaleString()}.`,
        },
    ];

    // Use ACF data if present, otherwise fallback to defaults
    const displaySteps = steps.length > 0 ? steps : defaultSteps;
    const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;
    const displayFooter = footerText || "This estimate is based on statutory sick-pay rules. Your CAO may offer better terms. This is not legal advice.";

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
                <ol className="relative space-y-8 sm:space-y-10">
                    {displaySteps.map((step, i) => {
                        const Icon = ICON_MAP[step.icon] || Euro;
                        const isLast = i === displaySteps.length - 1;
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

                {/* ---- Worked example ---- */}
                <div className="mt-10 rounded-xl border border-border bg-secondary/40 p-5 sm:p-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {example.heading || "A simple example"}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{exampleIntro}</p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border border-border bg-background p-4">
                            <p className="text-xs font-medium text-muted-foreground">
                                Year 1 · weeks 1–{year1Weeks}
                            </p>
                            <p className="mt-1 font-mono text-sm text-foreground">
                                € {sampleSalary.toLocaleString()} × {year1Percent}%
                            </p>
                            <p className="mt-1 font-serif text-2xl text-foreground">
                                € {sampleYear1.toLocaleString()}
                                <span className="text-sm text-muted-foreground"> /month</span>
                            </p>
                        </div>
                        <div className="rounded-lg border border-border bg-background p-4">
                            <p className="text-xs font-medium text-muted-foreground">
                                Year 2 · after week {year1Weeks}
                            </p>
                            <p className="mt-1 font-mono text-sm text-foreground">
                                € {sampleSalary.toLocaleString()} × {year2Percent}%
                            </p>
                            <p className="mt-1 font-serif text-2xl text-foreground">
                                € {sampleYear2.toLocaleString()}
                                <span className="text-sm text-muted-foreground"> /month</span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-3 text-sm">
                        <StatRow label={exampleTotalLabel}>
                            € {sampleTotal.toLocaleString()}
                        </StatRow>
                    </div>
                </div>

                {/* ---- Year 1 vs Year 2 table ---- */}
                <div className="mt-8 overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
                                <th className="px-4 py-3 font-medium">
                                    {tableLabels.col_period || "Period"}
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    {tableLabels.col_duration || "How long it lasts"}
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    {tableLabels.col_pay || "Pay you receive"}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-border">
                                <td className="px-4 py-3 font-medium text-foreground">Year 1</td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    Weeks 1–{year1Weeks}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {year1Percent}% of your salary
                                </td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="px-4 py-3 font-medium text-foreground">Year 2</td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {year2Weeks > 0 ? `Weeks ${year1Weeks + 1}–${maxWeeks}` : "—"}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {year2Percent}% of your salary
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* ---- FAQ ---- */}
                <div className="mt-10">
                    <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {faqHeading || "Questions people often ask"}
                    </p>
                    <div className="rounded-xl border border-border px-4">
                        {displayFaqs.map((faq, i) => (
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

                {/* ---- Legal basis / footer ---- */}
                <div className="mt-8 flex items-start gap-2 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
                    <BookOpenCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                    <p>{t(displayFooter)}</p>
                </div>
            </div>
        </section>
    );
}

export default CalculationInformatics;