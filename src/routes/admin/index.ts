import Dashboard from "@/pages/admin/dashboard/Dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
	component: () => Dashboard,
});
