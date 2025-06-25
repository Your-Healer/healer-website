"use client"
import type React from "react"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { LoggedInAccount, LoggedInStaff, LoggedInUser } from "@/models/models"
import api from "@/api/axios"
import { LoginEmailRequest, LoginResponse, LoginUsernameRequest } from "@/utils/types"
import { AuthLoading } from "@/components/loading"
import axios from "axios"

interface SessionContextType {
    account: LoggedInAccount | null
    user: LoggedInUser | null
    staff: LoggedInStaff | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (identifier: string, password: string) => Promise<{ success: boolean, data: LoginResponse | null }>
    logout: () => void
    updateUser: (userData: Partial<LoggedInUser>) => void
    checkPosition: (positionIds: string[] | null) => boolean
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

interface SessionProviderProps {
    children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
    const [user, setUser] = useState<LoggedInUser | null>(null)
    const [account, setAccount] = useState<LoggedInAccount | null>(null)
    const [staff, setStaff] = useState<LoggedInStaff | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Initialize session on mount
    useEffect(() => {
        initializeSession()
    }, [])

    const initializeSession = async () => {
        try {
            setIsLoading(true)

            const storedUser = localStorage.getItem("user")
            const storedAccount = localStorage.getItem("account")
            const storedStaff = localStorage.getItem("staff")
            const storedToken = localStorage.getItem("authToken")

            if (storedUser && storedToken) {
                const userData = JSON.parse(storedUser) as LoggedInUser;
                const accountData = storedAccount ? JSON.parse(storedAccount) as LoggedInAccount : null;
                const staffData = storedStaff ? JSON.parse(storedStaff) as LoggedInStaff : null;

                const tokenData = JSON.parse(atob(storedToken.split(".")[1] || "{}")) as any;
                const isTokenValid = tokenData.exp > Date.now() / 1000

                if (isTokenValid) {
                    setUser(userData)
                    setAccount(accountData)
                    setStaff(staffData)
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

    const login = async (identifier: string, password: string): Promise<{ success: boolean, data: LoginResponse | null }> => {
        try {
            setIsLoading(true)
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)

            let data: LoginEmailRequest | LoginUsernameRequest;
            if (isEmail) {
                data = { email: identifier, password }
            }
            else {
                data = { username: identifier, password }
            }

            const loginResult = await api.post<LoginResponse, { data: LoginResponse }, LoginEmailRequest | LoginUsernameRequest>(
                isEmail ? "/auth/login/email" : '/auth/login/username',
                data
            )

            const loginResultData = loginResult.data

            console.log(loginResultData)

            localStorage.setItem("user", JSON.stringify(loginResultData.user || {}))
            localStorage.setItem("staff", JSON.stringify(loginResultData.staff || {}))
            localStorage.setItem("account", JSON.stringify(loginResultData.account || {}))
            localStorage.setItem("authToken", loginResultData.token)
            localStorage.setItem("accountRole", loginResultData.account.role?.id || "3")
            localStorage.setItem("staffPositions", JSON.stringify(loginResultData.staff?.positions || []))

            setUser(loginResultData.user || null)
            setAccount(loginResultData.account || null)
            setStaff(loginResultData.staff || null)
            return {
                success: true,
                data: loginResultData
            }
        } catch (error) {
            return {
                success: false,
                data: null
            }
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        clearSession()
    }

    const clearSession = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("account")
        localStorage.removeItem("staff")
        localStorage.removeItem("authToken")
        localStorage.removeItem("accountRole")
        localStorage.removeItem("userEmail")
        localStorage.removeItem("staffPositions")
        setUser(null)
        setAccount(null)
        setStaff(null)
    }

    const updateUser = (userData: Partial<LoggedInUser>) => {
        if (user) {
            const updatedUser = { ...user, ...userData }
            setUser(updatedUser)
            localStorage.setItem("user", JSON.stringify(updatedUser))
        }
    }

    const checkPosition = (positionIds: string[] | null): boolean => {
        if (!positionIds || positionIds.length === 0) return true
        if (!staff || !staff.positions) return false
        return staff.positions.some(pos => positionIds.includes(pos.positionId))
    }

    const value: SessionContextType = {
        user,
        account,
        staff,
        isLoading,
        isAuthenticated: !!user && !!account,
        login,
        logout,
        updateUser,
        checkPosition
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
    requiredRole?: string,
    requiredPosition?: string[]
) {
    return function AuthenticatedComponent(props: P) {
        const { account, staff, isLoading, isAuthenticated } = useSession()

        useEffect(() => {
            if (!isLoading) {
                if (!isAuthenticated) {
                    return
                }

                if (requiredRole && account?.role?.id !== requiredRole) {
                    return
                }

                if (requiredPosition && staff && staff.positions && staff.positions.some(pos => requiredPosition.some(rp => rp === pos.positionId))) {
                    return
                }
            }
        }, [account, staff, isLoading, isAuthenticated])

        if (isLoading) {
            return <AuthLoading />;
        }

        if (!isAuthenticated) {
            return null
        }

        if (requiredRole && account?.role?.id !== requiredRole) {
            return
        }

        if (requiredPosition && staff && staff.positions && staff.positions.some(pos => requiredPosition.some(rp => rp === pos.positionId))) {
            return
        }

        return <Component {...props} />
    }
}