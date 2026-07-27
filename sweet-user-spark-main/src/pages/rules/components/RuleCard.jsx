/**
 * RuleCard.jsx — Rules page
 * A single statutory-rule card (icon, kicker, title, body, reference tags).
 */
export function RuleCard({ section }) {
  const Icon = section.icon;
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-accent" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {section.kicker}
        </span>
      </div>
      <h2 className="mt-3 font-serif text-xl leading-snug text-foreground">
        {section.title}
      </h2>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {section.body}
      </p>
      <div className="mt-5 flex flex-wrap gap-1.5 border-t border-border/60 pt-4">
        {section.refs.map((r) => (
          <span
            key={r}
            className="rounded-md bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-secondary-foreground"
          >
            {r}
          </span>
        ))}
      </div>
    </article>
  );
}

export default RuleCard;
