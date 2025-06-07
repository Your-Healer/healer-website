import PatientManagement from "@/pages/patients/Patients";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/staff/patients")({
	component: PatientManagement,
});
