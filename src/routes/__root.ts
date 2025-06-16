import { createRootRoute } from "@tanstack/react-router";
import NotFound from "@/pages/NotFound";

export const Route = createRootRoute({
	notFoundComponent: NotFound,
});
