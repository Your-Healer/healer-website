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
import { Plus, Edit, Trash2, MapPin, Building, RefreshCw, X, Search } from "lucide-react"
import { useSession } from "@/contexts/SessionProvider"
import { useGetLocations, createLocation, updateLocation, deleteLocation } from "@/hooks/use-locations"
import { LocationWithDetails } from "@/models/models"
import { TableLoading, ButtonLoading } from "@/components/loading"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"

interface LocationFormData {
    name: string
    detail: string
    street: string
    city: string
    country: string
    lat: number | null
    lng: number | null
}

export default function LocationsPage() {
    const { account } = useSession()

    // State management
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingLocation, setEditingLocation] = useState<LocationWithDetails | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form data
    const [formData, setFormData] = useState<LocationFormData>({
        name: "",
        detail: "",
        street: "",
        city: "",
        country: "Việt Nam",
        lat: null,
        lng: null,
    })

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
            setCurrentPage(1)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Fetch locations
    const { locations, pagination, loading, refetch } = useGetLocations({
        page: currentPage,
        limit: itemsPerPage,
        searchTerm: debouncedSearchTerm || undefined,
    })

    // Check if filters are active
    const hasActiveFilters = searchTerm

    const resetForm = () => {
        setFormData({
            name: "",
            detail: "",
            street: "",
            city: "",
            country: "Việt Nam",
            lat: null,
            lng: null,
        })
    }

    const handleAddLocation = () => {
        setEditingLocation(null)
        resetForm()
        setIsDialogOpen(true)
    }

    const handleEditLocation = (location: LocationWithDetails) => {
        setEditingLocation(location)
        setFormData({
            name: location.name,
            detail: location.detail,
            street: location.street,
            city: location.city,
            country: location.country,
            lat: location.lat,
            lng: location.lng,
        })
        setIsDialogOpen(true)
    }

    const handleSubmitLocation = async () => {
        if (!formData.name || !formData.street || !formData.city) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
            return
        }

        setIsSubmitting(true)
        try {
            const submitData = {
                ...formData,
                lat: formData.lat || undefined,
                lng: formData.lng || undefined,
            }

            if (editingLocation) {
                await updateLocation(editingLocation.id, submitData)
                toast.success("Cập nhật địa điểm thành công")
            } else {
                await createLocation(submitData)
                toast.success("Tạo địa điểm mới thành công")
            }

            resetForm()
            setIsDialogOpen(false)
            setEditingLocation(null)
            refetch()
        } catch (error: any) {
            console.error("Error saving location:", error)
            toast.error(error.response?.data?.message || "Không thể lưu thông tin địa điểm")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteLocation = async (id: string, name: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa địa điểm "${name}" không?`)) {
            return
        }

        try {
            await deleteLocation(id)
            toast.success("Xóa địa điểm thành công")
            refetch()
        } catch (error: any) {
            console.error("Error deleting location:", error)
            toast.error(error.response?.data?.message || "Không thể xóa địa điểm")
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

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole={account?.role?.id} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Quản lý Địa điểm</h1>
                                <p className="text-gray-600">Quản lý các địa điểm và cơ sở y tế</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={refetch} disabled={loading}>
                                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                                    Làm mới
                                </Button>
                                <Button onClick={handleAddLocation}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm Địa điểm
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="search">Tìm kiếm địa điểm</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="search"
                                            placeholder="Tìm theo tên, thành phố..."
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

                    {/* Locations Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Danh sách Địa điểm
                                        {pagination && (
                                            <span className="text-sm font-normal text-gray-500">
                                                ({pagination.total} tổng cộng)
                                            </span>
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        Xem và quản lý tất cả các địa điểm trong hệ thống
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
                                                <TableHead>Tên địa điểm</TableHead>
                                                <TableHead>Địa chỉ</TableHead>
                                                <TableHead>Thành phố</TableHead>
                                                <TableHead>Quốc gia</TableHead>
                                                <TableHead>Số khoa</TableHead>
                                                <TableHead>Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {locations.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                        {hasActiveFilters
                                                            ? "Không tìm thấy địa điểm nào phù hợp với bộ lọc"
                                                            : "Chưa có địa điểm nào trong hệ thống"}
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                locations.map((location) => (
                                                    <TableRow key={location.id}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                                {location.name}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="max-w-xs">
                                                            <div className="truncate">
                                                                {location.street}
                                                                {location.detail && (
                                                                    <div className="text-sm text-gray-500 truncate">
                                                                        {location.detail}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{location.city}</TableCell>
                                                        <TableCell>{location.country}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1">
                                                                <Building className="h-3 w-3 text-gray-400" />
                                                                <Badge variant="outline">
                                                                    {location.departments?.length || 0} khoa
                                                                </Badge>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleEditLocation(location)}
                                                                    title="Chỉnh sửa"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-red-600 hover:text-red-700"
                                                                    onClick={() => handleDeleteLocation(location.id, location.name)}
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
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingLocation ? "Chỉnh sửa Địa điểm" : "Thêm Địa điểm mới"}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingLocation ? "Cập nhật thông tin địa điểm" : "Nhập thông tin cho địa điểm mới"}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Tên địa điểm *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="VD: Bệnh viện Đa khoa Trung ương"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="street">Địa chỉ *</Label>
                                    <Input
                                        id="street"
                                        value={formData.street}
                                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                        placeholder="VD: 123 Đường ABC, Phường XYZ"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="detail">Chi tiết địa điểm</Label>
                                    <Textarea
                                        id="detail"
                                        value={formData.detail}
                                        onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                                        placeholder="Thông tin chi tiết về địa điểm"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="city">Thành phố *</Label>
                                        <Input
                                            id="city"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            placeholder="VD: Hà Nội, TP.HCM"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="country">Quốc gia *</Label>
                                        <Input
                                            id="country"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            placeholder="VD: Việt Nam"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="lat">Vĩ độ (Latitude)</Label>
                                        <Input
                                            id="lat"
                                            type="number"
                                            step="any"
                                            value={formData.lat || ""}
                                            onChange={(e) => setFormData({ ...formData, lat: e.target.value ? parseFloat(e.target.value) : null })}
                                            placeholder="VD: 21.0285"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="lng">Kinh độ (Longitude)</Label>
                                        <Input
                                            id="lng"
                                            type="number"
                                            step="any"
                                            value={formData.lng || ""}
                                            onChange={(e) => setFormData({ ...formData, lng: e.target.value ? parseFloat(e.target.value) : null })}
                                            placeholder="VD: 105.8544"
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsDialogOpen(false)
                                        setEditingLocation(null)
                                        resetForm()
                                    }}
                                    disabled={isSubmitting}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    onClick={handleSubmitLocation}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <ButtonLoading message={editingLocation ? "Đang cập nhật..." : "Đang tạo..."} />
                                    ) : (
                                        editingLocation ? "Cập nhật" : "Tạo Địa điểm"
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
