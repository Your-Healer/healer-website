"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, FileText, Eye, RefreshCw, User, Hash, Stethoscope } from "lucide-react"
import { TableLoading } from "@/components/loading"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"
import { useGetBlockchainAllPatientMedicalRecords } from "@/hooks/use-blockchain"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useNavigate } from "@tanstack/react-router"

export default function MedicalRecordsDataManagement() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [editingRecord, setEditingRecord] = useState<any>(null)
    const [viewingRecord, setViewingRecord] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [diagnosisFilter, setDiagnosisFilter] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigate = useNavigate();

    const { allPatientMedicalRecords, loading, refetch } = useGetBlockchainAllPatientMedicalRecords()

    // Flatten all records from all patients
    const allRecords = allPatientMedicalRecords.flatMap(patient =>
        patient.records.map(record => ({
            ...record,
            patientName: patient.patientName,
            patientId: patient.patientId
        }))
    )

    const formatHash = (hash: string) => {
        if (!hash) return "Không có";
        if (hash.length <= 16) return hash;
        return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
    }

    const filteredRecords = allRecords.filter(record => {
        const matchesSearch = searchTerm === "" ||
            record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.treatment.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesDiagnosis = diagnosisFilter === "all" || record.diagnosis.toLowerCase().includes(diagnosisFilter.toLowerCase())

        return matchesSearch && matchesDiagnosis
    })

    const hasActiveFilters = searchTerm !== "" || diagnosisFilter !== "all"

    const clearAllFilters = () => {
        setSearchTerm("")
        setDiagnosisFilter("all")
        setCurrentPage(1)
    }

    // Get unique diagnoses for filter
    const diagnoses = [...new Set(allRecords.map(record => record.diagnosis).filter(Boolean))]

    // Pagination logic
    const totalItems = filteredRecords.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentRecords = filteredRecords.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage)
        setCurrentPage(1)
    }

    const handleAddRecord = () => {
        setEditingRecord(null)
        setIsDialogOpen(true)
    }

    const handleEditRecord = (record: any) => {
        setEditingRecord(record)
        setIsDialogOpen(true)
    }

    const handleViewRecord = (record: any) => {
        setViewingRecord(record)
        setIsViewDialogOpen(true)
    }

    const handleViewPatientDetails = (patientId: string) => {
        navigate({
            to: "/medical-records/patients/$patientId",
            params: { patientId: patientId }
        });
    };

    const handleDeleteRecord = async (recordId: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa hồ sơ bệnh án này?")) {
            try {
                setIsSubmitting(true)
                // Add delete API call here
                toast.success("Xóa hồ sơ bệnh án thành công")
                refetch()
            } catch (error) {
                toast.error("Lỗi khi xóa hồ sơ bệnh án")
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Quản Lý Hồ Sơ Bệnh Án</h3>
                    <p className="text-sm text-gray-600">
                        Quản lý hồ sơ bệnh án và dữ liệu điều trị
                        <span className="ml-2 font-medium">({filteredRecords.length} hồ sơ)</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={refetch} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
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
                            placeholder="Tìm kiếm theo bệnh nhân, chẩn đoán, điều trị..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={diagnosisFilter} onValueChange={setDiagnosisFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Lọc theo chẩn đoán" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả chẩn đoán</SelectItem>
                            {diagnoses.slice(0, 10).map(diagnosis => (
                                <SelectItem key={diagnosis} value={diagnosis}>{diagnosis}</SelectItem>
                            ))}
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
                        {diagnosisFilter !== "all" && (
                            <Badge variant="secondary" className="gap-1">
                                Chẩn đoán: {diagnosisFilter}
                                <button onClick={() => setDiagnosisFilter("all")} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">×</button>
                            </Badge>
                        )}
                        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                            Xóa tất cả bộ lọc
                        </Button>
                    </div>
                )}
            </div>

            {/* Table */}
            {loading ? (
                <TableLoading />
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Bệnh nhân</TableHead>
                                <TableHead>Chẩn đoán</TableHead>
                                <TableHead>Điều trị</TableHead>
                                <TableHead>Bác sĩ</TableHead>
                                <TableHead>Record Hash</TableHead>
                                <TableHead>Data Pointer</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentRecords.map((record, index) => (
                                <TableRow key={`${record.recordId}-${index}`}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <button
                                                onClick={() => handleViewPatientDetails(record.patientId)}
                                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                                                title="Xem chi tiết bệnh nhân"
                                            >
                                                {record.patientName}
                                            </button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[150px] truncate" title={record.diagnosis}>
                                            <Badge variant="outline" className="gap-1">
                                                <Stethoscope className="h-3 w-3" />
                                                {record.diagnosis}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[200px] truncate text-sm" title={record.treatment}>
                                            {record.treatment}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div className="font-medium">
                                                {record.doctorAccount ?
                                                    `${record.doctorAccount.staff?.firstname || record.doctorAccount.user?.firstname || ''} ${record.doctorAccount.staff?.lastname || record.doctorAccount.user?.lastname || ''}`.trim() || 'Không có tên'
                                                    : 'Không có tên'
                                                }
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-xs font-mono">
                                            <Hash className="h-3 w-3 text-gray-400" />
                                            {formatHash(record.recordHash)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {record.dataPointer ? (
                                                <Badge variant="secondary">#{record.dataPointer}</Badge>
                                            ) : (
                                                <span className="text-gray-400">Không có</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewRecord(record)}
                                                disabled={isSubmitting}
                                                title="Xem chi tiết"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditRecord(record)}
                                                disabled={isSubmitting}
                                                title="Chỉnh sửa"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteRecord(record.recordId)}
                                                disabled={isSubmitting}
                                                title="Xóa"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredRecords.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy hồ sơ bệnh án</h3>
                            <p className="text-gray-500 mb-4">
                                {hasActiveFilters ? "Không có hồ sơ bệnh án nào phù hợp với bộ lọc của bạn." : "Chưa có hồ sơ bệnh án nào."}
                            </p>
                            {hasActiveFilters && (
                                <Button variant="outline" onClick={clearAllFilters}>Xóa bộ lọc</Button>
                            )}
                        </div>
                    )}

                    {filteredRecords.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                            onItemsPerPageChange={handleItemsPerPageChange}
                            className="mt-4"
                        />
                    )}
                </>
            )}

            {/* View Record Detail Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chi Tiết Hồ Sơ Bệnh Án</DialogTitle>
                        <DialogDescription>Thông tin chi tiết về hồ sơ bệnh án</DialogDescription>
                    </DialogHeader>
                    {viewingRecord && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="font-semibold text-sm">Bệnh nhân</Label>
                                    <p className="text-sm">{viewingRecord.patientName}</p>
                                </div>
                                <div>
                                    <Label className="font-semibold text-sm">Bác sĩ điều trị</Label>
                                    <p className="text-sm">
                                        {viewingRecord.doctorAccount ?
                                            `${viewingRecord.doctorAccount.staff?.firstname || viewingRecord.doctorAccount.user?.firstname || ''} ${viewingRecord.doctorAccount.staff?.lastname || viewingRecord.doctorAccount.user?.lastname || ''}`.trim() || 'Không có tên'
                                            : 'Không có tên'
                                        }
                                    </p>
                                </div>
                            </div>
                            <div>
                                <Label className="font-semibold text-sm">Chẩn đoán</Label>
                                <p className="text-sm whitespace-pre-wrap">{viewingRecord.diagnosis}</p>
                            </div>
                            <div>
                                <Label className="font-semibold text-sm">Điều trị</Label>
                                <p className="text-sm whitespace-pre-wrap">{viewingRecord.treatment}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="font-semibold text-sm">Record Hash</Label>
                                    <p className="text-xs font-mono break-all">{viewingRecord.recordHash}</p>
                                </div>
                                <div>
                                    <Label className="font-semibold text-sm">Data Pointer</Label>
                                    <p className="text-sm">{viewingRecord.dataPointer || "Không có"}</p>
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <h4 className="font-semibold text-sm mb-2">Thông tin Blockchain</h4>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <Label className="font-semibold">Tạo bởi</Label>
                                        <p className="font-mono">{viewingRecord.createBy}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Block tạo</Label>
                                        <p>#{viewingRecord.createdAt}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Đóng
                        </Button>
                        {viewingRecord && (
                            <Button
                                onClick={() => {
                                    setIsViewDialogOpen(false)
                                    handleEditRecord(viewingRecord)
                                }}
                            >
                                Chỉnh sửa
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
