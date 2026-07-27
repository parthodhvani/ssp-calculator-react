/**
 * content.js — Rules page
 * ---------------------------------------------------------------------------
 * Reference content explaining the statutory rules. A good candidate for an
 * ACF repeater ("rules_sections": icon [select] / kicker / title / body /
 * refs [repeater of text]) if the WP dev wants this editable without code.
 * ---------------------------------------------------------------------------
 */
import { BookOpen, Scale, Clock, AlertTriangle } from "lucide-react";

export const DEFAULT_CONTENT = {
  kicker: "Reference · Dutch Civil Code",
  title: "The rules we apply",
  description:
    "Every number Recura shows you traces back to a specific article of Dutch law or a clause in your CAO. Here's the short version, in plain English.",
  sections: [
    {
      icon: Scale,
      kicker: "The floor",
      title: "Article 7:629 — the 70% rule",
      body: "Your employer must pay at least 70% of your salary for up to 104 weeks of illness. During the first 52 weeks this cannot fall below the statutory minimum wage. Anything above 70% is set by your contract or CAO.",
      refs: ["Burgerlijk Wetboek Boek 7", "Art. 7:629 lid 1"],
    },
    {
      icon: Clock,
      kicker: "The clock",
      title: "104-week maximum",
      body: "Continued pay runs for a maximum of 104 weeks (roughly two years) per illness. After that, the UWV takes over via WIA if you're still unable to work. A new illness that starts within 4 weeks of recovery is treated as the same episode.",
      refs: ["Art. 7:629 lid 10", "Wet WIA"],
    },
    {
      icon: AlertTriangle,
      kicker: "The exceptions",
      title: "Waiting days (wachtdagen)",
      body: "Your CAO or contract can impose up to 2 waiting days per illness during which no salary is paid. Many CAOs waive this. Frequent short absences may cluster into a single episode, which limits how often waiting days apply.",
      refs: ["Art. 7:629 lid 9"],
    },
    {
      icon: BookOpen,
      kicker: "The upgrade",
      title: "CAOs and contract clauses",
      body: "Collective labor agreements often improve on the statutory floor — e.g. 100% in year one, 90% in year two. Your contract cannot fall below Art. 7:629, but it can (and often must) go above it. The policy analyser flags shortfalls.",
      refs: ["Sector CAOs", "Individual employment contract"],
    },
  ],
  ctaTitle: "Ready to see the numbers?",
  ctaBody:
    "Run your own case through the calculator, or upload a policy to see whether it clears the statutory floor.",
};
