import { createFileRoute } from "@tanstack/react-router";
import { BlogPage } from "@/pages/blog/BlogPage";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Recura" },
      {
        name: "description",
        content: "Notes on Dutch sick-leave law, CAOs and payroll edge cases.",
      },
    ],
  }),
  component: BlogPage,
});
