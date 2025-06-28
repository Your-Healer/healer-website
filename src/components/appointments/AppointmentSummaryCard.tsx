"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Building, CreditCard, Edit, CheckCircle, XCircle, Plus } from "lucide-react";
import { AppointmentWithDetails } from "@/models/models";
import { APPOINTMENTSTATUS } from "@/utils/enum";
import { getAppointmentStatusName } from "@/utils/utils";
import { convertToVietnameseDate } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AppointmentSummaryCardProps {
    appointment: AppointmentWithDetails;
    canModifyAppointment: boolean;
    isSubmitting: boolean;
    onStatusUpdate: () => void;
    onCompleteAppointment: () => void;
    onCancelAppointment: () => void;
    onAddDiagnosis: () => void;
}

export function AppointmentSummaryCard({
    appointment,
    canModifyAppointment,
    isSubmitting,
    onStatusUpdate,
    onCompleteAppointment,
    onCancelAppointment,
    onAddDiagnosis
}: AppointmentSummaryCardProps) {
    const getStatusColor = (status: APPOINTMENTSTATUS) => {
        switch (status) {
            case APPOINTMENTSTATUS.PAID:
                return "bg-green-100 text-green-800 border-green-200";
            case APPOINTMENTSTATUS.BOOKED:
                return "bg-blue-100 text-blue-800 border-blue-200";
            case APPOINTMENTSTATUS.IDLE:
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case APPOINTMENTSTATUS.CANCEL:
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                            <Calendar className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">
                                {`${appointment.patient.firstname} ${appointment.patient.lastname}`}
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {convertToVietnameseDate(appointment.bookingTime.medicalRoomTime.fromTime)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Building className="h-3 w-3" />
                                    {appointment.medicalRoom.name}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <Badge className={`mb-2 ${getStatusColor(appointment.status)}`}>
                            {getAppointmentStatusName(appointment.status)}
                        </Badge>
                        <div className="text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <CreditCard className="h-3 w-3" />
                                {appointment.medicalRoom.service.price.toLocaleString('vi-VN')} VNĐ
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            {canModifyAppointment && (
                <CardContent>
                    <div className="flex gap-3 flex-wrap">
                        <Button onClick={onStatusUpdate} disabled={isSubmitting}>
                            <Edit className="h-4 w-4 mr-2" />
                            Cập nhật trạng thái
                        </Button>

                        {appointment.status !== APPOINTMENTSTATUS.PAID && appointment.status !== APPOINTMENTSTATUS.CANCEL && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="default" disabled={isSubmitting}>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Hoàn thành
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Hoàn thành lịch hẹn</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Bạn có chắc chắn muốn đánh dấu lịch hẹn này là hoàn thành?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                                        <AlertDialogAction onClick={onCompleteAppointment}>
                                            Hoàn thành
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}

                        {appointment.status !== APPOINTMENTSTATUS.CANCEL && appointment.status !== APPOINTMENTSTATUS.PAID && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={isSubmitting}>
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Hủy lịch hẹn
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Hủy lịch hẹn</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Bạn có chắc chắn muốn hủy lịch hẹn này? Hành động này không thể hoàn tác.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Không</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={onCancelAppointment}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Hủy lịch hẹn
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}

                        <Button variant="outline" onClick={onAddDiagnosis} disabled={isSubmitting}>
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm chẩn đoán
                        </Button>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
