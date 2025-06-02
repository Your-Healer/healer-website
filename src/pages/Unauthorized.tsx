import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "@tanstack/react-router"
import { useSession } from "@/contexts/SessionProvider"
import { Shield, ArrowLeft } from "lucide-react"

export default function UnauthorizedPage() {
    const navigate = useNavigate()
    const { user, logout } = useSession()

    const handleGoBack = () => {
        try {
            if (user?.role === "admin") {
                navigate({ to: "/admin" })
            } else if (user?.role === "receptionist") {
                navigate({ to: "/receptionist/dashboard" })
            } else {
                navigate({ to: "/" })
            }
        } catch (error) {
            console.error('Navigation error:', error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <Shield className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Access Denied</CardTitle>
                    <CardDescription>You don't have permission to access this page or resource.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center text-sm text-gray-600">
                        <p>
                            Your current role: <strong>{user?.role || "Unknown"}</strong>
                        </p>
                        <p>If you believe this is an error, please contact your administrator.</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button onClick={handleGoBack} className="w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back to Dashboard
                        </Button>
                        <Button variant="outline" onClick={logout} className="w-full">
                            Sign Out
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
