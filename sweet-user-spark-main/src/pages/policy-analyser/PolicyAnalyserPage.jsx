/**
 * PolicyAnalyserPage.jsx
 * ---------------------------------------------------------------------------
 * The "/policy-analyser" route. Import and render this from
 * src/routes/policy-analyser.tsx.
 *
 * NOTE for WP dev: `runAnalysis` currently fakes a result after 900ms with
 * `content.demoFindings`. Replace the body of runAnalysis with a real call
 * to your analysis/AI endpoint, passing `text` (or the uploaded file).
 * ---------------------------------------------------------------------------
 */
import { useState } from "react";
import { DEFAULT_CONTENT } from "./content";
import { UploadPanel } from "./components/UploadPanel";
import { FindingsPanel } from "./components/FindingsPanel";

export function PolicyAnalyserPage() {
  const content = DEFAULT_CONTENT;

  const [fileName, setFileName] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [findings, setFindings] = useState(null);
  const [text, setText] = useState("");

  function handleFile(f) {
    if (!f) return;
    setFileName(f.name);
    runAnalysis();
  }

  function runAnalysis() {
    setAnalyzing(true);
    setFindings(null);
    // TODO (WP dev): replace with a real API call.
    setTimeout(() => {
      setFindings(content.demoFindings);
      setAnalyzing(false);
    }, 900);
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
        {content.kicker}
      </p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground sm:text-5xl">
        {content.title}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {content.description}
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <UploadPanel
          fileName={fileName}
          text={text}
          setText={setText}
          analyzing={analyzing}
          onFile={handleFile}
          onAnalyze={runAnalysis}
        />
        <FindingsPanel findings={findings} analyzing={analyzing} />
      </div>
    </main>
  );
}

export default PolicyAnalyserPage;
