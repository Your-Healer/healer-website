import StaffShift from "@/pages/admin/staff/StaffShift";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/staff/shifts")({
	component: StaffShift,
});
