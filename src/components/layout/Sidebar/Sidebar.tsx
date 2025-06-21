import { useState } from "react"
import { Link, useLocation } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSession } from "@/contexts/SessionProvider"
import {
    LogOut,
    Menu,
    X,
    ChevronRight,
    User,
    Shield,
    UserCheck
} from "lucide-react"
import { adminMenuItems, staffMenuItems } from "@/utils/side-bar-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import SidebarItem from "./SidebarItem"

interface SidebarProps {
    userRole?: string
}

export function Sidebar({ userRole }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const location = useLocation()
    const { logout, checkPosition, user, account, staff } = useSession()

    const menuItems = userRole == "1" ? adminMenuItems : staffMenuItems

    const filteredMenuItems = menuItems.filter((item) => {
        return checkPosition(item.positions)
    })

    const getRoleInfo = () => {
        switch (userRole) {
            case "1":
                return { name: "Quản trị viên", icon: Shield, color: "bg-red-500" }
            case "2":
                return { name: "Nhân viên", icon: UserCheck, color: "bg-blue-500" }
            case "3":
                return { name: "Người dùng", icon: User, color: "bg-green-500" }
            default:
                return { name: "Không xác định", icon: User, color: "bg-gray-500" }
        }
    }

    const roleInfo = getRoleInfo()
    const RoleIcon = roleInfo.icon

    return (
        <div className={cn(
            "bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ease-in-out shadow-lg",
            isCollapsed ? "w-20" : "w-72"
        )}>
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">H</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                    Healer
                                </h2>
                                <p className="text-xs text-gray-500 font-medium">Medical System</p>
                            </div>
                        </div>
                    )}

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsCollapsed(!isCollapsed)}
                                    className="h-9 w-9 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                >
                                    {isCollapsed ?
                                        <Menu className="h-5 w-5 text-gray-600" /> :
                                        <X className="h-5 w-5 text-gray-600" />
                                    }
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side={isCollapsed ? "right" : "bottom"}>
                                <p>{isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {/* User Info */}
            {!isCollapsed && (
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shadow-md", roleInfo.color)}>
                            <RoleIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {
                                    account?.role?.id === "2" ?
                                        `${staff?.firstname} ${staff?.lastname}` :
                                        `${user?.firstname} ${user?.lastname}` || "Người dùng"}
                            </p>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                    {roleInfo.name}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-2">
                    {!isCollapsed && (
                        <div className="px-4 mb-6">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Điều hướng
                            </p>
                        </div>
                    )}

                    {filteredMenuItems.map((item) => (
                        <SidebarItem key={item.href} item={item} isCollapsed={isCollapsed} />
                    ))}
                </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                onClick={logout}
                                className={cn(
                                    "w-full transition-all duration-200 hover:bg-red-50 hover:text-red-600 group rounded-xl",
                                    isCollapsed ? "justify-center px-0" : "justify-start gap-3"
                                )}
                            >
                                <LogOut className="h-5 w-5 group-hover:animate-pulse" />
                                {!isCollapsed && <span className="font-medium">Đăng xuất</span>}
                            </Button>
                        </TooltipTrigger>
                        {isCollapsed && (
                            <TooltipContent side="right">
                                <p>Đăng xuất</p>
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>

                {!isCollapsed && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-400 text-center">
                            Version 1.0.0
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

// Add default export for compatibility
export default Sidebar
