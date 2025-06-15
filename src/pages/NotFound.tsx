import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Home, Search, AlertTriangle } from "lucide-react";
import { useSession } from "@/contexts/SessionProvider";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { Header } from "@/components/layout/Header/Header";

export default function NotFound() {
    const navigate = useNavigate();
    const { user, account, isAuthenticated } = useSession();

    const handleGoHome = () => {
        navigate({ to: "/" });
    };

    const handleGoBack = () => {
        window.history.back();
    };

    // If user is authenticated, show the page with layout
    if (isAuthenticated && user) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar userRole={account?.role?.id} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-6">
                        <div className="min-h-full flex items-center justify-center">
                            <div className="max-w-md w-full space-y-8">
                                <div className="text-center">
                                    <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
                                        <AlertTriangle className="h-12 w-12 text-red-600" />
                                    </div>
                                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                                    <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                                        Không Tìm Thấy Trang
                                    </h2>
                                    <p className="text-gray-600 mb-8">
                                        Trang bạn đang tìm kiếm không tồn tại trong hệ thống y tế.
                                        Có thể trang đã bị di chuyển, xóa hoặc bạn đã nhập sai URL.
                                    </p>
                                </div>

                                <Card className="shadow-lg">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Bạn muốn làm gì?
                                        </h3>
                                        <div className="space-y-3">
                                            <Button
                                                onClick={handleGoHome}
                                                className="w-full justify-start"
                                                variant="default"
                                            >
                                                <Home className="mr-2 h-4 w-4" />
                                                Về Trang Chủ
                                            </Button>
                                            <Button
                                                onClick={handleGoBack}
                                                className="w-full justify-start"
                                                variant="outline"
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Quay Lại
                                            </Button>
                                            {account?.role?.id === "1" && (
                                                <>
                                                    <Button
                                                        onClick={() => navigate({ to: "/patients" })}
                                                        className="w-full justify-start"
                                                        variant="outline"
                                                    >
                                                        <Search className="mr-2 h-4 w-4" />
                                                        Quản Lý Bệnh Nhân
                                                    </Button>
                                                    <Button
                                                        onClick={() => navigate({ to: "/appointments" })}
                                                        className="w-full justify-start"
                                                        variant="outline"
                                                    >
                                                        <Search className="mr-2 h-4 w-4" />
                                                        Lịch Hẹn
                                                    </Button>
                                                </>
                                            )}
                                            {account?.role?.id === "2" && (
                                                <>
                                                    <Button
                                                        onClick={() => navigate({ to: "/patients" })}
                                                        className="w-full justify-start"
                                                        variant="outline"
                                                    >
                                                        <Search className="mr-2 h-4 w-4" />
                                                        Quản Lý Bệnh Nhân
                                                    </Button>
                                                    <Button
                                                        onClick={() => navigate({ to: "/appointments" })}
                                                        className="w-full justify-start"
                                                        variant="outline"
                                                    >
                                                        <Search className="mr-2 h-4 w-4" />
                                                        Lịch Hẹn
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="text-center">
                                    <p className="text-sm text-gray-500">
                                        Cần trợ giúp? Liên hệ quản trị viên hệ thống hoặc bộ phận IT hỗ trợ.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // If user is not authenticated, show simple 404 without layout
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
                        <AlertTriangle className="h-12 w-12 text-red-600" />
                    </div>
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                        Không Tìm Thấy Trang
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Trang bạn đang tìm kiếm không tồn tại.
                    </p>
                </div>

                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <div className="space-y-3">
                            <Button
                                onClick={() => navigate({ to: "/" })}
                                className="w-full justify-start"
                                variant="default"
                            >
                                <Home className="mr-2 h-4 w-4" />
                                Về Trang Chủ
                            </Button>
                            <Button
                                onClick={() => navigate({ to: "/sign-in" })}
                                className="w-full justify-start"
                                variant="outline"
                            >
                                <Search className="mr-2 h-4 w-4" />
                                Đăng Nhập
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
