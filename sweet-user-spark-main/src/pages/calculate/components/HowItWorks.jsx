/**
 * HowItWorks.jsx — Calculate page
 * Section heading + step cards — all from ACF (`how_it_works` repeater +
 * how_it_works_kicker / how_it_works_title).
 */
export function HowItWorks({ content }) {
  const section = content.howItWorksSection;

  return (
    <section className="border-t border-border/70 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
          {section.kicker}
        </p>
        <h2 className="mt-2 max-w-2xl font-serif text-3xl tracking-tight sm:text-4xl">
          {section.title}
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {content.howItWorks.map((c) => (
            <div
              key={c.number}
              className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent"
            >
              <p className="font-mono text-xs tracking-wider text-muted-foreground">
                {c.number}
              </p>
              <h3 className="mt-3 font-serif text-xl text-foreground">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {c.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
