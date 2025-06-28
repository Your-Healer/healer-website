"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, TestTube, Eye, RefreshCw, Calendar, User, FileText } from "lucide-react"
import { TableLoading } from "@/components/loading"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"
import { useGetBlockchainAllPatientClinicalTests } from "@/hooks/use-blockchain"
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

export default function ClinicalTestsManagement() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [editingTest, setEditingTest] = useState<any>(null)
    const [viewingTest, setViewingTest] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [testTypeFilter, setTestTypeFilter] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigate = useNavigate();

    const { allPatientClinicalTests, loading, refetch } = useGetBlockchainAllPatientClinicalTests()

    // Flatten all tests from all patients
    const allTests = allPatientClinicalTests.flatMap(patient =>
        patient.tests.map(test => ({
            ...test,
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

    const filteredTests = allTests.filter(test => {
        const matchesSearch = searchTerm === "" ||
            test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.result.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesTestType = testTypeFilter === "all" || test.testType === testTypeFilter

        return matchesSearch && matchesTestType
    })

    const hasActiveFilters = searchTerm !== "" || testTypeFilter !== "all"

    const clearAllFilters = () => {
        setSearchTerm("")
        setTestTypeFilter("all")
        setCurrentPage(1)
    }

    // Get unique test types for filter
    const testTypes = [...new Set(allTests.map(test => test.testType))]

    // Pagination logic
    const totalItems = filteredTests.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentTests = filteredTests.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage)
        setCurrentPage(1)
    }

    const handleAddTest = () => {
        setEditingTest(null)
        setIsDialogOpen(true)
    }

    const handleEditTest = (test: any) => {
        setEditingTest(test)
        setIsDialogOpen(true)
    }

    const handleViewTest = (test: any) => {
        setViewingTest(test)
        setIsViewDialogOpen(true)
    }

    const handleViewPatientDetails = (patientId: string) => {
        navigate({
            to: "/medical-records/patients/$patientId",
            params: { patientId: patientId }
        });
    };

    const handleDeleteTest = async (testId: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa kết quả xét nghiệm này?")) {
            try {
                setIsSubmitting(true)
                // Add delete API call here
                toast.success("Xóa kết quả xét nghiệm thành công")
                refetch()
            } catch (error) {
                toast.error("Lỗi khi xóa kết quả xét nghiệm")
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Quản Lý Xét Nghiệm</h3>
                    <p className="text-sm text-gray-600">
                        Quản lý kết quả xét nghiệm của bệnh nhân
                        <span className="ml-2 font-medium">({filteredTests.length} xét nghiệm)</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={refetch} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Làm mới
                    </Button>
                    <Button onClick={handleAddTest} disabled={isSubmitting}>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm Xét Nghiệm
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Tìm kiếm theo bệnh nhân, loại xét nghiệm, kết quả..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={testTypeFilter} onValueChange={setTestTypeFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Lọc theo loại xét nghiệm" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả loại xét nghiệm</SelectItem>
                            {testTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
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
                        {testTypeFilter !== "all" && (
                            <Badge variant="secondary" className="gap-1">
                                Loại: {testTypeFilter}
                                <button onClick={() => setTestTypeFilter("all")} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">×</button>
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
                                <TableHead>Loại xét nghiệm</TableHead>
                                <TableHead>Ngày xét nghiệm</TableHead>
                                <TableHead>Kết quả</TableHead>
                                <TableHead>Bác sĩ thực hiện</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentTests.map((test, index) => (
                                <TableRow key={`${test.testId}-${index}`}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <button
                                                onClick={() => handleViewPatientDetails(test.patientId)}
                                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                                                title="Xem chi tiết bệnh nhân"
                                            >
                                                {test.patientName}
                                            </button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="gap-1">
                                            <TestTube className="h-3 w-3" />
                                            {test.testType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Calendar className="h-3 w-3 text-gray-400" />
                                            {formatTimestamp(test.testDate)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[200px] truncate" title={test.result}>
                                            {test.result}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div className="font-medium">
                                                {test.doctor ?
                                                    `${test.doctor.staff?.firstname || test.doctor.user?.firstname || ''} ${test.doctor.staff?.lastname || test.doctor.user?.lastname || ''}`.trim() || 'Không có tên'
                                                    : 'Không có tên'
                                                }
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewTest(test)}
                                                disabled={isSubmitting}
                                                title="Xem chi tiết"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditTest(test)}
                                                disabled={isSubmitting}
                                                title="Chỉnh sửa"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteTest(test.testId)}
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

                    {filteredTests.length === 0 && (
                        <div className="text-center py-12">
                            <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy xét nghiệm</h3>
                            <p className="text-gray-500 mb-4">
                                {hasActiveFilters ? "Không có xét nghiệm nào phù hợp với bộ lọc của bạn." : "Chưa có kết quả xét nghiệm nào."}
                            </p>
                            {hasActiveFilters && (
                                <Button variant="outline" onClick={clearAllFilters}>Xóa bộ lọc</Button>
                            )}
                        </div>
                    )}

                    {filteredTests.length > 0 && (
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

            {/* View Test Detail Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chi Tiết Kết Quả Xét Nghiệm</DialogTitle>
                        <DialogDescription>Thông tin chi tiết về kết quả xét nghiệm</DialogDescription>
                    </DialogHeader>
                    {viewingTest && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="font-semibold text-sm">Bệnh nhân</Label>
                                    <p className="text-sm">{viewingTest.patientName}</p>
                                </div>
                                <div>
                                    <Label className="font-semibold text-sm">Loại xét nghiệm</Label>
                                    <p className="text-sm">{viewingTest.testType}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="font-semibold text-sm">Ngày xét nghiệm</Label>
                                    <p className="text-sm">{formatTimestamp(viewingTest.testDate)}</p>
                                </div>
                                <div>
                                    <Label className="font-semibold text-sm">Bác sĩ thực hiện</Label>
                                    <p className="text-sm">
                                        {viewingTest.doctor ?
                                            `${viewingTest.doctor.staff?.firstname || viewingTest.doctor.user?.firstname || ''} ${viewingTest.doctor.staff?.lastname || viewingTest.doctor.user?.lastname || ''}`.trim() || 'Không có tên'
                                            : 'Không có tên'
                                        }
                                    </p>
                                </div>
                            </div>
                            <div>
                                <Label className="font-semibold text-sm">Kết quả</Label>
                                <p className="text-sm whitespace-pre-wrap">{viewingTest.result}</p>
                            </div>
                            <div>
                                <Label className="font-semibold text-sm">Ghi chú</Label>
                                <p className="text-sm whitespace-pre-wrap">{viewingTest.notes || "Không có ghi chú"}</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Đóng
                        </Button>
                        {viewingTest && (
                            <Button
                                onClick={() => {
                                    setIsViewDialogOpen(false)
                                    handleEditTest(viewingTest)
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
