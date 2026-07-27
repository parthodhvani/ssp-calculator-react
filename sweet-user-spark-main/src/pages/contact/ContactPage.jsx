/**
 * ContactPage.jsx
 * ---------------------------------------------------------------------------
 * The "/contact" route. Import and render this from src/routes/contact.tsx.
 * ---------------------------------------------------------------------------
 */
import { DEFAULT_CONTENT } from "./content";
import { ContactInfoList } from "./components/ContactInfoList";
import { ContactForm } from "./components/ContactForm";

export function ContactPage() {
  const content = DEFAULT_CONTENT;

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

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <ContactInfoList items={content.infoItems} legalNote={content.legalNote} />
        <ContactForm
          topics={content.topics}
          successTitle={content.successTitle}
          successBody={content.successBody}
        />
      </div>
    </main>
  );
}

export default ContactPage;
