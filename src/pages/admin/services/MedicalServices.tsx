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
import { Switch } from "@/components/ui/switch"
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
import { Plus, Edit, Trash2, Clock, DollarSign } from "lucide-react"
import { useSession } from "@/contexts/SessionProvider"

interface MedicalService {
    id: string
    name: string
    code: string
    category: "consultation" | "procedure" | "diagnostic" | "therapy" | "surgery" | "emergency"
    department: string
    duration: number // in minutes
    price: number
    description: string
    requirements: string[]
    isActive: boolean
    createdAt?: string
}

export default function MedicalServicesPage() {
    const { user } = useSession()
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedService, setSelectedService] = useState<MedicalService | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategory, setFilterCategory] = useState("all")
    const [filterDepartment, setFilterDepartment] = useState("all")

    // Mock medical services data
    const [services, setServices] = useState<MedicalService[]>([
        {
            id: "1",
            name: "General Consultation",
            code: "CONS001",
            category: "consultation",
            department: "General Medicine",
            duration: 30,
            price: 150,
            description: "General medical consultation and examination",
            requirements: ["Patient ID", "Insurance Card"],
            isActive: true,
            createdAt: "2024-01-01",
        },
        {
            id: "2",
            name: "Blood Test - Complete Blood Count",
            code: "LAB001",
            category: "diagnostic",
            department: "Laboratory",
            duration: 15,
            price: 75,
            description: "Complete blood count analysis",
            requirements: ["Fasting 8-12 hours", "Patient ID"],
            isActive: true,
            createdAt: "2024-01-01",
        },
        {
            id: "3",
            name: "X-Ray Chest",
            code: "RAD001",
            category: "diagnostic",
            department: "Radiology",
            duration: 20,
            price: 120,
            description: "Chest X-ray examination",
            requirements: ["Remove metal objects", "Patient ID"],
            isActive: true,
            createdAt: "2024-01-01",
        },
        {
            id: "4",
            name: "Physical Therapy Session",
            code: "THER001",
            category: "therapy",
            department: "Physiotherapy",
            duration: 60,
            price: 200,
            description: "Individual physical therapy session",
            requirements: ["Doctor's referral", "Comfortable clothing"],
            isActive: true,
            createdAt: "2024-01-01",
        },
        {
            id: "5",
            name: "Minor Surgery - Wound Suturing",
            code: "SURG001",
            category: "surgery",
            department: "Surgery",
            duration: 45,
            price: 500,
            description: "Minor surgical procedure for wound closure",
            requirements: ["Consent form", "Pre-operative assessment"],
            isActive: true,
            createdAt: "2024-01-01",
        },
    ])

    const [newService, setNewService] = useState<Partial<MedicalService>>({
        name: "",
        code: "",
        category: "consultation",
        department: "",
        duration: 30,
        price: 0,
        description: "",
        requirements: [],
        isActive: true,
    })

    const filteredServices = services.filter((service) => {
        const matchesSearch =
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.department.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = filterCategory === "all" || service.category === filterCategory
        const matchesDepartment = filterDepartment === "all" || service.department === filterDepartment

        return matchesSearch && matchesCategory && matchesDepartment
    })

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "consultation":
                return "bg-blue-100 text-blue-800"
            case "procedure":
                return "bg-purple-100 text-purple-800"
            case "diagnostic":
                return "bg-green-100 text-green-800"
            case "therapy":
                return "bg-orange-100 text-orange-800"
            case "surgery":
                return "bg-red-100 text-red-800"
            case "emergency":
                return "bg-yellow-100 text-yellow-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const handleAddService = () => {
        const service: MedicalService = {
            id: Date.now().toString(),
            name: newService.name || "",
            code: newService.code || "",
            category: newService.category || "consultation",
            department: newService.department || "",
            duration: newService.duration || 30,
            price: newService.price || 0,
            description: newService.description || "",
            requirements: newService.requirements || [],
            isActive: newService.isActive ?? true,
            createdAt: new Date().toISOString().split("T")[0],
        }
        setServices([...services, service])
        setNewService({
            name: "",
            code: "",
            category: "consultation",
            department: "",
            duration: 30,
            price: 0,
            description: "",
            requirements: [],
            isActive: true,
        })
        setIsAddDialogOpen(false)
    }

    const handleEditService = (service: MedicalService) => {
        setSelectedService(service)
        setIsEditDialogOpen(true)
    }

    const handleDeleteService = (serviceId: string) => {
        setServices(services.filter((service) => service.id !== serviceId))
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole={user?.role || "admin"} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Medical Services Management</h1>
                                <p className="text-gray-600">Manage hospital services, procedures, and pricing</p>
                            </div>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Service
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Add New Medical Service</DialogTitle>
                                        <DialogDescription>Enter the service details and pricing information</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="serviceName">Service Name</Label>
                                            <Input
                                                id="serviceName"
                                                value={newService.name}
                                                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                                placeholder="e.g., General Consultation"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="serviceCode">Service Code</Label>
                                            <Input
                                                id="serviceCode"
                                                value={newService.code}
                                                onChange={(e) => setNewService({ ...newService, code: e.target.value })}
                                                placeholder="e.g., CONS001"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="category">Category</Label>
                                            <Select
                                                value={newService.category}
                                                onValueChange={(value) => setNewService({ ...newService, category: value as any })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="consultation">Consultation</SelectItem>
                                                    <SelectItem value="procedure">Procedure</SelectItem>
                                                    <SelectItem value="diagnostic">Diagnostic</SelectItem>
                                                    <SelectItem value="therapy">Therapy</SelectItem>
                                                    <SelectItem value="surgery">Surgery</SelectItem>
                                                    <SelectItem value="emergency">Emergency</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="department">Department</Label>
                                            <Select
                                                value={newService.department}
                                                onValueChange={(value) => setNewService({ ...newService, department: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select department" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="General Medicine">General Medicine</SelectItem>
                                                    <SelectItem value="Surgery">Surgery</SelectItem>
                                                    <SelectItem value="Laboratory">Laboratory</SelectItem>
                                                    <SelectItem value="Radiology">Radiology</SelectItem>
                                                    <SelectItem value="Physiotherapy">Physiotherapy</SelectItem>
                                                    <SelectItem value="Emergency">Emergency</SelectItem>
                                                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                                                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="duration">Duration (minutes)</Label>
                                            <Input
                                                id="duration"
                                                type="number"
                                                min="5"
                                                value={newService.duration}
                                                onChange={(e) => setNewService({ ...newService, duration: Number.parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Price ($)</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={newService.price}
                                                onChange={(e) => setNewService({ ...newService, price: Number.parseFloat(e.target.value) })}
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                value={newService.description}
                                                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                                placeholder="Service description and details"
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                                            <Input
                                                id="requirements"
                                                value={newService.requirements?.join(", ")}
                                                onChange={(e) =>
                                                    setNewService({ ...newService, requirements: e.target.value.split(", ").filter(Boolean) })
                                                }
                                                placeholder="e.g., Patient ID, Insurance Card, Fasting required"
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="active"
                                                checked={newService.isActive}
                                                onCheckedChange={(checked) => setNewService({ ...newService, isActive: checked })}
                                            />
                                            <Label htmlFor="active">Active Service</Label>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleAddService}>Add Service</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <Label htmlFor="search">Search Services</Label>
                                    <Input
                                        id="search"
                                        placeholder="Search by name, code, or department..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="w-full sm:w-48">
                                    <Label htmlFor="category-filter">Filter by Category</Label>
                                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All categories" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            <SelectItem value="consultation">Consultation</SelectItem>
                                            <SelectItem value="procedure">Procedure</SelectItem>
                                            <SelectItem value="diagnostic">Diagnostic</SelectItem>
                                            <SelectItem value="therapy">Therapy</SelectItem>
                                            <SelectItem value="surgery">Surgery</SelectItem>
                                            <SelectItem value="emergency">Emergency</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full sm:w-48">
                                    <Label htmlFor="department-filter">Filter by Department</Label>
                                    <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All departments" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Departments</SelectItem>
                                            <SelectItem value="General Medicine">General Medicine</SelectItem>
                                            <SelectItem value="Surgery">Surgery</SelectItem>
                                            <SelectItem value="Laboratory">Laboratory</SelectItem>
                                            <SelectItem value="Radiology">Radiology</SelectItem>
                                            <SelectItem value="Physiotherapy">Physiotherapy</SelectItem>
                                            <SelectItem value="Emergency">Emergency</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Services Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Medical Services ({filteredServices.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Service</TableHead>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredServices.map((service) => (
                                        <TableRow key={service.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{service.name}</div>
                                                    <div className="text-sm text-gray-500">{service.description}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">{service.code}</TableCell>
                                            <TableCell>
                                                <Badge className={getCategoryColor(service.category)}>{service.category.toUpperCase()}</Badge>
                                            </TableCell>
                                            <TableCell>{service.department}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4 text-gray-400" />
                                                    <span>{service.duration} min</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                                    <span>${service.price}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={service.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                                    {service.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => handleEditService(service)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:text-red-700"
                                                        onClick={() => handleDeleteService(service.id)}
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