import MedicalServices from "@/pages/admin/services/MedicalServices";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/services")({
	component: MedicalServices,
});
