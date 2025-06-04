import NotFound from "@/pages/NotFound";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/services")({
	notFoundComponent: NotFound,
});
