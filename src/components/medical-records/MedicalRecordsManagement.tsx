"use client"
import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, FileText, Eye, RefreshCw, Calendar, User, Phone, MapPin, Shield, ExternalLink } from "lucide-react"
import { TableLoading } from "@/components/loading"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"
import { EditingMedicalRecordDialog } from "@/components/dialog/medical-records/EditingMedicalRecordDialog"
import { useGetAllBlockchainPatients } from "@/hooks/use-blockchain"
import { BlockchainPatientWithDetails } from "@/models/models"
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

export default function MedicalRecordsManagement() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [editingRecord, setEditingRecord] = useState<BlockchainPatientWithDetails | null>(null)
    const [viewingPatient, setViewingPatient] = useState<BlockchainPatientWithDetails | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [genderFilter, setGenderFilter] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { patients: blockchainPatients, loading: blockchainPatientsLoading, refetch } = useGetAllBlockchainPatients();
    const navigate = useNavigate();

    const formatTimestamp = (timestamp: string) => {
        // Convert timestamp to readable date
        try {
            const date = new Date(parseInt(timestamp) * 1000);
            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch {
            return timestamp;
        }
    }

    const formatWalletAddress = (address: string) => {
        if (!address) return "Không có";
        if (address.length <= 10) return address;
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    const handleAddRecord = () => {
        setEditingRecord(null)
        setIsDialogOpen(true)
    }

    const handleEditRecord = (patient: BlockchainPatientWithDetails) => {
        setEditingRecord(patient)
        setIsDialogOpen(true)
    }

    const handleViewPatient = (patient: BlockchainPatientWithDetails) => {
        setViewingPatient(patient)
        setIsViewDialogOpen(true)
    }

    const handleDeleteRecord = async (patientAddress: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa hồ sơ blockchain này?")) {
            try {
                setIsSubmitting(true)
                // Add delete blockchain patient API call here
                toast.success("Xóa hồ sơ blockchain thành công")
                refetch()
            } catch (error) {
                toast.error("Lỗi khi xóa hồ sơ blockchain")
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    const handleDialogSuccess = () => {
        refetch()
        toast.success("Lưu hồ sơ blockchain thành công")
    }

    const filteredPatients = (blockchainPatients || []).filter(patient => {
        const matchesSearch = searchTerm === "" ||
            patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.address.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesGender = genderFilter === "all" || patient.gender === genderFilter

        return matchesSearch && matchesGender
    })

    const hasActiveFilters = searchTerm !== "" || genderFilter !== "all"

    const clearAllFilters = () => {
        setSearchTerm("")
        setGenderFilter("all")
        setCurrentPage(1)
    }

    // Pagination logic
    const totalItems = filteredPatients.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentPatients = filteredPatients.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage)
        setCurrentPage(1)
    }

    const handleViewPatientDetails = (patientId: string) => {
        navigate({
            to: "/medical-records/patients/$patientId",
            params: { patientId: patientId }
        });
    };

    const handlePatientNameClick = (patientId: string) => {
        handleViewPatientDetails(patientId);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Danh Sách Hồ Sơ Blockchain</h3>
                    <p className="text-sm text-gray-600">
                        Quản lý hồ sơ bệnh nhân trên blockchain
                        <span className="ml-2 font-medium">({filteredPatients.length} hồ sơ)</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={refetch} disabled={blockchainPatientsLoading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${blockchainPatientsLoading ? "animate-spin" : ""}`} />
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
                            placeholder="Tìm kiếm theo tên, số điện thoại, địa chỉ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={genderFilter} onValueChange={setGenderFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Lọc theo giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả giới tính</SelectItem>
                            <SelectItem value="Nam">Nam</SelectItem>
                            <SelectItem value="Nữ">Nữ</SelectItem>
                            <SelectItem value="Khác">Khác</SelectItem>
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
                        {genderFilter !== "all" && (
                            <Badge variant="secondary" className="gap-1">
                                Giới tính: {genderFilter}
                                <button onClick={() => setGenderFilter("all")} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">×</button>
                            </Badge>
                        )}
                        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                            Xóa tất cả bộ lọc
                        </Button>
                    </div>
                )}
            </div>

            {/* Table */}
            {blockchainPatientsLoading ? (
                <TableLoading />
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tên bệnh nhân</TableHead>
                                <TableHead>Giới tính</TableHead>
                                <TableHead>Ngày sinh</TableHead>
                                <TableHead>Liên hệ</TableHead>
                                <TableHead>Người tạo</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentPatients.map((patient, index) => (
                                <TableRow key={`${patient.createdBy}-${index}`}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <button
                                                onClick={() => handlePatientNameClick(patient.patientId)}
                                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                                                title="Xem chi tiết bệnh nhân"
                                            >
                                                {patient.patientName}
                                            </button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {patient.gender}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Calendar className="h-3 w-3 text-gray-400" />
                                            {formatTimestamp(patient.dateOfBirth)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            {patient.phoneNumber && (
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Phone className="h-3 w-3 text-gray-400" />
                                                    {patient.phoneNumber}
                                                </div>
                                            )}
                                            {patient.address && (
                                                <div className="flex items-center gap-1 text-sm truncate max-w-[200px]" title={patient.address}>
                                                    <MapPin className="h-3 w-3 text-gray-400" />
                                                    {patient.address}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div className="font-medium">
                                                {patient.createByAccount ?
                                                    `${patient.createByAccount.staff?.firstname || patient.createByAccount.user?.firstname || ''} ${patient.createByAccount.staff?.lastname || patient.createByAccount.user?.lastname || ''}`.trim() || 'Không có tên'
                                                    : 'Không có tên'
                                                }
                                            </div>
                                            <div className="text-xs text-gray-500 font-mono">
                                                {formatWalletAddress(patient.createdBy)}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Shield className="h-3 w-3" />
                                            Block #{patient.createdAt}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewPatientDetails(patient.patientId)}
                                                disabled={isSubmitting}
                                                title="Xem chi tiết"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewPatient(patient)}
                                                disabled={isSubmitting}
                                                title="Xem thông tin cơ bản"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditRecord(patient)}
                                                disabled={isSubmitting}
                                                title="Chỉnh sửa"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteRecord(patient.createdBy)}
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

                    {filteredPatients.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy hồ sơ</h3>
                            <p className="text-gray-500 mb-4">
                                {hasActiveFilters ? "Không có hồ sơ nào phù hợp với bộ lọc của bạn." : "Chưa có hồ sơ blockchain nào."}
                            </p>
                            {hasActiveFilters && (
                                <Button variant="outline" onClick={clearAllFilters}>Xóa bộ lọc</Button>
                            )}
                        </div>
                    )}

                    {filteredPatients.length > 0 && (
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

            {/* View Patient Detail Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            Chi Tiết Hồ Sơ Blockchain
                            {viewingPatient && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setIsViewDialogOpen(false);
                                        handleViewPatientDetails(viewingPatient.patientId);
                                    }}
                                    className="ml-auto"
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Xem chi tiết đầy đủ
                                </Button>
                            )}
                        </DialogTitle>
                        <DialogDescription>Thông tin chi tiết về bệnh nhân trên blockchain</DialogDescription>
                    </DialogHeader>
                    {viewingPatient && (
                        <div className="grid gap-6 py-4">
                            {/* Patient Information */}
                            <div className="space-y-3">
                                <h4 className="font-medium text-gray-900 border-b pb-1">Thông Tin Bệnh Nhân</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="font-semibold text-sm">Họ và tên</Label>
                                        <p className="text-sm">{viewingPatient.patientName}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold text-sm">Giới tính</Label>
                                        <p className="text-sm">{viewingPatient.gender}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="font-semibold text-sm">Ngày sinh</Label>
                                        <p className="text-sm">{formatTimestamp(viewingPatient.dateOfBirth)}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold text-sm">Số điện thoại</Label>
                                        <p className="text-sm">{viewingPatient.phoneNumber || "Chưa có"}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="font-semibold text-sm">Địa chỉ</Label>
                                    <p className="text-sm">{viewingPatient.address || "Chưa có thông tin địa chỉ"}</p>
                                </div>
                                <div>
                                    <Label className="font-semibold text-sm">Liên hệ khẩn cấp</Label>
                                    <p className="text-sm">{viewingPatient.emergencyContact !== "EMPTY" ? viewingPatient.emergencyContact : "Chưa có"}</p>
                                </div>
                            </div>

                            {/* Blockchain Information */}
                            <div className="space-y-3">
                                <h4 className="font-medium text-gray-900 border-b pb-1">Thông Tin Blockchain</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="font-semibold text-sm">Người tạo</Label>
                                        <p className="text-sm">
                                            {viewingPatient.createByAccount ?
                                                `${viewingPatient.createByAccount.staff?.firstname || viewingPatient.createByAccount.user?.firstname || ''} ${viewingPatient.createByAccount.staff?.lastname || viewingPatient.createByAccount.user?.lastname || ''}`.trim() || 'Không có tên'
                                                : 'Không có tên'
                                            }
                                        </p>
                                        <p className="text-xs text-gray-500 font-mono">{viewingPatient.createdBy}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold text-sm">Block tạo</Label>
                                        <p className="text-sm">#{viewingPatient.createdAt}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="font-semibold text-sm">Người sửa cuối</Label>
                                        <p className="text-sm">
                                            {viewingPatient.lastModifiedByAccount ?
                                                `${viewingPatient.lastModifiedByAccount.staff?.firstname || viewingPatient.lastModifiedByAccount.user?.firstname || ''} ${viewingPatient.lastModifiedByAccount.staff?.lastname || viewingPatient.lastModifiedByAccount.user?.lastname || ''}`.trim() || 'Không có tên'
                                                : 'Không có tên'
                                            }
                                        </p>
                                        <p className="text-xs text-gray-500 font-mono">{viewingPatient.lastModifiedBy}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold text-sm">Block sửa cuối</Label>
                                        <p className="text-sm">#{viewingPatient.lastModifiedAt}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Đóng
                        </Button>
                        {viewingPatient && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsViewDialogOpen(false);
                                        handleViewPatientDetails(viewingPatient.patientId);
                                    }}
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Chi tiết đầy đủ
                                </Button>
                                <Button
                                    onClick={() => {
                                        setIsViewDialogOpen(false)
                                        handleEditRecord(viewingPatient)
                                    }}
                                >
                                    Chỉnh sửa
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <EditingMedicalRecordDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                editingRecord={editingRecord}
                onSuccess={handleDialogSuccess}
            />
        </div>
    )
}
