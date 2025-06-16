import AnalyticsPage from "@/pages/analytics/Analytics";
import NotFound from "@/pages/NotFound";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/analytics/")({
	component: AnalyticsPage,
	notFoundComponent: NotFound,
});
