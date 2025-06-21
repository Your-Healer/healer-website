"use client"

import { useState, useEffect, useCallback } from "react"
import Sidebar from "@/components/layout/Sidebar/Sidebar"
import { Header } from "@/components/layout/Header/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Clock, DollarSign, Stethoscope, RefreshCw, X, Search } from "lucide-react"
import { useSession } from "@/contexts/SessionProvider"
import { useGetServices, createService, updateService, deleteService } from "@/hooks/use-services"
import { ServiceWithDetails } from "@/models/models"
import { TableLoading, ButtonLoading } from "@/components/loading"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"

interface ServiceFormData {
    name: string
    description: string
    durationTime: number
    price: number
}

export default function MedicalServicesPage() {
    const { account } = useSession()

    // State management
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingService, setEditingService] = useState<ServiceWithDetails | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form data
    const [formData, setFormData] = useState<ServiceFormData>({
        name: "",
        description: "",
        durationTime: 30,
        price: 0,
    })

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
            setCurrentPage(1)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Fetch services
    const { services, pagination, loading, refetch } = useGetServices({
        page: currentPage,
        limit: itemsPerPage,
        searchTerm: debouncedSearchTerm || undefined,
    })

    // Check if filters are active
    const hasActiveFilters = searchTerm

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            durationTime: 30,
            price: 0,
        })
    }

    const handleAddService = () => {
        setEditingService(null)
        resetForm()
        setIsDialogOpen(true)
    }

    const handleEditService = (service: ServiceWithDetails) => {
        setEditingService(service)
        setFormData({
            name: service.name,
            description: service.description || "",
            durationTime: service.durationTime,
            price: service.price,
        })
        setIsDialogOpen(true)
    }

    const handleSubmitService = async () => {
        if (!formData.name || formData.price < 0 || formData.durationTime < 5) {
            toast.error("Vui lòng điền đầy đủ thông tin hợp lệ")
            return
        }

        setIsSubmitting(true)
        try {
            if (editingService) {
                await updateService(editingService.id, formData)
                toast.success("Cập nhật dịch vụ thành công")
            } else {
                await createService(formData)
                toast.success("Tạo dịch vụ mới thành công")
            }

            resetForm()
            setIsDialogOpen(false)
            setEditingService(null)
            refetch()
        } catch (error: any) {
            console.error("Error saving service:", error)
            toast.error(error.response?.data?.message || "Không thể lưu thông tin dịch vụ")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteService = async (id: string, name: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa dịch vụ "${name}" không?`)) {
            return
        }

        try {
            await deleteService(id)
            toast.success("Xóa dịch vụ thành công")
            refetch()
        } catch (error: any) {
            console.error("Error deleting service:", error)
            toast.error(error.response?.data?.message || "Không thể xóa dịch vụ")
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
        setCurrentPage(1)
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
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
                                <h1 className="text-2xl font-bold text-gray-900">Quản lý Dịch vụ Y tế</h1>
                                <p className="text-gray-600">Quản lý các dịch vụ khám chữa bệnh và định giá</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={refetch} disabled={loading}>
                                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                                    Làm mới
                                </Button>
                                <Button onClick={handleAddService}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm Dịch vụ
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="search">Tìm kiếm dịch vụ</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="search"
                                            placeholder="Tìm theo tên dịch vụ..."
                                            value={searchTerm}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                        />
                                        <Button variant="outline" onClick={() => setCurrentPage(1)}>
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </div>
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

                    {/* Services Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Stethoscope className="h-5 w-5" />
                                        Danh sách Dịch vụ Y tế
                                        {pagination && (
                                            <span className="text-sm font-normal text-gray-500">
                                                ({pagination.total} tổng cộng)
                                            </span>
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        Xem và quản lý tất cả các dịch vụ y tế trong hệ thống
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
                                                <TableHead>Tên dịch vụ</TableHead>
                                                <TableHead>Mô tả</TableHead>
                                                <TableHead>Thời gian</TableHead>
                                                <TableHead>Giá tiền</TableHead>
                                                <TableHead>Số phòng</TableHead>
                                                <TableHead>Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {services.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                        {hasActiveFilters
                                                            ? "Không tìm thấy dịch vụ nào phù hợp với bộ lọc"
                                                            : "Chưa có dịch vụ nào trong hệ thống"}
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                services.map((service) => (
                                                    <TableRow key={service.id}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <Stethoscope className="h-4 w-4 text-gray-400" />
                                                                {service.name}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="max-w-xs truncate">
                                                            {service.description || "-"}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3 text-gray-400" />
                                                                <span>{service.durationTime} phút</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1 font-semibold text-green-600">
                                                                <DollarSign className="h-3 w-3" />
                                                                {formatCurrency(service.price)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">
                                                                {service?.medicalRooms?.length || 0} phòng
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleEditService(service)}
                                                                    title="Chỉnh sửa"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-red-600 hover:text-red-700"
                                                                    onClick={() => handleDeleteService(service.id, service.name)}
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
                                    {editingService ? "Chỉnh sửa Dịch vụ" : "Thêm Dịch vụ mới"}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingService ? "Cập nhật thông tin dịch vụ" : "Nhập thông tin cho dịch vụ mới"}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Tên dịch vụ *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="VD: Khám tổng quát, Xét nghiệm máu"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Mô tả</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Mô tả chi tiết về dịch vụ"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="duration">Thời gian (phút) *</Label>
                                        <Input
                                            id="duration"
                                            type="number"
                                            min="5"
                                            value={formData.durationTime}
                                            onChange={(e) => setFormData({ ...formData, durationTime: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="price">Giá tiền (VNĐ) *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsDialogOpen(false)
                                        setEditingService(null)
                                        resetForm()
                                    }}
                                    disabled={isSubmitting}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    onClick={handleSubmitService}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <ButtonLoading message={editingService ? "Đang cập nhật..." : "Đang tạo..."} />
                                    ) : (
                                        editingService ? "Cập nhật" : "Tạo Dịch vụ"
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