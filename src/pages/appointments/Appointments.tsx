"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar/Sidebar"
import { useNavigate } from "@tanstack/react-router"
import { Header } from "@/components/layout/Header/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { Appointment } from "@/utils/types"
import { mockAppointments } from "@/utils/fake-data"

export default function AppointmentManagement() {
    const [userRole, setUserRole] = useState<"admin" | "receptionist" | null>(null)
    const [appointments, setAppointments] = useState<Appointment[]>(
        mockAppointments
    )
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const role = localStorage.getItem("userRole") as "admin" | "receptionist"
        if (!role || role !== "admin") {
            navigate({ to: "/" })
            return
        }
        setUserRole(role)
    }, [navigate])

    const handleAddAppointment = () => {
        setEditingAppointment(null)
        setIsDialogOpen(true)
    }

    const handleEditAppointment = (appointment: Appointment) => {
        setEditingAppointment(appointment)
        setIsDialogOpen(true)
    }

    const handleDeleteAppointment = (id: string) => {
        setAppointments(appointments?.filter((a) => a.id !== id))
    }

    const filteredAppointments = appointments?.filter(
        (a) =>
            a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.department.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (!userRole) return null

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole={userRole} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
                        <p className="text-gray-600">Manage patient appointments and scheduling</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Appointments</CardTitle>
                                    <CardDescription>View and manage all appointments</CardDescription>
                                </div>
                                <Button onClick={handleAddAppointment}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Schedule Appointment
                                </Button>
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search appointments..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Doctor</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Service</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAppointments?.map((appointment) => (
                                        <TableRow key={appointment.id}>
                                            <TableCell className="font-medium">{appointment.patientName}</TableCell>
                                            <TableCell>{appointment.doctorName}</TableCell>
                                            <TableCell>{appointment.department}</TableCell>
                                            <TableCell>{appointment.service}</TableCell>
                                            <TableCell>{appointment.date}</TableCell>
                                            <TableCell>{appointment.time}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${appointment.status === "Confirmed"
                                                        ? "bg-green-100 text-green-800"
                                                        : appointment.status === "Pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {appointment.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditAppointment(appointment)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteAppointment(appointment.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>{editingAppointment ? "Edit Appointment" : "Schedule New Appointment"}</DialogTitle>
                                <DialogDescription>
                                    {editingAppointment ? "Update appointment details" : "Enter the details for the new appointment"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="patient">Patient</Label>
                                        <Select defaultValue={editingAppointment?.patientName}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select patient" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Alice Johnson">Alice Johnson</SelectItem>
                                                <SelectItem value="Bob Smith">Bob Smith</SelectItem>
                                                <SelectItem value="Carol Davis">Carol Davis</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="doctor">Doctor</Label>
                                        <Select defaultValue={editingAppointment?.doctorName}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select doctor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Dr. John Smith">Dr. John Smith</SelectItem>
                                                <SelectItem value="Dr. Sarah Wilson">Dr. Sarah Wilson</SelectItem>
                                                <SelectItem value="Dr. Mike Johnson">Dr. Mike Johnson</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="department">Department</Label>
                                        <Select defaultValue={editingAppointment?.department}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Cardiology">Cardiology</SelectItem>
                                                <SelectItem value="Emergency">Emergency</SelectItem>
                                                <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                                <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="service">Service</Label>
                                        <Select defaultValue={editingAppointment?.service}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select service" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Consultation">Consultation</SelectItem>
                                                <SelectItem value="Emergency Care">Emergency Care</SelectItem>
                                                <SelectItem value="Surgery">Surgery</SelectItem>
                                                <SelectItem value="Follow-up">Follow-up</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input id="date" type="date" defaultValue={editingAppointment?.date} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="time">Time</Label>
                                        <Input id="time" type="time" defaultValue={editingAppointment?.time} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select defaultValue={editingAppointment?.status}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea id="notes" defaultValue={editingAppointment?.notes} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                                    {editingAppointment ? "Update" : "Schedule"} Appointment
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </main>
            </div>
        </div>
    )
}
