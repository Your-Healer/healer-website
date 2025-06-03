import StaffManagement from "@/pages/admin/staff/Staff";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/staff")({
	component: () => StaffManagement,
});
