import { useEffect } from "react";
import { useNavigate, Navigate } from "@tanstack/react-router";
import { useSession } from "@/contexts/SessionProvider";
import { useTranslation } from "react-i18next";

export function Home() {
	const { user, isLoading, isAuthenticated } = useSession();
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();

	useEffect(() => {
		if (!isLoading) {
			if (user) {
				// Redirect based on user role
				if (user.role === "admin") {
					navigate({ to: "/admin" });
				} else if (user.role === "receptionist") {
					navigate({ to: "/receptionist" });
				}
			} else {
				// Redirect to sign-in if not authenticated
				navigate({ to: "/sign-in" });
			}
		}
	}, [user, isLoading, navigate]);

	const onTranslateButtonClick = async (): Promise<void> => {
		if (i18n.resolvedLanguage === "en") {
			await i18n.changeLanguage("es");
		} else {
			await i18n.changeLanguage("en");
		}
	};

	// Show loading while checking authentication
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Checking authentication...</p>
				</div>
			</div>
		);
	}

	// Redirect to sign-in if not authenticated
	if (!isAuthenticated) {
		return <Navigate to="/sign-in" replace />;
	}

	// Role-based dashboard selection
	if (user?.role === "admin") {
		return <Navigate to="/admin" replace />;
	} else if (user?.role === "receptionist") {
		return <Navigate to="/receptionist" replace />;
	}

	// Fallback to sign-in if role is not recognized
	return <Navigate to="/sign-in" replace />;
}
