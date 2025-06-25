import { Link, useLocation } from "@tanstack/react-router"
import { MenuItem } from '../../../utils/side-bar-menu'
import { cn } from "@/lib/utils"

interface SidebarItemProps {
    item: MenuItem
    isCollapsed: boolean
}

export default function SidebarItem({ item, isCollapsed }: SidebarItemProps) {
    const location = useLocation()
    const Icon = item.icon

    const isActive = location.pathname === item.href ||
        (item.href !== '/dashboard' && location.pathname.startsWith(item.href))

    return (
        <Link
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
}