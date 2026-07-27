/**
 * QuestionItem.jsx — Eligibility page
 * A single numbered yes/no question card.
 */
import { CheckCircle2, XCircle } from "lucide-react";

export function QuestionItem({ index, item, value, onAnswer }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary font-mono text-xs text-secondary-foreground">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-serif text-lg leading-snug text-foreground">{item.q}</p>
          <p className="mt-1 text-sm text-muted-foreground">{item.hint}</p>
          <div className="mt-4 flex gap-2">
            {["yes", "no"].map((opt) => (
              <button
                key={opt}
                onClick={() => onAnswer(item.id, opt)}
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
}

export default QuestionItem;
