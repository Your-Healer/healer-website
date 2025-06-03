import AccountManagement from "@/pages/admin/accounts/Accounts";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/accounts")({
	component: () => AccountManagement,
});
