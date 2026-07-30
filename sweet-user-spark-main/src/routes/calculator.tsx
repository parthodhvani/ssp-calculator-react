import { createFileRoute } from "@tanstack/react-router";
import { CalculatePage } from "@/pages/calculate/CalculatePage";

export const Route = createFileRoute("/calculator")({
    component: CalculatePage,
});