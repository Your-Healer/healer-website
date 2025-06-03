import DepartmentManagement from "@/pages/admin/departments/Departments";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/departments")({
	component: () => DepartmentManagement,
});
