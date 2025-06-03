import PatientManagement from "@/pages/patients/Patients";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/receptionist/patients")({
	component: () => PatientManagement,
});
