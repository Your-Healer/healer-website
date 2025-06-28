"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    Clock,
    Calendar,
    Users,
    MapPin,
    Building2,
    Stethoscope,
    User,
    Phone,
    Search,
    Filter,
    CheckCircle,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Activity,
    DollarSign,
    Info
} from "lucide-react"
import { MedicalRoomWithDetails, MedicalRoomTimeWithDetails } from "@/models/models"
import { APPOINTMENTSTATUS } from "@/utils/enum"
import { TableLoading } from "@/components/loading"

interface ViewRoomTimesDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    room: MedicalRoomWithDetails | null
    timeSlots: MedicalRoomTimeWithDetails[]
    loading?: boolean
}

export function ViewRoomTimesDialog({
    open,
    onOpenChange,
    room,
    timeSlots,
    loading = false
}: ViewRoomTimesDialogProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [dateFilter, setDateFilter] = useState<string>("")
    const [activeTab, setActiveTab] = useState("overview")
    const [expandedTimeSlots, setExpandedTimeSlots] = useState<Set<string>>(new Set())

    if (!room) return null

    const formatDateTime = (date: Date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date))
    }

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date))
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(date))
    }

    const getTimeSlotStatus = (timeSlot: MedicalRoomTimeWithDetails) => {
        const now = new Date()
        const fromTime = new Date(timeSlot.fromTime)
        const toTime = new Date(timeSlot.toTime)

        const hasBookings = timeSlot.bookings && timeSlot.bookings.length > 0
        const hasActiveBookings = timeSlot.bookings?.some(booking =>
            booking.appointment?.some(apt =>
                apt.status === APPOINTMENTSTATUS.BOOKED || apt.status === APPOINTMENTSTATUS.PAID
            )
        )

        if (now > toTime) {
            return {
                status: "finished",
                label: "Đã kết thúc",
                color: "bg-gray-100 text-gray-800",
                icon: CheckCircle,
                variant: "outline" as const
            }
        } else if (now >= fromTime && now <= toTime) {
            if (hasActiveBookings) {
                return {
                    status: "active-booked",
                    label: "Đang khám",
                    color: "bg-green-100 text-green-800",
                    icon: Activity,
                    variant: "default" as const
                }
            } else {
                return {
                    status: "active-free",
                    label: "Đang trống",
                    color: "bg-blue-100 text-blue-800",
                    icon: Clock,
                    variant: "secondary" as const
                }
            }
        } else {
            if (hasActiveBookings) {
                return {
                    status: "upcoming-booked",
                    label: "Đã đặt",
                    color: "bg-yellow-100 text-yellow-800",
                    icon: Calendar,
                    variant: "secondary" as const
                }
            } else {
                return {
                    status: "upcoming-free",
                    label: "Trống",
                    color: "bg-indigo-100 text-indigo-800",
                    icon: AlertCircle,
                    variant: "outline" as const
                }
            }
        }
    }

    // Statistics
    const totalTimeSlots = timeSlots.length
    const bookedTimeSlots = timeSlots.filter(slot =>
        slot.bookings && slot.bookings.length > 0 &&
        slot.bookings.some(booking =>
            booking.appointment?.some(apt =>
                apt.status === APPOINTMENTSTATUS.BOOKED || apt.status === APPOINTMENTSTATUS.PAID
            )
        )
    ).length
    const availableTimeSlots = totalTimeSlots - bookedTimeSlots
    const todayTimeSlots = timeSlots.filter(slot => {
        const today = new Date().toDateString()
        return new Date(slot.fromTime).toDateString() === today
    }).length

    // Filter time slots
    const filteredTimeSlots = timeSlots.filter(timeSlot => {
        const matchesSearch = searchTerm === "" ||
            formatDate(timeSlot.fromTime).includes(searchTerm) ||
            formatTime(timeSlot.fromTime).includes(searchTerm) ||
            formatTime(timeSlot.toTime).includes(searchTerm)

        const matchesDate = dateFilter === "" ||
            formatDate(timeSlot.fromTime) === formatDate(new Date(dateFilter))

        const status = getTimeSlotStatus(timeSlot)
        const matchesStatus = statusFilter === "all" || status.status === statusFilter

        return matchesSearch && matchesDate && matchesStatus
    })

    // Group time slots by date
    const groupedTimeSlots = filteredTimeSlots.reduce((groups, timeSlot) => {
        const date = formatDate(timeSlot.fromTime)
        if (!groups[date]) {
            groups[date] = []
        }
        groups[date].push(timeSlot)
        return groups
    }, {} as Record<string, MedicalRoomTimeWithDetails[]>)

    const clearFilters = () => {
        setSearchTerm("")
        setStatusFilter("all")
        setDateFilter("")
    }

    const hasActiveFilters = searchTerm !== "" || statusFilter !== "all" || dateFilter !== ""

    const toggleTimeSlotExpansion = (timeSlotId: string) => {
        const newExpanded = new Set(expandedTimeSlots)
        if (newExpanded.has(timeSlotId)) {
            newExpanded.delete(timeSlotId)
        } else {
            newExpanded.add(timeSlotId)
        }
        setExpandedTimeSlots(newExpanded)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl w-[90vw] max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader className="pb-3 space-y-2">
                    <DialogTitle className="flex items-center gap-3 text-lg">
                        <div className="p-1.5 bg-blue-100 rounded-md">
                            <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <span>{room.name}</span>
                            <p className="text-sm text-gray-500 font-normal">
                                {room.department.name} • {room.service.name}
                            </p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                    <TabsList className="grid w-full grid-cols-3 mb-3">
                        <TabsTrigger value="overview" className="flex items-center gap-1.5 text-sm">
                            <Info className="h-3.5 w-3.5" />
                            Tổng Quan
                        </TabsTrigger>
                        <TabsTrigger value="schedule" className="flex items-center gap-1.5 text-sm">
                            <Calendar className="h-3.5 w-3.5" />
                            Lịch Trình
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="flex items-center gap-1.5 text-sm">
                            <Activity className="h-3.5 w-3.5" />
                            Thống Kê
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-y-auto min-h-0">
                        <TabsContent value="overview" className="space-y-4 mt-0">
                            {/* Room Stats - More compact */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                <Card className="border-l-4 border-l-blue-500">
                                    <CardContent className="p-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-lg font-bold">{totalTimeSlots}</p>
                                                <p className="text-xs text-gray-500">Tổng khung giờ</p>
                                            </div>
                                            <Clock className="h-5 w-5 text-blue-600" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-l-4 border-l-green-500">
                                    <CardContent className="p-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-lg font-bold">{bookedTimeSlots}</p>
                                                <p className="text-xs text-gray-500">Đã đặt chỗ</p>
                                            </div>
                                            <Users className="h-5 w-5 text-green-600" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-l-4 border-l-yellow-500">
                                    <CardContent className="p-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-lg font-bold">{availableTimeSlots}</p>
                                                <p className="text-xs text-gray-500">Còn trống</p>
                                            </div>
                                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-l-4 border-l-purple-500">
                                    <CardContent className="p-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-lg font-bold">{todayTimeSlots}</p>
                                                <p className="text-xs text-gray-500">Hôm nay</p>
                                            </div>
                                            <Calendar className="h-5 w-5 text-purple-600" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Room Details - More compact */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">Thông Tin Chi Tiết</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm text-gray-900">Thông Tin Phòng</h4>
                                            <div className="space-y-1.5 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Tên phòng:</span>
                                                    <span className="font-medium">{room.name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Tầng:</span>
                                                    <span className="font-medium">Tầng {room.floor}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Khoa:</span>
                                                    <span className="font-medium">{room.department.name}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm text-gray-900">Dịch Vụ</h4>
                                            <div className="space-y-1.5 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Tên dịch vụ:</span>
                                                    <span className="font-medium">{room.service.name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Thời gian:</span>
                                                    <span className="font-medium">{room.service.durationTime} phút</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Giá:</span>
                                                    <span className="font-medium">{room.service.price?.toLocaleString('vi-VN')} VNĐ</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="schedule" className="space-y-4 mt-0">
                            {/* Filters - More compact */}
                            <Card>
                                <CardContent className="p-3">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="space-y-1">
                                            <Label htmlFor="search" className="text-xs">Tìm kiếm</Label>
                                            <div className="relative">
                                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                                                <Input
                                                    id="search"
                                                    placeholder="Tìm theo ngày, giờ..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-8 h-8 text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <Label htmlFor="date" className="text-xs">Ngày</Label>
                                            <Input
                                                id="date"
                                                type="date"
                                                value={dateFilter}
                                                onChange={(e) => setDateFilter(e.target.value)}
                                                className="h-8 text-sm"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <Label htmlFor="status" className="text-xs">Trạng thái</Label>
                                            <select
                                                id="status"
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="all">Tất cả</option>
                                                <option value="upcoming-free">Sắp tới - Trống</option>
                                                <option value="upcoming-booked">Sắp tới - Đã đặt</option>
                                                <option value="active-free">Đang trống</option>
                                                <option value="active-booked">Đang khám</option>
                                                <option value="completed">Đã kết thúc</option>
                                            </select>
                                        </div>
                                    </div>

                                    {hasActiveFilters && (
                                        <div className="flex items-center gap-2 mt-2 text-xs">
                                            <span className="text-gray-600">Đang lọc:</span>
                                            <div className="flex flex-wrap gap-1">
                                                {searchTerm && <Badge variant="secondary" className="text-xs">"{searchTerm}"</Badge>}
                                                {dateFilter && <Badge variant="secondary" className="text-xs">{formatDate(new Date(dateFilter))}</Badge>}
                                                {statusFilter !== "all" && <Badge variant="secondary" className="text-xs">Đã lọc trạng thái</Badge>}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={clearFilters}
                                                className="h-6 px-2 text-xs"
                                            >
                                                Xóa bộ lọc
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Schedule List - More compact */}
                            {loading ? (
                                <TableLoading />
                            ) : Object.keys(groupedTimeSlots).length === 0 ? (
                                <Card>
                                    <CardContent className="text-center py-8">
                                        <Clock className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                                        <h3 className="text-base font-medium text-gray-900 mb-2">
                                            Không tìm thấy khung giờ
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-3">
                                            {hasActiveFilters
                                                ? "Không có khung giờ nào phù hợp với bộ lọc."
                                                : "Chưa có khung giờ nào cho phòng này."
                                            }
                                        </p>
                                        {hasActiveFilters && (
                                            <Button variant="outline" size="sm" onClick={clearFilters}>
                                                Xóa bộ lọc
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {Object.entries(groupedTimeSlots)
                                        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                                        .map(([date, slots]) => (
                                            <Card key={date}>
                                                <CardHeader className="pb-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-blue-600" />
                                                            <div>
                                                                <h3 className="font-semibold text-sm text-gray-900">{date}</h3>
                                                                <p className="text-xs text-gray-500">{slots.length} khung giờ</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            {Array.from(new Set(slots.map(slot => getTimeSlotStatus(slot).status))).map(status => {
                                                                const count = slots.filter(slot => getTimeSlotStatus(slot).status === status).length
                                                                const statusInfo = getTimeSlotStatus(slots.find(slot => getTimeSlotStatus(slot).status === status)!)
                                                                return (
                                                                    <Badge key={status} variant={statusInfo.variant} className="text-xs px-1.5 py-0.5">
                                                                        {count}
                                                                    </Badge>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <div className="space-y-1.5">
                                                        {slots
                                                            .sort((a, b) => new Date(a.fromTime).getTime() - new Date(b.fromTime).getTime())
                                                            .map((timeSlot) => {
                                                                const status = getTimeSlotStatus(timeSlot)
                                                                const StatusIcon = status.icon
                                                                const isExpanded = expandedTimeSlots.has(timeSlot.id)
                                                                const hasBookings = timeSlot.bookings && timeSlot.bookings.length > 0

                                                                return (
                                                                    <div key={timeSlot.id} className="border rounded-md overflow-hidden">
                                                                        <div className="p-2.5 hover:bg-gray-50 transition-colors">
                                                                            <div className="flex items-center justify-between">
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Clock className="h-3.5 w-3.5 text-gray-500" />
                                                                                        <span className="font-medium text-sm">
                                                                                            {formatTime(timeSlot.fromTime)} - {formatTime(timeSlot.toTime)}
                                                                                        </span>
                                                                                    </div>

                                                                                    <Badge variant={status.variant} className="gap-1 text-xs px-1.5 py-0.5">
                                                                                        <StatusIcon className="h-2.5 w-2.5" />
                                                                                        {status.label}
                                                                                    </Badge>

                                                                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                                                                        <Users className="h-3 w-3" />
                                                                                        {timeSlot.bookings?.length || 0}
                                                                                    </div>
                                                                                </div>

                                                                                {hasBookings && (
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        onClick={() => toggleTimeSlotExpansion(timeSlot.id)}
                                                                                        className="h-6 w-6 p-0"
                                                                                    >
                                                                                        {isExpanded ? (
                                                                                            <ChevronUp className="h-3 w-3" />
                                                                                        ) : (
                                                                                            <ChevronDown className="h-3 w-3" />
                                                                                        )}
                                                                                    </Button>
                                                                                )}
                                                                            </div>

                                                                            {/* Booking Details */}
                                                                            {hasBookings && isExpanded && (
                                                                                <div className="mt-2 pt-2 border-t border-gray-100">
                                                                                    <div className="space-y-1.5">
                                                                                        {timeSlot.bookings!.map((booking) => (
                                                                                            <div key={booking.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                                                                                        <User className="h-3 w-3 text-blue-600" />
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <p className="font-medium text-xs">
                                                                                                            {`${booking.patient.firstname} ${booking.patient.lastname}`}
                                                                                                        </p>
                                                                                                        {booking.patient.phoneNumber && (
                                                                                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                                                                <Phone className="h-2.5 w-2.5" />
                                                                                                                {booking.patient.phoneNumber}
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                </div>

                                                                                                <div className="flex flex-wrap gap-1">
                                                                                                    {booking.appointment?.map((apt) => (
                                                                                                        <Badge
                                                                                                            key={apt.id}
                                                                                                            variant={
                                                                                                                apt.status === APPOINTMENTSTATUS.PAID ? "default" :
                                                                                                                    apt.status === APPOINTMENTSTATUS.BOOKED ? "secondary" :
                                                                                                                        apt.status === APPOINTMENTSTATUS.CANCEL ? "destructive" :
                                                                                                                            "outline"
                                                                                                            }
                                                                                                            className="text-xs px-1 py-0"
                                                                                                        >
                                                                                                            {apt.status === APPOINTMENTSTATUS.PAID && "Đã thanh toán"}
                                                                                                            {apt.status === APPOINTMENTSTATUS.BOOKED && "Đã đặt"}
                                                                                                            {apt.status === APPOINTMENTSTATUS.CANCEL && "Đã hủy"}
                                                                                                            {apt.status === APPOINTMENTSTATUS.IDLE && "Chờ xử lý"}
                                                                                                        </Badge>
                                                                                                    ))}
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="analytics" className="space-y-4 mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Utilization Chart */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base">Tỷ Lệ Sử Dụng</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">Đã đặt chỗ</span>
                                                <span className="font-medium">{bookedTimeSlots}/{totalTimeSlots}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${totalTimeSlots > 0 ? (bookedTimeSlots / totalTimeSlots) * 100 : 0}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {totalTimeSlots > 0 ? Math.round((bookedTimeSlots / totalTimeSlots) * 100) : 0}% tỷ lệ sử dụng
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Revenue Estimation */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <DollarSign className="h-4 w-4" />
                                            Doanh Thu Ước Tính
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Giá dịch vụ:</span>
                                                <span className="font-medium">{room.service.price?.toLocaleString('vi-VN')} VNĐ</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Đã đặt:</span>
                                                <span className="font-medium">{bookedTimeSlots} khung giờ</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between font-semibold">
                                                <span>Tổng ước tính:</span>
                                                <span className="text-green-600">
                                                    {((room.service.price || 0) * bookedTimeSlots).toLocaleString('vi-VN')} VNĐ
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Status Distribution */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">Phân Bố Trạng Thái</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {Object.entries(
                                            timeSlots.reduce((acc, slot) => {
                                                const status = getTimeSlotStatus(slot).status
                                                acc[status] = (acc[status] || 0) + 1
                                                return acc
                                            }, {} as Record<string, number>)
                                        ).map(([status, count]) => {
                                            const statusInfo = getTimeSlotStatus(timeSlots.find(slot => getTimeSlotStatus(slot).status === status)!)
                                            const StatusIcon = statusInfo.icon
                                            return (
                                                <div key={status} className="text-center p-3 bg-gray-50 rounded-lg">
                                                    <StatusIcon className="h-5 w-5 mx-auto mb-1.5 text-gray-600" />
                                                    <p className="text-lg font-bold">{count}</p>
                                                    <p className="text-xs text-gray-600">{statusInfo.label}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>

                <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Đóng
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}