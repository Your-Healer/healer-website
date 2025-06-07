"use client"

import { Sidebar } from "@/components/layout/Sidebar/Sidebar"
import { Header } from "@/components/layout/Header/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Calendar, Clock, Plus, Phone, Mail } from "lucide-react"
import { useSession, withAuth } from "@/contexts/SessionProvider"
import { useNavigate } from "@tanstack/react-router"

function StaffDashboard() {
    const { user } = useSession()
    const navigate = useNavigate()

    const todayStats = [
        { title: "Today's Appointments", value: "24", icon: Calendar, change: "+3 from yesterday" },
        { title: "Patients Checked In", value: "18", icon: UserCheck, change: "6 pending" },
        { title: "Average Wait Time", value: "15 min", icon: Clock, change: "2 min faster" },
    ]

    const upcomingAppointments = [
        {
            time: "09:00 AM",
            patient: "John Doe",
            doctor: "Dr. Smith",
            type: "Consultation",
            status: "confirmed",
        },
        {
            time: "09:30 AM",
            patient: "Jane Wilson",
            doctor: "Dr. Johnson",
            type: "Follow-up",
            status: "pending",
        },
        {
            time: "10:00 AM",
            patient: "Mike Brown",
            doctor: "Dr. Davis",
            type: "Treatment",
            status: "confirmed",
        },
        {
            time: "10:30 AM",
            patient: "Sarah Lee",
            doctor: "Dr. Wilson",
            type: "Consultation",
            status: "pending",
        },
    ]

    const quickActions = [
        {
            title: "Register New Patient",
            description: "Add a new patient to the system",
            action: () => navigate({ to: "/staff/patients" }),
            icon: UserCheck,
        },
        {
            title: "Schedule Appointment",
            description: "Book a new appointment",
            action: () => console.log("Schedule appointment"),
            icon: Calendar,
        },
        {
            title: "Patient Check-in",
            description: "Check in arriving patients",
            action: () => console.log("Patient check-in"),
            icon: Clock,
        },
    ]

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole="2" />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">{`Welcome back, ${user?.firstname} ${user?.lastname}!`}</h1>
                        <p className="text-gray-600">Here's what's happening at the front desk today.</p>
                    </div>

                    {/* Today's Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {todayStats.map((stat) => {
                            const Icon = stat.icon
                            return (
                                <Card key={stat.title}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Common tasks for front desk operations</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {quickActions.map((action, index) => {
                                    const Icon = action.icon
                                    return (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Icon className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{action.title}</p>
                                                    <p className="text-sm text-gray-600">{action.description}</p>
                                                </div>
                                            </div>
                                            <Button size="sm" onClick={action.action}>
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>

                        {/* Upcoming Appointments */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Appointments</CardTitle>
                                <CardDescription>Next appointments for today</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {upcomingAppointments.map((appointment, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="text-center min-w-[60px]">
                                                    <div className="text-sm font-medium">{appointment.time}</div>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{appointment.patient}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {appointment.doctor} • {appointment.type}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                                                {appointment.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Emergency Contacts */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Emergency Contacts</CardTitle>
                            <CardDescription>Important contact information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                                    <Phone className="h-4 w-4 text-red-600" />
                                    <div>
                                        <p className="font-medium text-red-800">Emergency Services</p>
                                        <p className="text-sm text-red-600">911</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                    <Phone className="h-4 w-4 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-blue-800">Hospital Main</p>
                                        <p className="text-sm text-blue-600">(555) 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                    <Mail className="h-4 w-4 text-green-600" />
                                    <div>
                                        <p className="font-medium text-green-800">IT Support</p>
                                        <p className="text-sm text-green-600">support@hospital.com</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
}

export default withAuth(StaffDashboard, "2")
