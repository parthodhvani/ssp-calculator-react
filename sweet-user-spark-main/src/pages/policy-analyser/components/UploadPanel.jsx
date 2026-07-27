/**
 * UploadPanel.jsx — Policy Analyser page
 * Left column: file drop zone + paste-text fallback + "Analyse" trigger.
 */
import { Upload, FileText, Loader2 } from "lucide-react";

export function UploadPanel({ fileName, text, setText, analyzing, onFile, onAnalyze }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-serif text-lg text-foreground">1. Provide the document</h2>

      <label
        htmlFor="policy-file"
        className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/30 px-4 py-10 text-center transition-colors hover:border-accent hover:bg-secondary/50"
      >
        <Upload className="h-6 w-6 text-accent" />
        <span className="text-sm font-medium text-foreground">
          {fileName ?? "Drop a PDF or DOCX, or click to select"}
        </span>
        <span className="text-xs text-muted-foreground">
          Max 10 MB · nothing leaves your browser in demo mode
        </span>
        <input
          id="policy-file"
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="sr-only"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </label>

      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Or paste the text
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Paste the sick-leave clauses from your contract or handbook…"
          className="mt-2 w-full resize-y rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
        />
        <button
          onClick={onAnalyze}
          disabled={!text && !fileName}
          className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {analyzing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          Analyse
        </button>
      </div>
    </section>
  );
}

export default UploadPanel;
