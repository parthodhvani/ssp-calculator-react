/**
 * ResultBanner.jsx — Eligibility page
 * Shown once all 4 questions are answered — summarises the outcome.
 */
import { Link } from "@tanstack/react-router";
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export function ResultBanner({ allYes, anyNo, outcomes }) {
  return (
    <div
      className={`mt-8 rounded-2xl border p-6 sm:p-8 ${
        allYes ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"
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
            {allYes ? outcomes.allYesTitle : outcomes.notCoveredTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {allYes
              ? outcomes.allYesBody
              : anyNo
                ? outcomes.anyNoBody
                : outcomes.grayZoneBody}
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
  );
}

export default ResultBanner;
