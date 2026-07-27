/**
 * content.js — Contact page
 * ---------------------------------------------------------------------------
 * All copy for the Contact page in one place. Follows the same pattern as
 * src/pages/calculate/content.js so a WP dev can wire this up to ACF later
 * (e.g. an Options Page "Contact Settings" with matching field names in the
 * suggested `acfField` comments below).
 * ---------------------------------------------------------------------------
 */
import { Mail, MessageSquare, MapPin } from "lucide-react";

export const DEFAULT_CONTENT = {
  kicker: "Reach us", // ACF field: contact_kicker
  title: "Contact", // ACF field: contact_title
  description:
    "Questions, feedback or a tricky case? We read every message and usually respond within a working day.", // ACF field: contact_description
  // ACF field: contact_info (repeater: icon [select] / label / value / href)
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
    "Recura is an information tool, not a law firm. For binding advice on your own case, consult a Dutch employment lawyer or your works council.", // ACF field: contact_legal_note
  // ACF field: contact_topics (repeater of single "topic_label" text rows)
  topics: ["General question", "My own case", "Policy audit", "Press"],
  successTitle: "Message received", // ACF field: contact_success_title
  successBody:
    "Thanks — we'll reply to you within a working day. In the meantime, feel free to explore the calculator or the rules page.", // ACF field: contact_success_body
};
