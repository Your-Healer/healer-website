import { Sidebar } from "@/components/layout/Sidebar/Sidebar"
import { Header } from "@/components/layout/Header/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, Calendar, Building2, Stethoscope, Clock, Activity, TrendingUp, TrendingDown, DollarSign, Timer, Star, AlertCircle } from "lucide-react"
import { Navigate, useNavigate } from "@tanstack/react-router"
import { useSession } from "@/contexts/SessionProvider"
import { DashboardLoading } from "@/components/loading"
import { useAdminDashboard } from "@/hooks/use-statistics"
import { getAppointmentStatusName } from "@/utils/utils"
import { APPOINTMENTSTATUS } from "@/utils/enum"
import { convertToVietnameseDate } from "@/lib/utils"
import { useEffect } from "react"

export default function AdminDashboard() {
    const { isAuthenticated, user, account, isLoading } = useSession();
    const navigate = useNavigate();
    const { stats, recentAppointments, recentActivities, loading: dashboardLoading, refetch } = useAdminDashboard();

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
    if (isLoading || dashboardLoading) {
        return <DashboardLoading />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    const mainStats = [
        {
            title: "Tổng Bệnh Nhân",
            value: stats.totalPatients.toLocaleString(),
            icon: UserCheck,
            change: "+12%",
            href: "/admin/patients",
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: "Nhân Viên Y Tế",
            value: stats.totalStaff.toString(),
            icon: Users,
            change: "+3%",
            href: "/admin/staff",
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            title: "Lịch Hẹn Hôm Nay",
            value: stats.todayAppointments.toString(),
            icon: Calendar,
            change: "+8%",
            href: "/admin/appointments",
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        },
        {
            title: "Khoa Khám",
            value: stats.totalDepartments.toString(),
            icon: Building2,
            change: "0%",
            href: "/admin/departments",
            color: "text-orange-600",
            bgColor: "bg-orange-50"
        },
        {
            title: "Phòng Khám",
            value: stats.totalMedicalRooms.toString(),
            icon: Stethoscope,
            change: "+5%",
            href: "/admin/medical-rooms",
            color: "text-indigo-600",
            bgColor: "bg-indigo-50"
        },
        {
            title: "Doanh Thu Tháng",
            value: `$${stats.monthlyRevenue.toLocaleString()}`,
            icon: DollarSign,
            change: "+15%",
            href: "/admin/analytics",
            color: "text-emerald-600",
            bgColor: "bg-emerald-50"
        },
    ];

    const performanceStats = [
        {
            title: "Lịch Hẹn Hoàn Thành",
            value: stats.completedAppointments.toLocaleString(),
            subtitle: "tổng số lịch hẹn",
            icon: UserCheck,
            color: "text-green-600"
        },
        {
            title: "Thời Gian Chờ Trung Bình",
            value: `${stats.averageWaitTime} phút`,
            subtitle: "thời gian chờ",
            icon: Timer,
            color: "text-blue-600"
        },
        {
            title: "Tỷ Lệ Hài Lòng",
            value: `${stats.patientSatisfactionRate}%`,
            subtitle: "đánh giá bệnh nhân",
            icon: Star,
            color: "text-yellow-600"
        },
        {
            title: "Lịch Hẹn Đang Chờ",
            value: stats.pendingAppointments.toString(),
            subtitle: "cần xử lý",
            icon: AlertCircle,
            color: "text-orange-600"
        },
    ];

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'appointment': return Calendar;
            case 'patient': return UserCheck;
            case 'staff': return Users;
            default: return Activity;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'appointment': return 'text-blue-600';
            case 'patient': return 'text-green-600';
            case 'staff': return 'text-purple-600';
            default: return 'text-gray-600';
        }
    };

    const getAppointmentStatusBadge = (status: APPOINTMENTSTATUS) => {
        switch (status) {
            case APPOINTMENTSTATUS.PAID:
                return <Badge className="bg-green-100 text-green-800">Đã thanh toán</Badge>;
            case APPOINTMENTSTATUS.BOOKED:
                return <Badge className="bg-blue-100 text-blue-800">Đã đặt</Badge>;
            case APPOINTMENTSTATUS.CANCEL:
                return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
            case APPOINTMENTSTATUS.IDLE:
                return <Badge className="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole={account?.role?.id} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Chào mừng trở lại, {user?.firstname} {user?.lastname}!
                                </h1>
                                <p className="text-gray-600">
                                    Tổng quan hoạt động của bệnh viện hôm nay
                                </p>
                            </div>
                            <Button onClick={refetch} variant="outline">
                                <Activity className="h-4 w-4 mr-2" />
                                Làm mới
                            </Button>
                        </div>
                    </div>

                    {/* Main Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {mainStats.map((stat) => {
                            const Icon = stat.icon;
                            const isPositive = stat.change.startsWith("+");
                            return (
                                <Card
                                    key={stat.title}
                                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
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
                                        <div className="text-2xl font-bold text-gray-900 mb-2">
                                            {stat.value}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {isPositive ? (
                                                <TrendingUp className="h-3 w-3 text-green-600" />
                                            ) : (
                                                <TrendingDown className="h-3 w-3 text-red-600" />
                                            )}
                                            <span className={`text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"
                                                }`}>
                                                {stat.change}
                                            </span>
                                            <span className="text-xs text-gray-500 ml-1">
                                                so với tháng trước
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {performanceStats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <Card key={stat.title} className="border-l-4 border-l-blue-500">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    {stat.title}
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {stat.value}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {stat.subtitle}
                                                </p>
                                            </div>
                                            <Icon className={`h-8 w-8 ${stat.color}`} />
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Appointments */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Lịch Hẹn Gần Đây</CardTitle>
                                    <CardDescription>
                                        Các lịch hẹn mới nhất trong hệ thống
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCardClick('/admin/appointments')}
                                >
                                    Xem tất cả
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentAppointments.length > 0 ? (
                                        recentAppointments.slice(0, 5).map((appointment) => (
                                            <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">
                                                        {`${appointment.patient.firstname} ${appointment.patient.lastname}`}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {appointment.medicalRoom.name} - {appointment.medicalRoom.department.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {convertToVietnameseDate(appointment.bookingTime.medicalRoomTime.fromTime)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {convertToVietnameseDate(appointment.bookingTime.medicalRoomTime.toTime)}
                                                    </p>
                                                </div>
                                                <div className="ml-4">
                                                    {getAppointmentStatusBadge(appointment.status)}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p>Chưa có lịch hẹn nào</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* System Activity */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Hoạt Động Hệ Thống</CardTitle>
                                    <CardDescription>
                                        Các hoạt động gần đây trong hệ thống
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCardClick('/admin/activity-logs')}
                                >
                                    Xem chi tiết
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => {
                                        const Icon = getActivityIcon(activity.type);
                                        const iconColor = getActivityColor(activity.type);
                                        return (
                                            <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                <div className={`p-2 rounded-full bg-white ${iconColor}`}>
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm text-gray-900">
                                                        {activity.action}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        bởi {activity.user} • {activity.time}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}