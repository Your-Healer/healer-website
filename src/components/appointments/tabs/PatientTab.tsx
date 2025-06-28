"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Phone, MapPin } from "lucide-react";
import { AppointmentWithDetails } from "@/models/models";

interface PatientTabProps {
    appointment: AppointmentWithDetails;
}

export function PatientTab({ appointment }: PatientTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Thông tin bệnh nhân</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-semibold">Họ</Label>
                            <p className="text-sm">{appointment.patient.firstname}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-semibold">Tên</Label>
                            <p className="text-sm">{appointment.patient.lastname}</p>
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-semibold">Số điện thoại</Label>
                        <p className="text-sm flex items-center gap-1">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {appointment.patient.phoneNumber || "Chưa có"}
                        </p>
                    </div>
                    <div>
                        <Label className="text-sm font-semibold">Địa chỉ</Label>
                        <p className="text-sm flex items-start gap-1">
                            <MapPin className="h-3 w-3 text-gray-400 mt-0.5" />
                            <span>{appointment.patient.address || "Chưa có thông tin địa chỉ"}</span>
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* User Account Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Thông tin tài khoản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-semibold">Họ</Label>
                            <p className="text-sm">{appointment.user.firstname}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-semibold">Tên</Label>
                            <p className="text-sm">{appointment.user.lastname}</p>
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-semibold">Email</Label>
                        <p className="text-sm">{appointment.user.email || "Chưa có"}</p>
                    </div>
                    <div>
                        <Label className="text-sm font-semibold">Role</Label>
                        <p className="text-sm">{appointment.user.role || "User"}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
