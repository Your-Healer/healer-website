import MedicalRooms from "@/pages/admin/rooms/MedicalRooms";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/rooms")({
	component: MedicalRooms,
});
