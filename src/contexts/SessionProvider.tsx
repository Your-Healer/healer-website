"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { User } from "../utils/types"
import { mockUsers } from "../utils/fake-data"

interface SessionContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (email: string, password: string, role: string) => Promise<boolean>
    logout: () => void
    updateUser: (userData: Partial<User>) => void
    checkPermission: (permission: string) => boolean
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

interface SessionProviderProps {
    children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Initialize session on mount
    useEffect(() => {
        initializeSession()
    }, [])

    const initializeSession = async () => {
        try {
            setIsLoading(true)

            const storedUser = localStorage.getItem("user")
            const storedToken = localStorage.getItem("authToken")

            if (storedUser && storedToken) {
                const userData = JSON.parse(storedUser) as any;

                const tokenData = JSON.parse(atob(storedToken.split(".")[1] || "{}")) as any;
                const isTokenValid = tokenData.exp > Date.now() / 1000

                if (isTokenValid) {
                    setUser(userData)
                } else {
                    clearSession()
                }
            }
        } catch (error) {
            console.error("Error initializing session:", error)
            clearSession()
        } finally {
            setIsLoading(false)
        }
    }

    const login = async (email: string, password: string, role: string): Promise<boolean> => {
        try {
            setIsLoading(true)

            await new Promise((resolve) => setTimeout(resolve, 1000))

            const mockUser = mockUsers[email]

            if (!mockUser || mockUser.role !== role) {
                return false
            }

            const validPasswords: Record<string, string> = {
                "admin@hospital.com": "admin123",
                "receptionist@hospital.com": "rec123",
            }

            if (validPasswords[email] !== password) {
                return false
            }

            // Create mock JWT token (in real app, this would come from backend)
            const tokenPayload = {
                userId: mockUser.id,
                email: mockUser.email,
                role: mockUser.role,
                exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
                iat: Math.floor(Date.now() / 1000),
            }

            const mockToken =
                btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })) +
                "." +
                btoa(JSON.stringify(tokenPayload)) +
                "." +
                btoa("mock-signature")

            // Store session data
            localStorage.setItem("user", JSON.stringify(mockUser))
            localStorage.setItem("authToken", mockToken)
            localStorage.setItem("userRole", role) // Keep for backward compatibility
            localStorage.setItem("userEmail", email) // Keep for backward compatibility

            setUser(mockUser)
            return true
        } catch (error) {
            console.error("Login error:", error)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        clearSession()
    }

    const clearSession = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("authToken")
        localStorage.removeItem("userRole")
        localStorage.removeItem("userEmail")
        setUser(null)
    }

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData }
            setUser(updatedUser)
            localStorage.setItem("user", JSON.stringify(updatedUser))
        }
    }

    const checkPermission = (permission: string): boolean => {
        if (!user) return false
        return user.permissions.includes(permission)
    }

    const value: SessionContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        checkPermission,
    }

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
    const context = useContext(SessionContext)
    if (context === undefined) {
        throw new Error("useSession must be used within a SessionProvider")
    }
    return context
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
    Component: React.ComponentType<P>,
    requiredRole?: "admin" | "receptionist",
    requiredPermissions?: string[],
) {
    return function AuthenticatedComponent(props: P) {
        const { user, isLoading, isAuthenticated } = useSession()

        useEffect(() => {
            if (!isLoading) {
                if (!isAuthenticated) {
                    return
                }

                if (requiredRole && user?.role !== requiredRole) {
                    return
                }

                if (requiredPermissions && requiredPermissions.length > 0) {
                    const hasPermissions = requiredPermissions.every((permission) => user?.permissions.includes(permission))
                    if (!hasPermissions) {
                        return
                    }
                }
            }
        }, [user, isLoading, isAuthenticated])

        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                </div>
            )
        }

        if (!isAuthenticated) {
            return null
        }

        if (requiredRole && user?.role !== requiredRole) {
            return null
        }

        if (requiredPermissions && requiredPermissions.length > 0) {
            const hasPermissions = requiredPermissions.every((permission) => user?.permissions.includes(permission))
            if (!hasPermissions) {
                return null
            }
        }

        return <Component {...props} />
    }
}
