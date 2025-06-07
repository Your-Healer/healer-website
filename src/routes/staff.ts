import StaffLayout from "@/pages/staff";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/staff")({
	component: StaffLayout,
});
