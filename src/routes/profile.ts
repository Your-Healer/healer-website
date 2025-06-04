import ProfilePage from "@/pages/profile/Profile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
	component: ProfilePage,
});
