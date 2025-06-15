import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "@/contexts/SessionProvider";
import { AuthLoading } from "@/components/loading";

export function Home() {
	const { user, account, isLoading, isAuthenticated } = useSession();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading) {
			if (isAuthenticated) {
				navigate({ to: "/dashboard" });
			} else {
				navigate({ to: "/sign-in" });
			}
		}
	}, [isAuthenticated, isLoading, navigate]);

	if (isLoading) {
		return <AuthLoading />;
	}

	return <AuthLoading />;
}