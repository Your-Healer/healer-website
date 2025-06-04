import AppointmentManagement from "@/pages/appointments/Appointments";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/appointments")({
	component: AppointmentManagement,
	// beforeLoad: async () => {
	// 	// Check authentication and authorization for patient management
	// 	const userRole = localStorage.getItem("userRole");
	// 	const isAuthenticated = localStorage.getItem("authToken");

	// 	if (!isAuthenticated || userRole !== "admin") {
	// 		throw redirect({ to: "/sign-in" });
	// 	}
	// },
});
