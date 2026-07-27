import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Clock } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Recura" },
      {
        name: "description",
        content: "Notes on Dutch sick-leave law, CAOs and payroll edge cases.",
      },
    ],
  }),
  component: BlogPage,
});

const posts = [
  {
    date: "12 July 2026",
    read: "6 min",
    tag: "Case law",
    title: "When a bedrijfsarts disagrees with your GP: your options in 2026",
    excerpt:
      "A second opinion is now a statutory right, but only within a narrow window. Here's what changed in April and how to use it.",
  },
  {
    date: "28 June 2026",
    read: "4 min",
    tag: "CAO",
    title: "Metalektro CAO 2026: what actually improved for sick pay",
    excerpt:
      "The new agreement lifts year-two pay to 90% and waives waiting days for chronic conditions. We break down who benefits.",
  },
  {
    date: "10 June 2026",
    read: "8 min",
    tag: "Deep dive",
    title: "Payrolling, uitzend and the 104-week clock",
    excerpt:
      "If your contract keeps flipping between agencies, when does the two-year continued-pay period actually start?",
  },
  {
    date: "22 May 2026",
    read: "3 min",
    tag: "Explainer",
    title: "Why 'ziek uit dienst' still catches people out",
    excerpt:
      "Falling ill in the last month of a fixed-term contract has a very specific outcome — and most employees don't know it.",
  },
];

function BlogPage() {
  const [featured, ...rest] = posts;
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
        Writing · Updated weekly
      </p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground sm:text-5xl">
        Notes from the sick-leave desk
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Case law, CAO changes and the payroll edge cases we keep running
        into — written for employees and HR teams that want the actual answer.
      </p>

      {/* Featured */}
      <article className="group mt-12 grid gap-6 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/40 sm:grid-cols-[1.4fr_1fr] sm:p-8">
        <div>
          <div className="flex items-center gap-3 text-xs">
            <span className="rounded-md bg-accent/15 px-2 py-0.5 font-mono uppercase tracking-wider text-accent">
              {featured.tag}
            </span>
            <span className="text-muted-foreground">{featured.date}</span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" /> {featured.read}
            </span>
          </div>
          <h2 className="mt-4 font-serif text-2xl leading-snug text-foreground sm:text-3xl">
            {featured.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {featured.excerpt}
          </p>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
            Read the article <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
        <div
          aria-hidden
          className="hidden rounded-xl bg-gradient-to-br from-primary/90 via-primary to-accent/60 p-8 sm:flex sm:items-end"
        >
          <blockquote className="font-serif text-xl leading-snug text-primary-foreground">
            "The second opinion right is only useful if you know the seven-day
            window exists."
          </blockquote>
        </div>
      </article>

      {/* Rest */}
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {rest.map((p) => (
          <li key={p.title}>
            <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/40">
              <div className="flex items-center gap-3 text-xs">
                <span className="rounded-md bg-secondary px-2 py-0.5 font-mono uppercase tracking-wider text-secondary-foreground">
                  {p.tag}
                </span>
                <span className="text-muted-foreground">{p.date}</span>
              </div>
              <h3 className="mt-3 font-serif text-lg leading-snug text-foreground">
                {p.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {p.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {p.read}
                </span>
                <ArrowUpRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}