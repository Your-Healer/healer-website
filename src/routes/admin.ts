import AdminRoute from "@/pages/admin";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
	component: AdminRoute,
});
