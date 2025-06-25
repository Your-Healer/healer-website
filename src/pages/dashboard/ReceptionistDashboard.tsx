import { Sidebar } from "@/components/layout/Sidebar/Sidebar"
import { Header } from "@/components/layout/Header/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Activity, Phone, UserPlus, CheckCircle, AlertCircle } from "lucide-react"
import { Navigate, useNavigate } from "@tanstack/react-router"
import { useSession } from "@/contexts/SessionProvider"
import { DashboardLoading } from "@/components/loading"
import { useEffect } from "react"

export default function ReceptionistDashboard() {
    const { isAuthenticated, user, account, isLoading } = useSession();
    const navigate = useNavigate();

    const handleCardClick = (href: string) => {
        try {
            navigate({ to: href })
        } catch (error) {
            console.error('Navigation error:', error)
        }
    }

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

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    // Mock data for receptionist dashboard
    const stats = [
        {
            title: "Lịch Hẹn Hôm Nay",
            value: "45",
            icon: Calendar,
            change: "+12%",
            href: "/receptionist/appointments",
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: "Bệnh Nhân Chờ",
            value: "8",
            icon: Clock,
            change: "-5%",
            href: "/receptionist/waiting",
            color: "text-orange-600",
            bgColor: "bg-orange-50"
        },
        {
            title: "Đăng Ký Mới",
            value: "12",
            icon: UserPlus,
            change: "+8%",
            href: "/receptionist/patients",
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            title: "Cuộc Gọi",
            value: "23",
            icon: Phone,
            change: "+15%",
            href: "/receptionist/calls",
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole={account?.role?.id} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Chào mừng, {user?.firstname} {user?.lastname}!
                        </h1>
                        <p className="text-gray-600">
                            Tổng quan công việc lễ tân hôm nay
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <Card
                                    key={stat.title}
                                    className="cursor-pointer hover:shadow-lg transition-all duration-200"
                                    onClick={() => handleCardClick(stat.href)}
                                >
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">
                                            {stat.title}
                                        </CardTitle>
                                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                            <Icon className={`h-5 w-5 ${stat.color}`} />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {stat.value}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            <span className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}>
                                                {stat.change}
                                            </span>{" "}
                                            so với hôm qua
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="text-center py-12">
                        <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Dashboard Lễ Tân
                        </h3>
                        <p className="text-gray-500">
                            Tính năng này sẽ được phát triển trong phiên bản tiếp theo
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
