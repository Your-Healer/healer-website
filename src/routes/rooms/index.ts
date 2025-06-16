import NotFound from "@/pages/NotFound";
import MedicalRoomsPage from "@/pages/rooms/MedicalRooms";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rooms/")({
	component: MedicalRoomsPage,
	notFoundComponent: NotFound,
});
