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
        if (account?.role?.id === "1") {
            navigate({ to: "/admin" });
        } else if (account?.role?.id === "2") {
            navigate({ to: "/staff" });
        } else {
            navigate({ to: "/" });
        }
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
                                        Page Not Found
                                    </h2>
                                    <p className="text-gray-600 mb-8">
                                        The page you're looking for doesn't exist in the medical system.
                                        It may have been moved, deleted, or you may have entered an incorrect URL.
                                    </p>
                                </div>

                                <Card className="shadow-lg">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            What would you like to do?
                                        </h3>
                                        <div className="space-y-3">
                                            <Button
                                                onClick={handleGoHome}
                                                className="w-full justify-start"
                                                variant="default"
                                            >
                                                <Home className="mr-2 h-4 w-4" />
                                                Go to Dashboard
                                            </Button>
                                            <Button
                                                onClick={handleGoBack}
                                                className="w-full justify-start"
                                                variant="outline"
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Go Back
                                            </Button>
                                            {account?.role?.id === "1" && (
                                                <>
                                                    <Button
                                                        onClick={() => navigate({ to: "/admin/patients" })}
                                                        className="w-full justify-start"
                                                        variant="outline"
                                                    >
                                                        <Search className="mr-2 h-4 w-4" />
                                                        Patient Management
                                                    </Button>
                                                    <Button
                                                        onClick={() => navigate({ to: "/admin/appointment" })}
                                                        className="w-full justify-start"
                                                        variant="outline"
                                                    >
                                                        <Search className="mr-2 h-4 w-4" />
                                                        Appointments
                                                    </Button>
                                                </>
                                            )}
                                            {account?.role?.id === "2" && (
                                                <>
                                                    <Button
                                                        onClick={() => navigate({ to: "/staff/patients" })}
                                                        className="w-full justify-start"
                                                        variant="outline"
                                                    >
                                                        <Search className="mr-2 h-4 w-4" />
                                                        Patient Management
                                                    </Button>
                                                    <Button
                                                        onClick={() => navigate({ to: "/staff/appointment" })}
                                                        className="w-full justify-start"
                                                        variant="outline"
                                                    >
                                                        <Search className="mr-2 h-4 w-4" />
                                                        Appointments
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="text-center">
                                    <p className="text-sm text-gray-500">
                                        Need help? Contact your system administrator or IT support.
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
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 mb-8">
                        The page you're looking for doesn't exist.
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
                                Go to Home
                            </Button>
                            <Button
                                onClick={() => navigate({ to: "/sign-in" })}
                                className="w-full justify-start"
                                variant="outline"
                            >
                                <Search className="mr-2 h-4 w-4" />
                                Sign In
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
