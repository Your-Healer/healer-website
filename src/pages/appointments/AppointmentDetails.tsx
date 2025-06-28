"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { Header } from "@/components/layout/Header/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/contexts/SessionProvider";
import { Activity, User, Stethoscope, History, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
    useGetAppointmentById,
    updateAppointmentStatus,
    completeAppointment,
    cancelAppointment,
    addDiagnosisSuggestion
} from "@/hooks/use-appointment";
import { TableLoading } from "@/components/loading";
import { toast } from "sonner";
import { APPOINTMENTSTATUS } from "@/utils/enum";

// Import child components
import { AppointmentHeader } from "@/components/appointments/AppointmentHeader";
import { AppointmentSummaryCard } from "@/components/appointments/AppointmentSummaryCard";
import { OverviewTab } from "@/components/appointments/tabs/OverviewTab";
import { PatientTab } from "@/components/appointments/tabs/PatientTab";
import { DiagnosisTab } from "@/components/appointments/tabs/DiagnosisTab";
import { HistoryTab } from "@/components/appointments/tabs/HistoryTab";
import { StatusUpdateDialog } from "@/components/appointments/dialogs/StatusUpdateDialog";
import { DiagnosisDialog } from "@/components/appointments/dialogs/DiagnosisDialog";

export default function AppointmentDetailsPage() {
    const { appointmentId } = useParams({ strict: false });
    const { account, staff, isLoading, isAuthenticated } = useSession();
    const [activeTab, setActiveTab] = useState("overview");
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [isDiagnosisDialogOpen, setIsDiagnosisDialogOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<APPOINTMENTSTATUS | "">("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Diagnosis form state
    const [diagnosisForm, setDiagnosisForm] = useState({
        disease: "",
        confidence: 90,
        description: "",
        suggestedByAI: ""
    });

    // Fetch appointment data
    const { appointment, loading: appointmentLoading, error: appointmentError, refetch } = useGetAppointmentById(appointmentId as string);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                navigate({ to: "/sign-in" });
            }
        }
    }, [isAuthenticated, isLoading, navigate]);

    const handleRefresh = async () => {
        try {
            await refetch();
            toast.success("Đã làm mới dữ liệu");
        } catch (error) {
            toast.error("Lỗi khi làm mới dữ liệu");
        }
    };

    const handleStatusUpdate = async () => {
        if (!selectedStatus || !appointment) return;

        try {
            setIsSubmitting(true);
            await updateAppointmentStatus(appointment.id, selectedStatus);
            toast.success("Cập nhật trạng thái thành công");
            setIsStatusDialogOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(`Lỗi khi cập nhật trạng thái: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCompleteAppointment = async () => {
        if (!appointment) return;

        try {
            setIsSubmitting(true);
            await completeAppointment(appointment.id);
            toast.success("Hoàn thành lịch hẹn thành công");
            refetch();
        } catch (error: any) {
            toast.error(`Lỗi khi hoàn thành lịch hẹn: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelAppointment = async () => {
        if (!appointment) return;

        try {
            setIsSubmitting(true);
            await cancelAppointment(appointment.id);
            toast.success("Hủy lịch hẹn thành công");
            refetch();
        } catch (error: any) {
            toast.error(`Lỗi khi hủy lịch hẹn: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddDiagnosis = async () => {
        if (!appointment || !diagnosisForm.disease) return;

        try {
            setIsSubmitting(true);
            await addDiagnosisSuggestion(appointment.id, {
                disease: diagnosisForm.disease,
                confidence: diagnosisForm.confidence / 100,
                description: diagnosisForm.description || undefined,
                suggestedByAI: diagnosisForm.suggestedByAI || undefined
            });
            toast.success("Thêm gợi ý chẩn đoán thành công");
            setIsDiagnosisDialogOpen(false);
            setDiagnosisForm({
                disease: "",
                confidence: 90,
                description: "",
                suggestedByAI: ""
            });
            refetch();
        } catch (error: any) {
            toast.error(`Lỗi khi thêm gợi ý chẩn đoán: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const canModifyAppointment = () => {
        if (!appointment || !account) return false;
        return account.role?.id === "1" || (account.role?.id === "2" && staff?.id != undefined);
    };

    if (appointmentLoading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar userRole={account?.role?.id} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-6">
                        <TableLoading />
                    </main>
                </div>
            </div>
        );
    }

    if (appointmentError || !appointment) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar userRole={account?.role?.id} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-6">
                        <div className="text-center py-12">
                            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy lịch hẹn</h3>
                            <p className="text-gray-500 mb-4">
                                Lịch hẹn với ID này không tồn tại hoặc đã bị xóa.
                            </p>
                            <Button onClick={() => navigate({ to: "/appointments" })}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Quay lại danh sách
                            </Button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole={account?.role?.id} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <AppointmentHeader
                        onBack={() => navigate({ to: "/appointments" })}
                        onRefresh={handleRefresh}
                        appointmentId={appointment.id}
                    />

                    <AppointmentSummaryCard
                        appointment={appointment}
                        canModifyAppointment={canModifyAppointment()}
                        isSubmitting={isSubmitting}
                        onStatusUpdate={() => {
                            setSelectedStatus("");
                            setIsStatusDialogOpen(true);
                        }}
                        onCompleteAppointment={handleCompleteAppointment}
                        onCancelAppointment={handleCancelAppointment}
                        onAddDiagnosis={() => setIsDiagnosisDialogOpen(true)}
                    />

                    <Card>
                        <CardHeader>
                            <CardTitle>Thông Tin Chi Tiết</CardTitle>
                            <CardDescription>
                                Xem tất cả thông tin về lịch hẹn và bệnh nhân
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="overview" className="flex items-center gap-2">
                                        <Activity className="h-4 w-4" />
                                        Tổng quan
                                    </TabsTrigger>
                                    <TabsTrigger value="patient" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Bệnh nhân
                                    </TabsTrigger>
                                    <TabsTrigger value="diagnosis" className="flex items-center gap-2">
                                        <Stethoscope className="h-4 w-4" />
                                        Chẩn đoán ({appointment.suggestions.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="history" className="flex items-center gap-2">
                                        <History className="h-4 w-4" />
                                        Lịch sử ({appointment.statusLogs.length})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="mt-6">
                                    <OverviewTab appointment={appointment} />
                                </TabsContent>

                                <TabsContent value="patient" className="mt-6">
                                    <PatientTab appointment={appointment} />
                                </TabsContent>

                                <TabsContent value="diagnosis" className="mt-6">
                                    <DiagnosisTab
                                        appointment={appointment}
                                        canModifyAppointment={canModifyAppointment()}
                                        isSubmitting={isSubmitting}
                                        onAddDiagnosis={() => setIsDiagnosisDialogOpen(true)}
                                    />
                                </TabsContent>

                                <TabsContent value="history" className="mt-6">
                                    <HistoryTab appointment={appointment} />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    <StatusUpdateDialog
                        open={isStatusDialogOpen}
                        onOpenChange={setIsStatusDialogOpen}
                        selectedStatus={selectedStatus}
                        onStatusChange={(status) => setSelectedStatus(status)}
                        onConfirm={handleStatusUpdate}
                        isSubmitting={isSubmitting}
                    />

                    <DiagnosisDialog
                        open={isDiagnosisDialogOpen}
                        onOpenChange={setIsDiagnosisDialogOpen}
                        formData={diagnosisForm}
                        onFormDataChange={(data) => setDiagnosisForm({
                            ...data,
                        })}
                        onConfirm={handleAddDiagnosis}
                        isSubmitting={isSubmitting}
                    />
                </main>
            </div>
        </div>
    );
}
