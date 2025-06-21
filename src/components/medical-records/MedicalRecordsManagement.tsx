"use client"
import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, FileText, Eye, RefreshCw, Calendar } from "lucide-react"
import { TableLoading } from "@/components/loading"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"
import { EditingMedicalRecordDialog } from "@/components/dialog/medical-records/EditingMedicalRecordDialog"

interface MedicalRecord {
    id: string
    patientId: string
    patientName: string
    diagnosis: string
    treatment: string
    status: "active" | "completed" | "pending"
    createdAt: string
    updatedAt: string
    doctorName: string
    department: string
}

export default function MedicalRecordsManagement() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [departmentFilter, setDepartmentFilter] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Mock data - replace with actual API calls
    const [records, setRecords] = useState<MedicalRecord[]>([
        {
            id: "1",
            patientId: "P001",
            patientName: "Nguyễn Văn A",
            diagnosis: "Cảm cúm",
            treatment: "Thuốc kháng sinh",
            status: "completed",
            createdAt: "2024-01-15",
            updatedAt: "2024-01-16",
            doctorName: "BS. Trần Thị B",
            department: "Nội khoa"
        },
        {
            id: "2",
            patientId: "P002",
            patientName: "Lê Thị C",
            diagnosis: "Đau dạ dày",
            treatment: "Thuốc bảo vệ niêm mạc dạ dày",
            status: "active",
            createdAt: "2024-01-17",
            updatedAt: "2024-01-17",
            doctorName: "BS. Phạm Văn D",
            department: "Tiêu hóa"
        }
    ])

    const handleAddRecord = () => {
        setEditingRecord(null)
        setIsDialogOpen(true)
    }

    const handleEditRecord = (record: MedicalRecord) => {
        setEditingRecord(record)
        setIsDialogOpen(true)
    }

    const handleDeleteRecord = async (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa hồ sơ này?")) {
            try {
                setIsSubmitting(true)
                // Add delete API call here
                setRecords(prev => prev.filter(record => record.id !== id))
                toast.success("Xóa hồ sơ bệnh án thành công")
            } catch (error) {
                toast.error("Lỗi khi xóa hồ sơ bệnh án")
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    const handleDialogSuccess = () => {
        // Refresh records list after successful create/update
        toast.success("Lưu hồ sơ bệnh án thành công")
    }

    const getStatusDisplayName = (status: string) => {
        switch (status) {
            case "active": return "Đang điều trị"
            case "completed": return "Hoàn thành"
            case "pending": return "Chờ xử lý"
            default: return "Không xác định"
        }
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "active": return "default"
            case "completed": return "secondary"
            case "pending": return "outline"
            default: return "outline"
        }
    }

    const filteredRecords = records.filter(record => {
        const matchesSearch = searchTerm === "" ||
            record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.doctorName.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || record.status === statusFilter
        const matchesDepartment = departmentFilter === "all" || record.department === departmentFilter

        return matchesSearch && matchesStatus && matchesDepartment
    })

    const hasActiveFilters = searchTerm !== "" || statusFilter !== "all" || departmentFilter !== "all"

    const clearAllFilters = () => {
        setSearchTerm("")
        setStatusFilter("all")
        setDepartmentFilter("all")
        setCurrentPage(1)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Danh Sách Hồ Sơ Bệnh Án</h3>
                    <p className="text-sm text-gray-600">
                        Quản lý và theo dõi hồ sơ bệnh án của bệnh nhân
                        <span className="ml-2 font-medium">({filteredRecords.length} hồ sơ)</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsLoading(!isLoading)} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                        Làm mới
                    </Button>
                    <Button onClick={handleAddRecord} disabled={isSubmitting}>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm Hồ Sơ
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Tìm kiếm theo tên bệnh nhân, chẩn đoán, bác sĩ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Lọc theo trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="active">Đang điều trị</SelectItem>
                            <SelectItem value="completed">Hoàn thành</SelectItem>
                            <SelectItem value="pending">Chờ xử lý</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Lọc theo khoa" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả khoa</SelectItem>
                            <SelectItem value="Nội khoa">Nội khoa</SelectItem>
                            <SelectItem value="Ngoại khoa">Ngoại khoa</SelectItem>
                            <SelectItem value="Tiêu hóa">Tiêu hóa</SelectItem>
                            <SelectItem value="Tim mạch">Tim mạch</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {hasActiveFilters && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Bộ lọc đang áp dụng:</span>
                        {searchTerm && (
                            <Badge variant="secondary" className="gap-1">
                                Tìm kiếm: "{searchTerm}"
                                <button onClick={() => setSearchTerm("")} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">×</button>
                            </Badge>
                        )}
                        {statusFilter !== "all" && (
                            <Badge variant="secondary" className="gap-1">
                                Trạng thái: {getStatusDisplayName(statusFilter)}
                                <button onClick={() => setStatusFilter("all")} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">×</button>
                            </Badge>
                        )}
                        {departmentFilter !== "all" && (
                            <Badge variant="secondary" className="gap-1">
                                Khoa: {departmentFilter}
                                <button onClick={() => setDepartmentFilter("all")} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">×</button>
                            </Badge>
                        )}
                        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                            Xóa tất cả bộ lọc
                        </Button>
                    </div>
                )}
            </div>

            {/* Table */}
            {isLoading ? (
                <TableLoading />
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Bệnh nhân</TableHead>
                            <TableHead>Chẩn đoán</TableHead>
                            <TableHead>Bác sĩ</TableHead>
                            <TableHead>Khoa</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead>Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRecords.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell className="font-medium">
                                    <div>
                                        <p className="font-medium">{record.patientName}</p>
                                        <p className="text-sm text-gray-500">ID: {record.patientId}</p>
                                    </div>
                                </TableCell>
                                <TableCell>{record.diagnosis}</TableCell>
                                <TableCell>{record.doctorName}</TableCell>
                                <TableCell>{record.department}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(record.status)}>
                                        {getStatusDisplayName(record.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <Calendar className="h-3 w-3" />
                                        {record.createdAt}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleEditRecord(record)} disabled={isSubmitting}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" disabled={isSubmitting}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteRecord(record.id)} disabled={isSubmitting}>
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {filteredRecords.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy hồ sơ</h3>
                    <p className="text-gray-500 mb-4">
                        {hasActiveFilters ? "Không có hồ sơ nào phù hợp với bộ lọc của bạn." : "Chưa có hồ sơ bệnh án nào."}
                    </p>
                    {hasActiveFilters && (
                        <Button variant="outline" onClick={clearAllFilters}>Xóa bộ lọc</Button>
                    )}
                </div>
            )}

            <EditingMedicalRecordDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                editingRecord={editingRecord}
                onSuccess={handleDialogSuccess}
            />
        </div>
    )
}
