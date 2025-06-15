import { createFileRoute, redirect } from "@tanstack/react-router";
import SignInPage from "@/pages/auth/SignIn";
import { jwtDecode } from "jwt-decode";

export const Route = createFileRoute("/sign-in")({
	component: SignInPage,
	beforeLoad: () => {
		// Check if user is already authenticated
		const storedToken = localStorage.getItem("authToken");
		const storedUser = localStorage.getItem("user");

		if (storedToken && storedUser) {
			try {
				const decodedToken = jwtDecode(storedToken);
				let currentDate = new Date();

				const isTokenValid =
					decodedToken.exp && decodedToken.exp * 1000 >= currentDate.getTime();

				if (isTokenValid) {
					throw redirect({ to: "/dashboard" });
				}
			} catch (error) {
				// If it's a redirect, re-throw it
				if (error && typeof error === "object" && "to" in error) {
					throw error;
				}
				// Otherwise, clear invalid session data
				localStorage.removeItem("authToken");
				localStorage.removeItem("user");
				localStorage.removeItem("account");
				localStorage.removeItem("staff");
			}
		}
	},
});
