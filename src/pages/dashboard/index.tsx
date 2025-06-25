import { Navigate, useNavigate } from "@tanstack/react-router";
import { useSession } from "@/contexts/SessionProvider";
import { DashboardLoading } from "@/components/loading";
import AdminDashboard from "./AdminDashboard";
import DoctorDashboard from "./DoctorDashboard";
import { useEffect } from "react";

export default function Dashboard() {
    const { isAuthenticated, account, user, staff, isLoading } = useSession();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                navigate({ to: "/sign-in" });
            }
        }
    }, [isAuthenticated, isLoading, navigate]);

    // Show loading while checking authentication
    if (isLoading) {
        return <DashboardLoading />;
    }

    // Redirect to sign-in if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    // Route based on user role
    switch (account?.role?.id) {
        case "1": // Admin role
            return <AdminDashboard />;

        case "2": // Staff/Doctor role
            if (staff) {
                return <DoctorDashboard />;
            }
            // If staff role but no staff data, show error or redirect
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Lỗi Truy Cập
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Tài khoản của bạn chưa được liên kết với thông tin nhân viên.
                        </p>
                        <p className="text-sm text-gray-500">
                            Vui lòng liên hệ quản trị viên để được hỗ trợ.
                        </p>
                    </div>
                </div>
            );

        default:
            // return (
            //     <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            //         <div className="text-center">
            //             <h1 className="text-2xl font-bold text-gray-900 mb-4">
            //                 Vai Trò Không Xác Định
            //             </h1>
            //             <p className="text-gray-600 mb-6">
            //                 Không thể xác định vai trò của tài khoản.
            //             </p>
            //             <p className="text-sm text-gray-500">
            //                 Vui lòng liên hệ quản trị viên để được hỗ trợ.
            //             </p>
            //         </div>
            //     </div>
            // );
            return <Navigate to="/sign-in" replace />;
    }
}