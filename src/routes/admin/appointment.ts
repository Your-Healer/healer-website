import AppointmentManagement from "@/pages/appointments/Appointments";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/appointment")({
	component: AppointmentManagement,
});
