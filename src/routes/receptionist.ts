import ReceptionistLayout from "@/pages/receptionist";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/receptionist")({
	component: ReceptionistLayout,
	beforeLoad: async () => {
		// Check authentication and authorization for admin dashboard
		const userRole = localStorage.getItem("userRole");
		const isAuthenticated = localStorage.getItem("authToken");

		if (!isAuthenticated || userRole !== "receptionist") {
			throw redirect({ to: "/sign-in" });
		}
	},
});
