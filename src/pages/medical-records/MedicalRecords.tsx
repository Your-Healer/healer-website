"use client";
import { useEffect, useState } from "react";
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
import { useSession } from "@/contexts/SessionProvider";
import { ClipboardPlus, Database, GitBranch, TestTube, TrendingUp, FileText } from "lucide-react";
import MedicalRecordsManagement from "@/components/medical-records/MedicalRecordsManagement";
import BlockchainData from "@/components/medical-records/BlockchainData";
import DataChangeManagement from "@/components/medical-records/DataChangeManagement";
import { useNavigate } from "@tanstack/react-router";

export default function MedicalRecordsPage() {
    const { account, isLoading, isAuthenticated } = useSession();
    const [activeTab, setActiveTab] = useState("patients");

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                navigate({ to: "/sign-in" });
            }
        }
    }, [isAuthenticated, isLoading, navigate]);

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole={account?.role?.id} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Quản Lý Hồ Sơ Y Tế
                                </h1>
                                <p className="text-gray-600">
                                    Quản lý toàn diện hồ sơ bệnh nhân, xét nghiệm, tiến triển bệnh và blockchain
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="gap-2">
                                    <ClipboardPlus className="h-4 w-4" />
                                    Hồ sơ y tế
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Hệ Thống Quản Lý Hồ Sơ Y Tế</CardTitle>
                            <CardDescription>
                                Quản lý toàn diện hồ sơ bệnh nhân với tích hợp blockchain và theo dõi thay đổi
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="w-full"
                            >
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger
                                        value="patients"
                                        className="flex items-center gap-2"
                                    >
                                        <ClipboardPlus className="h-4 w-4" />
                                        Bệnh Nhân
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="blockchain"
                                        className="flex items-center gap-2"
                                    >
                                        <Database className="h-4 w-4" />
                                        Blockchain
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="data-changes"
                                        className="flex items-center gap-2"
                                    >
                                        <GitBranch className="h-4 w-4" />
                                        Thay Đổi
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="patients" className="mt-6">
                                    <MedicalRecordsManagement />
                                </TabsContent>

                                <TabsContent value="blockchain" className="mt-6">
                                    <BlockchainData />
                                </TabsContent>

                                <TabsContent value="data-changes" className="mt-6">
                                    <DataChangeManagement />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}