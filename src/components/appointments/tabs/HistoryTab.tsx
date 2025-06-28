"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import { AppointmentWithDetails } from "@/models/models";
import { APPOINTMENTSTATUS } from "@/utils/enum";
import { getAppointmentStatusName } from "@/utils/utils";
import { convertToVietnameseDate } from "@/lib/utils";

interface HistoryTabProps {
    appointment: AppointmentWithDetails;
}

export function HistoryTab({ appointment }: HistoryTabProps) {
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
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Lịch sử trạng thái</h3>

            {appointment.statusLogs.length > 0 ? (
                <div className="space-y-3">
                    {appointment.statusLogs
                        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                        .map((log, index) => (
                            <Card key={log.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                                                <History className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    Trạng thái: {getAppointmentStatusName(log.status)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {convertToVietnameseDate(log.updatedAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className={getStatusColor(log.status)}>
                                            {getAppointmentStatusName(log.status)}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử</h3>
                    <p className="text-gray-500">
                        Chưa có thay đổi trạng thái nào cho lịch hẹn này.
                    </p>
                </div>
            )}
        </div>
    );
}
