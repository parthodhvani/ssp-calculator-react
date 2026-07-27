import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageSquare, MapPin, CheckCircle2, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Recura" },
      { name: "description", content: "Get in touch with the Recura team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState("General question");

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
        Reach us
      </p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground sm:text-5xl">
        Contact
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Questions, feedback or a tricky case? We read every message and
        usually respond within a working day.
      </p>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        {/* Info column */}
        <aside className="space-y-5">
          {[
            {
              icon: Mail,
              label: "Email",
              value: "hello@recura.nl",
              href: "mailto:hello@recura.nl",
            },
            {
              icon: MessageSquare,
              label: "Press & partnerships",
              value: "press@recura.nl",
              href: "mailto:press@recura.nl",
            },
            {
              icon: MapPin,
              label: "Based in",
              value: "Amsterdam, NL",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-card p-5"
            >
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
                <p className="mt-2 font-serif text-lg text-foreground">
                  {item.value}
                </p>
              )}
            </div>
          ))}
          <p className="px-1 text-xs leading-relaxed text-muted-foreground">
            Recura is an information tool, not a law firm. For binding advice
            on your own case, consult a Dutch employment lawyer or your
            works council.
          </p>
        </aside>

        {/* Form */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          {sent ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <CheckCircle2 className="h-10 w-10 text-primary" />
              <h2 className="font-serif text-2xl text-foreground">
                Message received
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Thanks — we'll reply to you within a working day. In the
                meantime, feel free to explore the calculator or the rules
                page.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-2 inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Name
                  </label>
                  <input
                    required
                    type="text"
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
                  {["General question", "My own case", "Policy audit", "Press"].map(
                    (t) => (
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
                    ),
                  )}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Message
                </label>
                <textarea
                  required
                  rows={6}
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
      </div>
    </main>
  );
}