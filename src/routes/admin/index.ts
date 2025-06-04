import Dashboard from "@/pages/admin/dashboard/Dashboard";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
	component: Dashboard,
	// beforeLoad: async () => {
	// 	// Check authentication and authorization for admin dashboard
	// 	const userRole = localStorage.getItem("userRole");
	// 	const isAuthenticated = localStorage.getItem("authToken");

	// 	if (!isAuthenticated || userRole !== "admin") {
	// 		throw redirect({ to: "/sign-in" });
	// 	}
	// },
});
