import { useState } from "react"
import { Link, useLocation } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSession } from "@/contexts/SessionProvider"
import {
    LogOut,
    Menu,
    X,
} from "lucide-react"
import { adminMenuItems, receptionistMenuItems } from "@/utils/side-bar-menu"

interface SidebarProps {
    userRole: "admin" | "receptionist"
}

export function Sidebar({ userRole }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const location = useLocation()
    const { logout, checkPermission } = useSession()

    const menuItems = userRole === "admin" ? adminMenuItems : receptionistMenuItems
    const filteredMenuItems = menuItems.filter((item) => !item.permission || checkPermission(item.permission))

    return (
        <div className={cn("bg-white border-r border-gray-200 h-screen flex flex-col", isCollapsed ? "w-16" : "w-64")}>
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    {!isCollapsed && <h2 className="text-lg font-semibold text-gray-800">Medical ERP</h2>}
                    <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)}>
                        {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {filteredMenuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.href

                        return (
                            <li key={item.href}>
                                <Link
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {!isCollapsed && <span>{item.label}</span>}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-200">
                <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <LogOut className="h-4 w-4" />
                    {!isCollapsed && <span>Logout</span>}
                </Button>
            </div>
        </div>
    )
}
