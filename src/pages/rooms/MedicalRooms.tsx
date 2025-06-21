"use client"

import { useState } from "react"
import Sidebar from "@/components/layout/Sidebar/Sidebar"
import { Header } from "@/components/layout/Header/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"
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
import { Plus, Edit, Trash2, MapPin, Building, Users, Search, RefreshCw, X } from "lucide-react"
import { useSession } from "@/contexts/SessionProvider"
import { useGetMedicalRooms } from "@/hooks/use-medical"
import { MedicalRoomWithDetails, DepartmentWithDetails, ServiceWithDetails } from "@/models/models"
import { CreateMedicalRoomRequest, UpdateMedicalRoomRequest, GetMedicalRoomRequest } from "@/utils/types"
import api from "@/api/axios"
import { toast } from "sonner"
import { APPOINTMENTSTATUS } from "@/utils/enum"
import { TableLoading } from "@/components/loading"
import { SelectDepartments } from "@/components/select/SelectDepartments"
import { SelectServices } from "@/components/select/SelectServices"
import { useGetDepartments } from "@/hooks/use-departments"
import { useGetServices } from "@/hooks/use-services"

interface MedicalRoomFormData {
    name: string
    departmentId: string
    serviceId: string
    floor: number
}

export default function MedicalRoomsPage() {
    const { user, account } = useSession()

    // Pagination and filters state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterDepartment, setFilterDepartment] = useState("all")
    const [filterService, setFilterService] = useState("all")
    const [filterFloor, setFilterFloor] = useState("all")

    // Dialog states
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedRoom, setSelectedRoom] = useState<MedicalRoomWithDetails | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form data
    const [formData, setFormData] = useState<MedicalRoomFormData>({
        name: "",
        departmentId: "",
        serviceId: "",
        floor: 1,
    })

    // Remove departments state since we'll use the hook
    // const [departments, setDepartments] = useState<DepartmentWithDetails[]>([])

    // Use hooks to get departments and services for filter display
    const { departments } = useGetDepartments({
        page: 1,
        limit: 1000,
    })

    const { services } = useGetServices({
        page: 1,
        limit: 1000,
    })

    // Build API params
    const apiParams: GetMedicalRoomRequest = {
        page: currentPage,
        limit: itemsPerPage,
        searchTerm: searchTerm || undefined,
        departmentId: filterDepartment !== "all" ? filterDepartment : undefined,
        serviceId: filterService !== "all" ? filterService : undefined,
        floor: filterFloor !== "all" ? parseInt(filterFloor) : undefined,
    }

    // Fetch medical rooms
    const { medicalRooms, pagination, loading, refetch } = useGetMedicalRooms(apiParams)

    // Check if filters are active
    const hasActiveFilters = searchTerm || filterDepartment !== "all" || filterService !== "all" || filterFloor !== "all"

    const resetForm = () => {
        setFormData({
            name: "",
            departmentId: "",
            serviceId: "",
            floor: 1,
        })
    }

    const handleAddRoom = async () => {
        if (!formData.name || !formData.departmentId || !formData.serviceId) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
            return
        }

        setIsSubmitting(true)
        try {
            const requestData: CreateMedicalRoomRequest = {
                name: formData.name,
                departmentId: formData.departmentId,
                serviceId: formData.serviceId,
                floor: formData.floor,
            }

            await api.post("/medical/rooms", requestData)

            toast.success("Tạo phòng khám thành công")

            resetForm()
            setIsAddDialogOpen(false)
            refetch()
        } catch (error: any) {
            console.error("Error creating medical room:", error)
            toast.error(error.response?.data?.message || "Không thể tạo phòng khám")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditRoom = (room: MedicalRoomWithDetails) => {
        setSelectedRoom(room)
        setFormData({
            name: room.name,
            departmentId: room.departmentId,
            serviceId: room.serviceId,
            floor: room.floor,
        })
        setIsEditDialogOpen(true)
    }

    const handleUpdateRoom = async () => {
        if (!selectedRoom || !formData.name || !formData.departmentId || !formData.serviceId) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
            return
        }

        setIsSubmitting(true)
        try {
            const requestData: UpdateMedicalRoomRequest = {
                name: formData.name,
                departmentId: formData.departmentId,
                serviceId: formData.serviceId,
                floor: formData.floor,
            }

            await api.put(`/medical/rooms/${selectedRoom.id}`, requestData)

            toast.success("Cập nhật phòng khám thành công")

            resetForm()
            setIsEditDialogOpen(false)
            setSelectedRoom(null)
            refetch()
        } catch (error: any) {
            console.error("Error updating medical room:", error)
            toast.error(error.response?.data?.message || "Không thể cập nhật phòng khám")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteRoom = async (roomId: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa phòng khám này không?")) {
            return
        }

        try {
            await api.delete(`/medical/rooms/${roomId}`)

            toast.success("Xóa phòng khám thành công")

            refetch()
        } catch (error: any) {
            console.error("Error deleting medical room:", error)
            toast.error(error.response?.data?.message || "Không thể xóa phòng khám")
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (itemsPerPage: number) => {
        setItemsPerPage(itemsPerPage)
        setCurrentPage(1)
    }

    const handleSearch = () => {
        setCurrentPage(1)
    }

    const clearAllFilters = () => {
        setSearchTerm("")
        setFilterDepartment("all")
        setFilterService("all")
        setFilterFloor("all")
        setCurrentPage(1)
    }

    const getRoomStatusBadge = (room: MedicalRoomWithDetails) => {
        const hasActiveAppointments = room.appointments?.some(
            (apt) => apt.status === APPOINTMENTSTATUS.BOOKED || apt.status === APPOINTMENTSTATUS.IDLE
        )

        if (hasActiveAppointments) {
            return <Badge className="bg-red-100 text-red-800">Đang sử dụng</Badge>
        }
        return <Badge className="bg-green-100 text-green-800">Trống</Badge>
    }

    // Remove the useEffect for fetching departments/services since hooks handle it

    // Helper functions to get names from IDs
    const getDepartmentName = (departmentId: string) => {
        if (departmentId === "all") return "Tất cả khoa"
        const dept = departments?.find(d => d.id === departmentId)
        return dept?.name || "Không xác định"
    }

    const getServiceName = (serviceId: string) => {
        if (serviceId === "all") return "Tất cả dịch vụ"
        const service = services?.find(s => s.id === serviceId)
        return service?.name || "Không xác định"
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
                                <h1 className="text-2xl font-bold text-gray-900">Quản lý Phòng khám</h1>
                                <p className="text-gray-600">Quản lý các phòng khám và phân công</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={refetch} disabled={loading}>
                                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                                    Làm mới
                                </Button>
                                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Thêm phòng
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Thêm phòng khám mới</DialogTitle>
                                            <DialogDescription>Nhập thông tin chi tiết phòng khám</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Tên phòng *</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="VD: Phòng 101, Phòng mổ A"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="department">Khoa *</Label>
                                                <SelectDepartments
                                                    value={formData.departmentId}
                                                    onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                                                    placeholder="Chọn khoa"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="service">Dịch vụ *</Label>
                                                <SelectServices
                                                    value={formData.serviceId}
                                                    onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
                                                    placeholder="Chọn dịch vụ"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="floor">Tầng</Label>
                                                <Select
                                                    value={formData.floor.toString()}
                                                    onValueChange={(value) => setFormData({ ...formData, floor: parseInt(value) })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn tầng" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((floor) => (
                                                            <SelectItem key={floor} value={floor.toString()}>
                                                                Tầng {floor}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setIsAddDialogOpen(false)
                                                    resetForm()
                                                }}
                                                disabled={isSubmitting}
                                            >
                                                Hủy
                                            </Button>
                                            <Button onClick={handleAddRoom} disabled={isSubmitting}>
                                                {isSubmitting ? "Đang thêm..." : "Thêm phòng"}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div className="md:col-span-2">
                                    <Label htmlFor="search">Tìm kiếm phòng</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="search"
                                            placeholder="Tìm theo tên phòng..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                        />
                                        <Button variant="outline" onClick={handleSearch}>
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <SelectDepartments
                                    label="Khoa"
                                    onValueChange={setFilterDepartment}
                                    value={filterDepartment}
                                    placeholder="Tất cả khoa"
                                    includeAll={true}
                                />
                                <SelectServices
                                    label="Dịch vụ"
                                    onValueChange={setFilterService}
                                    value={filterService}
                                    placeholder="Tất cả dịch vụ"
                                    includeAll={true}
                                />
                                <div>
                                    <Label htmlFor="floor-filter">Tầng</Label>
                                    <Select value={filterFloor} onValueChange={setFilterFloor}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tất cả tầng" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả tầng</SelectItem>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((floor) => (
                                                <SelectItem key={floor} value={floor.toString()}>
                                                    Tầng {floor}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {hasActiveFilters && (
                                <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                                    <span>Bộ lọc đang áp dụng:</span>
                                    {searchTerm && (
                                        <Badge variant="secondary" className="gap-1">
                                            Tìm kiếm: "{searchTerm}"
                                            <button
                                                onClick={() => setSearchTerm("")}
                                                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    )}
                                    {filterDepartment !== "all" && (
                                        <Badge variant="secondary" className="gap-1">
                                            Khoa: {getDepartmentName(filterDepartment)}
                                            <button
                                                onClick={() => setFilterDepartment("all")}
                                                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    )}
                                    {filterService !== "all" && (
                                        <Badge variant="secondary" className="gap-1">
                                            Dịch vụ: {getServiceName(filterService)}
                                            <button
                                                onClick={() => setFilterService("all")}
                                                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    )}
                                    {filterFloor !== "all" && (
                                        <Badge variant="secondary" className="gap-1">
                                            Tầng: {filterFloor}
                                            <button
                                                onClick={() => setFilterFloor("all")}
                                                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearAllFilters}
                                        className="text-xs"
                                    >
                                        Xóa tất cả bộ lọc
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Rooms Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Danh sách phòng khám
                                {pagination && (
                                    <span className="text-sm font-normal text-gray-500">
                                        ({pagination.total} tổng cộng)
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <TableLoading />
                            ) : (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tên phòng</TableHead>
                                                <TableHead>Khoa</TableHead>
                                                <TableHead>Dịch vụ</TableHead>
                                                <TableHead>Tầng</TableHead>
                                                <TableHead>Trạng thái</TableHead>
                                                <TableHead>Lịch hẹn hiện tại</TableHead>
                                                <TableHead>Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {medicalRooms.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                                        Không tìm thấy phòng khám nào
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                medicalRooms.map((room) => (
                                                    <TableRow key={room.id}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                                {room.name}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{room.department?.name || "-"}</TableCell>
                                                        <TableCell>{room.service?.name || "-"}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">Tầng {room.floor}</Badge>
                                                        </TableCell>
                                                        <TableCell>{getRoomStatusBadge(room)}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1">
                                                                <Users className="h-4 w-4 text-gray-400" />
                                                                {room.appointments?.filter(
                                                                    (apt) => apt.status === APPOINTMENTSTATUS.BOOKED || apt.status === APPOINTMENTSTATUS.IDLE
                                                                ).length || 0}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleEditRoom(room)}
                                                                    title="Chỉnh sửa"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-red-600 hover:text-red-700"
                                                                    onClick={() => handleDeleteRoom(room.id)}
                                                                    title="Xóa"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>

                                    {/* Pagination */}
                                    {pagination && pagination.totalPages > 1 && (
                                        <div className="mt-6">
                                            <Pagination
                                                currentPage={pagination.page}
                                                totalPages={pagination.totalPages}
                                                totalItems={pagination.total}
                                                itemsPerPage={itemsPerPage}
                                                onPageChange={handlePageChange}
                                                onItemsPerPageChange={handleItemsPerPageChange}
                                                className="justify-center"
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Edit Dialog */}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Chỉnh sửa phòng khám</DialogTitle>
                                <DialogDescription>Cập nhật thông tin chi tiết phòng khám</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Tên phòng *</Label>
                                    <Input
                                        id="edit-name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="VD: Phòng 101, Phòng mổ A"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-department">Khoa *</Label>
                                    <SelectDepartments
                                        value={formData.departmentId}
                                        onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                                        placeholder="Chọn khoa"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-service">Dịch vụ *</Label>
                                    <SelectServices
                                        value={formData.serviceId}
                                        onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
                                        placeholder="Chọn dịch vụ"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-floor">Tầng</Label>
                                    <Select
                                        value={formData.floor.toString()}
                                        onValueChange={(value) => setFormData({ ...formData, floor: parseInt(value) })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn tầng" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((floor) => (
                                                <SelectItem key={floor} value={floor.toString()}>
                                                    Tầng {floor}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditDialogOpen(false)
                                        setSelectedRoom(null)
                                        resetForm()
                                    }}
                                    disabled={isSubmitting}
                                >
                                    Hủy
                                </Button>
                                <Button onClick={handleUpdateRoom} disabled={isSubmitting}>
                                    {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </main>
            </div>
        </div>
    )
}