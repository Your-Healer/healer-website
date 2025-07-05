"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { Header } from "@/components/layout/Header/Header";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/contexts/SessionProvider";
import {
    ArrowLeft,
    User,
    Calendar,
    Phone,
    MapPin,
    Shield,
    TestTube,
    TrendingUp,
    FileText,
    Hash,
    Clock,
    Stethoscope,
    Pill,
    Activity,
    AlertCircle,
    RefreshCw,
    Edit,
    Eye,
    Plus
} from "lucide-react";
import {
    useGetBlockchainPatientsById,
    useGetBlockchainPatientClinicalTests,
    useGetBlockchainPatientDiseaseProgressions,
    useGetBlockchainPatientMedicalRecords
} from "@/hooks/use-blockchain";
import { TableLoading } from "@/components/loading";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PatientDetailsPage() {
    const { patientId } = useParams({ strict: false });
    const { account, isLoading, isAuthenticated } = useSession();
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedTest, setSelectedTest] = useState<any>(null);
    const [selectedProgression, setSelectedProgression] = useState<any>(null);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const navigate = useNavigate();

    // Fetch patient data
    const { patient, loading: patientLoading, error: patientError, refetch: refetchPatient } = useGetBlockchainPatientsById(patientId as string);
    const { clinicalTests, loading: testsLoading, refetch: refetchTests } = useGetBlockchainPatientClinicalTests(patientId as string);
    const { diseaseProgressions, loading: progressionsLoading, refetch: refetchProgressions } = useGetBlockchainPatientDiseaseProgressions(patientId as string);
    const { patientMedicalRecords, loading: recordsLoading, refetch: refetchRecords } = useGetBlockchainPatientMedicalRecords(patientId as string);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                navigate({ to: "/sign-in" });
            }
        }
    }, [isAuthenticated, isLoading, navigate]);

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
    };

    const formatHash = (hash: string) => {
        if (!hash) return "Không có";
        if (hash.length <= 16) return hash;
        return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
    };

    const formatWalletAddress = (address: string) => {
        if (!address) return "Không có";
        if (address.length <= 10) return address;
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    const handleRefreshAll = async () => {
        try {
            await Promise.all([
                refetchPatient(),
                refetchTests(),
                refetchProgressions(),
                refetchRecords()
            ]);
            toast.success("Đã làm mới tất cả dữ liệu");
        } catch (error) {
            toast.error("Lỗi khi làm mới dữ liệu");
        }
    };

    if (patientLoading) {
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

    if (patientError || !patient) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar userRole={account?.role?.id} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-6">
                        <div className="text-center py-12">
                            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bệnh nhân</h3>
                            <p className="text-gray-500 mb-4">
                                Bệnh nhân với ID này không tồn tại hoặc đã bị xóa.
                            </p>
                            <Button onClick={() => navigate({ to: "/medical-records" })}>
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
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate({ to: "/medical-records" })}
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Quay lại
                                </Button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Chi Tiết Bệnh Nhân
                                    </h1>
                                    <p className="text-gray-600">
                                        Thông tin chi tiết và lịch sử điều trị của bệnh nhân
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" onClick={handleRefreshAll}>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Làm mới
                                </Button>
                                <Badge variant="outline" className="gap-2">
                                    <User className="h-4 w-4" />
                                    Chi tiết bệnh nhân
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Patient Summary Card */}
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                                        <User className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold">{patient.patientName}</h2>
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatTimestamp(patient.dateOfBirth)}
                                            </span>
                                            <Badge variant="outline">{patient.gender}</Badge>
                                            {patient.phoneNumber && (
                                                <span className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3" />
                                                    {patient.phoneNumber}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Shield className="h-3 w-3" />
                                            Block #{patient.createdAt}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-900">Thông tin liên hệ</h4>
                                    {patient.address && (
                                        <div className="flex items-start gap-2 text-sm">
                                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                            <span>{patient.address}</span>
                                        </div>
                                    )}
                                    {patient.emergencyContact && patient.emergencyContact !== "EMPTY" && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <span>Khẩn cấp: {patient.emergencyContact}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-900">Người tạo</h4>
                                    <div className="text-sm">
                                        <p className="font-medium">
                                            {patient.createByAccount ?
                                                `${patient.createByAccount.staff?.firstname || patient.createByAccount.user?.firstname || ''} ${patient.createByAccount.staff?.lastname || patient.createByAccount.user?.lastname || ''}`.trim() || 'Không có tên'
                                                : 'Không có tên'
                                            }
                                        </p>
                                        <p className="text-gray-500 font-mono text-xs">
                                            {formatWalletAddress(patient.createdBy)}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-900">Cập nhật cuối</h4>
                                    <div className="text-sm">
                                        <p className="font-medium">
                                            {patient.lastModifiedByAccount ?
                                                `${patient.lastModifiedByAccount.staff?.firstname || patient.lastModifiedByAccount.user?.firstname || ''} ${patient.lastModifiedByAccount.staff?.lastname || patient.lastModifiedByAccount.user?.lastname || ''}`.trim() || 'Không có tên'
                                                : 'Không có tên'
                                            }
                                        </p>
                                        <p className="text-gray-500">Block #{patient.lastModifiedAt}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card>
                            <CardContent className="flex items-center p-6">
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                                    <TestTube className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Xét nghiệm</p>
                                    <p className="text-2xl font-bold text-gray-900">{clinicalTests.length}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-center p-6">
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100">
                                    <TrendingUp className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Tiến triển bệnh</p>
                                    <p className="text-2xl font-bold text-gray-900">{diseaseProgressions.length}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-center p-6">
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100">
                                    <FileText className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Hồ sơ bệnh án</p>
                                    <p className="text-2xl font-bold text-gray-900">{patientMedicalRecords.length}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Tabs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông Tin Y Tế Chi Tiết</CardTitle>
                            <CardDescription>
                                Xem tất cả thông tin y tế và lịch sử điều trị của bệnh nhân
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="overview" className="flex items-center gap-2">
                                        <Activity className="h-4 w-4" />
                                        Tổng quan
                                    </TabsTrigger>
                                    <TabsTrigger value="tests" className="flex items-center gap-2">
                                        <TestTube className="h-4 w-4" />
                                        Xét nghiệm ({clinicalTests.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="progressions" className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4" />
                                        Tiến triển ({diseaseProgressions.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="records" className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Hồ sơ ({patientMedicalRecords.length})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="mt-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Latest Clinical Tests */}
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Xét nghiệm gần đây</CardTitle>
                                                <TestTube className="h-4 w-4 text-muted-foreground" />
                                            </CardHeader>
                                            <CardContent>
                                                {testsLoading ? (
                                                    <div className="text-center py-4">
                                                        <RefreshCw className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                                                    </div>
                                                ) : clinicalTests.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {clinicalTests.slice(0, 3).map((test, index) => (
                                                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                                <div>
                                                                    <p className="font-medium text-sm">{test.testType}</p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {formatTimestamp(test.testDate)}
                                                                    </p>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setSelectedTest(test)}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                        {clinicalTests.length > 3 && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="w-full"
                                                                onClick={() => setActiveTab("tests")}
                                                            >
                                                                Xem tất cả ({clinicalTests.length})
                                                            </Button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500 text-center py-4">
                                                        Chưa có xét nghiệm nào
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>

                                        {/* Latest Disease Progressions */}
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Tiến triển gần đây</CardTitle>
                                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                            </CardHeader>
                                            <CardContent>
                                                {progressionsLoading ? (
                                                    <div className="text-center py-4">
                                                        <RefreshCw className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                                                    </div>
                                                ) : diseaseProgressions.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {diseaseProgressions.slice(0, 3).map((progression, index) => (
                                                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                                <div>
                                                                    <p className="font-medium text-sm">{progression.diagnosis}</p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {formatTimestamp(progression.visitDate)}
                                                                    </p>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setSelectedProgression(progression)}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                        {diseaseProgressions.length > 3 && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="w-full"
                                                                onClick={() => setActiveTab("progressions")}
                                                            >
                                                                Xem tất cả ({diseaseProgressions.length})
                                                            </Button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500 text-center py-4">
                                                        Chưa có tiến triển bệnh nào
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>

                                <TabsContent value="tests" className="mt-6">
                                    {testsLoading ? (
                                        <TableLoading />
                                    ) : clinicalTests.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold">Kết quả xét nghiệm</h3>
                                                <Button size="sm">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Thêm xét nghiệm
                                                </Button>
                                            </div>
                                            <div className="grid gap-4">
                                                {clinicalTests.map((test, index) => (
                                                    <Card key={index} className="hover:shadow-md transition-shadow">
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <Badge variant="outline" className="gap-1">
                                                                            <TestTube className="h-3 w-3" />
                                                                            {test.testType}
                                                                        </Badge>
                                                                        <span className="text-sm text-gray-500">
                                                                            {formatTimestamp(test.testDate)}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm mb-2 line-clamp-2">{test.result}</p>
                                                                    <div className="text-xs text-gray-500">
                                                                        Bác sĩ: {test.doctor ?
                                                                            `${test.doctor.staff?.firstname || test.doctor.user?.firstname || ''} ${test.doctor.staff?.lastname || test.doctor.user?.lastname || ''}`.trim() || 'Không có tên'
                                                                            : 'Không có tên'
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => setSelectedTest(test)}
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm">
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <TestTube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có xét nghiệm</h3>
                                            <p className="text-gray-500 mb-4">
                                                Bệnh nhân chưa có kết quả xét nghiệm nào.
                                            </p>
                                            <Button>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Thêm xét nghiệm đầu tiên
                                            </Button>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="progressions" className="mt-6">
                                    {progressionsLoading ? (
                                        <TableLoading />
                                    ) : diseaseProgressions.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold">Tiến triển bệnh</h3>
                                                <Button size="sm">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Thêm tiến triển
                                                </Button>
                                            </div>
                                            <div className="grid gap-4">
                                                {diseaseProgressions.map((progression, index) => (
                                                    <Card key={index} className="hover:shadow-md transition-shadow">
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <Badge variant="outline" className="gap-1">
                                                                            <Stethoscope className="h-3 w-3" />
                                                                            {progression.diagnosis}
                                                                        </Badge>
                                                                        <span className="text-sm text-gray-500">
                                                                            {formatTimestamp(progression.visitDate)}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm mb-1"><strong>Triệu chứng:</strong> {progression.symptoms}</p>
                                                                    <p className="text-sm mb-2 line-clamp-1"><strong>Điều trị:</strong> {progression.treatment}</p>
                                                                    <div className="text-xs text-gray-500">
                                                                        Bác sĩ: {progression.doctor ?
                                                                            `${progression.doctor.staff?.firstname || progression.doctor.user?.firstname || ''} ${progression.doctor.staff?.lastname || progression.doctor.user?.lastname || ''}`.trim() || 'Không có tên'
                                                                            : 'Không có tên'
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => setSelectedProgression(progression)}
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm">
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có tiến triển bệnh</h3>
                                            <p className="text-gray-500 mb-4">
                                                Chưa có thông tin tiến triển bệnh của bệnh nhân.
                                            </p>
                                            <Button>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Thêm tiến triển đầu tiên
                                            </Button>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="records" className="mt-6">
                                    {recordsLoading ? (
                                        <TableLoading />
                                    ) : patientMedicalRecords.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold">Hồ sơ bệnh án</h3>
                                                <Button size="sm">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Thêm hồ sơ
                                                </Button>
                                            </div>
                                            <div className="grid gap-4">
                                                {patientMedicalRecords.map((record, index) => (
                                                    <Card key={index} className="hover:shadow-md transition-shadow">
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <Badge variant="outline" className="gap-1">
                                                                            <FileText className="h-3 w-3" />
                                                                            Hồ sơ #{record.recordId}
                                                                        </Badge>
                                                                        {record.dataPointer && (
                                                                            <Badge variant="secondary">
                                                                                Pointer: #{record.dataPointer}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm mb-1"><strong>Chẩn đoán:</strong> {record.diagnosis}</p>
                                                                    <p className="text-sm mb-2 line-clamp-1"><strong>Điều trị:</strong> {record.treatment}</p>
                                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                        <Hash className="h-3 w-3" />
                                                                        <span className="font-mono">{formatHash(record.recordHash)}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => setSelectedRecord(record)}
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm">
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có hồ sơ bệnh án</h3>
                                            <p className="text-gray-500 mb-4">
                                                Bệnh nhân chưa có hồ sơ bệnh án nào.
                                            </p>
                                            <Button>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Tạo hồ sơ đầu tiên
                                            </Button>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* Detail Dialogs */}
                    {/* Clinical Test Detail Dialog */}
                    <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Chi Tiết Kết Quả Xét Nghiệm</DialogTitle>
                                <DialogDescription>Thông tin chi tiết về kết quả xét nghiệm</DialogDescription>
                            </DialogHeader>
                            {selectedTest && (
                                <ScrollArea className="max-h-[60vh]">
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="font-semibold text-sm">Loại xét nghiệm</Label>
                                                <p className="text-sm">{selectedTest.testType}</p>
                                            </div>
                                            <div>
                                                <Label className="font-semibold text-sm">Ngày xét nghiệm</Label>
                                                <p className="text-sm">{formatTimestamp(selectedTest.testDate)}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="font-semibold text-sm">Kết quả</Label>
                                            <p className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded-lg mt-1">
                                                {selectedTest.result}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="font-semibold text-sm">Ghi chú</Label>
                                            <p className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded-lg mt-1">
                                                {selectedTest.notes || "Không có ghi chú"}
                                            </p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <Label className="font-semibold text-sm">Bác sĩ thực hiện</Label>
                                            <p className="text-sm">
                                                {selectedTest.doctor ?
                                                    `${selectedTest.doctor.staff?.firstname || selectedTest.doctor.user?.firstname || ''} ${selectedTest.doctor.staff?.lastname || selectedTest.doctor.user?.lastname || ''}`.trim() || 'Không có tên'
                                                    : 'Không có tên'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </ScrollArea>
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* Disease Progression Detail Dialog */}
                    <Dialog open={!!selectedProgression} onOpenChange={() => setSelectedProgression(null)}>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Chi Tiết Tiến Triển Bệnh</DialogTitle>
                                <DialogDescription>Thông tin chi tiết về tiến triển bệnh</DialogDescription>
                            </DialogHeader>
                            {selectedProgression && (
                                <ScrollArea className="max-h-[60vh]">
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="font-semibold text-sm">Ngày khám</Label>
                                                <p className="text-sm">{formatTimestamp(selectedProgression.visitDate)}</p>
                                            </div>
                                            <div>
                                                <Label className="font-semibold text-sm">Hẹn khám tiếp</Label>
                                                <p className="text-sm">
                                                    {selectedProgression.nextAppointment && selectedProgression.nextAppointment !== "EMPTY" ?
                                                        formatTimestamp(selectedProgression.nextAppointment) :
                                                        "Chưa hẹn"
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="font-semibold text-sm">Triệu chứng</Label>
                                            <p className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded-lg mt-1">
                                                {selectedProgression.symptoms}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="font-semibold text-sm">Chẩn đoán</Label>
                                            <p className="text-sm whitespace-pre-wrap bg-blue-50 p-3 rounded-lg mt-1">
                                                {selectedProgression.diagnosis}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="font-semibold text-sm">Phương pháp điều trị</Label>
                                            <p className="text-sm whitespace-pre-wrap bg-green-50 p-3 rounded-lg mt-1">
                                                {selectedProgression.treatment}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="font-semibold text-sm">Đơn thuốc</Label>
                                            <div className="bg-yellow-50 p-3 rounded-lg mt-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Pill className="h-4 w-4 text-yellow-600" />
                                                    <span className="font-medium text-sm">Đơn thuốc được kê</span>
                                                </div>
                                                <p className="text-sm whitespace-pre-wrap">
                                                    {selectedProgression.prescription}
                                                </p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div>
                                            <Label className="font-semibold text-sm">Bác sĩ điều trị</Label>
                                            <p className="text-sm">
                                                {selectedProgression.doctor ?
                                                    `${selectedProgression.doctor.staff?.firstname || selectedProgression.doctor.user?.firstname || ''} ${selectedProgression.doctor.staff?.lastname || selectedProgression.doctor.user?.lastname || ''}`.trim() || 'Không có tên'
                                                    : 'Không có tên'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </ScrollArea>
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* Medical Record Detail Dialog */}
                    <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Chi Tiết Hồ Sơ Bệnh Án</DialogTitle>
                                <DialogDescription>Thông tin chi tiết về hồ sơ bệnh án blockchain</DialogDescription>
                            </DialogHeader>
                            {selectedRecord && (
                                <ScrollArea className="max-h-[60vh]">
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="font-semibold text-sm">ID Hồ sơ</Label>
                                                <p className="text-sm font-mono">#{selectedRecord.recordId}</p>
                                            </div>
                                            <div>
                                                <Label className="font-semibold text-sm">Data Pointer</Label>
                                                <p className="text-sm">
                                                    {selectedRecord.dataPointer ? `#${selectedRecord.dataPointer}` : "Không có"}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="font-semibold text-sm">Chẩn đoán</Label>
                                            <p className="text-sm whitespace-pre-wrap bg-blue-50 p-3 rounded-lg mt-1">
                                                {selectedRecord.diagnosis}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="font-semibold text-sm">Phương pháp điều trị</Label>
                                            <p className="text-sm whitespace-pre-wrap bg-green-50 p-3 rounded-lg mt-1">
                                                {selectedRecord.treatment}
                                            </p>
                                        </div>
                                        <Separator />
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-sm">Thông tin Blockchain</h4>
                                            <div>
                                                <Label className="font-semibold text-sm">Record Hash</Label>
                                                <div className="bg-gray-50 p-3 rounded-lg mt-1">
                                                    <div className="flex items-center gap-2">
                                                        <Hash className="h-4 w-4 text-gray-400" />
                                                        <p className="text-xs font-mono break-all">{selectedRecord.recordHash}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="font-semibold text-sm">Tạo bởi</Label>
                                                    <p className="text-sm">
                                                        {selectedRecord.doctorAccount ?
                                                            `${selectedRecord.doctorAccount.staff?.firstname || selectedRecord.doctorAccount.user?.firstname || ''} ${selectedRecord.doctorAccount.staff?.lastname || selectedRecord.doctorAccount.user?.lastname || ''}`.trim() || 'Không có tên'
                                                            : 'Không có tên'
                                                        }
                                                    </p>
                                                    <p className="text-xs text-gray-500 font-mono">
                                                        {formatWalletAddress(selectedRecord.createBy)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <Label className="font-semibold text-sm">Block tạo</Label>
                                                    <p className="text-sm">#{selectedRecord.createdAt}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>
                            )}
                        </DialogContent>
                    </Dialog>
                </main>
            </div>
        </div>
    );
}
