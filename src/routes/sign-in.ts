import { createFileRoute } from "@tanstack/react-router";
import SignInPage from "@/pages/auth/SignIn";
import { checkAlreadyAuthenticated } from "@/utils/auth-utils";

export const Route = createFileRoute("/sign-in")({
	component: SignInPage,
	beforeLoad: checkAlreadyAuthenticated,
});
