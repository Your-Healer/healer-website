"use client"

import { useEffect, useState, useCallback } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Search, Eye, User, Phone, Calendar, MapPin, RefreshCw } from "lucide-react"
import { PatientWithDetails } from "@/models/models"
import { useSession } from "@/contexts/SessionProvider"
import { useGetPatients } from "@/hooks/use-patients"
import { TableLoading, ButtonLoading } from "@/components/loading"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"
import { SelectDepartments } from "@/components/select/SelectDepartments"
import { useGetDepartments } from "@/hooks/use-departments"
import { getDepartmentName } from "@/utils/utils"
import { useNavigate } from "@tanstack/react-router"

export default function PatientManagement() {
    const { user, account, isLoading, isAuthenticated } = useSession()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [editingPatient, setEditingPatient] = useState<PatientWithDetails | null>(null)
    const [viewingPatient, setViewingPatient] = useState<PatientWithDetails | null>(null)

    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
    const [departmentFilter, setDepartmentFilter] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                navigate({ to: "/sign-in" });
            }
        }
    }, [isAuthenticated, isLoading, navigate]);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
            setCurrentPage(1)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [departmentFilter])

    const { patients, pagination, loading, refetch } = useGetPatients({
        page: currentPage,
        limit: itemsPerPage,
        searchTerm: debouncedSearchTerm || undefined,
    })

    const handleAddPatient = () => {
        setEditingPatient(null)
        setIsDialogOpen(true)
    }

    const handleEditPatient = (patient: PatientWithDetails) => {
        setEditingPatient(patient)
        setIsDialogOpen(true)
    }

    const handleViewPatient = (patient: PatientWithDetails) => {
        setViewingPatient(patient)
        setIsViewDialogOpen(true)
    }

    const handleDeletePatient = async (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bệnh nhân này?")) {
            try {
                setIsSubmitting(true)
                // Add delete API call here
                toast.success("Xóa bệnh nhân thành công")
            } catch (error) {
                toast.error("Lỗi khi xóa bệnh nhân")
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    const handleSubmitPatient = async () => {
        try {
            setIsSubmitting(true)
            // Add create/update API call here
            setIsDialogOpen(false)
            toast.success(editingPatient ? "Cập nhật bệnh nhân thành công" : "Thêm bệnh nhân thành công")
        } catch (error) {
            toast.error("Lỗi khi lưu thông tin bệnh nhân")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value)
    }, [])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage)
        setCurrentPage(1) // Reset to first page
    }

    const clearAllFilters = () => {
        setSearchTerm("")
        setDepartmentFilter("all")
        setCurrentPage(1)
    }

    const hasActiveFilters = searchTerm !== "" || departmentFilter !== "all"

    // Use hooks to get departments for filter display
    const { departments } = useGetDepartments({
        page: 1,
        limit: 1000,
    })

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole={account?.role?.id || "1"} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Quản Lý Bệnh Nhân</h1>
                                <p className="text-gray-600">Quản lý thông tin và hồ sơ bệnh nhân</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={refetch} disabled={loading}>
                                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                                    Làm mới
                                </Button>
                                <Button onClick={handleAddPatient} disabled={isSubmitting}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm Bệnh Nhân
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Danh Sách Bệnh Nhân</CardTitle>
                                    <CardDescription>
                                        Xem và quản lý tất cả bệnh nhân trong hệ thống
                                        {pagination && (
                                            <span className="ml-2 text-sm font-medium">
                                                ({pagination.total} bệnh nhân)
                                            </span>
                                        )}
                                    </CardDescription>
                                </div>
                            </div>

                            <div className="space-y-4 mt-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="relative flex-1 max-w-sm">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                                            value={searchTerm}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>

                                    <SelectDepartments
                                        value={departmentFilter}
                                        onValueChange={setDepartmentFilter}
                                        className="w-[200px]"
                                        includeAll={true}
                                        allLabel="Tất cả khoa"
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
                            {loading ? (
                                <TableLoading />
                            ) : (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Họ và tên</TableHead>
                                                <TableHead>Thông tin liên hệ</TableHead>
                                                <TableHead>Địa chỉ</TableHead>
                                                <TableHead>Lịch hẹn</TableHead>
                                                <TableHead>Trạng thái</TableHead>
                                                <TableHead>Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {patients?.map((patient) => (
                                                <TableRow key={patient.id}>
                                                    <TableCell className="font-medium">
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold">
                                                                {`${patient.firstname} ${patient.lastname}`}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1">
                                                            {patient.user?.email && (
                                                                <a
                                                                    href={`mailto:${patient.user.email}`}
                                                                    className="text-blue-600 hover:underline text-sm"
                                                                >
                                                                    {patient.user.email}
                                                                </a>
                                                            )}
                                                            {patient.phoneNumber && (
                                                                <a
                                                                    href={`tel:${patient.phoneNumber}`}
                                                                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                                                                >
                                                                    <Phone className="h-3 w-3" />
                                                                    {patient.phoneNumber}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {patient.address ? (
                                                            <div className="flex items-center gap-1 text-sm">
                                                                <MapPin className="h-3 w-3" />
                                                                <span className="truncate max-w-[200px]" title={patient.address}>
                                                                    {patient.address}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">Chưa có</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {patient.Appointment && patient.Appointment.length > 0 ? (
                                                            <Badge variant="default" className="gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {patient.Appointment.length} lịch hẹn
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                Chưa có lịch hẹn
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="gap-1">
                                                            <User className="h-3 w-3" />
                                                            Hoạt động
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleViewPatient(patient)}
                                                                disabled={isSubmitting}
                                                                title="Xem chi tiết bệnh nhân"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEditPatient(patient)}
                                                                disabled={isSubmitting}
                                                                title="Chỉnh sửa bệnh nhân"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeletePatient(patient.id)}
                                                                disabled={isSubmitting}
                                                                title="Xóa bệnh nhân"
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-600" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    {patients?.length === 0 && !loading && (
                                        <div className="text-center py-12">
                                            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Không tìm thấy bệnh nhân
                                            </h3>
                                            <p className="text-gray-500 mb-4">
                                                {hasActiveFilters
                                                    ? "Không có bệnh nhân nào phù hợp với bộ lọc của bạn."
                                                    : "Chưa có bệnh nhân nào trong hệ thống."
                                                }
                                            </p>
                                            {hasActiveFilters && (
                                                <Button variant="outline" onClick={clearAllFilters}>
                                                    Xóa bộ lọc
                                                </Button>
                                            )}
                                        </div>
                                    )}

                                    {pagination && pagination.total > 0 && (
                                        <Pagination
                                            currentPage={pagination.page}
                                            totalPages={pagination.totalPages}
                                            totalItems={pagination.total}
                                            itemsPerPage={pagination.limit}
                                            onPageChange={handlePageChange}
                                            onItemsPerPageChange={handleItemsPerPageChange}
                                            className="mt-4"
                                        />
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Add/Edit Patient Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingPatient ? "Chỉnh Sửa Bệnh Nhân" : "Thêm Bệnh Nhân Mới"}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingPatient ? "Cập nhật thông tin bệnh nhân" : "Nhập thông tin cho bệnh nhân mới"}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-6 py-4">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                        Thông Tin Cơ Bản
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="firstName">Họ *</Label>
                                            <Input
                                                id="firstName"
                                                defaultValue={editingPatient?.firstname}
                                                placeholder="Nhập họ"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="lastName">Tên *</Label>
                                            <Input
                                                id="lastName"
                                                defaultValue={editingPatient?.lastname}
                                                placeholder="Nhập tên"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                defaultValue={editingPatient?.user?.email}
                                                placeholder="Nhập địa chỉ email"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">Số điện thoại</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                defaultValue={editingPatient?.phoneNumber}
                                                placeholder="Nhập số điện thoại"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                        Thông Tin Cá Nhân
                                    </h3>

                                    <div className="grid gap-2">
                                        <Label htmlFor="address">Địa chỉ</Label>
                                        <Textarea
                                            id="address"
                                            defaultValue={editingPatient?.address}
                                            placeholder="Nhập địa chỉ chi tiết"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    onClick={handleSubmitPatient}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <ButtonLoading message={editingPatient ? "Đang cập nhật..." : "Đang thêm..."} />
                                    ) : (
                                        editingPatient ? "Cập Nhật" : "Thêm Bệnh Nhân"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* View Patient Dialog */}
                    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Chi Tiết Bệnh Nhân</DialogTitle>
                                <DialogDescription>Thông tin chi tiết về bệnh nhân</DialogDescription>
                            </DialogHeader>
                            {viewingPatient && (
                                <div className="grid gap-6 py-4">
                                    {/* Basic Information */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900 border-b pb-1">Thông Tin Cơ Bản</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="font-semibold text-sm">Họ và tên</Label>
                                                <p className="text-sm">{`${viewingPatient.firstname} ${viewingPatient.lastname}`}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="font-semibold text-sm">Email</Label>
                                                <p className="text-sm">{viewingPatient.user?.email || "Chưa có"}</p>
                                            </div>
                                            <div>
                                                <Label className="font-semibold text-sm">Số điện thoại</Label>
                                                <p className="text-sm">{viewingPatient.phoneNumber || "Chưa có"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900 border-b pb-1">Địa Chỉ</h4>
                                        <div>
                                            <p className="text-sm">{viewingPatient.address || "Chưa có thông tin địa chỉ"}</p>
                                        </div>
                                    </div>

                                    {/* Appointments */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900 border-b pb-1">Lịch Hẹn</h4>
                                        <div>
                                            {viewingPatient.Appointment && viewingPatient.Appointment.length > 0 ? (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">
                                                        Tổng số lịch hẹn: {viewingPatient.Appointment.length}
                                                    </p>
                                                    {/* Add more appointment details as needed */}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">Chưa có lịch hẹn nào</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                                    Đóng
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </main>
            </div>
        </div>
    )
}