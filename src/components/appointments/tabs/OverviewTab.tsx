"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Clock, TimerIcon, Building } from "lucide-react";
import { AppointmentWithDetails } from "@/models/models";
import { convertToVietnameseDate } from "@/lib/utils";

interface OverviewTabProps {
    appointment: AppointmentWithDetails;
}

export function OverviewTab({ appointment }: OverviewTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointment Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Thông tin lịch hẹn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-semibold">Thời gian bắt đầu</Label>
                            <p className="text-sm flex items-center gap-1">
                                <Clock className="h-3 w-3 text-gray-400" />
                                {convertToVietnameseDate(appointment.bookingTime.medicalRoomTime.fromTime)}
                            </p>
                        </div>
                        <div>
                            <Label className="text-sm font-semibold">Thời gian kết thúc</Label>
                            <p className="text-sm flex items-center gap-1">
                                <TimerIcon className="h-3 w-3 text-gray-400" />
                                {convertToVietnameseDate(appointment.bookingTime.medicalRoomTime.toTime)}
                            </p>
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-semibold">Phòng khám</Label>
                        <p className="text-sm flex items-center gap-1">
                            <Building className="h-3 w-3 text-gray-400" />
                            {appointment.medicalRoom.name} - Tầng {appointment.medicalRoom.floor}
                        </p>
                    </div>
                    <div>
                        <Label className="text-sm font-semibold">Khoa</Label>
                        <p className="text-sm">{appointment.medicalRoom.department.name}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Service Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Thông tin dịch vụ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="text-sm font-semibold">Tên dịch vụ</Label>
                        <p className="text-sm font-medium">{appointment.medicalRoom.service.name}</p>
                    </div>
                    {appointment.medicalRoom.service.description && (
                        <div>
                            <Label className="text-sm font-semibold">Mô tả</Label>
                            <p className="text-sm text-gray-600">{appointment.medicalRoom.service.description}</p>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-semibold">Thời gian dự kiến</Label>
                            <p className="text-sm">{appointment.medicalRoom.service.durationTime} phút</p>
                        </div>
                        <div>
                            <Label className="text-sm font-semibold">Giá dịch vụ</Label>
                            <p className="text-sm font-medium text-green-600">
                                {appointment.medicalRoom.service.price.toLocaleString('vi-VN')} VNĐ
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
