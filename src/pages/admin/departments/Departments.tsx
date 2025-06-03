"use client"

import { useState } from "react"

import { Sidebar } from "@/components/layout/Sidebar/Sidebar"
import { Header } from "@/components/layout/Header/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Department } from "@/utils/types"
import { useNavigate } from "@tanstack/react-router"
import { mockDepartments } from "@/utils/fake-data"
import { useSession } from "@/contexts/SessionProvider"

export default function DepartmentManagement() {
    const { user } = useSession()
    const [departments, setDepartments] = useState<Department[]>(
        mockDepartments
    )
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()

    const handleAddDepartment = () => {
        setEditingDepartment(null)
        setIsDialogOpen(true)
    }

    const handleEditDepartment = (department: Department) => {
        setEditingDepartment(department)
        setIsDialogOpen(true)
    }

    const handleDeleteDepartment = (id: string) => {
        setDepartments(departments?.filter((d) => d.id !== id))
    }

    const filteredDepartments = departments?.filter(
        (d) =>
            d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.headOfDepartment.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole={user?.role || "admin"} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
                        <p className="text-gray-600">Manage medical departments</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Medical Departments</CardTitle>
                                    <CardDescription>View and manage hospital departments</CardDescription>
                                </div>
                                <Button onClick={handleAddDepartment}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Department
                                </Button>
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search departments..."
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
                                        <TableHead>Description</TableHead>
                                        <TableHead>Head of Department</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDepartments?.map((department) => (
                                        <TableRow key={department.id}>
                                            <TableCell className="font-medium">{department.name}</TableCell>
                                            <TableCell>{department.description}</TableCell>
                                            <TableCell>{department.headOfDepartment}</TableCell>
                                            <TableCell>{department.location}</TableCell>
                                            <TableCell>{department.phone}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${department.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {department.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditDepartment(department)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteDepartment(department.id)}>
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
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>{editingDepartment ? "Edit Department" : "Add New Department"}</DialogTitle>
                                <DialogDescription>
                                    {editingDepartment ? "Update department information" : "Enter the details for the new department"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Department Name</Label>
                                    <Input id="name" defaultValue={editingDepartment?.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" defaultValue={editingDepartment?.description} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="head">Head of Department</Label>
                                    <Input id="head" defaultValue={editingDepartment?.headOfDepartment} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input id="location" defaultValue={editingDepartment?.location} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" defaultValue={editingDepartment?.phone} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                                    {editingDepartment ? "Update" : "Add"} Department
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </main>
            </div>
        </div>
    )
}
