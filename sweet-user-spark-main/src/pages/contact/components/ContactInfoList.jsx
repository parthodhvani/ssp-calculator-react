/**
 * ContactInfoList.jsx — Contact page
 * Left column: email / press / location cards + legal disclaimer.
 */
export function ContactInfoList({ items, legalNote }) {
  return (
    <aside className="space-y-5">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <item.icon className="h-3.5 w-3.5 text-accent" />
            {item.label}
          </div>
          {item.href ? (
            <a
              href={item.href}
              className="mt-2 block font-serif text-lg text-foreground hover:text-accent"
            >
              {item.value}
            </a>
          ) : (
            <p className="mt-2 font-serif text-lg text-foreground">{item.value}</p>
          )}
        </div>
      ))}
      <p className="px-1 text-xs leading-relaxed text-muted-foreground">{legalNote}</p>
    </aside>
  );
}

export default ContactInfoList;
