import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Scale, Clock, AlertTriangle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/rules")({
  head: () => ({
    meta: [
      { title: "Rules — Recura" },
      {
        name: "description",
        content:
          "The Dutch statutory rules Recura applies: Art. 7:629, waiting days, and the 104-week limit.",
      },
    ],
  }),
  component: RulesPage,
});

const sections = [
  {
    icon: Scale,
    kicker: "The floor",
    title: "Article 7:629 — the 70% rule",
    body: "Your employer must pay at least 70% of your salary for up to 104 weeks of illness. During the first 52 weeks this cannot fall below the statutory minimum wage. Anything above 70% is set by your contract or CAO.",
    refs: ["Burgerlijk Wetboek Boek 7", "Art. 7:629 lid 1"],
  },
  {
    icon: Clock,
    kicker: "The clock",
    title: "104-week maximum",
    body: "Continued pay runs for a maximum of 104 weeks (roughly two years) per illness. After that, the UWV takes over via WIA if you're still unable to work. A new illness that starts within 4 weeks of recovery is treated as the same episode.",
    refs: ["Art. 7:629 lid 10", "Wet WIA"],
  },
  {
    icon: AlertTriangle,
    kicker: "The exceptions",
    title: "Waiting days (wachtdagen)",
    body: "Your CAO or contract can impose up to 2 waiting days per illness during which no salary is paid. Many CAOs waive this. Frequent short absences may cluster into a single episode, which limits how often waiting days apply.",
    refs: ["Art. 7:629 lid 9"],
  },
  {
    icon: BookOpen,
    kicker: "The upgrade",
    title: "CAOs and contract clauses",
    body: "Collective labor agreements often improve on the statutory floor — e.g. 100% in year one, 90% in year two. Your contract cannot fall below Art. 7:629, but it can (and often must) go above it. The policy analyser flags shortfalls.",
    refs: ["Sector CAOs", "Individual employment contract"],
  },
];

function RulesPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16 sm:py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
        Reference · Dutch Civil Code
      </p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground sm:text-5xl">
        The rules we apply
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Every number Recura shows you traces back to a specific article of
        Dutch law or a clause in your CAO. Here's the short version, in
        plain English.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {sections.map((s) => (
          <article
            key={s.title}
            className="flex flex-col rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-2">
              <s.icon className="h-4 w-4 text-accent" />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {s.kicker}
              </span>
            </div>
            <h2 className="mt-3 font-serif text-xl leading-snug text-foreground">
              {s.title}
            </h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {s.body}
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5 border-t border-border/60 pt-4">
              {s.refs.map((r) => (
                <span
                  key={r}
                  className="rounded-md bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-secondary-foreground"
                >
                  {r}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-secondary/40 p-6 sm:p-8">
        <h2 className="font-serif text-2xl text-foreground">
          Ready to see the numbers?
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Run your own case through the calculator, or upload a policy to
          see whether it clears the statutory floor.
        </p>
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
    </main>
  );
}