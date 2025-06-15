import NotFound from "@/pages/NotFound";
import StaffShift from "@/pages/staff/StaffShift";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/staffs/shifts")({
	component: StaffShift,
	notFoundComponent: NotFound,
});
