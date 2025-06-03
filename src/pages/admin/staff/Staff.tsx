"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar/Sidebar"
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
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { Staff } from "@/utils/types"
import { mockStaffs } from "@/utils/fake-data"
import { useNavigate } from "@tanstack/react-router"

export default function StaffManagement() {
    const [userRole, setUserRole] = useState<"admin" | "receptionist" | null>(null)
    const [staff, setStaff] = useState<Staff[]>(mockStaffs)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
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

    const handleAddStaff = () => {
        setEditingStaff(null)
        setIsDialogOpen(true)
    }

    const handleEditStaff = (staffMember: Staff) => {
        setEditingStaff(staffMember)
        setIsDialogOpen(true)
    }

    const handleDeleteStaff = (id: string) => {
        setStaff(staff.filter((s) => s.id !== id))
    }

    const filteredStaff = staff.filter(
        (s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.role.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (!userRole) return null

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole={userRole} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
                        <p className="text-gray-600">Manage hospital staff members</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Staff Members</CardTitle>
                                    <CardDescription>View and manage all staff members</CardDescription>
                                </div>
                                <Button onClick={handleAddStaff}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Staff
                                </Button>
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search staff..."
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
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStaff.map((staffMember) => (
                                        <TableRow key={staffMember.id}>
                                            <TableCell className="font-medium">{staffMember.name}</TableCell>
                                            <TableCell>{staffMember.email}</TableCell>
                                            <TableCell>{staffMember.role}</TableCell>
                                            <TableCell>{staffMember.department}</TableCell>
                                            <TableCell>{staffMember.phone}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${staffMember.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {staffMember.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditStaff(staffMember)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteStaff(staffMember.id)}>
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
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingStaff ? "Edit Staff Member" : "Add New Staff Member"}</DialogTitle>
                                <DialogDescription>
                                    {editingStaff ? "Update staff member information" : "Enter the details for the new staff member"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" defaultValue={editingStaff?.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" defaultValue={editingStaff?.email} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select defaultValue={editingStaff?.role}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Doctor">Doctor</SelectItem>
                                            <SelectItem value="Nurse">Nurse</SelectItem>
                                            <SelectItem value="Receptionist">Receptionist</SelectItem>
                                            <SelectItem value="Technician">Technician</SelectItem>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Select defaultValue={editingStaff?.department}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Cardiology">Cardiology</SelectItem>
                                            <SelectItem value="Emergency">Emergency</SelectItem>
                                            <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                            <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                                            <SelectItem value="Front Desk">Front Desk</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" defaultValue={editingStaff?.phone} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                                    {editingStaff ? "Update" : "Add"} Staff Member
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </main>
            </div>
        </div>
    )
}
