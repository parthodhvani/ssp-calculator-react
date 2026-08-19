import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/pages/contact/ContactPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { name: "description", content: "Get in touch with the Recura team." },
    ],
  }),
  component: ContactPage,
});