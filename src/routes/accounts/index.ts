import AccountManagement from "@/pages/accounts/Accounts";
import NotFound from "@/pages/NotFound";
import { checkAuthentication } from "@/utils/auth-utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/accounts/")({
	component: AccountManagement,
	notFoundComponent: NotFound,
	beforeLoad: checkAuthentication,
});
