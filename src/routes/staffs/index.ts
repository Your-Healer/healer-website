import NotFound from "@/pages/NotFound";
import StaffManagement from "@/pages/staff/Staff";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/staffs/")({
	component: StaffManagement,
	notFoundComponent: NotFound,
});
