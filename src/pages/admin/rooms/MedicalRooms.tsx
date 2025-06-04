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
import { Plus, Edit, Trash2, MapPin, Bed, Wifi, Monitor, Heart } from "lucide-react"
import { useSession } from "@/contexts/SessionProvider"

interface MedicalRoom {
    id: string
    roomNumber: string
    roomType: "general" | "icu" | "surgery" | "emergency" | "consultation" | "laboratory"
    floor: number
    capacity: number
    isAvailable: boolean
    equipment: string[]
    description?: string
    lastMaintenance?: string
    assignedDepartment: string
}

export default function MedicalRoomsPage() {
    const { user } = useSession()
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedRoom, setSelectedRoom] = useState<MedicalRoom | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [filterFloor, setFilterFloor] = useState("all")

    // Mock medical rooms data
    const [rooms, setRooms] = useState<MedicalRoom[]>([
        {
            id: "1",
            roomNumber: "101",
            roomType: "general",
            floor: 1,
            capacity: 2,
            isAvailable: true,
            equipment: ["Bed", "Monitor", "Oxygen"],
            description: "General ward room with basic amenities",
            lastMaintenance: "2024-01-10",
            assignedDepartment: "General Medicine",
        },
        {
            id: "2",
            roomNumber: "201",
            roomType: "icu",
            floor: 2,
            capacity: 1,
            isAvailable: false,
            equipment: ["ICU Bed", "Ventilator", "Heart Monitor", "Defibrillator"],
            description: "Intensive Care Unit with advanced life support",
            lastMaintenance: "2024-01-08",
            assignedDepartment: "Critical Care",
        },
        {
            id: "3",
            roomNumber: "301",
            roomType: "surgery",
            floor: 3,
            capacity: 1,
            isAvailable: true,
            equipment: ["Operating Table", "Anesthesia Machine", "Surgical Lights", "Monitors"],
            description: "Main operating theater",
            lastMaintenance: "2024-01-12",
            assignedDepartment: "Surgery",
        },
        {
            id: "4",
            roomNumber: "102",
            roomType: "consultation",
            floor: 1,
            capacity: 3,
            isAvailable: true,
            equipment: ["Examination Table", "Computer", "Basic Medical Tools"],
            description: "Doctor consultation room",
            lastMaintenance: "2024-01-05",
            assignedDepartment: "Outpatient",
        },
    ])

    const [newRoom, setNewRoom] = useState<Partial<MedicalRoom>>({
        roomNumber: "",
        roomType: "general",
        floor: 1,
        capacity: 1,
        isAvailable: true,
        equipment: [],
        description: "",
        assignedDepartment: "",
    })

    const filteredRooms = rooms.filter((room) => {
        const matchesSearch =
            room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.assignedDepartment.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = filterType === "all" || room.roomType === filterType
        const matchesFloor = filterFloor === "all" || room.floor.toString() === filterFloor

        return matchesSearch && matchesType && matchesFloor
    })

    const getRoomTypeColor = (type: string) => {
        switch (type) {
            case "general":
                return "bg-blue-100 text-blue-800"
            case "icu":
                return "bg-red-100 text-red-800"
            case "surgery":
                return "bg-purple-100 text-purple-800"
            case "emergency":
                return "bg-orange-100 text-orange-800"
            case "consultation":
                return "bg-green-100 text-green-800"
            case "laboratory":
                return "bg-yellow-100 text-yellow-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getEquipmentIcon = (equipment: string) => {
        if (equipment.toLowerCase().includes("bed")) return <Bed className="h-4 w-4" />
        if (equipment.toLowerCase().includes("monitor")) return <Monitor className="h-4 w-4" />
        if (equipment.toLowerCase().includes("heart")) return <Heart className="h-4 w-4" />
        if (equipment.toLowerCase().includes("wifi")) return <Wifi className="h-4 w-4" />
        return <MapPin className="h-4 w-4" />
    }

    const handleAddRoom = () => {
        const room: MedicalRoom = {
            id: Date.now().toString(),
            roomNumber: newRoom.roomNumber || "",
            roomType: newRoom.roomType || "general",
            floor: newRoom.floor || 1,
            capacity: newRoom.capacity || 1,
            isAvailable: newRoom.isAvailable ?? true,
            equipment: newRoom.equipment || [],
            description: newRoom.description || "",
            lastMaintenance: new Date().toISOString().split("T")[0],
            assignedDepartment: newRoom.assignedDepartment || "",
        }
        setRooms([...rooms, room])
        setNewRoom({
            roomNumber: "",
            roomType: "general",
            floor: 1,
            capacity: 1,
            isAvailable: true,
            equipment: [],
            description: "",
            assignedDepartment: "",
        })
        setIsAddDialogOpen(false)
    }

    const handleEditRoom = (room: MedicalRoom) => {
        setSelectedRoom(room)
        setIsEditDialogOpen(true)
    }

    const handleDeleteRoom = (roomId: string) => {
        setRooms(rooms.filter((room) => room.id !== roomId))
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
                                <h1 className="text-2xl font-bold text-gray-900">Medical Rooms Management</h1>
                                <p className="text-gray-600">Manage hospital rooms, equipment, and availability</p>
                            </div>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Room
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Add New Medical Room</DialogTitle>
                                        <DialogDescription>Enter the room details and equipment information</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="roomNumber">Room Number</Label>
                                            <Input
                                                id="roomNumber"
                                                value={newRoom.roomNumber}
                                                onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                                                placeholder="e.g., 101, A-201"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="roomType">Room Type</Label>
                                            <Select
                                                value={newRoom.roomType}
                                                onValueChange={(value) => setNewRoom({ ...newRoom, roomType: value as any })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select room type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="general">General Ward</SelectItem>
                                                    <SelectItem value="icu">ICU</SelectItem>
                                                    <SelectItem value="surgery">Surgery</SelectItem>
                                                    <SelectItem value="emergency">Emergency</SelectItem>
                                                    <SelectItem value="consultation">Consultation</SelectItem>
                                                    <SelectItem value="laboratory">Laboratory</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="floor">Floor</Label>
                                            <Select
                                                value={newRoom.floor?.toString()}
                                                onValueChange={(value) => setNewRoom({ ...newRoom, floor: Number.parseInt(value) })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select floor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">1st Floor</SelectItem>
                                                    <SelectItem value="2">2nd Floor</SelectItem>
                                                    <SelectItem value="3">3rd Floor</SelectItem>
                                                    <SelectItem value="4">4th Floor</SelectItem>
                                                    <SelectItem value="5">5th Floor</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="capacity">Capacity</Label>
                                            <Input
                                                id="capacity"
                                                type="number"
                                                min="1"
                                                value={newRoom.capacity}
                                                onChange={(e) => setNewRoom({ ...newRoom, capacity: Number.parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="department">Assigned Department</Label>
                                            <Select
                                                value={newRoom.assignedDepartment}
                                                onValueChange={(value) => setNewRoom({ ...newRoom, assignedDepartment: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select department" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="General Medicine">General Medicine</SelectItem>
                                                    <SelectItem value="Surgery">Surgery</SelectItem>
                                                    <SelectItem value="Critical Care">Critical Care</SelectItem>
                                                    <SelectItem value="Emergency">Emergency</SelectItem>
                                                    <SelectItem value="Outpatient">Outpatient</SelectItem>
                                                    <SelectItem value="Laboratory">Laboratory</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="available"
                                                checked={newRoom.isAvailable}
                                                onCheckedChange={(checked) => setNewRoom({ ...newRoom, isAvailable: checked })}
                                            />
                                            <Label htmlFor="available">Available</Label>
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="equipment">Equipment (comma-separated)</Label>
                                            <Input
                                                id="equipment"
                                                value={newRoom.equipment?.join(", ")}
                                                onChange={(e) =>
                                                    setNewRoom({ ...newRoom, equipment: e.target.value.split(", ").filter(Boolean) })
                                                }
                                                placeholder="e.g., Bed, Monitor, Oxygen, Ventilator"
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                value={newRoom.description}
                                                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                                                placeholder="Room description and special notes"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleAddRoom}>Add Room</Button>
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
                                    <Label htmlFor="search">Search Rooms</Label>
                                    <Input
                                        id="search"
                                        placeholder="Search by room number or department..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="w-full sm:w-48">
                                    <Label htmlFor="type-filter">Filter by Type</Label>
                                    <Select value={filterType} onValueChange={setFilterType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="general">General Ward</SelectItem>
                                            <SelectItem value="icu">ICU</SelectItem>
                                            <SelectItem value="surgery">Surgery</SelectItem>
                                            <SelectItem value="emergency">Emergency</SelectItem>
                                            <SelectItem value="consultation">Consultation</SelectItem>
                                            <SelectItem value="laboratory">Laboratory</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full sm:w-32">
                                    <Label htmlFor="floor-filter">Filter by Floor</Label>
                                    <Select value={filterFloor} onValueChange={setFilterFloor}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All floors" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Floors</SelectItem>
                                            <SelectItem value="1">1st Floor</SelectItem>
                                            <SelectItem value="2">2nd Floor</SelectItem>
                                            <SelectItem value="3">3rd Floor</SelectItem>
                                            <SelectItem value="4">4th Floor</SelectItem>
                                            <SelectItem value="5">5th Floor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rooms Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Medical Rooms ({filteredRooms.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Room</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Floor</TableHead>
                                        <TableHead>Capacity</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Equipment</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRooms.map((room) => (
                                        <TableRow key={room.id}>
                                            <TableCell className="font-medium">{room.roomNumber}</TableCell>
                                            <TableCell>
                                                <Badge className={getRoomTypeColor(room.roomType)}>{room.roomType.toUpperCase()}</Badge>
                                            </TableCell>
                                            <TableCell>{room.floor}</TableCell>
                                            <TableCell>{room.capacity}</TableCell>
                                            <TableCell>{room.assignedDepartment}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {room.equipment.slice(0, 3).map((eq, index) => (
                                                        <div key={index} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                                                            {getEquipmentIcon(eq)}
                                                            <span>{eq}</span>
                                                        </div>
                                                    ))}
                                                    {room.equipment.length > 3 && (
                                                        <span className="text-xs text-gray-500">+{room.equipment.length - 3} more</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={room.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                                    {room.isAvailable ? "Available" : "Occupied"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => handleEditRoom(room)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:text-red-700"
                                                        onClick={() => handleDeleteRoom(room.id)}
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