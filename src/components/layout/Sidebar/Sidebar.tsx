import { useState } from "react"
import { Link, useLocation } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSession } from "@/contexts/SessionProvider"
import {
    LogOut,
    Menu,
    X,
    User,
    Shield,
    UserCheck
} from "lucide-react"
import { adminMenuItems, staffMenuItems } from "@/utils/side-bar-menu"
import { useGetMyAccount } from "@/hooks/use-accounts"

interface SidebarProps {
    userRole?: string
}

export function Sidebar({ userRole }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const location = useLocation()
    const { logout, checkPosition, user, account, staff } = useSession()

    const menuItems = userRole == "1" ? adminMenuItems : staffMenuItems

    const { account: myAccount, loading: myAccountLoading } = useGetMyAccount(account?.id || "")

    const filteredMenuItems = menuItems.filter((item) => {
        return checkPosition(item.positions)
    })

    const getRoleInfo = () => {
        switch (userRole) {
            case "1":
                return { name: "Admin", icon: Shield, color: "text-red-600" }
            case "2":
                return { name: "Nhân viên", icon: UserCheck, color: "text-blue-600" }
            case "3":
                return { name: "Người dùng bình thường", icon: User, color: "text-green-600" }
            default:
                return { name: "Guest", icon: User, color: "text-gray-600" }
        }
    }

    const roleInfo = getRoleInfo()
    const RoleIcon = roleInfo.icon

    return (
        <div className={cn(
            "bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-200",
            isCollapsed ? "w-16" : "w-64"
        )}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">H</span>
                            </div>
                            <span className="font-bold text-gray-900">Healer</span>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2"
                    >
                        {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* User Info */}
            {!isCollapsed && (
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center", roleInfo.color)}>
                            <RoleIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {account?.role?.id === "2" ?
                                    `${staff?.firstname} ${staff?.lastname}` :
                                    `${user?.firstname} ${user?.lastname}` || "User"}
                            </p>
                            <p className="text-xs text-gray-500">
                                {roleInfo.name}
                                {myAccount?.roleId === "2" && myAccount?.staff?.positions && myAccount.staff.positions.length > 0 &&
                                    ` - ${myAccount.staff.positions.map(pos => pos.name).join(', ')}`
                                }
                            </p>

                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <div className="space-y-1">
                    {filteredMenuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.href ||
                            (item.href !== '/dashboard' && location.pathname.startsWith(item.href))

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-blue-100 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                    isCollapsed && "justify-center px-2"
                                )}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                {!isCollapsed && (
                                    <span className="truncate">{item.label}</span>
                                )}
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <Button
                    variant="ghost"
                    onClick={logout}
                    className={cn(
                        "w-full transition-colors hover:bg-red-50 hover:text-red-600",
                        isCollapsed ? "px-2" : "justify-start gap-3"
                    )}
                >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span>Logout</span>}
                </Button>
            </div>
        </div>
    )
}