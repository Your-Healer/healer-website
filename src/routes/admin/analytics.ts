import AnalyticsPage from "@/pages/admin/analytics/Analytics";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/analytics")({
	component: () => AnalyticsPage,
});
