import { Navigate } from "@tanstack/react-router";
import { useSession } from "@/contexts/SessionProvider";
import ReceptionistDashboard from '@/pages/staff/dashboard/Dashboard';

export default function StaffLayout() {
    const { isAuthenticated, account, isLoading } = useSession();

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

    console.log(!isAuthenticated || account?.role?.id !== "2")

    if (!isAuthenticated || account?.role?.id !== "2") {
        return <Navigate to="/sign-in" />;
    }

    return <ReceptionistDashboard />;
}