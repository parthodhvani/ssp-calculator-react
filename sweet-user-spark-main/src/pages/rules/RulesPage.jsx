/**
 * RulesPage.jsx — all copy from ACF.
 */
import { useRulesContent } from "./useRulesContent";
import { AcfPageGate } from "../shared/AcfPageGate";
import { RuleCard } from "./components/RuleCard";
import { CtaBanner } from "./components/CtaBanner";

export function RulesPage() {
  const { content, isLoading, error } = useRulesContent();

  return (
    <AcfPageGate isLoading={isLoading} error={error} label="rules">
      {content ? (
        <main className="mx-auto w-full max-w-4xl px-6 py-16 sm:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
            {content.kicker}
          </p>
          <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {content.description}
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {content.sections.map((section) => (
              <RuleCard key={section.title} section={section} />
            ))}
          </div>

          <CtaBanner
            title={content.ctaTitle}
            body={content.ctaBody}
            primaryLabel={content.primaryCtaLabel}
            primaryLink={content.primaryCtaLink}
            secondaryLabel={content.secondaryCtaLabel}
            secondaryLink={content.secondaryCtaLink}
          />
        </main>
      ) : null}
    </AcfPageGate>
  );
}

export default RulesPage;
