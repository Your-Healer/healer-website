import Dashboard from "@/pages/dashboard/index";
import NotFound from "@/pages/NotFound";
import { createFileRoute } from "@tanstack/react-router";
import { checkAuthentication } from "@/utils/auth-utils";

export const Route = createFileRoute("/dashboard")({
	component: Dashboard,
	notFoundComponent: NotFound,
	beforeLoad: checkAuthentication,
});
