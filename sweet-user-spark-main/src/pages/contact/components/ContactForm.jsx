/**
 * ContactForm.jsx — Contact page
 * Submits to WordPress:
 *   POST …/wp-json/recura/v1/contact
 */
import { useEffect, useState } from "react";
import { CheckCircle2, Send, Loader2 } from "lucide-react";
import { submitContactForm } from "../submitContactForm";

export function ContactForm({
  topics,
  successTitle,
  successBody,
  submitLabel = "",
}) {
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState(topics?.[0] || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!topics?.length) return;
    if (!topics.includes(topic)) {
      setTopic(topics[0]);
    }
  }, [topics, topic]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    setSubmitting(true);
    try {
      const result = await submitContactForm({
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        topic,
        message: String(data.get("message") || ""),
      });

      if (result.ok) {
        setSent(true);
        form.reset();
      } else {
        setError(result.message || "Could not send your message. Please try again.");
        console.error("[Contact] submit failed", result);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Network error — could not reach WordPress.";
      setError(message);
      console.error("[Contact] submit error", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      {sent ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <CheckCircle2 className="h-10 w-10 text-primary" />
          <h2 className="font-serif text-2xl text-foreground">{successTitle}</h2>
          <p className="max-w-md text-sm text-muted-foreground">{successBody}</p>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setError(null);
            }}
            className="mt-2 inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Name
              </label>
              <input
                required
                type="text"
                name="name"
                autoComplete="name"
                disabled={submitting}
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none disabled:opacity-60"
                placeholder="e.g., Jordan Vance"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Email
              </label>
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                disabled={submitting}
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none disabled:opacity-60"
                placeholder="e.g., you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Topic
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {topics.map((t) => (
                <button
                  type="button"
                  key={t}
                  disabled={submitting}
                  onClick={() => setTopic(t)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
                    topic === t
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-secondary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Message
            </label>
            <textarea
              required
              rows={6}
              name="message"
              disabled={submitting}
              className="mt-2 w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none disabled:opacity-60"
              placeholder="Type your inquiry or describe your current sick leave situation here...
"
            />
          </div>

          {error ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {submitting ? "Sending…" : submitLabel}
          </button>
        </form>
      )}
    </section>
  );
}

export default ContactForm;
