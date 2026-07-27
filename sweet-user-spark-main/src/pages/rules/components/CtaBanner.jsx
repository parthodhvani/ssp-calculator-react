/**
 * CtaBanner.jsx — Rules page
 * Bottom call-to-action linking to the calculator and policy analyser.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function CtaBanner({ title, body }) {
  return (
    <div className="mt-12 rounded-2xl border border-border bg-secondary/40 p-6 sm:p-8">
      <h2 className="font-serif text-2xl text-foreground">{title}</h2>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">{body}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Open calculator <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/policy-analyser"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
        >
          Analyse a policy
        </Link>
      </div>
    </div>
  );
}

export default CtaBanner;
