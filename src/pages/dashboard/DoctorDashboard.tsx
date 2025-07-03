import { Sidebar } from "@/components/layout/Sidebar/Sidebar"
import { Header } from "@/components/layout/Header/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Calendar, Clock, Users, Activity, Stethoscope, Timer, User,
    MapPin, CheckCircle, TrendingUp, FileText
} from "lucide-react"
import { Navigate, useNavigate } from "@tanstack/react-router"
import { useSession } from "@/contexts/SessionProvider"
import { DashboardLoading } from "@/components/loading"
import { useDoctorDashboard } from "@/hooks/use-statistics"
import { getAppointmentStatusName } from "@/utils/utils"
import { APPOINTMENTSTATUS } from "@/utils/enum"
import { useEffect, useState, useMemo } from "react"
import { AppointmentWithDetails, ShiftWorkingDetails } from "@/models/models"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, LineChart, Line
} from 'recharts'

export default function DoctorDashboard() {
    const { isAuthenticated, user, account, staff, isLoading } = useSession();
    const navigate = useNavigate();
    const [chartView, setChartView] = useState<"appointments" | "shifts">("appointments");

    const staffId = staff?.id || '';
    const { stats, loading: dashboardLoading, refetch } = useDoctorDashboard(staffId);

    // Translate month names to Vietnamese
    const translatedAppointmentsData = useMemo(() => {
        return stats.appointments.monthlyData.map(item => {
            // Extract month number from the English month name
            const monthIndex = new Date(`${item.month} 1, 2023`).getMonth();
            // Format month in Vietnamese
            const translatedMonth = format(new Date(2023, monthIndex, 1), 'MMMM', { locale: vi });
            return {
                ...item,
                month: translatedMonth.charAt(0).toUpperCase() + translatedMonth.slice(1)
            };
        });
    }, [stats.appointments.monthlyData]);

    const translatedShiftsData = useMemo(() => {
        return stats.shifts.monthlyData.map(item => {
            // Extract month number from the English month name
            const monthIndex = new Date(`${item.month} 1, 2023`).getMonth();
            // Format month in Vietnamese
            const translatedMonth = format(new Date(2023, monthIndex, 1), 'MMMM', { locale: vi });
            return {
                ...item,
                month: translatedMonth.charAt(0).toUpperCase() + translatedMonth.slice(1)
            };
        });
    }, [stats.shifts.monthlyData]);

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

    if (!staff) {
        return <Navigate to="/sign-in" replace />;
    }

    const mainStats = [
        {
            title: "Lịch Hẹn Hôm Nay",
            value: stats.appointments.today.count.toString(),
            icon: Calendar,
            href: "/appointments",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            description: "lịch hẹn cần khám"
        },
        {
            title: "Lịch Hẹn Sắp Tới",
            value: stats.appointments.total.toString(),
            icon: Clock,
            href: "/appointments",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            description: "trong tuần này"
        },
        {
            title: "Đã Hoàn Thành",
            value: stats.appointments.today.paid.toString(),
            icon: CheckCircle,
            href: "/appointments",
            color: "text-green-600",
            bgColor: "bg-green-50",
            description: "lịch hẹn hôm nay"
        },
        {
            title: "Lịch Hẹn Chờ Xử Lý",
            value: stats.appointments.today.idle.toString(),
            icon: Users,
            href: "/appointments",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            description: "cần xác nhận"
        },
    ];

    const performanceStats = [
        {
            title: "Thời Gian Khám Trung Bình",
            value: "20 phút",
            subtitle: "mỗi bệnh nhân",
            icon: Timer,
            color: "text-blue-600"
        },
        {
            title: "Ca Làm Việc Hiện Tại",
            value: stats.shifts.total.toString(),
            subtitle: "ca đang thực hiện",
            icon: Activity,
            color: "text-green-600"
        },
        {
            title: "Giờ Làm Tuần Này",
            value: `${stats.shifts.weeklyHours.hours}h`,
            subtitle: "tổng thời gian",
            icon: Clock,
            color: "text-purple-600"
        },
    ];

    const getAppointmentStatusBadge = (status: APPOINTMENTSTATUS) => {
        switch (status) {
            case APPOINTMENTSTATUS.PAID:
                return <Badge className="bg-green-100 text-green-800">Đã thanh toán</Badge>;
            case APPOINTMENTSTATUS.BOOKED:
                return <Badge className="bg-blue-100 text-blue-800">Đã đặt</Badge>;
            case APPOINTMENTSTATUS.CANCEL:
                return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
            case APPOINTMENTSTATUS.IDLE:
                return <Badge className="bg-yellow-100 text-yellow-800">Chờ khám</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
        }
    };

    const formatTime = (timeString: Date | string) => {
        try {
            const date = new Date(timeString);
            return date.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return timeString.toString();
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
                                    Chào mừng, BS. {staff.firstname} {staff.lastname}!
                                </h1>
                                <p className="text-gray-600">
                                    Tổng quan hoạt động khám chữa bệnh của bạn hôm nay
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={refetch} variant="outline">
                                    <Activity className="h-4 w-4 mr-2" />
                                    Làm mới
                                </Button>
                                <Button onClick={() => handleCardClick('/appointments')}>
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Xem lịch hẹn
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Main Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {mainStats.map((stat) => {
                            const Icon = stat.icon;
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
                                        <div className="text-2xl font-bold text-gray-900 mb-1">
                                            {stat.value}
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2">
                                            {stat.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

                    {/* Monthly Charts */}
                    <Card className="mb-8">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Thống Kê Theo Tháng</CardTitle>
                                    <CardDescription>
                                        Biểu đồ thống kê hoạt động khám chữa bệnh
                                    </CardDescription>
                                </div>
                                <Tabs value={chartView} onValueChange={(value) => setChartView(value as "appointments" | "shifts")}>
                                    <TabsList>
                                        <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
                                        <TabsTrigger value="shifts">Ca làm việc</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px] w-full">
                                {chartView === "appointments" ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={translatedAppointmentsData}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value: any) => [`${value} lịch hẹn`, ""]}
                                                labelFormatter={(label: any) => label}
                                            />
                                            <Legend />
                                            <Bar dataKey="idle" name="Chờ xử lý" stackId="a" fill="#FFBB28" />
                                            <Bar dataKey="booked" name="Đã đặt" stackId="a" fill="#0088FE" />
                                            <Bar dataKey="paid" name="Đã thanh toán" stackId="a" fill="#00C49F" />
                                            <Bar dataKey="cancel" name="Đã hủy" stackId="a" fill="#FF8042" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={translatedShiftsData}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value: any) => [`${value} ca làm việc`, ""]}
                                                labelFormatter={(label: any) => label}
                                            />
                                            <Legend />
                                            <Bar dataKey="count" name="Số ca làm việc" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Today's Status */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Tình Trạng Lịch Hẹn Hôm Nay</CardTitle>
                                    <CardDescription>
                                        Thống kê lịch hẹn trong ngày
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCardClick('/appointments')}
                                >
                                    Xem tất cả
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-blue-100">
                                                <Calendar className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Đã đặt
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                            {stats.appointments.today.booked}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-yellow-100">
                                                <Clock className="h-4 w-4 text-yellow-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Chờ xử lý
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                            {stats.appointments.today.idle}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-green-100">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Hoàn thành
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="bg-green-100 text-green-800">
                                            {stats.appointments.today.paid}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-red-100">
                                                <Clock className="h-4 w-4 text-red-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Đã hủy
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="bg-red-100 text-red-800">
                                            {stats.appointments.today.cancel}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Working Schedule */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Giờ Làm Việc</CardTitle>
                                    <CardDescription>
                                        Thông tin giờ làm việc của bạn
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCardClick('/shifts')}
                                >
                                    Xem lịch trình
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-blue-100">
                                                <Clock className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Tuần này
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Tổng số giờ làm việc
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-lg font-bold text-blue-600">
                                            {stats.shifts.weeklyHours.hours} giờ
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-green-100">
                                                <Stethoscope className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Tổng ca làm việc
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-green-600">
                                                {stats.shifts.total} ca
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-purple-100">
                                                <Calendar className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Tuần làm việc
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {stats.shifts.weeklyHours.week}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="text-purple-600">
                                            Xem chi tiết
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
