/**
 * EligibilityPage.jsx
 * ---------------------------------------------------------------------------
 * The "/eligibility" route. UI structure unchanged — all copy from ACF
 * via useEligibilityContent() (WP page ID 149).
 * ---------------------------------------------------------------------------
 */
import { useState } from "react";
import { useEligibilityContent } from "./useEligibilityContent";
import { QuestionItem } from "./components/QuestionItem";
import { ResultBanner } from "./components/ResultBanner";

export function EligibilityPage() {
  const { content } = useEligibilityContent();
  const [answers, setAnswers] = useState({});

  function handleAnswer(id, opt) {
    setAnswers((a) => ({ ...a, [id]: opt }));
  }

  const answered = content.questions.filter((q) => answers[q.id]).length;
  const allYes =
    answered === content.questions.length &&
    content.questions.every((q) => answers[q.id] === "yes");
  const anyNo = content.questions.some((q) => answers[q.id] === "no");
  const done = answered === content.questions.length;

  return (
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
        {content.questions.map((item, i) => (
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
  );
}

export default EligibilityPage;
