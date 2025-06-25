"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar/Sidebar"
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
import { Plus, Edit, Trash2, MapPin, Building, Users, Search, RefreshCw, X, Eye, Clock, Calendar, ChevronRight } from "lucide-react"
import { useSession } from "@/contexts/SessionProvider"
import { useGetMedicalRooms, useGetTimeSlots, createTimeSlot } from "@/hooks/use-medical"
import { MedicalRoomWithDetails, DepartmentWithDetails, ServiceWithDetails, MedicalRoomTimeWithDetails } from "@/models/models"
import { CreateMedicalRoomRequest, UpdateMedicalRoomRequest, GetMedicalRoomRequest, CreateMedicalRoomTimeRequest } from "@/utils/types"
import api from "@/api/axios"
import { toast } from "sonner"
import { APPOINTMENTSTATUS } from "@/utils/enum"
import { TableLoading, ButtonLoading } from "@/components/loading"
import { SelectDepartments } from "@/components/select/SelectDepartments"
import { SelectServices } from "@/components/select/SelectServices"
import { useGetDepartments } from "@/hooks/use-departments"
import { useGetServices } from "@/hooks/use-services"
import { ViewRoomTimesDialog } from "@/components/dialog/room-times/ViewRoomTimesDialog"
import { useNavigate } from "@tanstack/react-router"

interface MedicalRoomFormData {
    name: string
    departmentId: string
    serviceId: string
    floor: number
}

interface TimeSlotFormData {
    fromTime: string
    toTime: string
    date: string
}

