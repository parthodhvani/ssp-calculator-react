import { ArrowRight } from "lucide-react";

export function PagePlaceholder({
  kick,
  title,
  lede,
  cta,
}: {
  kick: string;
  title: string;
  lede: string;
  cta?: { label: string; href: string };
}) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col px-6 py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
        {kick}
      </p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {lede}
      </p>
      {cta && (
        <a
          href={cta.href}
          className="mt-8 inline-flex w-fit items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {cta.label} <ArrowRight className="h-4 w-4" />
        </a>
      )}
      <div className="mt-16 rounded-2xl border border-dashed border-border bg-secondary/40 p-8 text-sm text-muted-foreground">
        This section is scaffolded — content coming soon.
      </div>
    </main>
  );
}