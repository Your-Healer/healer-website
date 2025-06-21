import Sidebar from "@/components/layout/Sidebar/Sidebar"
import { Header } from "@/components/layout/Header/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Activity, Stethoscope, Timer, Star, AlertCircle, User, MapPin, CheckCircle, TrendingUp, FileText } from "lucide-react"
import { Navigate, useNavigate } from "@tanstack/react-router"
import { useSession } from "@/contexts/SessionProvider"
import { DashboardLoading } from "@/components/loading"
import { useDoctorDashboard } from "@/hooks/use-statistics"
import { getAppointmentStatusName } from "@/utils/utils"
import { APPOINTMENTSTATUS } from "@/utils/enum"

export default function DoctorDashboard() {
    const { isAuthenticated, user, account, staff, isLoading } = useSession();
    const navigate = useNavigate();

    const staffId = staff?.id || '';
    const { stats, todayAppointments, currentShifts, recentPatients, loading: dashboardLoading, refetch } = useDoctorDashboard(staffId);

    console.log('Today Appointments:', todayAppointments);

    const handleCardClick = (href: string) => {
        try {
            navigate({ to: href })
        } catch (error) {
            console.error('Navigation error:', error)
        }
    }

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
            value: stats.todayAppointments.toString(),
            icon: Calendar,
            change: "+8%",
            href: "/doctor/appointments",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            description: "lịch hẹn cần khám"
        },
        {
            title: "Lịch Hẹn Sắp Tới",
            value: stats.upcomingAppointments.toString(),
            icon: Clock,
            change: "+5%",
            href: "/doctor/appointments",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            description: "trong tuần này"
        },
        {
            title: "Đã Hoàn Thành",
            value: stats.completedToday.toString(),
            icon: CheckCircle,
            change: "+12%",
            href: "/doctor/appointments",
            color: "text-green-600",
            bgColor: "bg-green-50",
            description: "lịch hẹn hôm nay"
        },
        {
            title: "Tổng Bệnh Nhân",
            value: stats.totalPatients.toString(),
            icon: Users,
            change: "+15%",
            href: "/doctor/patients",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            description: "đang theo dõi"
        },
    ];

    const performanceStats = [
        {
            title: "Thời Gian Khám Trung Bình",
            value: `${stats.averageConsultationTime} phút`,
            subtitle: "mỗi bệnh nhân",
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
            title: "Ca Làm Việc Hiện Tại",
            value: stats.currentShifts.toString(),
            subtitle: "ca đang thực hiện",
            icon: Activity,
            color: "text-green-600"
        },
        {
            title: "Giờ Làm Tuần Này",
            value: `${stats.weeklyHours}h`,
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

    const formatTime = (timeString: string) => {
        try {
            const time = new Date(`2000-01-01T${timeString}`);
            return time.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return timeString;
        }
    };

    const getShiftStatus = (shift: any) => {
        const now = new Date();
        const fromTime = new Date(shift.fromTime);
        const toTime = new Date(shift.toTime);

        if (now < fromTime) {
            return { label: "Sắp tới", color: "bg-blue-100 text-blue-800" };
        } else if (now >= fromTime && now <= toTime) {
            return { label: "Đang diễn ra", color: "bg-green-100 text-green-800" };
        } else {
            return { label: "Đã kết thúc", color: "bg-gray-100 text-gray-800" };
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
                                <Button onClick={() => handleCardClick('/doctor/appointments')}>
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
                                        <div className="text-2xl font-bold text-gray-900 mb-1">
                                            {stat.value}
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2">
                                            {stat.description}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <TrendingUp className={`h-3 w-3 ${isPositive ? "text-green-600" : "text-red-600"}`} />
                                            <span className={`text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"
                                                }`}>
                                                {stat.change}
                                            </span>
                                            <span className="text-xs text-gray-500 ml-1">
                                                so với tuần trước
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Today's Appointments */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Lịch Hẹn Hôm Nay</CardTitle>
                                    <CardDescription>
                                        Danh sách bệnh nhân cần khám hôm nay
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCardClick('/doctor/appointments')}
                                >
                                    Xem tất cả
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {todayAppointments.length > 0 ? (
                                        todayAppointments.slice(0, 5).map((appointment) => (
                                            <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 rounded-full">
                                                        <User className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {`${appointment.patient.firstname} ${appointment.patient.lastname}`}
                                                        </p>
                                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{formatTime(appointment.bookingTime.medicalRoomTime.fromTime)} - {formatTime(appointment.bookingTime.medicalRoomTime.toTime)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                            <MapPin className="h-3 w-3" />
                                                            <span>{appointment.medicalRoom.name}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    {getAppointmentStatusBadge(appointment.status)}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p>Không có lịch hẹn nào hôm nay</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Current Shifts */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Ca Làm Việc Hiện Tại</CardTitle>
                                    <CardDescription>
                                        Thông tin ca làm việc của bạn
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCardClick('/doctor/shifts')}
                                >
                                    Xem lịch trình
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {currentShifts.length > 0 ? (
                                        currentShifts.map((shift) => {
                                            const status = getShiftStatus(shift);
                                            return (
                                                <div key={shift.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-green-100 rounded-full">
                                                            <Stethoscope className="h-4 w-4 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {shift.room?.name || "Phòng không xác định"}
                                                            </p>
                                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                                <Clock className="h-3 w-3" />
                                                                <span>
                                                                    {formatTime(new Date(shift.fromTime).toTimeString().slice(0, 5))} - {formatTime(new Date(shift.toTime).toTimeString().slice(0, 5))}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                <MapPin className="h-3 w-3" />
                                                                <span>{shift.room?.department?.name || "Khoa không xác định"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Badge className={status.color}>
                                                        {status.label}
                                                    </Badge>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p>Không có ca làm việc nào hôm nay</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Patients */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Bệnh Nhân Gần Đây</CardTitle>
                                <CardDescription>
                                    Những bệnh nhân bạn đã khám gần đây
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCardClick('/doctor/patients')}
                            >
                                Xem tất cả
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {recentPatients.length > 0 ? (
                                    recentPatients.slice(0, 6).map((patient) => (
                                        <div key={patient.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                            <div className="p-2 bg-blue-100 rounded-full">
                                                <User className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">
                                                    {`${patient.firstname} ${patient.lastname}`}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {patient.phoneNumber || "Chưa có SĐT"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {patient.address || "Chưa có địa chỉ"}
                                                </p>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                                <FileText className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-8 text-gray-500">
                                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                        <p>Chưa có bệnh nhân nào được khám</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
