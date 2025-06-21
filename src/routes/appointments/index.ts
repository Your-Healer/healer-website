import AppointmentManagement from "@/pages/appointments/Appointments";
import NotFound from "@/pages/NotFound";
import { checkAuthentication } from "@/utils/auth-utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/appointments/")({
	component: AppointmentManagement,
	notFoundComponent: NotFound,
	beforeLoad: checkAuthentication,
});
