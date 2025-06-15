"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Plus, Edit, Trash2, Search, Building, MapPin, Users, RefreshCw, X } from "lucide-react"
import { DepartmentWithDetails } from "@/models/models"
import { useSession } from "@/contexts/SessionProvider"
import { useGetDepartments, createDepartment, updateDepartment, deleteDepartment } from "@/hooks/use-departments"
import { SelectLocations } from "@/components/select/SelectLocations"
import { useGetLocations } from "@/hooks/use-locations"
import { TableLoading, ButtonLoading } from "@/components/loading"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DepartmentFormData {
    name: string
    symbol: string
    locationId: string
    floor: number
}

export default function DepartmentManagement() {
    const { account } = useSession()

    // State management
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
    const [locationFilter, setLocationFilter] = useState("all")
    const [floorFilter, setFloorFilter] = useState("all")

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingDepartment, setEditingDepartment] = useState<DepartmentWithDetails | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form data
    const [formData, setFormData] = useState<DepartmentFormData>({
        name: "",
        symbol: "",
        locationId: "",
        floor: 1,
    })

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
    }, [locationFilter, floorFilter])

    // Fetch departments
    const { departments, pagination, loading, refetch } = useGetDepartments({
        page: currentPage,
        limit: itemsPerPage,
        searchTerm: debouncedSearchTerm || undefined,
        locationId: locationFilter !== "all" ? locationFilter : undefined,
        floor: floorFilter !== "all" ? parseInt(floorFilter) : undefined,
    })

    // Fetch locations for filter display
    const { locations } = useGetLocations({
        page: 1,
        limit: 100,
    })

    // Check if filters are active
    const hasActiveFilters = searchTerm || locationFilter !== "all" || floorFilter !== "all"

    const resetForm = () => {
        setFormData({
            name: "",
            symbol: "",
            locationId: "",
            floor: 1,
        })
    }

    const handleAddDepartment = () => {
        setEditingDepartment(null)
        resetForm()
        setIsDialogOpen(true)
    }

    const handleEditDepartment = (department: DepartmentWithDetails) => {
        setEditingDepartment(department)
        setFormData({
            name: department.name,
            symbol: department.symbol,
            locationId: department.locationId,
            floor: department.floor,
        })
        setIsDialogOpen(true)
    }

    const handleSubmitDepartment = async () => {
        if (!formData.name || !formData.symbol || !formData.locationId) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
            return
        }

        setIsSubmitting(true)
        try {
            if (editingDepartment) {
                await updateDepartment(editingDepartment.id, formData)
                toast.success("Cập nhật khoa thành công")
            } else {
                await createDepartment(formData)
                toast.success("Tạo khoa mới thành công")
            }

            resetForm()
            setIsDialogOpen(false)
            setEditingDepartment(null)
            refetch()
        } catch (error: any) {
            console.error("Error saving department:", error)
            toast.error(error.response?.data?.message || "Không thể lưu thông tin khoa")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteDepartment = async (id: string, name: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa khoa "${name}" không?`)) {
            return
        }

        try {
            await deleteDepartment(id)
            toast.success("Xóa khoa thành công")
            refetch()
        } catch (error: any) {
            console.error("Error deleting department:", error)
            toast.error(error.response?.data?.message || "Không thể xóa khoa")
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
        setCurrentPage(1)
    }

    const clearAllFilters = () => {
        setSearchTerm("")
        setLocationFilter("all")
        setFloorFilter("all")
        setCurrentPage(1)
    }

    // Helper functions to get names from IDs
    const getLocationName = (locationId: string) => {
        if (locationId === "all") return "Tất cả địa điểm"
        const location = locations?.find(l => l.id === locationId)
        return location?.name || "Không xác định"
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
                                <h1 className="text-2xl font-bold text-gray-900">Quản lý Khoa</h1>
                                <p className="text-gray-600">Quản lý các khoa và phòng ban trong bệnh viện</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={refetch} disabled={loading}>
                                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                                    Làm mới
                                </Button>
                                <Button onClick={handleAddDepartment}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm Khoa
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <Label htmlFor="search">Tìm kiếm khoa</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="search"
                                            placeholder="Tìm theo tên khoa, ký hiệu..."
                                            value={searchTerm}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                        />
                                        <Button variant="outline" onClick={() => setCurrentPage(1)}>
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <SelectLocations
                                    label="Địa điểm"
                                    value={locationFilter}
                                    onValueChange={setLocationFilter}
                                    placeholder="Tất cả địa điểm"
                                    includeAll={true}
                                />
                                <div>
                                    <Label htmlFor="floor-filter">Tầng</Label>
                                    <Select value={floorFilter} onValueChange={setFloorFilter}>
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
                                    {locationFilter !== "all" && (
                                        <Badge variant="secondary" className="gap-1">
                                            Địa điểm: {getLocationName(locationFilter)}
                                            <button
                                                onClick={() => setLocationFilter("all")}
                                                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    )}
                                    {floorFilter !== "all" && (
                                        <Badge variant="secondary" className="gap-1">
                                            Tầng: {floorFilter}
                                            <button
                                                onClick={() => setFloorFilter("all")}
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

                    {/* Departments Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building className="h-5 w-5" />
                                        Danh sách Khoa
                                        {pagination && (
                                            <span className="text-sm font-normal text-gray-500">
                                                ({pagination.total} tổng cộng)
                                            </span>
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        Xem và quản lý tất cả các khoa trong hệ thống
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <TableLoading />
                            ) : (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tên khoa</TableHead>
                                                <TableHead>Ký hiệu</TableHead>
                                                <TableHead>Địa điểm</TableHead>
                                                <TableHead>Tầng</TableHead>
                                                <TableHead>Số nhân viên</TableHead>
                                                <TableHead>Trạng thái</TableHead>
                                                <TableHead>Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {departments.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                                        {hasActiveFilters
                                                            ? "Không tìm thấy khoa nào phù hợp với bộ lọc"
                                                            : "Chưa có khoa nào trong hệ thống"}
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                departments.map((department) => (
                                                    <TableRow key={department.id}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <Building className="h-4 w-4 text-gray-400" />
                                                                {department.name}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="font-mono">
                                                                {department.symbol}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="h-3 w-3 text-gray-400" />
                                                                {department.location?.name || "-"}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary">Tầng {department.floor}</Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1">
                                                                <Users className="h-3 w-3 text-gray-400" />
                                                                {department.staffAssignments?.length || 0}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className="bg-green-100 text-green-800">
                                                                Hoạt động
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleEditDepartment(department)}
                                                                    title="Chỉnh sửa"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-red-600 hover:text-red-700"
                                                                    onClick={() => handleDeleteDepartment(department.id, department.name)}
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

                    {/* Add/Edit Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingDepartment ? "Chỉnh sửa Khoa" : "Thêm Khoa mới"}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingDepartment ? "Cập nhật thông tin khoa" : "Nhập thông tin cho khoa mới"}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Tên khoa *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="VD: Khoa Nội tổng hợp"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="symbol">Ký hiệu *</Label>
                                    <Input
                                        id="symbol"
                                        value={formData.symbol}
                                        onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                                        placeholder="VD: NTH, TMH, ..."
                                        maxLength={10}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="location">Địa điểm *</Label>
                                    <SelectLocations
                                        value={formData.locationId}
                                        onValueChange={(value) => setFormData({ ...formData, locationId: value })}
                                        placeholder="Chọn địa điểm"
                                    />
                                </div>

                                <div className="grid gap-2">
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

                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsDialogOpen(false)
                                        setEditingDepartment(null)
                                        resetForm()
                                    }}
                                    disabled={isSubmitting}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    onClick={handleSubmitDepartment}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <ButtonLoading message={editingDepartment ? "Đang cập nhật..." : "Đang tạo..."} />
                                    ) : (
                                        editingDepartment ? "Cập nhật" : "Tạo Khoa"
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
