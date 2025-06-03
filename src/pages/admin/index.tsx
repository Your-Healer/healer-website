import { Navigate } from "@tanstack/react-router";
import { useSession } from "@/contexts/SessionProvider";
import AdminDashboard from "@/pages/admin/dashboard/Dashboard";

export default function AdminRoute() {
    const { isAuthenticated, user, isLoading } = useSession();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || user?.role !== "admin") {
        return <Navigate to="/sign-in" />;
    }

    return <AdminDashboard />;
}