export default function MedicalRoomsPage() {
    const { user, account, isLoading, isAuthenticated } = useSession()

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
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isTimeSlotDialogOpen, setIsTimeSlotDialogOpen] = useState(false)
    const [isViewTimesDialogOpen, setIsViewTimesDialogOpen] = useState(false)
    const [selectedRoom, setSelectedRoom] = useState<MedicalRoomWithDetails | null>(null)
    const [viewingRoom, setViewingRoom] = useState<MedicalRoomWithDetails | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form data
    const [formData, setFormData] = useState<MedicalRoomFormData>({
        name: "",
        departmentId: "",
        serviceId: "",
        floor: 1,
    })

    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                navigate({ to: "/sign-in" });
            }
        }
    }, [isAuthenticated, isLoading, navigate]);

    const [timeSlotFormData, setTimeSlotFormData] = useState<TimeSlotFormData>({
        fromTime: "",
        toTime: "",
        date: ""
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

    // Fetch time slots for selected room
    const { timeSlots, loading: timeSlotsLoading, refetch: refetchTimeSlots } = useGetTimeSlots({
        page: 1,
        limit: 100,
        filter: {
            roomId: selectedRoom?.id
        }
    })

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

    const handleViewRoom = (room: MedicalRoomWithDetails) => {
        setViewingRoom(room)
        setIsViewDialogOpen(true)
    }

    const handleManageTimeSlots = (room: MedicalRoomWithDetails) => {
        setSelectedRoom(room)
        setIsTimeSlotDialogOpen(true)
    }

    const handleViewRoomTimes = (room: MedicalRoomWithDetails) => {
        setSelectedRoom(room)
        setIsViewTimesDialogOpen(true)
    }

    const resetTimeSlotForm = () => {
        setTimeSlotFormData({
            fromTime: "",
            toTime: "",
            date: ""
        })
    }

    const handleAddTimeSlot = async () => {
        if (!selectedRoom || !timeSlotFormData.date || !timeSlotFormData.fromTime || !timeSlotFormData.toTime) {
            toast.error("Vui lòng điền đầy đủ thông tin")
            return
        }

        if (timeSlotFormData.fromTime >= timeSlotFormData.toTime) {
            toast.error("Thời gian kết thúc phải sau thời gian bắt đầu")
            return
        }

        setIsSubmitting(true)
        try {
            const fromDateTime = new Date(`${timeSlotFormData.date}T${timeSlotFormData.fromTime}:00`)
            const toDateTime = new Date(`${timeSlotFormData.date}T${timeSlotFormData.toTime}:00`)

            const requestData: CreateMedicalRoomTimeRequest = {
                roomId: selectedRoom.id,
                fromTime: fromDateTime,
                toTime: toDateTime
            }

            await createTimeSlot(requestData)
            toast.success("Tạo khung giờ thành công")
            resetTimeSlotForm()
            refetchTimeSlots()
        } catch (error: any) {
            console.error("Error creating time slot:", error)
            toast.error(error.response?.data?.message || "Không thể tạo khung giờ")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteTimeSlot = async (timeSlotId: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa khung giờ này không?")) {
            return
        }

        try {
            await api.delete(`/medical/time-slots/${timeSlotId}`)
            toast.success("Xóa khung giờ thành công")
            refetchTimeSlots()
        } catch (error: any) {
            console.error("Error deleting time slot:", error)
            toast.error(error.response?.data?.message || "Không thể xóa khung giờ")
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

    const formatDateTime = (dateTime: Date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateTime))
    }

    const formatTime = (dateTime: Date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateTime))
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
                                                <TableHead>Khung giờ</TableHead>
                                                <TableHead>Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {medicalRooms.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
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
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-4 w-4 text-gray-400" />
                                                                {room.times?.length || 0} khung giờ
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-1">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleViewRoom(room)}
                                                                    title="Xem chi tiết"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
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
                                                                    onClick={() => handleManageTimeSlots(room)}
                                                                    title="Quản lý khung giờ"
                                                                >
                                                                    <Clock className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleViewRoomTimes(room)}
                                                                    title="Xem chi tiết khung giờ"
                                                                    className="text-blue-600 hover:text-blue-700"
                                                                >
                                                                    <Calendar className="h-4 w-4" />
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

                    {/* View Room Dialog */}
                    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Chi Tiết Phòng Khám</DialogTitle>
                                <DialogDescription>Thông tin chi tiết về phòng khám</DialogDescription>
                            </DialogHeader>
                            {viewingRoom && (
                                <div className="grid gap-6 py-4">
                                    {/* Basic Information */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900 border-b pb-1">Thông Tin Cơ Bản</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="font-semibold text-sm">Tên phòng</Label>
                                                <p className="text-sm">{viewingRoom.name}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="font-semibold text-sm">Khoa</Label>
                                                <p className="text-sm">{viewingRoom.department?.name || "Không xác định"}</p>
                                            </div>
                                            <div>
                                                <Label className="font-semibold text-sm">Dịch vụ</Label>
                                                <p className="text-sm">{viewingRoom.service?.name || "Không xác định"}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="font-semibold text-sm">Tầng</Label>
                                                <p className="text-sm">Tầng {viewingRoom.floor}</p>
                                            </div>
                                            <div>
                                                <Label className="font-semibold text-sm">Trạng thái</Label>
                                                <div className="mt-1">{getRoomStatusBadge(viewingRoom)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Department Information */}
                                    {viewingRoom.department && (
                                        <div className="space-y-3">
                                            <h4 className="font-medium text-gray-900 border-b pb-1">Thông Tin Khoa</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="font-semibold text-sm">Tên khoa</Label>
                                                    <p className="text-sm">{viewingRoom.department.name}</p>
                                                </div>
                                                <div>
                                                    <Label className="font-semibold text-sm">Ký hiệu</Label>
                                                    <p className="text-sm">{viewingRoom.department.symbol}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Service Information */}
                                    {viewingRoom.service && (
                                        <div className="space-y-3">
                                            <h4 className="font-medium text-gray-900 border-b pb-1">Thông Tin Dịch Vụ</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="font-semibold text-sm">Tên dịch vụ</Label>
                                                    <p className="text-sm">{viewingRoom.service.name}</p>
                                                </div>
                                                <div>
                                                    <Label className="font-semibold text-sm">Thời gian khám</Label>
                                                    <p className="text-sm">{viewingRoom.service.durationTime} phút</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="font-semibold text-sm">Giá dịch vụ</Label>
                                                    <p className="text-sm">{viewingRoom.service.price?.toLocaleString('vi-VN')} VNĐ</p>
                                                </div>
                                                <div>
                                                    <Label className="font-semibold text-sm">Mô tả</Label>
                                                    <p className="text-sm">{viewingRoom.service.description || "Không có mô tả"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Time Slots */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900 border-b pb-1">Khung Giờ Làm Việc</h4>
                                        <div>
                                            {viewingRoom.times && viewingRoom.times.length > 0 ? (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">
                                                        Tổng số khung giờ: {viewingRoom.times.length}
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                                                        {viewingRoom.times.slice(0, 10).map((time, index) => (
                                                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                                <Clock className="h-3 w-3 text-gray-500" />
                                                                <span className="text-xs">
                                                                    {formatTime(time.fromTime)} - {formatTime(time.toTime)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {viewingRoom.times.length > 10 && (
                                                        <p className="text-xs text-gray-500">
                                                            và {viewingRoom.times.length - 10} khung giờ khác...
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">Chưa có khung giờ nào</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Appointments */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900 border-b pb-1">Lịch Hẹn</h4>
                                        <div>
                                            {viewingRoom.appointments && viewingRoom.appointments.length > 0 ? (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">
                                                        Tổng số lịch hẹn: {viewingRoom.appointments.length}
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <Badge className="bg-blue-100 text-blue-800">
                                                            Đã đặt: {viewingRoom.appointments.filter(apt => apt.status === APPOINTMENTSTATUS.BOOKED).length}
                                                        </Badge>
                                                        <Badge className="bg-green-100 text-green-800">
                                                            Đã thanh toán: {viewingRoom.appointments.filter(apt => apt.status === APPOINTMENTSTATUS.PAID).length}
                                                        </Badge>
                                                        <Badge className="bg-yellow-100 text-yellow-800">
                                                            Chờ xử lý: {viewingRoom.appointments.filter(apt => apt.status === APPOINTMENTSTATUS.IDLE).length}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">Chưa có lịch hẹn nào</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                                    Đóng
                                </Button>
                                <Button onClick={() => {
                                    setIsViewDialogOpen(false)
                                    if (viewingRoom) handleViewRoomTimes(viewingRoom)
                                }}>
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Xem chi tiết khung giờ
                                </Button>
                                <Button onClick={() => {
                                    setIsViewDialogOpen(false)
                                    if (viewingRoom) handleManageTimeSlots(viewingRoom)
                                }}>
                                    <Clock className="h-4 w-4 mr-2" />
                                    Quản lý khung giờ
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Time Slot Management Dialog */}
                    <Dialog open={isTimeSlotDialogOpen} onOpenChange={setIsTimeSlotDialogOpen}>
                        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Quản Lý Khung Giờ - {selectedRoom?.name}</DialogTitle>
                                <DialogDescription>
                                    Thêm và quản lý khung giờ làm việc cho phòng khám
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-6 py-4">
                                {/* Add Time Slot Form */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Thêm Khung Giờ Mới</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="date">Ngày *</Label>
                                                <Input
                                                    id="date"
                                                    type="date"
                                                    value={timeSlotFormData.date}
                                                    onChange={(e) => setTimeSlotFormData(prev => ({ ...prev, date: e.target.value }))}
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="fromTime">Giờ bắt đầu *</Label>
                                                <Input
                                                    id="fromTime"
                                                    type="time"
                                                    value={timeSlotFormData.fromTime}
                                                    onChange={(e) => setTimeSlotFormData(prev => ({ ...prev, fromTime: e.target.value }))}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="toTime">Giờ kết thúc *</Label>
                                                <Input
                                                    id="toTime"
                                                    type="time"
                                                    value={timeSlotFormData.toTime}
                                                    onChange={(e) => setTimeSlotFormData(prev => ({ ...prev, toTime: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button onClick={handleAddTimeSlot} disabled={isSubmitting}>
                                                {isSubmitting ? (
                                                    <ButtonLoading message="Đang thêm..." />
                                                ) : (
                                                    <>
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Thêm Khung Giờ
                                                    </>
                                                )}
                                            </Button>
                                            <Button variant="outline" onClick={resetTimeSlotForm}>
                                                Đặt lại
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Time Slots List */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Danh Sách Khung Giờ</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {timeSlotsLoading ? (
                                            <TableLoading />
                                        ) : (
                                            <>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Ngày</TableHead>
                                                            <TableHead>Thời gian</TableHead>
                                                            <TableHead>Trạng thái</TableHead>
                                                            <TableHead>Lịch hẹn</TableHead>
                                                            <TableHead>Thao tác</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {timeSlots.length === 0 ? (
                                                            <TableRow>
                                                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                                                    Chưa có khung giờ nào
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            timeSlots.map((timeSlot) => {
                                                                const isAvailable = !timeSlot.bookings || timeSlot.bookings.length === 0
                                                                const isPast = new Date(timeSlot.toTime) < new Date()

                                                                return (
                                                                    <TableRow key={timeSlot.id}>
                                                                        <TableCell>
                                                                            <div className="flex items-center gap-2">
                                                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                                                {new Date(timeSlot.fromTime).toLocaleDateString('vi-VN')}
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div className="flex items-center gap-2">
                                                                                <Clock className="h-4 w-4 text-gray-400" />
                                                                                {formatTime(timeSlot.fromTime)} - {formatTime(timeSlot.toTime)}
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Badge variant={
                                                                                isPast ? "outline" :
                                                                                    isAvailable ? "secondary" : "default"
                                                                            }>
                                                                                {isPast ? "Đã qua" :
                                                                                    isAvailable ? "Trống" : "Đã đặt"}
                                                                            </Badge>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div className="flex items-center gap-1">
                                                                                <Users className="h-4 w-4 text-gray-400" />
                                                                                {timeSlot.bookings?.length || 0}
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="text-red-600 hover:text-red-700"
                                                                                onClick={() => handleDeleteTimeSlot(timeSlot.id)}
                                                                                disabled={!isAvailable}
                                                                                title={!isAvailable ? "Không thể xóa khung giờ đã có lịch hẹn" : "Xóa khung giờ"}
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            })
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => {
                                    setIsTimeSlotDialogOpen(false)
                                    setSelectedRoom(null)
                                    resetTimeSlotForm()
                                }}>
                                    Đóng
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

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

                    {/* New Detailed Room Times View Dialog */}
                    <ViewRoomTimesDialog
                        open={isViewTimesDialogOpen}
                        onOpenChange={setIsViewTimesDialogOpen}
                        room={selectedRoom}
                        timeSlots={timeSlots}
                        loading={timeSlotsLoading}
                    />
                </main>
            </div>
        </div>
    )
}