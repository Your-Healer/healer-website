import NotFound from "@/pages/NotFound";
import MedicalRoomsPage from "@/pages/rooms/MedicalRooms";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { jwtDecode } from "jwt-decode";

export const Route = createFileRoute("/rooms/")({
	component: MedicalRoomsPage,
	notFoundComponent: NotFound,
	beforeLoad: () => {
		// Check if user is authenticated
		const storedToken = localStorage.getItem("authToken");
		const storedUser = localStorage.getItem("user");

		if (!storedToken || !storedUser) {
			throw redirect({ to: "/sign-in" });
		}

		try {
			const decodedToken = jwtDecode(storedToken);
			let currentDate = new Date();

			const isTokenValid =
				decodedToken.exp && decodedToken.exp * 1000 >= currentDate.getTime();

			if (!isTokenValid) {
				// Clear expired session
				localStorage.removeItem("authToken");
				localStorage.removeItem("user");
				localStorage.removeItem("account");
				localStorage.removeItem("staff");
				throw redirect({ to: "/sign-in" });
			}
		} catch (error) {
			// If it's a redirect, re-throw it
			if (error && typeof error === "object" && "to" in error) {
				throw error;
			}
			// Otherwise, clear invalid session data and redirect
			localStorage.removeItem("authToken");
			localStorage.removeItem("user");
			localStorage.removeItem("account");
			localStorage.removeItem("staff");
			throw redirect({ to: "/sign-in" });
		}
	},
});
