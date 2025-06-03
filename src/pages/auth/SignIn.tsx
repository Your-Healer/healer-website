import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "@tanstack/react-router"
import { useSession } from "@/contexts/SessionProvider"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import hospitalImage from "@/assets/images/hospital.png"
import logoImage from '@/assets/images/logo.png';

export default function SignInPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { login, isLoading } = useSession()
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const success = await login(email, password, role)

            if (success) {
                toast.message("Login Successful", {
                    description: "Welcome back to the Medical ERP System",
                })

                try {
                    if (role === "admin") {
                        navigate({ to: "/admin" })
                    } else if (role === "receptionist") {
                        navigate({ to: "/receptionist" })
                    }
                } catch (navError) {
                    console.error('Navigation error:', navError)
                }
            } else {
                toast.error("Login Failed", {
                    description: "Invalid credentials. Please check your email, password, and role.",
                })
            }
        } catch (error) {
            toast.warning("Login Error", {
                description: "An error occurred while trying to log you in. Please try again later.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 relative">
                <img src={hospitalImage} alt="Modern Hospital Building" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-blue-900/20" />
                <div className="absolute bottom-8 left-8 text-white">
                    <h2 className="text-3xl font-bold mb-2">Welcome to Our Medical Center</h2>
                    <p className="text-lg opacity-90">Providing exceptional healthcare with modern technology</p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <img src={logoImage} alt="Medical ERP Logo" className="h-20 w-auto" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Medical ERP System</h1>
                        <p className="mt-2 text-gray-600">Sign in to your account to continue</p>
                    </div>

                    <Card className="shadow-lg border-0">
                        <CardHeader className="space-y-1 pb-6">
                            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
                            <CardDescription className="text-center">Enter your credentials to access the system</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-11"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium">
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-11"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-sm font-medium">
                                        Role
                                    </Label>
                                    <Select value={role} onValueChange={setRole} required disabled={isSubmitting}>
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Select your role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Administrator</SelectItem>
                                            <SelectItem value="receptionist">Receptionist</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                                    disabled={!email || !password || !role || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Signing In...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h3 className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</h3>
                                <div className="text-xs text-blue-800 space-y-1">
                                    <p>
                                        <strong>Admin:</strong> admin@hospital.com / admin123
                                    </p>
                                    <p>
                                        <strong>Receptionist:</strong> receptionist@hospital.com / rec123
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-center text-xs text-gray-500">
                        <p>&copy; 2024 Medical ERP System. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
