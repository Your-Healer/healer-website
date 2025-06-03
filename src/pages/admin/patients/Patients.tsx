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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Search, Eye } from "lucide-react"
import { Patient } from "@/utils/types"
import { useNavigate } from "@tanstack/react-router"
import { mockPatients } from "@/utils/fake-data"

export default function PatientManagement() {
    const [userRole, setUserRole] = useState<"admin" | "receptionist" | null>(null)
    const [patients, setPatients] = useState<Patient[]>(
        mockPatients
    )
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
    const [viewingPatient, setViewingPatient] = useState<Patient | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const role = localStorage.getItem("userRole") as "admin" | "receptionist"
        if (!role) {
            navigate({ to: "/" })
            return
        }
        setUserRole(role)
    }, [navigate])

    const handleAddPatient = () => {
        setEditingPatient(null)
        setIsDialogOpen(true)
    }

    const handleEditPatient = (patient: Patient) => {
        setEditingPatient(patient)
        setIsDialogOpen(true)
    }

    const handleViewPatient = (patient: Patient) => {
        setViewingPatient(patient)
        setIsViewDialogOpen(true)
    }

    const handleDeletePatient = (id: string) => {
        setPatients(patients?.filter((p) => p.id !== id))
    }

    const filteredPatients = patients?.filter(
        (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.phone.includes(searchTerm),
    )

    if (!userRole) return null

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole={userRole} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
                        <p className="text-gray-600">Manage patient records and information</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Patients</CardTitle>
                                    <CardDescription>View and manage patient records</CardDescription>
                                </div>
                                <Button onClick={handleAddPatient}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Patient
                                </Button>
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search patients..."
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
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Date of Birth</TableHead>
                                        <TableHead>Gender</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPatients.map((patient) => (
                                        <TableRow key={patient.id}>
                                            <TableCell className="font-medium">{patient.name}</TableCell>
                                            <TableCell>{patient.email}</TableCell>
                                            <TableCell>{patient.phone}</TableCell>
                                            <TableCell>{patient.dateOfBirth}</TableCell>
                                            <TableCell>{patient.gender}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${patient.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {patient.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleViewPatient(patient)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditPatient(patient)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeletePatient(patient.id)}>
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

                    {/* Add/Edit Patient Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>{editingPatient ? "Edit Patient" : "Add New Patient"}</DialogTitle>
                                <DialogDescription>
                                    {editingPatient ? "Update patient information" : "Enter the details for the new patient"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" defaultValue={editingPatient?.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" defaultValue={editingPatient?.email} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" defaultValue={editingPatient?.phone} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="dob">Date of Birth</Label>
                                        <Input id="dob" type="date" defaultValue={editingPatient?.dateOfBirth} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select defaultValue={editingPatient?.gender}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Textarea id="address" defaultValue={editingPatient?.address} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="emergency">Emergency Contact</Label>
                                    <Input id="emergency" defaultValue={editingPatient?.emergencyContact} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="history">Medical History</Label>
                                    <Textarea id="history" defaultValue={editingPatient?.medicalHistory} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                                    {editingPatient ? "Update" : "Add"} Patient
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* View Patient Dialog */}
                    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Patient Details</DialogTitle>
                                <DialogDescription>Complete patient information</DialogDescription>
                            </DialogHeader>
                            {viewingPatient && (
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="font-semibold">Name</Label>
                                            <p>{viewingPatient.name}</p>
                                        </div>
                                        <div>
                                            <Label className="font-semibold">Email</Label>
                                            <p>{viewingPatient.email}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="font-semibold">Phone</Label>
                                            <p>{viewingPatient.phone}</p>
                                        </div>
                                        <div>
                                            <Label className="font-semibold">Date of Birth</Label>
                                            <p>{viewingPatient.dateOfBirth}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Gender</Label>
                                        <p>{viewingPatient.gender}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Address</Label>
                                        <p>{viewingPatient.address}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Emergency Contact</Label>
                                        <p>{viewingPatient.emergencyContact}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Medical History</Label>
                                        <p>{viewingPatient.medicalHistory}</p>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </main>
            </div>
        </div>
    )
}
