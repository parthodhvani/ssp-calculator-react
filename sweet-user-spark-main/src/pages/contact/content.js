/**
 * content.js — Contact page
 * ---------------------------------------------------------------------------
 * Fallback when WordPress/ACF is unreachable. Live copy from Contact page ACF.
 * Submissions go through Contact Form 7 (see submitContactForm.js).
 * ---------------------------------------------------------------------------
 */
import { Mail, MessageSquare, MapPin } from "lucide-react";

export const DEFAULT_CONTENT = {
  kicker: "Reach us",
  title: "Contact",
  description:
    "Questions, feedback or a tricky case? We read every message and usually respond within a working day.",
  infoItems: [
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
  ],
  legalNote:
    "Recura is an information tool, not a law firm. For binding advice on your own case, consult a Dutch employment lawyer or your works council.",
  topics: ["General question", "My own case", "Policy audit", "Press"],
  successTitle: "Message received",
  successBody:
    "Thanks — we'll reply to you within a working day. In the meantime, feel free to explore the calculator or the rules page.",
  submitLabel: "Send message",
};
