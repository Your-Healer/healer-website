import DepartmentManagement from "@/pages/admin/departments/Departments";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/departments")({
	component: DepartmentManagement,
	// beforeLoad: async () => {
	// 	// Check authentication and authorization for patient management
	// 	const userRole = localStorage.getItem("userRole");
	// 	const isAuthenticated = localStorage.getItem("authToken");

	// 	if (!isAuthenticated || userRole !== "admin") {
	// 		throw redirect({ to: "/sign-in" });
	// 	}
	// },
});
