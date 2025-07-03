import { Sidebar } from "@/components/layout/Sidebar/Sidebar"
import { Header } from "@/components/layout/Header/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Users, UserCheck, Calendar, Building2, Stethoscope, Clock, Activity,
    TrendingUp, TrendingDown, DollarSign, Timer, CreditCard, ChevronRight,
    CheckCircle
} from "lucide-react"
import { Navigate, useNavigate } from "@tanstack/react-router"
import { useSession } from "@/contexts/SessionProvider"
import { DashboardLoading } from "@/components/loading"
import { useAdminDashboard } from "@/hooks/use-statistics"
import { getAppointmentStatusName } from "@/utils/utils"
import { APPOINTMENTSTATUS } from "@/utils/enum"
import { convertToVietnameseDate } from "@/lib/utils"
import { useEffect, useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

// Dynamically import Recharts to avoid SSR issues
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, LineChart, Line
} from 'recharts'

export default function AdminDashboard() {
    const { isAuthenticated, user, account, isLoading } = useSession();
    const navigate = useNavigate();
    const { stats, loading: dashboardLoading, refetch } = useAdminDashboard();
    const [chartView, setChartView] = useState<"appointments" | "revenue">("appointments");

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

    const translatedRevenueData = useMemo(() => {
        return stats.revenue.monthlyData.map(item => {
            // Extract month number from the English month name
            const monthIndex = new Date(`${item.month} 1, 2023`).getMonth();
            // Format month in Vietnamese
            const translatedMonth = format(new Date(2023, monthIndex, 1), 'MMMM', { locale: vi });
            return {
                ...item,
                month: translatedMonth.charAt(0).toUpperCase() + translatedMonth.slice(1)
            };
        });
    }, [stats.revenue.monthlyData]);

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
            href: "/patients",
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: "Nhân Viên Y Tế",
            value: stats.totalStaff.toString(),
            icon: Users,
            href: "/staff",
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            title: "Lịch Hẹn Hôm Nay",
            value: stats.appointments.today.count.toString(),
            icon: Calendar,
            href: "/appointments",
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        },
        {
            title: "Khoa Khám",
            value: stats.totalDepartments.toString(),
            icon: Building2,
            href: "/departments",
            color: "text-orange-600",
            bgColor: "bg-orange-50"
        },
        {
            title: "Phòng Khám",
            value: stats.totalMedicalRooms.toString(),
            icon: Stethoscope,
            href: "/medical-rooms",
            color: "text-indigo-600",
            bgColor: "bg-indigo-50"
        },
    ];

    const performanceStats = [
        {
            title: "Doanh Thu Tháng Này",
            value: stats.revenue.monthly.toLocaleString() + " VNĐ",
            subtitle: "tổng thu nhập",
            icon: CreditCard,
            color: "text-green-600"
        },
        {
            title: "Doanh Thu Hôm Nay",
            value: stats.revenue.today.toLocaleString() + " VNĐ",
            subtitle: "đã thanh toán",
            icon: DollarSign,
            color: "text-blue-600"
        },
        {
            title: "Lịch Hẹn Hoàn Thành",
            value: stats.appointments.today.paid.toString(),
            subtitle: "tổng số lịch hẹn",
            icon: CheckCircle,
            color: "text-green-600"
        },
        {
            title: "Lịch Hẹn Đang Chờ",
            value: stats.appointments.today.idle.toString(),
            subtitle: "cần xử lý",
            icon: Clock,
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

                    {/* Monthly Charts */}
                    <Card className="mb-8">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Thống Kê Theo Tháng</CardTitle>
                                    <CardDescription>
                                        Biểu đồ thống kê hoạt động của bệnh viện
                                    </CardDescription>
                                </div>
                                <Tabs value={chartView} onValueChange={(value) => setChartView(value as "appointments" | "revenue")}>
                                    <TabsList>
                                        <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
                                        <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
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
                                            <Bar dataKey="booked" name="Đã đặt lịch" stackId="a" fill="#0088FE" />
                                            <Bar dataKey="paid" name="Đã thanh toán" stackId="a" fill="#00C49F" />
                                            <Bar dataKey="cancel" name="Đã hủy" stackId="a" fill="#FF8042" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={translatedRevenueData}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value: any) => [`${value.toLocaleString()} VNĐ`, ""]}
                                                labelFormatter={(label: any) => label}
                                            />
                                            <Legend />
                                            <Bar dataKey="amount" name="Doanh thu" fill="#00C49F" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Appointments */}
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

                        {/* System Activity */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Tổng Doanh Thu</CardTitle>
                                    <CardDescription>
                                        Tổng quan doanh thu của bệnh viện
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCardClick('/finance')}
                                >
                                    Xem chi tiết
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-green-100">
                                                <DollarSign className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Tổng doanh thu
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    tính từ khi thành lập
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-lg font-bold text-green-600">
                                            {stats.revenue.total.toLocaleString()} VNĐ
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-blue-100">
                                                <CreditCard className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Doanh thu tháng này
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-blue-600">
                                                {stats.revenue.monthly.toLocaleString()} VNĐ
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
                                                    Doanh thu hôm nay
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-lg font-bold text-purple-600">
                                            {stats.revenue.today.toLocaleString()} VNĐ
                                        </p>
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