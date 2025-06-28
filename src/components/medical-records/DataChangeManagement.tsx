"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, RefreshCw, GitBranch, User, Calendar, Eye } from "lucide-react"
import { TableLoading } from "@/components/loading"

interface DataChange {
    id: string
    recordId: string
    patientName: string
    changeType: "create" | "update" | "delete"
    fieldChanged: string
    oldValue: string
    newValue: string
    changedBy: string
    changedAt: string
    reason: string
    status: "pending" | "approved" | "rejected"
    approvedBy?: string
    approvedAt?: string
}

export default function DataChangeManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isLoading, setIsLoading] = useState(false)

    // Mock data - replace with actual API calls
    const [dataChanges] = useState<DataChange[]>([
        {
            id: "1",
            recordId: "MR001",
            patientName: "Nguyễn Văn A",
            changeType: "update",
            fieldChanged: "diagnosis",
            oldValue: "Cảm cúm thông thường",
            newValue: "Cảm cúm H1N1",
            changedBy: "BS. Trần Thị B",
            changedAt: "2024-01-20T10:30:00Z",
            reason: "Cập nhật chẩn đoán sau kết quả xét nghiệm",
            status: "approved",
            approvedBy: "GS. Lê Văn C",
            approvedAt: "2024-01-20T11:00:00Z"
        },
        {
            id: "2",
            recordId: "MR002",
            patientName: "Lê Thị D",
            changeType: "create",
            fieldChanged: "medical_record",
            oldValue: "",
            newValue: "Hồ sơ bệnh án mới",
            changedBy: "BS. Phạm Văn E",
            changedAt: "2024-01-21T14:15:00Z",
            reason: "Tạo hồ sơ bệnh án cho bệnh nhân mới",
            status: "pending"
        },
        {
            id: "3",
            recordId: "MR003",
            patientName: "Hoàng Văn F",
            changeType: "update",
            fieldChanged: "treatment",
            oldValue: "Thuốc kháng sinh A",
            newValue: "Thuốc kháng sinh B + Vitamin C",
            changedBy: "BS. Nguyễn Thị G",
            changedAt: "2024-01-21T16:45:00Z",
            reason: "Thay đổi phác đồ điều trị do kháng thuốc",
            status: "rejected",
            approvedBy: "GS. Lê Văn C",
            approvedAt: "2024-01-21T17:00:00Z"
        }
    ])

    const getChangeTypeDisplayName = (type: string) => {
        switch (type) {
            case "create": return "Tạo mới"
            case "update": return "Cập nhật"
            case "delete": return "Xóa"
            default: return "Không xác định"
        }
    }

    const getChangeTypeVariant = (type: string) => {
        switch (type) {
            case "create": return "default"
            case "update": return "secondary"
            case "delete": return "destructive"
            default: return "outline"
        }
    }

    const getStatusDisplayName = (status: string) => {
        switch (status) {
            case "pending": return "Chờ duyệt"
            case "approved": return "Đã duyệt"
            case "rejected": return "Từ chối"
            default: return "Không xác định"
        }
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "pending": return "secondary"
            case "approved": return "default"
            case "rejected": return "destructive"
            default: return "outline"
        }
    }

    const filteredChanges = dataChanges.filter(change => {
        const matchesSearch = searchTerm === "" ||
            change.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            change.recordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            change.changedBy.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesType = typeFilter === "all" || change.changeType === typeFilter
        const matchesStatus = statusFilter === "all" || change.status === statusFilter

        return matchesSearch && matchesType && matchesStatus
    })

    const hasActiveFilters = searchTerm !== "" || typeFilter !== "all" || statusFilter !== "all"

    const clearAllFilters = () => {
        setSearchTerm("")
        setTypeFilter("all")
        setStatusFilter("all")
    }

    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString("vi-VN")
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Theo Dõi Thay Đổi Dữ Liệu</h3>
                    <p className="text-sm text-gray-600">
                        Lịch sử và quản lý các thay đổi dữ liệu hồ sơ bệnh án
                        <span className="ml-2 font-medium">({filteredChanges.length} thay đổi)</span>
                    </p>
                </div>
                <Button variant="outline" onClick={() => setIsLoading(!isLoading)} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Làm mới
                </Button>
            </div>

            {/* Filters */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Tìm kiếm theo bệnh nhân, mã hồ sơ, người thay đổi..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Lọc theo loại thay đổi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả loại</SelectItem>
                            <SelectItem value="create">Tạo mới</SelectItem>
                            <SelectItem value="update">Cập nhật</SelectItem>
                            <SelectItem value="delete">Xóa</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Lọc theo trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="pending">Chờ duyệt</SelectItem>
                            <SelectItem value="approved">Đã duyệt</SelectItem>
                            <SelectItem value="rejected">Từ chối</SelectItem>
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
                        {typeFilter !== "all" && (
                            <Badge variant="secondary" className="gap-1">
                                Loại: {getChangeTypeDisplayName(typeFilter)}
                                <button onClick={() => setTypeFilter("all")} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">×</button>
                            </Badge>
                        )}
                        {statusFilter !== "all" && (
                            <Badge variant="secondary" className="gap-1">
                                Trạng thái: {getStatusDisplayName(statusFilter)}
                                <button onClick={() => setStatusFilter("all")} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">×</button>
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
                            <TableHead>Hồ sơ</TableHead>
                            <TableHead>Loại thay đổi</TableHead>
                            <TableHead>Trường dữ liệu</TableHead>
                            <TableHead>Người thay đổi</TableHead>
                            <TableHead>Thời gian</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredChanges.map((change) => (
                            <TableRow key={change.id}>
                                <TableCell>
                                    <div className="font-medium">{change.patientName}</div>
                                    <div className="text-sm text-gray-500 font-mono">{change.recordId}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getChangeTypeVariant(change.changeType)}>
                                        {getChangeTypeDisplayName(change.changeType)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-mono text-sm">{change.fieldChanged}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {change.changedBy}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <Calendar className="h-3 w-3" />
                                        {formatDateTime(change.changedAt)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(change.status)}>
                                        {getStatusDisplayName(change.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {filteredChanges.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thay đổi nào</h3>
                    <p className="text-gray-500 mb-4">
                        {hasActiveFilters ? "Không có thay đổi nào phù hợp với bộ lọc của bạn." : "Chưa có thay đổi dữ liệu nào."}
                    </p>
                    {hasActiveFilters && (
                        <Button variant="outline" onClick={clearAllFilters}>Xóa bộ lọc</Button>
                    )}
                </div>
            )}
        </div>
    )
}
