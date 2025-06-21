import AnalyticsPage from "@/pages/analytics/Analytics";
import NotFound from "@/pages/NotFound";
import { checkAuthentication } from "@/utils/auth-utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/analytics/")({
	component: AnalyticsPage,
	notFoundComponent: NotFound,
	beforeLoad: checkAuthentication,
});
