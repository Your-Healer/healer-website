import AppointmentManagement from "@/pages/appointments/Appointments";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/receptionist/appointment")({
	component: () => AppointmentManagement,
});
