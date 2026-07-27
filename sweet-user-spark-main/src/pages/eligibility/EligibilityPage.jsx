/**
 * EligibilityPage.jsx — all copy from ACF.
 */
import { useState } from "react";
import { useEligibilityContent } from "./useEligibilityContent";
import { AcfPageGate } from "../shared/AcfPageGate";
import { QuestionItem } from "./components/QuestionItem";
import { ResultBanner } from "./components/ResultBanner";

export function EligibilityPage() {
  const { content, isLoading, error } = useEligibilityContent();
  const [answers, setAnswers] = useState({});

  function handleAnswer(id, opt) {
    setAnswers((a) => ({ ...a, [id]: opt }));
  }

  const questions = content?.questions ?? [];
  const answered = questions.filter((q) => answers[q.id]).length;
  const allYes =
    questions.length > 0 &&
    answered === questions.length &&
    questions.every((q) => answers[q.id] === "yes");
  const anyNo = questions.some((q) => answers[q.id] === "no");
  const done = questions.length > 0 && answered === questions.length;

  return (
    <AcfPageGate isLoading={isLoading} error={error} label="eligibility">
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

          <div className="mt-10 space-y-4">
            {questions.map((item, i) => (
              <QuestionItem
                key={item.id}
                index={i}
                item={item}
                value={answers[item.id]}
                onAnswer={handleAnswer}
                yesLabel={content.yesLabel}
                noLabel={content.noLabel}
              />
            ))}
          </div>

          {done && (
            <ResultBanner allYes={allYes} anyNo={anyNo} outcomes={content.outcomes} />
          )}
        </main>
      ) : null}
    </AcfPageGate>
  );
}

export default EligibilityPage;
