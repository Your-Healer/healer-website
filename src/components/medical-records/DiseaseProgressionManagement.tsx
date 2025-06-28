"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, TrendingUp, Eye, RefreshCw, Calendar, User, Stethoscope } from "lucide-react"
import { TableLoading } from "@/components/loading"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"
import { useGetBlockchainAllPatientDiseaseProgressions } from "@/hooks/use-blockchain"
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

export default function DiseaseProgressionManagement() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [editingProgression, setEditingProgression] = useState<any>(null)
    const [viewingProgression, setViewingProgression] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [diagnosisFilter, setDiagnosisFilter] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate();

    const { allPatientDiseaseProgressions, loading, refetch } = useGetBlockchainAllPatientDiseaseProgressions()

    // Flatten all progressions from all patients
    const allProgressions = allPatientDiseaseProgressions.flatMap(patient =>
        patient.progressions.map(progression => ({
            ...progression,
            patientName: patient.patientName,
            patientId: patient.patientId
        }))
    )

    const formatTimestamp = (timestamp: string) => {
        try {
            const date = new Date(parseInt(timestamp) * 1000);
            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return timestamp;
        }
    }

    const filteredProgressions = allProgressions.filter(progression => {
        const matchesSearch = searchTerm === "" ||
            progression.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            progression.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
            progression.symptoms.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesDiagnosis = diagnosisFilter === "all" || progression.diagnosis.toLowerCase().includes(diagnosisFilter.toLowerCase())

        return matchesSearch && matchesDiagnosis
    })

    const hasActiveFilters = searchTerm !== "" || diagnosisFilter !== "all"

    const clearAllFilters = () => {
        setSearchTerm("")
        setDiagnosisFilter("all")
        setCurrentPage(1)
    }

    // Get unique diagnoses for filter
    const diagnoses = [...new Set(allProgressions.map(prog => prog.diagnosis).filter(Boolean))]

    // Pagination logic
    const totalItems = filteredProgressions.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentProgressions = filteredProgressions.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage)
        setCurrentPage(1)
    }

    const handleAddProgression = () => {
        setEditingProgression(null)
        setIsDialogOpen(true)
    }

    const handleEditProgression = (progression: any) => {
        setEditingProgression(progression)
        setIsDialogOpen(true)
    }

    const handleViewProgression = (progression: any) => {
        setViewingProgression(progression)
        setIsViewDialogOpen(true)
    }

    const handleDeleteProgression = async (progressionId: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tiến triển bệnh này?")) {
            try {
                setIsSubmitting(true)
                // Add delete API call here
                toast.success("Xóa tiến triển bệnh thành công")
                refetch()
            } catch (error) {
                toast.error("Lỗi khi xóa tiến triển bệnh")
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    const handleViewPatientDetails = (patientId: string) => {
        navigate({
            to: "/medical-records/patients/$patientId",
            params: { patientId: patientId }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Quản Lý Tiến Triển Bệnh</h3>
                    <p className="text-sm text-gray-600">
                        Theo dõi và quản lý tiến triển bệnh của bệnh nhân
                        <span className="ml-2 font-medium">({filteredProgressions.length} tiến triển)</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={refetch} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Làm mới
                    </Button>
                    <Button onClick={handleAddProgression} disabled={isSubmitting}>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm Tiến Triển
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Tìm kiếm theo bệnh nhân, chẩn đoán, triệu chứng..."
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
                                <TableHead>Ngày khám</TableHead>
                                <TableHead>Chẩn đoán</TableHead>
                                <TableHead>Triệu chứng</TableHead>
                                <TableHead>Bác sĩ</TableHead>
                                <TableHead>Hẹn khám tiếp</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentProgressions.map((progression, index) => (
                                <TableRow key={`${progression.progressionId}-${index}`}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <button
                                                onClick={() => handleViewPatientDetails(progression.patientId)}
                                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                                                title="Xem chi tiết bệnh nhân"
                                            >
                                                {progression.patientName}
                                            </button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Calendar className="h-3 w-3 text-gray-400" />
                                            {formatTimestamp(progression.visitDate)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[150px] truncate" title={progression.diagnosis}>
                                            <Badge variant="outline" className="gap-1">
                                                <Stethoscope className="h-3 w-3" />
                                                {progression.diagnosis}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[200px] truncate text-sm" title={progression.symptoms}>
                                            {progression.symptoms}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div className="font-medium">
                                                {progression.doctor ?
                                                    `${progression.doctor.staff?.firstname || progression.doctor.user?.firstname || ''} ${progression.doctor.staff?.lastname || progression.doctor.user?.lastname || ''}`.trim() || 'Không có tên'
                                                    : 'Không có tên'
                                                }
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Calendar className="h-3 w-3 text-gray-400" />
                                            {progression.nextAppointment && progression.nextAppointment !== "EMPTY" ?
                                                formatTimestamp(progression.nextAppointment) :
                                                "Chưa hẹn"
                                            }
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewProgression(progression)}
                                                disabled={isSubmitting}
                                                title="Xem chi tiết"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditProgression(progression)}
                                                disabled={isSubmitting}
                                                title="Chỉnh sửa"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteProgression(progression.progressionId)}
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

                    {filteredProgressions.length === 0 && (
                        <div className="text-center py-12">
                            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy tiến triển bệnh</h3>
                            <p className="text-gray-500 mb-4">
                                {hasActiveFilters ? "Không có tiến triển bệnh nào phù hợp với bộ lọc của bạn." : "Chưa có tiến triển bệnh nào."}
                            </p>
                            {hasActiveFilters && (
                                <Button variant="outline" onClick={clearAllFilters}>Xóa bộ lọc</Button>
                            )}
                        </div>
                    )}

                    {filteredProgressions.length > 0 && (
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

            {/* View Progression Detail Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chi Tiết Tiến Triển Bệnh</DialogTitle>
                        <DialogDescription>Thông tin chi tiết về tiến triển bệnh của bệnh nhân</DialogDescription>
                    </DialogHeader>
                    {viewingProgression && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="font-semibold text-sm">Bệnh nhân</Label>
                                    <p className="text-sm">{viewingProgression.patientName}</p>
                                </div>
                                <div>
                                    <Label className="font-semibold text-sm">Ngày khám</Label>
                                    <p className="text-sm">{formatTimestamp(viewingProgression.visitDate)}</p>
                                </div>
                            </div>
                            <div>
                                <Label className="font-semibold text-sm">Triệu chứng</Label>
                                <p className="text-sm whitespace-pre-wrap">{viewingProgression.symptoms}</p>
                            </div>
                            <div>
                                <Label className="font-semibold text-sm">Chẩn đoán</Label>
                                <p className="text-sm whitespace-pre-wrap">{viewingProgression.diagnosis}</p>
                            </div>
                            <div>
                                <Label className="font-semibold text-sm">Điều trị</Label>
                                <p className="text-sm whitespace-pre-wrap">{viewingProgression.treatment}</p>
                            </div>
                            <div>
                                <Label className="font-semibold text-sm">Đơn thuốc</Label>
                                <p className="text-sm whitespace-pre-wrap">{viewingProgression.prescription}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="font-semibold text-sm">Bác sĩ điều trị</Label>
                                    <p className="text-sm">
                                        {viewingProgression.doctor ?
                                            `${viewingProgression.doctor.staff?.firstname || viewingProgression.doctor.user?.firstname || ''} ${viewingProgression.doctor.staff?.lastname || viewingProgression.doctor.user?.lastname || ''}`.trim() || 'Không có tên'
                                            : 'Không có tên'
                                        }
                                    </p>
                                </div>
                                <div>
                                    <Label className="font-semibold text-sm">Hẹn khám tiếp</Label>
                                    <p className="text-sm">
                                        {viewingProgression.nextAppointment && viewingProgression.nextAppointment !== "EMPTY" ?
                                            formatTimestamp(viewingProgression.nextAppointment) :
                                            "Chưa hẹn khám tiếp"
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Đóng
                        </Button>
                        {viewingProgression && (
                            <Button
                                onClick={() => {
                                    setIsViewDialogOpen(false)
                                    handleEditProgression(viewingProgression)
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
