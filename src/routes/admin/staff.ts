import StaffManagement from "@/pages/admin/staff/Staff";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/staff")({
	component: StaffManagement,
	// beforeLoad: async () => {
	// 	// Check authentication and authorization for patient management
	// 	const userRole = localStorage.getItem("userRole");
	// 	const isAuthenticated = localStorage.getItem("authToken");

	// 	if (!isAuthenticated || userRole !== "admin") {
	// 		throw redirect({ to: "/sign-in" });
	// 	}
	// },
});
