import { Home } from "@/pages/Home";
import { createFileRoute } from "@tanstack/react-router";
import { checkAlreadyAuthenticated } from "@/utils/auth-utils";

export const Route = createFileRoute("/")({
	component: Home,
	beforeLoad: checkAlreadyAuthenticated,
});
