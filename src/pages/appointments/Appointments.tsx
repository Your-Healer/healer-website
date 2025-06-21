"use client"

import { useCallback, useEffect, useState } from "react"
import Sidebar from "@/components/layout/Sidebar/Sidebar"
import { useNavigate } from "@tanstack/react-router"
import { Header } from "@/components/layout/Header/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Search, RefreshCw } from "lucide-react"
import { AppointmentWithDetails } from "@/models/models"
import { useSession } from "@/contexts/SessionProvider"
import { useGetAppointments } from "@/hooks/use-appointment"
import { APPOINTMENTSTATUS } from "@/utils/enum"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { getAppointmentStatusName, getDepartmentName, getStaffName } from "@/utils/utils"
import { TableLoading } from "@/components/loading"
import { Pagination } from "@/components/ui/pagination"
import { convertToVietnameseDate } from "@/lib/utils"
import { SelectStaffs } from "@/components/select/SelectStaffs"
import { SelectDepartments } from "@/components/select/SelectDepartments"
import { useGetDepartments } from "@/hooks/use-departments"
import { useGetStaffs } from "@/hooks/use-staffs"

export default function AppointmentManagement() {
    const { account, staff } = useSession()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingAppointment, setEditingAppointment] = useState<AppointmentWithDetails | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
    const [staffFilter, setStaffFilter] = useState<string>("all")
    const [departmentFilter, setDepartmentFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string | APPOINTMENTSTATUS>("all")
    const [fromDateFilter, setFromDateFilter] = useState<Date | null>(null)
    const [toDateFilter, setToDateFilter] = useState<Date | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
            setCurrentPage(1)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    useEffect(() => {
        setCurrentPage(1)
        setStaffFilter("all")
    }, [departmentFilter])

    const filter: any = {
        departmentId: departmentFilter !== "all" ? departmentFilter : undefined,
        status: typeof (statusFilter) != "string" ? statusFilter : undefined,
        fromDate: fromDateFilter && fromDateFilter != toDateFilter ? fromDateFilter : undefined,
        toDate: toDateFilter && toDateFilter != fromDateFilter ? toDateFilter : undefined,
        date: fromDateFilter && toDateFilter && fromDateFilter == toDateFilter ? fromDateFilter : undefined,
    }
    if (account?.role?.id === "2" && staff?.positions?.includes({
        positionId: "1",
    })) {
        filter.staffId = staff.id;
    }
    else {
        filter.staffId = staffFilter !== "all" ? staffFilter : undefined;
    }

    const { appointments: getAppointmentsResult, pagination: getAppointmentsPagination, loading: getAppointmentsLoading, refetch } = useGetAppointments({
        page: currentPage,
        limit: itemsPerPage,
        orderByFromTime: "desc",
        ...filter
    })


    const handleAddAppointment = () => {
        setEditingAppointment(null)
        setIsDialogOpen(true)
    }

    const handleEditAppointment = (appointment: AppointmentWithDetails) => {
        setEditingAppointment(appointment)
        setIsDialogOpen(true)
    }

    const handleDeleteAppointment = (id: string) => {
        // setAppointments(appointments?.filter((a) => a.id !== id))
    }

    const handleSubmitAppointment = async () => {
        try {
            setIsSubmitting(true)
            // Add create/update API call here
            setIsDialogOpen(false)
            toast.success(editingAppointment ? "Cập nhật thông tin thành công" : "Tạo lịch đặt thành công")
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi xử lý yêu cầu")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value)
    }, [])

    const handleStaffFilterChange = useCallback((value: string) => {
        setStaffFilter(value)
    }, [])

    const handleDepartmentFilterChange = useCallback((value: string) => {
        setDepartmentFilter(value)
    }, [])

    const handleStatusFilterChange = useCallback((value: string) => {
        setStatusFilter(value)
    }, [])

    const handleFromDateFilterChange = useCallback((value: Date | null) => {
        setFromDateFilter(value)
    }, [])

    const handleToDateFilterChange = useCallback((value: Date | null) => {
        setToDateFilter(value)
    }, [])

    const clearAllFilters = () => {
        setStaffFilter("all")
        setDepartmentFilter("all")
        setStatusFilter("all")
        setFromDateFilter(null)
        setToDateFilter(null)
        setSearchTerm("")
        setDebouncedSearchTerm("")
        setCurrentPage(1)
    }

    const filteredAppointments = getAppointmentsResult || []
    console.log(filteredAppointments[0]?.bookingTime.medicalRoomTime.fromTime)
    const hasActiveFilters = searchTerm !== "" || staffFilter !== "all" || departmentFilter !== "all" || statusFilter !== "all" || fromDateFilter || toDateFilter;

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page
    };

    // Use hooks to get departments for filter display
    const { departments } = useGetDepartments({
        page: 1,
        limit: 1000,
    })

    const { staffs } = useGetStaffs({
        page: 1,
        limit: 1000,
        departmentId: departmentFilter !== "all" ? departmentFilter : undefined,
        positionId: "1", // Assuming positionId "1" is for doctors
    })

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole={account?.role?.id} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Quản Lý Lịch hẹn</h1>
                                <p className="text-gray-600">Quản lý lịch hẹn</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={refetch} disabled={getAppointmentsLoading}>
                                    <RefreshCw className={`h-4 w-4 mr-2 ${getAppointmentsLoading ? "animate-spin" : ""}`} />
                                    Làm mới
                                </Button>
                                <Button onClick={handleAddAppointment} disabled={isSubmitting}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm Lịch hẹn
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Danh sách lịch hẹn</CardTitle>
                                    <CardDescription>Xem và quản lý lịch hẹn {getAppointmentsResult && (
                                        <span className="ml-2 text-sm font-medium">
                                            ({getAppointmentsResult.length} lịch hẹn hiển thị)
                                        </span>
                                    )}</CardDescription>
                                </div>
                            </div>
                            <div className="space-y-4 mt-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="relative flex-1 max-w-sm">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            placeholder="Tìm kiếm lịch hẹn..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>

                                    {/* Select anything */}
                                    <SelectDepartments
                                        value={departmentFilter}
                                        onValueChange={setDepartmentFilter}
                                        className="w-[180px]"
                                        includeAll={true}
                                        allLabel="Tất cả khoa"
                                    />

                                    <SelectStaffs
                                        value={staffFilter}
                                        onValueChange={handleStaffFilterChange}
                                        placeholder="Lọc theo bác sĩ"
                                        departmentId={departmentFilter !== "all" ? departmentFilter : undefined}
                                        positionId="1"
                                        includeAll
                                        allLabel="Tất cả bác sĩ"
                                        className="w-[180px]"
                                    />

                                </div>

                                {hasActiveFilters && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>Bộ lọc đang áp dụng:</span>
                                        {searchTerm && (
                                            <Badge variant="secondary" className="gap-1">
                                                Tìm kiếm: "{searchTerm}"
                                                <button
                                                    onClick={() => setSearchTerm("")}
                                                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        )}
                                        {!(staff && staff.positions && account?.role?.id === "2" && staff?.positions?.includes({
                                            positionId: "1",
                                        })) && staffFilter !== "all" && (
                                                <Badge variant="secondary" className="gap-1">
                                                    Bác sĩ: {getStaffName(staffs, staffFilter)}
                                                    <button
                                                        onClick={() => setStaffFilter("all")}
                                                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                                    >
                                                        ×
                                                    </button>
                                                </Badge>
                                            )}
                                        {departmentFilter !== "all" && (
                                            <Badge variant="secondary" className="gap-1">
                                                Khoa: {getDepartmentName(departments, departmentFilter)}
                                                <button
                                                    onClick={() => setDepartmentFilter("all")}
                                                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        )}
                                        {statusFilter !== "all" && typeof (statusFilter) != "string" && (
                                            <Badge variant="secondary" className="gap-1">
                                                Trạng thái: {getAppointmentStatusName(statusFilter)}
                                                <button
                                                    onClick={() => setStatusFilter("all")}
                                                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        )}
                                        {
                                            fromDateFilter && (
                                                <Badge variant="secondary" className="gap-1">
                                                    Từ ngày: {fromDateFilter.toLocaleDateString()}
                                                    <button
                                                        onClick={() => setFromDateFilter(null)}
                                                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                                    >
                                                        ×
                                                    </button>
                                                </Badge>
                                            )
                                        }
                                        {
                                            toDateFilter && (
                                                <Badge variant="secondary" className="gap-1">
                                                    Đến ngày: {toDateFilter.toLocaleDateString()}
                                                    <button
                                                        onClick={() => setToDateFilter(null)}
                                                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                                    >
                                                        ×
                                                    </button>
                                                </Badge>
                                            )
                                        }
                                        {/* Clear all filters button */}
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
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {getAppointmentsLoading ? (
                                <TableLoading />
                            ) :
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tên bệnh nhân</TableHead>
                                                <TableHead>Phòng khám</TableHead>
                                                <TableHead>Khoa khám</TableHead>
                                                <TableHead>Dịch vụ</TableHead>
                                                <TableHead>Từ thời gian</TableHead>
                                                <TableHead>Đến thời gian</TableHead>
                                                <TableHead>Trạng thái</TableHead>
                                                <TableHead>Hành động</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredAppointments?.map((appointment) => (
                                                <TableRow key={appointment.id}>
                                                    <TableCell className="font-medium">{`${appointment.patient.firstname} ${appointment.patient.lastname}`}</TableCell>
                                                    <TableCell>{appointment.medicalRoom.name}</TableCell>
                                                    <TableCell>{appointment.medicalRoom.department.name}</TableCell>
                                                    <TableCell>{appointment.medicalRoom.service.name}</TableCell>
                                                    <TableCell>{convertToVietnameseDate(appointment.bookingTime.medicalRoomTime.fromTime)}</TableCell>
                                                    <TableCell>{convertToVietnameseDate(appointment.bookingTime.medicalRoomTime.toTime)}</TableCell>
                                                    <TableCell>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs ${appointment.status === APPOINTMENTSTATUS.PAID
                                                                ? "bg-green-100 text-green-800"
                                                                : appointment.status === APPOINTMENTSTATUS.IDLE
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : appointment.status === APPOINTMENTSTATUS.CANCEL
                                                                        ? "bg-red-100 text-red-800"
                                                                        : appointment.status === APPOINTMENTSTATUS.BOOKED
                                                                            ? "bg-blue-100 text-blue-800"
                                                                            : "bg-gray-100 text-gray-800"
                                                                }`}
                                                        >
                                                            {getAppointmentStatusName(appointment.status)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Button variant="ghost" size="sm" onClick={() => handleEditAppointment(appointment)}>
                                                                <Edit className="h-4 w-4" />
                                                            </Button>

                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button variant="ghost" size="sm">
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Bạn muốn xóa lịch hẹn này không ?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Hành động này không thể hoàn tác. Lịch hẹn sẽ bị xóa vĩnh viễn khỏi hệ thống.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => handleDeleteAppointment(appointment.id)}
                                                                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                                                        >
                                                                            Đồng ý
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    {filteredAppointments.length === 0 && !getAppointmentsLoading && (
                                        <div className="text-center py-12">
                                            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Không tìm thấy lịch hẹn
                                            </h3>
                                            <p className="text-gray-500 mb-4">
                                                {hasActiveFilters
                                                    ? "Không có lịch hẹn nào phù hợp với bộ lọc của bạn."
                                                    : "Chưa có lịch hẹn nào trong hệ thống."
                                                }
                                            </p>
                                            {hasActiveFilters && (
                                                <Button variant="outline" onClick={clearAllFilters}>
                                                    Xóa bộ lọc
                                                </Button>
                                            )}
                                        </div>
                                    )}

                                    {
                                        getAppointmentsResult &&
                                        getAppointmentsResult.length > 0 && getAppointmentsPagination && (
                                            <Pagination
                                                currentPage={getAppointmentsPagination.page}
                                                totalPages={getAppointmentsPagination.totalPages}
                                                totalItems={getAppointmentsPagination.total}
                                                itemsPerPage={getAppointmentsPagination.limit}
                                                onPageChange={handlePageChange}
                                                onItemsPerPageChange={handleItemsPerPageChange}
                                                className="mt-4"
                                            />
                                        )
                                    }
                                </>}

                        </CardContent>
                    </Card>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>{editingAppointment ? "Chỉnh sửa lịch hẹn" : "Thêm Lịch hẹn Mới"}</DialogTitle>
                                <DialogDescription>
                                    {editingAppointment ? "Cập nhật thông tin lịch hẹn" : "Tạo lịch hẹn mới"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="patient">Họ</Label>
                                        <Input
                                            id="lastname"
                                            defaultValue={editingAppointment?.patient.lastname}
                                            placeholder="Nhập họ bệnh nhân"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="patient">Tên</Label>
                                        <Input
                                            id="firstname"
                                            defaultValue={editingAppointment?.patient.lastname}
                                            placeholder="Nhập tên bệnh nhân"
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                                    {editingAppointment ? "Cập nhật" : "Đặt"} lịch hẹn
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </main>
            </div>
        </div>
    )
}
