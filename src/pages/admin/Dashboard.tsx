import { Sidebar } from "@/components/layout/Sidebar/Sidebar"
import { Header } from "@/components/layout/Header/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Calendar, Building2, Stethoscope, Clock, Activity } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { useSession, withAuth } from "@/contexts/SessionProvider"

function AdminDashboard() {
    const { user } = useSession()
    const navigate = useNavigate()

    const handleCardClick = (href: string) => {
        try {
            navigate({ to: href })
        } catch (error) {
            console.error('Navigation error:', error)
        }
    }

    const stats = [
        { title: "Total Patients", value: "1,234", icon: UserCheck, change: "+12%", href: "/admin/patients" },
        { title: "Staff Members", value: "56", icon: Users, change: "+3%", href: "/admin/staff" },
        { title: "Appointments Today", value: "89", icon: Calendar, change: "+8%", href: "/admin/appointments" },
        { title: "Departments", value: "12", icon: Building2, change: "0%", href: "/admin/departments" },
        { title: "Medical Services", value: "45", icon: Stethoscope, change: "+5%", href: "/admin/services" },
        { title: "Monthly Revenue", value: "$39,800", icon: Clock, change: "+15%", href: "/admin/analytics" },
    ]

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole="admin" />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
                        <p className="text-gray-600">Here's what's happening at your medical facility today.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {stats.map((stat) => {
                            const Icon = stat.icon
                            return (
                                <Card
                                    key={stat.title}
                                    className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => handleCardClick(stat.href)}
                                >
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <p className="text-xs text-muted-foreground">
                                            <span className={stat.change.startsWith("+") ? "text-green-600" : "text-gray-600"}>
                                                {stat.change}
                                            </span>{" "}
                                            from last month
                                        </p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Appointments</CardTitle>
                                <CardDescription>Latest appointment bookings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { patient: "John Doe", doctor: "Dr. Smith", time: "10:00 AM", status: "Confirmed" },
                                        { patient: "Jane Wilson", doctor: "Dr. Johnson", time: "11:30 AM", status: "Pending" },
                                        { patient: "Mike Brown", doctor: "Dr. Davis", time: "2:00 PM", status: "Confirmed" },
                                    ].map((appointment, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">{appointment.patient}</p>
                                                <p className="text-sm text-gray-600">
                                                    {appointment.doctor} - {appointment.time}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${appointment.status === "Confirmed"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {appointment.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>System Activity</CardTitle>
                                <CardDescription>Recent system activities</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { action: "New patient registered", user: "Receptionist", time: "5 min ago" },
                                        { action: "Appointment scheduled", user: "Dr. Smith", time: "15 min ago" },
                                        { action: "Staff shift updated", user: "Admin", time: "1 hour ago" },
                                        { action: "New service added", user: "Admin", time: "2 hours ago" },
                                    ].map((activity, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Activity className="h-4 w-4 text-blue-600" />
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{activity.action}</p>
                                                <p className="text-xs text-gray-600">
                                                    by {activity.user} • {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default withAuth(AdminDashboard, "admin")
