import DepartmentManagement from "@/pages/departments/Departments";
import NotFound from "@/pages/NotFound";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/departments/")({
	component: DepartmentManagement,
	notFoundComponent: NotFound,
});
