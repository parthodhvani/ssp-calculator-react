import { createFileRoute, redirect } from "@tanstack/react-router";
import { PolicyAnalyserPage } from "@/pages/policy-analyser/PolicyAnalyserPage";

export const Route = createFileRoute("/policy-analyser")({
  beforeLoad: () => {
    throw redirect({ to: "/" }); // TEMP: hiding this page — remove this block to re-enable
  },
  head: () => ({
    meta: [
      { title: "Policy Analyser — Recura" },
      {
        name: "description",
        content:
          "Upload your sick-leave policy, contract or CAO excerpt and check it against Dutch statutory rules.",
      },
    ],
  }),
  component: PolicyAnalyserPage,
});