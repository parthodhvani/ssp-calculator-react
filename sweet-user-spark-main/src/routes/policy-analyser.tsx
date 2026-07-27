import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, FileText, CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/policy-analyser")({
  head: () => ({
    meta: [
      { title: "Policy Analyser — Recura" },
      {
        name: "description",
        content:
          "Upload your sick-leave policy, contract or CAO excerpt and check it against Dutch statutory rules.",
      },
    ],
  }),
  component: PolicyAnalyserPage,
});

type Finding = {
  status: "pass" | "warn" | "fail";
  clause: string;
  detail: string;
};

const demoFindings: Finding[] = [
  {
    status: "pass",
    clause: "Year 1 continued pay set at 100% of gross salary",
    detail: "Well above the statutory floor of 70% (Art. 7:629).",
  },
  {
    status: "pass",
    clause: "Year 2 continued pay set at 80%",
    detail: "Above the 70% minimum.",
  },
  {
    status: "warn",
    clause: "2 waiting days per illness",
    detail: "Legally allowed, but many CAOs waive this. Worth negotiating.",
  },
  {
    status: "fail",
    clause: "Pay suspended after 5 late notifications in 12 months",
    detail: "Blanket suspension is not enforceable — pay may only be suspended after a formal reintegration warning.",
  },
];

function PolicyAnalyserPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [findings, setFindings] = useState<Finding[] | null>(null);
  const [text, setText] = useState("");

  function handleFile(f: File | null) {
    if (!f) return;
    setFileName(f.name);
    runAnalysis();
  }

  function runAnalysis() {
    setAnalyzing(true);
    setFindings(null);
    setTimeout(() => {
      setFindings(demoFindings);
      setAnalyzing(false);
    }, 900);
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
        Tool · Beta
      </p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground sm:text-5xl">
        Policy analyser
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Upload your sick-leave policy, contract or CAO excerpt. We compare
        every clause against Dutch statutory rules and flag anything that
        falls below the floor.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-serif text-lg text-foreground">1. Provide the document</h2>

          <label
            htmlFor="policy-file"
            className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/30 px-4 py-10 text-center transition-colors hover:border-accent hover:bg-secondary/50"
          >
            <Upload className="h-6 w-6 text-accent" />
            <span className="text-sm font-medium text-foreground">
              {fileName ?? "Drop a PDF or DOCX, or click to select"}
            </span>
            <span className="text-xs text-muted-foreground">
              Max 10 MB · nothing leaves your browser in demo mode
            </span>
            <input
              id="policy-file"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="sr-only"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Or paste the text
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder="Paste the sick-leave clauses from your contract or handbook…"
              className="mt-2 w-full resize-y rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
            <button
              onClick={runAnalysis}
              disabled={!text && !fileName}
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {analyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              Analyse
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-lg text-foreground">2. Findings</h2>
            {findings && (
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {findings.length} clauses checked
              </span>
            )}
          </div>

          {!findings && !analyzing && (
            <div className="mt-10 flex flex-col items-center justify-center gap-2 rounded-xl bg-secondary/40 py-12 text-center">
              <FileText className="h-6 w-6 text-muted-foreground/60" />
              <p className="text-sm text-muted-foreground">
                Findings will appear here once you upload or paste a policy.
              </p>
            </div>
          )}

          {analyzing && (
            <div className="mt-10 flex flex-col items-center justify-center gap-2 py-12 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
              <p className="text-sm text-muted-foreground">
                Comparing against Art. 7:629 and common CAO benchmarks…
              </p>
            </div>
          )}

          {findings && (
            <ul className="mt-5 space-y-3">
              {findings.map((f, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-lg border border-border bg-background p-4"
                >
                  {f.status === "pass" && (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  )}
                  {f.status === "warn" && (
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  )}
                  {f.status === "fail" && (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {f.clause}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {f.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}