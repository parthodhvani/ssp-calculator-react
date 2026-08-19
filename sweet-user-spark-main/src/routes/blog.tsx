import { createFileRoute } from "@tanstack/react-router";
import { RulesPage } from "@/pages/rules/RulesPage";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      {
        name: "description",
        content:
          "The Dutch statutory rules Recura applies: Art. 7:629, waiting days, and the 104-week limit.",
      },
    ],
  }),
  component: RulesPage,
});