import AdminLayout from "@/pages/admin";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
	component: AdminLayout,
	beforeLoad: async () => {
		// Check authentication and authorization
		const userRole = localStorage.getItem("userRole");
		const isAuthenticated = localStorage.getItem("authToken");

		if (!isAuthenticated || userRole !== "admin") {
			throw redirect({ to: "/sign-in" });
		}
	},
});
