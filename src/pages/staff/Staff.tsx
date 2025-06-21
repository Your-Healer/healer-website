"use client"

import { useEffect, useState, useCallback } from "react"
import Sidebar from "@/components/layout/Sidebar/Sidebar"
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
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Search, UserCheck, GraduationCap, Building, RefreshCw } from "lucide-react"
import { StaffWithDetails } from "@/models/models"
import { useSession } from "@/contexts/SessionProvider"
import { useGetStaffs } from "@/hooks/use-staffs"
import { TableLoading, ButtonLoading } from "@/components/loading"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"
import { SelectDepartments } from "@/components/select/SelectDepartments"
import { SelectPositions } from "./SelectPositions"
import { useGetDepartments } from "@/hooks/use-departments"
import { useGetPositions } from "@/hooks/use-positions"
import { getDepartmentName, getEducationDisplayName, getPositionName } from "@/utils/utils"

export default function StaffManagement() {
    const { account } = useSession()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingStaff, setEditingStaff] = useState<StaffWithDetails | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
    const [departmentFilter, setDepartmentFilter] = useState<string>("all")
    const [positionFilter, setPositionFilter] = useState<string>("all")
    const [educationFilter, setEducationFilter] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isSubmitting, setIsSubmitting] = useState(false)
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
    }, [departmentFilter, positionFilter, educationFilter])

    const { staffs: getStaffs, pagination, loading: getStaffsLoading, refetch } = useGetStaffs({
        page: currentPage,
        limit: itemsPerPage,
        departmentId: departmentFilter !== "all" ? departmentFilter : undefined,
        positionId: positionFilter !== "all" ? positionFilter : undefined,
        educationLevel: educationFilter !== "all" ? educationFilter as any : undefined,
        query: debouncedSearchTerm || undefined
    })

    const handleAddStaff = () => {
        setEditingStaff(null)
        setIsDialogOpen(true)
    }

    const handleEditStaff = (staff: StaffWithDetails) => {
        setEditingStaff(staff)
        setIsDialogOpen(true)
    }

    const handleDeleteStaff = async (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
            try {
                setIsSubmitting(true)
                // Add delete API call here
                toast.success("Xóa nhân viên thành công")
            } catch (error) {
                toast.error("Lỗi khi xóa nhân viên")
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    const handleSubmitStaff = async () => {
        try {
            setIsSubmitting(true)
            // Add create/update API call here
            setIsDialogOpen(false)
            toast.success(editingStaff ? "Cập nhật nhân viên thành công" : "Thêm nhân viên thành công")
        } catch (error) {
            toast.error("Lỗi khi lưu thông tin nhân viên")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value)
    }, [])

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page
    };

    const clearAllFilters = () => {
        setSearchTerm("")
        setDepartmentFilter("all")
        setPositionFilter("all")
        setEducationFilter("all")
        setCurrentPage(1)
    }

    // Use hooks to get departments and positions for filter display
    const { departments } = useGetDepartments({
        page: 1,
        limit: 1000,
    })

    const { positions } = useGetPositions({
        page: 1,
        limit: 1000,
    })

    const hasActiveFilters = searchTerm !== "" || departmentFilter !== "all" || positionFilter !== "all" || educationFilter !== "all"

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole={account?.role?.id || "1"} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Quản Lý Nhân Viên</h1>
                                <p className="text-gray-600">Quản lý thông tin và phân công nhân viên y tế</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={refetch} disabled={getStaffsLoading}>
                                    <RefreshCw className={`h-4 w-4 mr-2 ${getStaffsLoading ? "animate-spin" : ""}`} />
                                    Làm mới
                                </Button>
                                <Button onClick={handleAddStaff} disabled={isSubmitting}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm Nhân Viên
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Danh Sách Nhân Viên</CardTitle>
                                    <CardDescription>
                                        Xem và quản lý tất cả nhân viên trong hệ thống
                                        {pagination && (
                                            <span className="ml-2 text-sm font-medium">
                                                ({pagination.total} nhân viên)
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
                                            placeholder="Tìm kiếm theo tên, email..."
                                            value={searchTerm}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>

                                    <SelectDepartments
                                        value={departmentFilter}
                                        onValueChange={setDepartmentFilter}
                                        className="w-[180px]"
                                        includeAll={true}
                                        allLabel="Tất cả khoa"
                                    />

                                    <SelectPositions
                                        value={positionFilter}
                                        onValueChange={setPositionFilter}
                                        className="w-[180px]"
                                        includeAll={true}
                                        allLabel="Tất cả chức vụ"
                                    />

                                    <Select value={educationFilter} onValueChange={setEducationFilter}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Lọc theo học vấn" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả học vấn</SelectItem>
                                            <SelectItem value="DIPLOMA">Cao đẳng</SelectItem>
                                            <SelectItem value="BACHELOR">Cử nhân</SelectItem>
                                            <SelectItem value="MASTER">Thạc sĩ</SelectItem>
                                            <SelectItem value="PROFESSIONAL">Chuyên nghiệp</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                        {positionFilter !== "all" && (
                                            <Badge variant="secondary" className="gap-1">
                                                Chức vụ: {getPositionName(positions, positionFilter)}
                                                <button
                                                    onClick={() => setPositionFilter("all")}
                                                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        )}
                                        {educationFilter !== "all" && (
                                            <Badge variant="secondary" className="gap-1">
                                                Học vấn: {getEducationDisplayName(educationFilter)}
                                                <button
                                                    onClick={() => setEducationFilter("all")}
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
                            {getStaffsLoading ? (
                                <TableLoading />
                            ) : (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Họ và tên</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Số điện thoại</TableHead>
                                                <TableHead>Vai trò</TableHead>
                                                <TableHead>Khoa</TableHead>
                                                <TableHead>Học vấn</TableHead>
                                                <TableHead>Trạng thái</TableHead>
                                                <TableHead>Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {getStaffs?.map((staff) => {
                                                return (<TableRow key={staff.id}>
                                                    <TableCell className="font-medium">
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold">
                                                                {`${staff.firstname} ${staff.lastname}`}
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                ID: {staff.id}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {staff.account.email ? (
                                                            <a
                                                                href={`mailto:${staff.account.email}`}
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                {staff.account.email}
                                                            </a>
                                                        ) : (
                                                            <span className="text-gray-400">Chưa có</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {staff.account.phoneNumber ? (
                                                            <a
                                                                href={`tel:${staff.account.phoneNumber}`}
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                {staff.account.phoneNumber}
                                                            </a>
                                                        ) : (
                                                            <span className="text-gray-400">Chưa có</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {staff.positions && staff.positions.length > 0 ? (
                                                            <Badge
                                                                variant={
                                                                    staff.positions.some(pos => pos.position.id === "1") ? "default" :
                                                                        staff.positions.some(pos => pos.position.id === "2") ? "secondary" :
                                                                            staff.positions.some(pos => pos.position.id === "3") ? "outline" :
                                                                                staff.positions.some(pos => pos.position.id === "4") ? "destructive" : "outline"
                                                                }
                                                                className="gap-1"
                                                            >
                                                                <UserCheck className="h-3 w-3" />
                                                                {staff.positions.map(pos => {
                                                                    switch (pos.position.id) {
                                                                        case "1": return "Bác sĩ";
                                                                        case "2": return "Y tá";
                                                                        case "3": return "Lễ Tân";
                                                                        case "4": return "Trưởng Khoa";
                                                                        default: return pos.position.name || "Khác";
                                                                    }
                                                                }).join(", ")}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-gray-400">Chưa có</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {staff.departments && staff.departments.length > 0 ? (
                                                            staff.departments.map((dept, index) => {
                                                                return (<Badge key={dept.department.id} variant="outline" className="gap-1 mr-1">
                                                                    <Building className="h-3 w-3" />
                                                                    {dept.department.name}
                                                                    {dept.department.symbol && (
                                                                        <span className="text-xs">({dept.department.symbol})</span>
                                                                    )}
                                                                </Badge>)
                                                            })
                                                        ) : (
                                                            <span className="text-gray-400">Chưa có</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {staff.educationLevel ? (
                                                            <Badge variant="secondary" className="gap-1">
                                                                <GraduationCap className="h-3 w-3" />
                                                                {getEducationDisplayName(staff.educationLevel)}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-gray-400">Chưa có</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEditStaff(staff)}
                                                                disabled={isSubmitting}
                                                                title="Chỉnh sửa nhân viên"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteStaff(staff.id)}
                                                                disabled={isSubmitting}
                                                                title="Xóa nhân viên"
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-600" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>)
                                            })}
                                        </TableBody>
                                    </Table>

                                    {getStaffs?.length === 0 && !getStaffsLoading && (
                                        <div className="text-center py-12">
                                            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Không tìm thấy nhân viên
                                            </h3>
                                            <p className="text-gray-500 mb-4">
                                                {hasActiveFilters
                                                    ? "Không có nhân viên nào phù hợp với bộ lọc của bạn."
                                                    : "Chưa có nhân viên nào trong hệ thống."
                                                }
                                            </p>
                                            {hasActiveFilters && (
                                                <Button variant="outline" onClick={clearAllFilters}>
                                                    Xóa bộ lọc
                                                </Button>
                                            )}
                                        </div>
                                    )}

                                    {pagination
                                        //  && pagination.total > 0 
                                        && (
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

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingStaff ? "Chỉnh Sửa Nhân Viên" : "Thêm Nhân Viên Mới"}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingStaff ? "Cập nhật thông tin nhân viên" : "Nhập thông tin cho nhân viên mới"}
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
                                                defaultValue={editingStaff?.firstname}
                                                placeholder="Nhập họ"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="lastName">Tên *</Label>
                                            <Input
                                                id="lastName"
                                                defaultValue={editingStaff?.lastname}
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
                                                defaultValue={editingStaff?.account.email}
                                                placeholder="Nhập địa chỉ email"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">Số điện thoại</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                defaultValue={editingStaff?.account.phoneNumber}
                                                placeholder="Nhập số điện thoại"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                        Thông Tin Nghề Nghiệp
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="role">Vai trò *</Label>
                                            <SelectPositions
                                                value={editingStaff?.positions?.[0]?.position.id || ""}
                                                onValueChange={(value) => {
                                                    // Handle position selection
                                                    console.log("Selected position:", value)
                                                }}
                                                placeholder="Chọn vai trò"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="department">Khoa</Label>
                                            <SelectDepartments
                                                value={editingStaff?.departments?.[0]?.department.id || ""}
                                                onValueChange={(value) => {
                                                    console.log("Selected department:", value)
                                                }}
                                                placeholder="Chọn khoa"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="education">Trình độ học vấn</Label>
                                            <Select defaultValue={editingStaff?.educationLevel}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn trình độ học vấn" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="DIPLOMA">Cao đẳng</SelectItem>
                                                    <SelectItem value="ASSOCIATE">Liên thông</SelectItem>
                                                    <SelectItem value="BACHELOR">Cử nhân</SelectItem>
                                                    <SelectItem value="MASTER">Thạc sĩ</SelectItem>
                                                    <SelectItem value="PROFESSIONAL">Chuyên nghiệp</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                        Thông Tin Bổ Sung
                                    </h3>

                                    <div className="grid gap-2">
                                        <Label htmlFor="introduction">Giới thiệu</Label>
                                        <Textarea
                                            id="introduction"
                                            defaultValue={editingStaff?.introduction}
                                            placeholder="Nhập thông tin giới thiệu về nhân viên"
                                            rows={4}
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
                                    onClick={handleSubmitStaff}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <ButtonLoading message={editingStaff ? "Đang cập nhật..." : "Đang thêm..."} />
                                    ) : (
                                        editingStaff ? "Cập Nhật" : "Thêm Nhân Viên"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </main>
            </div>
        </div>
    )
}