import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "@tanstack/react-router"
import { useSession } from "@/contexts/SessionProvider"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import hospitalImage from "@/assets/images/hospital.jpg"
import logoImage from '@/assets/images/logo.png';
import { AuthLoading, ButtonLoading } from "@/components/loading";

export default function SignInPage() {
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { login, isLoading, account, isAuthenticated } = useSession()
    const navigate = useNavigate()

    // Redirect if already authenticated
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate({ to: "/dashboard" })
        }
    }, [isLoading, isAuthenticated, navigate])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const result = await login(identifier, password)

            if (result.success) {
                toast.message("Login Successful", {
                    description: "Welcome back to the Your Healer System",
                })

                const data = result.data

                try {
                    navigate({ to: "/dashboard" })
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
        return <AuthLoading />;
    }

    if (isAuthenticated) {
        return null
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
                            <img src={logoImage} alt="Your Healer Logo" className="h-20 w-auto" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Your Healer System</h1>
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
                                        Username / Email Address
                                    </Label>
                                    <Input
                                        id="identifier"
                                        type="text"
                                        placeholder="Enter your username or email"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
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
                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                                    disabled={!identifier || !password || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <ButtonLoading message="Đang đăng nhập..." />
                                    ) : (
                                        "Đăng Nhập"
                                    )}
                                </Button>
                            </form>
                            <div className="mt-6 text-center">
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-center text-xs text-gray-500">
                        <p>&copy; 2024 Your Healer System. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
