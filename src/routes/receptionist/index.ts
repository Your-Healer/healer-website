import ReceptionistRoute from "@/pages/receptionist";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/receptionist/")({
	component: () => ReceptionistRoute,
});
