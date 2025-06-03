import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/pages/admin/dashboard/Dashboard";

export const Route = createFileRoute("/admin")({
	component: Dashboard,
});
