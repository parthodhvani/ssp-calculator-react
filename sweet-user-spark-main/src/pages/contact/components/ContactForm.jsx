/**
 * ContactForm.jsx — Contact page
 * Right column: the actual form + its "message sent" success state.
 *
 * NOTE for WP dev: `onSubmit` currently just flips local `sent` state to
 * true (demo only). Wire it up to your real submission endpoint (e.g. a WP
 * REST route, Formspree, or wp_mail via a custom endpoint) inside
 * `handleSubmit` below.
 */
import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

export function ContactForm({ topics, successTitle, successBody }) {
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState(topics[0]);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO (WP dev): send `topic` + form fields to your backend here.
    setSent(true);
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      {sent ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <CheckCircle2 className="h-10 w-10 text-primary" />
          <h2 className="font-serif text-2xl text-foreground">{successTitle}</h2>
          <p className="max-w-md text-sm text-muted-foreground">{successBody}</p>
          <button
            onClick={() => setSent(false)}
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
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                placeholder="Anna de Vries"
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
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                placeholder="you@company.nl"
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
                  onClick={() => setTopic(t)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
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
              className="mt-2 w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              placeholder="Tell us what you're trying to figure out…"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Send className="h-4 w-4" /> Send message
          </button>
        </form>
      )}
    </section>
  );
}

export default ContactForm;
