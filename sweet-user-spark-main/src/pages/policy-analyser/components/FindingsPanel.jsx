/**
 * FindingsPanel.jsx — Policy Analyser page
 * Right column: empty state, loading state, and the list of findings.
 */
import { FileText, Loader2, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export function FindingsPanel({ findings, analyzing }) {
  return (
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
                <p className="text-sm font-medium text-foreground">{f.clause}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {f.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default FindingsPanel;
