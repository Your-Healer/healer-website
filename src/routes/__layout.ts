// src/routes/layout.tsx
import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "./__root";
import AppLayout from "@/components/layout/AppLayout";

export const Route = createRoute({
	getParentRoute: () => RootRoute,
	id: "layout",
	component: AppLayout,
});
