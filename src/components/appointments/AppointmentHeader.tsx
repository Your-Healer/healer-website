"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw } from "lucide-react";

interface AppointmentHeaderProps {
    onBack: () => void;
    onRefresh: () => void;
    appointmentId?: string;
}

export function AppointmentHeader({ onBack, onRefresh, appointmentId }: AppointmentHeaderProps) {
    return (
        <div className="mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Chi Tiết Lịch Hẹn
                        </h1>
                        <p className="text-gray-600">
                            Thông tin chi tiết và quản lý lịch hẹn
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={onRefresh}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Làm mới
                    </Button>
                    {appointmentId && (
                        <Badge variant="outline" className="gap-2">
                            ID: {appointmentId}
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    );
}
