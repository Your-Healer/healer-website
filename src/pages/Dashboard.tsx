import { Navigate } from "@tanstack/react-router";
import { useSession } from "@/contexts/SessionProvider";

export default function Dashboard() {
    const { isAuthenticated, user, account, isLoading } = useSession();

    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                    <p className="mt-2 text-sm text-gray-500">Determining user role and permissions</p>
                </div>
            </div>
        );
    }

    // Redirect to sign-in if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    // Role-based dashboard selection
    if (account?.role?.id === "1") {
        return <Navigate to="/admin" replace />;
    } else if (account?.role?.id === "2") {
        return <Navigate to="/staff" replace />;
    }

    // Fallback to sign-in if role is not recognized
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="text-red-600 text-xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
                <p className="text-gray-600 mb-4">Your user role is not recognized or you don't have permission to access this system.</p>
                <p className="text-sm text-gray-500 mb-6">Please contact your administrator for assistance.</p>
                <Navigate to="/sign-in" replace />
            </div>
        </div>
    );
}
