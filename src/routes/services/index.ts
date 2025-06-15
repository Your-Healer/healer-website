import NotFound from "@/pages/NotFound";
import MedicalServicesPage from "@/pages/services/MedicalServices";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/services/")({
	component: MedicalServicesPage,
	notFoundComponent: NotFound,
});
