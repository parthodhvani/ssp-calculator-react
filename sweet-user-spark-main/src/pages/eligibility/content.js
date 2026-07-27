/**
 * content.js — Eligibility page
 * ---------------------------------------------------------------------------
 * The 4-question eligibility guide. Good candidate for an ACF repeater
 * ("eligibility_questions": id / question / hint) if this needs to be
 * editable without touching code.
 * ---------------------------------------------------------------------------
 */

export const DEFAULT_CONTENT = {
  kicker: "Guide · 4 questions",
  title: "Are you eligible for continued pay?",
  description:
    "Dutch law (Art. 7:629 BW) obliges most employers to keep paying you while you're ill — up to 104 weeks. Answer four questions to see whether you're covered.",
  questions: [
    {
      id: "contract",
      q: "Do you have a written employment contract (arbeidsovereenkomst) with a Dutch employer?",
      hint: "Includes fixed-term, permanent, on-call and uitzend contracts — but not freelance/ZZP agreements.",
    },
    {
      id: "working",
      q: "Were you actively working (or on paid leave) when you became ill?",
      hint: "Sick leave that starts during unpaid leave or after your contract ended is treated differently.",
    },
    {
      id: "reported",
      q: "Did you report your illness to your employer on the first day?",
      hint: "Late reporting can trigger extra waiting days (wachtdagen) under your CAO.",
    },
    {
      id: "cooperate",
      q: "Are you willing to cooperate with the company doctor (bedrijfsarts) and reintegration plan?",
      hint: "Refusing reasonable reintegration steps is the most common reason pay gets suspended.",
    },
  ],
  outcomes: {
    allYesTitle: "You're most likely covered.",
    notCoveredTitle: "Your situation needs a closer look.",
    allYesBody:
      "Based on your answers, your employer must continue paying you under Art. 7:629. Run the calculator to see the estimated euro amount.",
    anyNoBody:
      "One or more answers suggest your entitlement may be reduced, suspended, or fall outside statutory sick pay. Check the rules page or contact us for a full audit.",
    grayZoneBody: "Complete the calculator for an estimate; some cases sit in a gray zone.",
  },
};
