import { createFileRoute } from "@tanstack/react-router";
import { EligibilityPage } from "@/pages/eligibility/EligibilityPage";

export const Route = createFileRoute("/eligibility")({
  head: () => ({
    meta: [
      { title: "Eligibility — Recura" },
      {
        name: "description",
        content:
          "Check whether you're covered by Dutch statutory sick-pay rules (Art. 7:629).",
      },
    ],
  }),
  component: EligibilityPage,
});
