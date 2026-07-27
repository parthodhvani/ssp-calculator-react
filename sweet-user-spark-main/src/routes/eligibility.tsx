import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/eligibility")({
  head: () => ({
    meta: [
      { title: "Eligibility — Recura" },
      {
        name: "description",
        content:
          "Check whether you're covered by Dutch statutory sick-pay rules (Art. 7:629).",
      },
    ],
  }),
  component: EligibilityPage,
});

type Answer = "yes" | "no" | null;

const questions: { id: string; q: string; hint: string }[] = [
  {
    id: "contract",
    q: "Do you have a written employment contract (arbeidsovereenkomst) with a Dutch employer?",
    hint: "Includes fixed-term, permanent, on-call and uitzend contracts — but not freelance/ZZP agreements.",
  },
  {
    id: "working",
    q: "Were you actively working (or on paid leave) when you became ill?",
    hint: "Sick leave that starts during unpaid leave or after your contract ended is treated differently.",
  },
  {
    id: "reported",
    q: "Did you report your illness to your employer on the first day?",
    hint: "Late reporting can trigger extra waiting days (wachtdagen) under your CAO.",
  },
  {
    id: "cooperate",
    q: "Are you willing to cooperate with the company doctor (bedrijfsarts) and reintegration plan?",
    hint: "Refusing reasonable reintegration steps is the most common reason pay gets suspended.",
  },
];

function EligibilityPage() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const answered = questions.filter((q) => answers[q.id]).length;
  const allYes =
    answered === questions.length &&
    questions.every((q) => answers[q.id] === "yes");
  const anyNo = questions.some((q) => answers[q.id] === "no");
  const done = answered === questions.length;

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16 sm:py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
        Guide · 4 questions
      </p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground sm:text-5xl">
        Are you eligible for continued pay?
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Dutch law (Art. 7:629 BW) obliges most employers to keep paying you
        while you're ill — up to 104 weeks. Answer four questions to see
        whether you're covered.
      </p>

      <div className="mt-10 space-y-4">
        {questions.map((item, i) => {
          const value = answers[item.id];
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-border bg-card p-5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary font-mono text-xs text-secondary-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-lg leading-snug text-foreground">
                    {item.q}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.hint}
                  </p>
                  <div className="mt-4 flex gap-2">
                    {(["yes", "no"] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() =>
                          setAnswers((a) => ({ ...a, [item.id]: opt }))
                        }
                        className={`inline-flex items-center gap-1.5 rounded-md border px-4 py-1.5 text-sm font-medium transition-colors ${
                          value === opt
                            ? opt === "yes"
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-destructive bg-destructive text-destructive-foreground"
                            : "border-border bg-background text-foreground hover:bg-secondary"
                        }`}
                      >
                        {opt === "yes" ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                        {opt === "yes" ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {done && (
        <div
          className={`mt-8 rounded-2xl border p-6 sm:p-8 ${
            allYes
              ? "border-primary/30 bg-primary/5"
              : "border-destructive/30 bg-destructive/5"
          }`}
        >
          <div className="flex items-start gap-3">
            {allYes ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
            ) : (
              <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
            )}
            <div>
              <h2 className="font-serif text-2xl text-foreground">
                {allYes
                  ? "You're most likely covered."
                  : "Your situation needs a closer look."}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {allYes
                  ? "Based on your answers, your employer must continue paying you under Art. 7:629. Run the calculator to see the estimated euro amount."
                  : anyNo
                    ? "One or more answers suggest your entitlement may be reduced, suspended, or fall outside statutory sick pay. Check the rules page or contact us for a full audit."
                    : "Complete the calculator for an estimate; some cases sit in a gray zone."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Open the calculator <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/rules"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Read the rules
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}