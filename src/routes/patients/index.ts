import NotFound from "@/pages/NotFound";
import PatientManagement from "@/pages/patients/Patients";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/patients/")({
	component: PatientManagement,
	notFoundComponent: NotFound,
});
