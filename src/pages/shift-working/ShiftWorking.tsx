"use client"
import { useEffect, useState, useCallback } from "react"
import { Sidebar } from "@/components/layout/Sidebar/Sidebar"
import { Header } from "@/components/layout/Header/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, RefreshCw, Clock, Calendar, MapPin, User } from "lucide-react"
import { ShiftWorkingDetails } from "@/models/models"
import { useSession } from "@/contexts/SessionProvider"
import { useGetShiftWorkings, useDeleteShiftWorking } from "@/hooks/use-shift-working"
import { TableLoading, ButtonLoading } from "@/components/loading"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"
import { EditingShiftWorkingDialog } from "@/components/dialog/shift-working/EditingShiftWorkingDialog"
import { SelectStaffs } from "@/components/select/SelectStaffs"
import { SelectDepartments } from "@/components/select/SelectDepartments"
import { SelectMedicalRoom } from "@/components/select/SelectMedicalRoom"
import { SelectShiftStatus, getShiftStatusName } from "@/components/select/SelectShiftStatus"
import { getDepartmentName, getMedicalRoomName, getShiftStatus, getStaffName } from "@/utils/utils"
import { useGetDepartments } from "@/hooks/use-departments"
import { useGetStaffs } from "@/hooks/use-staffs"
import { useGetMedicalRooms } from "@/hooks/use-medical"
import { useNavigate } from "@tanstack/react-router"

