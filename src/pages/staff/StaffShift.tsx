"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar/Sidebar"
import { Header } from "@/components/layout/Header/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Clock, User, CalendarIcon, Users } from "lucide-react"
import { useSession } from "@/contexts/SessionProvider"

interface StaffShift {
    id: string
    staffId: string
    staffName: string
    staffRole: string
    department: string
    shiftType: "morning" | "afternoon" | "night" | "full-day"
    startTime: string
    endTime: string
    date: string
    status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show"
    notes?: string
    createdAt?: string
}

export default function StaffShiftsPage() {
    const { user, account } = useSession()
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedShift, setSelectedShift] = useState<StaffShift | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date>()
    const [searchTerm, setSearchTerm] = useState("")
    const [filterDepartment, setFilterDepartment] = useState("all")
    const [filterShiftType, setFilterShiftType] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")

    // Mock staff shifts data
    const [shifts, setShifts] = useState<StaffShift[]>([
        {
            id: "1",
            staffId: "staff001",
            staffName: "Dr. Sarah Johnson",
            staffRole: "Doctor",
            department: "General Medicine",
            shiftType: "morning",
            startTime: "08:00",
            endTime: "16:00",
            date: "2024-01-15",
            status: "confirmed",
            notes: "Regular morning shift",
            createdAt: "2024-01-10",
        },
        {
            id: "2",
            staffId: "staff002",
            staffName: "Nurse Mary Wilson",
            staffRole: "Nurse",
            department: "Emergency",
            shiftType: "night",
            startTime: "20:00",
            endTime: "08:00",
            date: "2024-01-15",
            status: "scheduled",
            notes: "Night shift coverage",
            createdAt: "2024-01-10",
        },
        {
            id: "3",
            staffId: "staff003",
            staffName: "Dr. Mike Chen",
            staffRole: "Doctor",
            department: "Surgery",
            shiftType: "afternoon",
            startTime: "12:00",
            endTime: "20:00",
            date: "2024-01-15",
            status: "completed",
            notes: "Surgery department coverage",
            createdAt: "2024-01-10",
        },
        {
            id: "4",
            staffId: "staff004",
            staffName: "Technician John Doe",
            staffRole: "Technician",
            department: "Laboratory",
            shiftType: "full-day",
            startTime: "08:00",
            endTime: "17:00",
            date: "2024-01-16",
            status: "scheduled",
            notes: "Lab operations",
            createdAt: "2024-01-10",
        },
    ])

    const [newShift, setNewShift] = useState<Partial<StaffShift>>({
        staffId: "",
        staffName: "",
        staffRole: "",
        department: "",
        shiftType: "morning",
        startTime: "08:00",
        endTime: "16:00",
        date: "",
        status: "scheduled",
        notes: "",
    })

    const filteredShifts = shifts.filter((shift) => {
        const matchesSearch =
            shift.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shift.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shift.staffRole.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesDepartment = filterDepartment === "all" || shift.department === filterDepartment
        const matchesShiftType = filterShiftType === "all" || shift.shiftType === filterShiftType
        const matchesStatus = filterStatus === "all" || shift.status === filterStatus

        return matchesSearch && matchesDepartment && matchesShiftType && matchesStatus
    })

    const getShiftTypeColor = (type: string) => {
        switch (type) {
            case "morning":
                return "bg-yellow-100 text-yellow-800"
            case "afternoon":
                return "bg-orange-100 text-orange-800"
            case "night":
                return "bg-blue-100 text-blue-800"
            case "full-day":
                return "bg-purple-100 text-purple-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "scheduled":
                return "bg-blue-100 text-blue-800"
            case "confirmed":
                return "bg-green-100 text-green-800"
            case "completed":
                return "bg-gray-100 text-gray-800"
            case "cancelled":
                return "bg-red-100 text-red-800"
            case "no-show":
                return "bg-orange-100 text-orange-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const handleAddShift = () => {
        const shift: StaffShift = {
            id: Date.now().toString(),
            staffId: newShift.staffId || "",
            staffName: newShift.staffName || "",
            staffRole: newShift.staffRole || "",
            department: newShift.department || "",
            shiftType: newShift.shiftType || "morning",
            startTime: newShift.startTime || "08:00",
            endTime: newShift.endTime || "16:00",
            date: newShift.date || "",
            status: newShift.status || "scheduled",
            notes: newShift.notes || "",
            createdAt: new Date().toISOString().split("T")[0],
        }
        setShifts([...shifts, shift])
        setNewShift({
            staffId: "",
            staffName: "",
            staffRole: "",
            department: "",
            shiftType: "morning",
            startTime: "08:00",
            endTime: "16:00",
            date: "",
            status: "scheduled",
            notes: "",
        })
        setIsAddDialogOpen(false)
    }

    const handleEditShift = (shift: StaffShift) => {
        setSelectedShift(shift)
        setIsEditDialogOpen(true)
    }

    const handleDeleteShift = (shiftId: string) => {
        setShifts(shifts.filter((shift) => shift.id !== shiftId))
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole={account?.role?.id} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Staff Shifts Management</h1>
                                <p className="text-gray-600">Schedule and manage staff work shifts</p>
                            </div>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Schedule Shift
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Schedule New Shift</DialogTitle>
                                        <DialogDescription>Enter the shift details and staff assignment</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="staff">Staff Member</Label>
                                            <Select
                                                value={newShift.staffId}
                                                onValueChange={(value) => {
                                                    const staffData = {
                                                        staff001: { name: "Dr. Sarah Johnson", role: "Doctor", department: "General Medicine" },
                                                        staff002: { name: "Nurse Mary Wilson", role: "Nurse", department: "Emergency" },
                                                        staff003: { name: "Dr. Mike Chen", role: "Doctor", department: "Surgery" },
                                                        staff004: { name: "Technician John Doe", role: "Technician", department: "Laboratory" },
                                                    }
                                                    const selected = staffData[value as keyof typeof staffData]
                                                    setNewShift({
                                                        ...newShift,
                                                        staffId: value,
                                                        staffName: selected?.name || "",
                                                        staffRole: selected?.role || "",
                                                        department: selected?.department || "",
                                                    })
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select staff member" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="staff001">Dr. Sarah Johnson - Doctor</SelectItem>
                                                    <SelectItem value="staff002">Nurse Mary Wilson - Nurse</SelectItem>
                                                    <SelectItem value="staff003">Dr. Mike Chen - Doctor</SelectItem>
                                                    <SelectItem value="staff004">Technician John Doe - Technician</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="department">Department</Label>
                                            <Input
                                                id="department"
                                                value={newShift.department}
                                                onChange={(e) => setNewShift({ ...newShift, department: e.target.value })}
                                                placeholder="Department"
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="shiftType">Shift Type</Label>
                                            <Select
                                                value={newShift.shiftType}
                                                onValueChange={(value) => {
                                                    const times = {
                                                        morning: { start: "08:00", end: "16:00" },
                                                        afternoon: { start: "12:00", end: "20:00" },
                                                        night: { start: "20:00", end: "08:00" },
                                                        "full-day": { start: "08:00", end: "17:00" },
                                                    }
                                                    const selectedTimes = times[value as keyof typeof times]
                                                    setNewShift({
                                                        ...newShift,
                                                        shiftType: value as any,
                                                        startTime: selectedTimes.start,
                                                        endTime: selectedTimes.end,
                                                    })
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select shift type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="morning">Morning (8:00 - 16:00)</SelectItem>
                                                    <SelectItem value="afternoon">Afternoon (12:00 - 20:00)</SelectItem>
                                                    <SelectItem value="night">Night (20:00 - 08:00)</SelectItem>
                                                    <SelectItem value="full-day">Full Day (8:00 - 17:00)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="date">Date</Label>
                                            <Input
                                                id="date"
                                                type="date"
                                                value={newShift.date}
                                                onChange={(e) => setNewShift({ ...newShift, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="startTime">Start Time</Label>
                                            <Input
                                                id="startTime"
                                                type="time"
                                                value={newShift.startTime}
                                                onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="endTime">End Time</Label>
                                            <Input
                                                id="endTime"
                                                type="time"
                                                value={newShift.endTime}
                                                onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <Select
                                                value={newShift.status}
                                                onValueChange={(value) => setNewShift({ ...newShift, status: value as any })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                                    <SelectItem value="completed">Completed</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="notes">Notes</Label>
                                            <Textarea
                                                id="notes"
                                                value={newShift.notes}
                                                onChange={(e) => setNewShift({ ...newShift, notes: e.target.value })}
                                                placeholder="Shift notes and special instructions"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleAddShift}>Schedule Shift</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Shifts</p>
                                        <p className="text-2xl font-bold text-gray-900">{shifts.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Clock className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Today's Shifts</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {shifts.filter((s) => s.date === new Date().toISOString().split("T")[0]).length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <CalendarIcon className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Scheduled</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {shifts.filter((s) => s.status === "scheduled").length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <User className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Active Staff</p>
                                        <p className="text-2xl font-bold text-gray-900">{new Set(shifts.map((s) => s.staffId)).size}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <Label htmlFor="search">Search Shifts</Label>
                                    <Input
                                        id="search"
                                        placeholder="Search by staff name, role, or department..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="w-full sm:w-48">
                                    <Label htmlFor="department-filter">Department</Label>
                                    <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All departments" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Departments</SelectItem>
                                            <SelectItem value="General Medicine">General Medicine</SelectItem>
                                            <SelectItem value="Emergency">Emergency</SelectItem>
                                            <SelectItem value="Surgery">Surgery</SelectItem>
                                            <SelectItem value="Laboratory">Laboratory</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full sm:w-32">
                                    <Label htmlFor="shift-filter">Shift Type</Label>
                                    <Select value={filterShiftType} onValueChange={setFilterShiftType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All shifts" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Shifts</SelectItem>
                                            <SelectItem value="morning">Morning</SelectItem>
                                            <SelectItem value="afternoon">Afternoon</SelectItem>
                                            <SelectItem value="night">Night</SelectItem>
                                            <SelectItem value="full-day">Full Day</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full sm:w-32">
                                    <Label htmlFor="status-filter">Status</Label>
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="scheduled">Scheduled</SelectItem>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shifts Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Staff Shifts ({filteredShifts.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Staff</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Shift Type</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredShifts.map((shift) => (
                                        <TableRow key={shift.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{shift.staffName}</div>
                                                    <div className="text-sm text-gray-500">{shift.staffRole}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{shift.department}</TableCell>
                                            <TableCell>
                                                {new Date(shift.date).toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getShiftTypeColor(shift.shiftType)}>{shift.shiftType.toUpperCase()}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm">
                                                        {shift.startTime} - {shift.endTime}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(shift.status)}>{shift.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => handleEditShift(shift)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:text-red-700"
                                                        onClick={() => handleDeleteShift(shift.id)}
                                                    >
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
                </main>
            </div>
        </div>
    )
}