import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "@/contexts/SessionProvider";
import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "../common/types";

export function Home() {
	const { user, isLoading } = useSession();
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();

	useEffect(() => {
		if (!isLoading) {
			if (user) {
				// Redirect based on user role
				if (user.role === "admin") {
					navigate({ to: "/admin" });
				} else if (user.role === "receptionist") {
					navigate({ to: "/receptionist/dashboard" });
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

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-blue-300  font-bold w-screen h-screen flex flex-col justify-center items-center">
			<p className="text-white text-6xl">{t("home.greeting")}</p>
			<button type="submit" onClick={onTranslateButtonClick}>
				translate
			</button>
		</div>
	);
}
