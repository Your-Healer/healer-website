import { createFileRoute } from "@tanstack/react-router";
import SignInPage from "@/pages/auth/SignIn";

export const Route = createFileRoute("/sign-in")({
	component: SignInPage,
});