export default function ShiftWorkingManagement() {
    const { account, isLoading, isAuthenticated } = useSession()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingShiftWorking, setEditingShiftWorking] = useState<ShiftWorkingDetails | null>(null)
    const [staffFilter, setStaffFilter] = useState<string>("all")
    const [departmentFilter, setDepartmentFilter] = useState<string>("all")
    const [roomFilter, setRoomFilter] = useState<string>("all")
    const [dateFilter, setDateFilter] = useState<string>("")
    const [fromDateFilter, setFromDateFilter] = useState<string>("")
    const [toDateFilter, setToDateFilter] = useState<string>("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { deleteShiftWorking, loading: deleteLoading } = useDeleteShiftWorking()

    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                navigate({ to: "/sign-in" });
            }
        }
    }, [isAuthenticated, isLoading, navigate]);

    // Reset filters when department changes
    useEffect(() => {
        setCurrentPage(1)
        setRoomFilter("all")
        setStaffFilter("all")
    }, [departmentFilter])

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [staffFilter, roomFilter, dateFilter, fromDateFilter, toDateFilter, statusFilter])

    const {
        shiftWorkings: getShiftWorkingsResult,
        pagination: getShiftWorkingsPagination,
        loading: getShiftWorkingsLoading,
        refetch
    } = useGetShiftWorkings({
        page: currentPage,
        limit: itemsPerPage,
        staffId: staffFilter !== "all" ? staffFilter : undefined,
        departmentId: departmentFilter !== "all" ? departmentFilter : undefined,
        roomId: roomFilter !== "all" ? roomFilter : undefined,
        date: dateFilter ? new Date(dateFilter) : undefined,
        fromDate: fromDateFilter ? new Date(fromDateFilter) : undefined,
        toDate: toDateFilter ? new Date(toDateFilter) : undefined,
        status: statusFilter !== "all" ? statusFilter as any : undefined
    })

    const handleAddShiftWorking = () => {
        setEditingShiftWorking(null)
        setIsDialogOpen(true)
    }

    const handleEditShiftWorking = (shiftWorking: ShiftWorkingDetails) => {
        setEditingShiftWorking(shiftWorking)
        setIsDialogOpen(true)
    }

    const handleDeleteShiftWorking = async (id: string, staffName: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa ca làm việc của ${staffName}?`)) {
            try {
                setIsSubmitting(true)
                await deleteShiftWorking(id)
                toast.success("Xóa ca làm việc thành công")
                refetch()
            } catch (error) {
                toast.error("Lỗi khi xóa ca làm việc")
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    const handleDialogSuccess = () => {
        refetch()
    }

    const handleStaffFilterChange = useCallback((value: string) => {
        setStaffFilter(value)
    }, [])

    const handleDepartmentFilterChange = useCallback((value: string) => {
        setDepartmentFilter(value)
    }, [])

    const handleRoomFilterChange = useCallback((value: string) => {
        setRoomFilter(value)
    }, [])

    const handleStatusFilterChange = useCallback((value: string) => {
        setStatusFilter(value)
    }, [])

    const clearAllFilters = () => {
        setStaffFilter("all")
        setDepartmentFilter("all")
        setRoomFilter("all")
        setDateFilter("")
        setFromDateFilter("")
        setToDateFilter("")
        setStatusFilter("all")
        setCurrentPage(1)
    }

    const filteredShiftWorkings = getShiftWorkingsResult || []
    const hasActiveFilters = staffFilter !== "all" || departmentFilter !== "all" || roomFilter !== "all" ||
        dateFilter !== "" || fromDateFilter !== "" || toDateFilter !== "" || statusFilter !== "all"

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage)
        setCurrentPage(1)
    }

    // Use hooks to get departments and positions for filter display
    const { departments } = useGetDepartments({
        page: 1,
        limit: 1000,
    })

    const { staffs } = useGetStaffs({
        page: 1,
        limit: 1000,
    })

    const { medicalRooms } = useGetMedicalRooms({
        page: 1,
        limit: 1000,
    })

    const formatDateTime = (date: Date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date))
    }

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date))
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
                                <h1 className="text-2xl font-bold text-gray-900">Quản Lý Ca Làm Việc</h1>
                                <p className="text-gray-600">Quản lý lịch trình làm việc của nhân viên y tế</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={refetch} disabled={getShiftWorkingsLoading}>
                                    <RefreshCw className={`h-4 w-4 mr-2 ${getShiftWorkingsLoading ? "animate-spin" : ""}`} />
                                    Làm mới
                                </Button>
                                <Button onClick={handleAddShiftWorking} disabled={isSubmitting}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm Ca Làm Việc
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Danh Sách Ca Làm Việc</CardTitle>
                                    <CardDescription>
                                        Xem và quản lý ca làm việc của nhân viên y tế
                                        {getShiftWorkingsResult && (
                                            <span className="ml-2 text-sm font-medium">
                                                ({getShiftWorkingsResult.length} ca làm việc hiển thị)
                                            </span>
                                        )}
                                    </CardDescription>
                                </div>
                            </div>

                            <div className="space-y-4 mt-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <SelectDepartments
                                        value={departmentFilter}
                                        onValueChange={handleDepartmentFilterChange}
                                        placeholder="Lọc theo khoa"
                                        includeAll
                                        allLabel="Tất cả khoa"
                                        className="w-[180px]"
                                    />

                                    <SelectMedicalRoom
                                        value={roomFilter}
                                        onValueChange={handleRoomFilterChange}
                                        placeholder="Lọc theo phòng"
                                        departmentId={departmentFilter !== "all" ? departmentFilter : undefined}
                                        includeAll
                                        allLabel="Tất cả phòng"
                                        className="w-[180px]"
                                    />

                                    <SelectStaffs
                                        value={staffFilter}
                                        onValueChange={handleStaffFilterChange}
                                        placeholder="Lọc theo nhân viên"
                                        departmentId={departmentFilter !== "all" ? departmentFilter : undefined}
                                        includeAll
                                        allLabel="Tất cả nhân viên"
                                        className="w-[180px]"
                                    />

                                    <SelectShiftStatus
                                        value={statusFilter}
                                        onValueChange={handleStatusFilterChange}
                                        placeholder="Lọc theo trạng thái"
                                        includeAll
                                        allLabel="Tất cả trạng thái"
                                        className="w-[180px]"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="date">Ngày cụ thể</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={dateFilter}
                                            onChange={(e) => {
                                                setDateFilter(e.target.value)
                                                if (e.target.value) {
                                                    setFromDateFilter("")
                                                    setToDateFilter("")
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="fromDate">Từ ngày</Label>
                                        <Input
                                            id="fromDate"
                                            type="date"
                                            value={fromDateFilter}
                                            onChange={(e) => {
                                                setFromDateFilter(e.target.value)
                                                if (e.target.value) {
                                                    setDateFilter("")
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="toDate">Đến ngày</Label>
                                        <Input
                                            id="toDate"
                                            type="date"
                                            value={toDateFilter}
                                            onChange={(e) => {
                                                setToDateFilter(e.target.value)
                                                if (e.target.value) {
                                                    setDateFilter("")
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                {hasActiveFilters && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                                        <span>Bộ lọc đang áp dụng:</span>
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
                                        {roomFilter !== "all" && (
                                            <Badge variant="secondary" className="gap-1">
                                                Phòng: {getMedicalRoomName(roomFilter, medicalRooms)}
                                                <button
                                                    onClick={() => setRoomFilter("all")}
                                                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        )}
                                        {staffFilter !== "all" && (
                                            <Badge variant="secondary" className="gap-1">
                                                Nhân viên: {getStaffName(staffs, staffFilter)}
                                                <button
                                                    onClick={() => setStaffFilter("all")}
                                                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        )}
                                        {statusFilter !== "all" && (
                                            <Badge variant="secondary" className="gap-1">
                                                Trạng thái: {getShiftStatusName(statusFilter)}
                                                <button
                                                    onClick={() => setStatusFilter("all")}
                                                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        )}
                                        {dateFilter && (
                                            <Badge variant="secondary" className="gap-1">
                                                Ngày: {new Date(dateFilter).toLocaleDateString('vi-VN')}
                                                <button
                                                    onClick={() => setDateFilter("")}
                                                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        )}
                                        {fromDateFilter && (
                                            <Badge variant="secondary" className="gap-1">
                                                Từ: {new Date(fromDateFilter).toLocaleDateString('vi-VN')}
                                                <button
                                                    onClick={() => setFromDateFilter("")}
                                                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        )}
                                        {toDateFilter && (
                                            <Badge variant="secondary" className="gap-1">
                                                Đến: {new Date(toDateFilter).toLocaleDateString('vi-VN')}
                                                <button
                                                    onClick={() => setToDateFilter("")}
                                                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                                >
                                                    ×
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
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {getShiftWorkingsLoading ? (
                                <TableLoading />
                            ) : (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nhân viên</TableHead>
                                                <TableHead>Phòng khám</TableHead>
                                                <TableHead>Khoa</TableHead>
                                                <TableHead>Ngày làm việc</TableHead>
                                                <TableHead>Thời gian</TableHead>
                                                <TableHead>Trạng thái</TableHead>
                                                <TableHead>Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredShiftWorkings.map((shiftWorking) => {
                                                const status = getShiftStatus(shiftWorking)
                                                return (
                                                    <TableRow key={shiftWorking.id}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-4 w-4 text-gray-400" />
                                                                <span>
                                                                    {shiftWorking.staff ?
                                                                        `${shiftWorking.staff.firstname} ${shiftWorking.staff.lastname}` :
                                                                        "Không xác định"
                                                                    }
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                                <span>{shiftWorking.room?.name || "Không xác định"}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {shiftWorking.room?.department?.name || "Không xác định"}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                                <span>
                                                                    {new Date(shiftWorking.fromTime).toLocaleDateString('vi-VN')}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-gray-400" />
                                                                <span className="text-sm">
                                                                    {formatTime(shiftWorking.fromTime)} - {formatTime(shiftWorking.toTime)}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={status.color}>
                                                                {status.label}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleEditShiftWorking(shiftWorking)}
                                                                    disabled={isSubmitting}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteShiftWorking(
                                                                        shiftWorking.id,
                                                                        shiftWorking.staff ?
                                                                            `${shiftWorking.staff.firstname} ${shiftWorking.staff.lastname}` :
                                                                            "Nhân viên"
                                                                    )}
                                                                    disabled={isSubmitting || deleteLoading}
                                                                >
                                                                    {deleteLoading ? (
                                                                        <ButtonLoading />
                                                                    ) : (
                                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>

                                    {filteredShiftWorkings.length === 0 && !getShiftWorkingsLoading && (
                                        <div className="text-center py-12">
                                            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Không tìm thấy ca làm việc
                                            </h3>
                                            <p className="text-gray-500 mb-4">
                                                {hasActiveFilters
                                                    ? "Không có ca làm việc nào phù hợp với bộ lọc của bạn."
                                                    : "Chưa có ca làm việc nào trong hệ thống."
                                                }
                                            </p>
                                            {hasActiveFilters && (
                                                <Button variant="outline" onClick={clearAllFilters}>
                                                    Xóa bộ lọc
                                                </Button>
                                            )}
                                        </div>
                                    )}

                                    {getShiftWorkingsResult && getShiftWorkingsResult.length > 0 && getShiftWorkingsPagination && (
                                        <Pagination
                                            currentPage={getShiftWorkingsPagination.page}
                                            totalPages={getShiftWorkingsPagination.totalPages}
                                            totalItems={getShiftWorkingsPagination.total}
                                            itemsPerPage={getShiftWorkingsPagination.limit}
                                            onPageChange={handlePageChange}
                                            onItemsPerPageChange={handleItemsPerPageChange}
                                            className="mt-4"
                                        />
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <EditingShiftWorkingDialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                        editingShiftWorking={editingShiftWorking}
                        onSuccess={handleDialogSuccess}
                    />
                </main>
            </div>
        </div>
    )
}
