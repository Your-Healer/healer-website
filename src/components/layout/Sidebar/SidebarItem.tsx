import { useState } from "react"
import { Link, useLocation } from "@tanstack/react-router"
import { MenuItem } from '../../../utils/side-bar-menu'
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidebarItemProps {
    item: MenuItem
    isCollapsed: boolean
}

export default function SidebarItem({ item, isCollapsed }: SidebarItemProps) {
    const [isHovered, setIsHovered] = useState(false)
    const location = useLocation()
    const Icon = item.icon

    // Enhanced route matching with exactMatch support
    const isActive = location.pathname.startsWith(item.href)

    const itemContent = (
        <Link
            to={item.href}
            className={cn(
                "group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ease-in-out",
                "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                isActive
                    ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/30 border border-blue-400/20 transform scale-[1.01]"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:via-blue-25 hover:to-blue-50 hover:text-blue-700 hover:shadow-md",
                isCollapsed && "justify-center px-3"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={cn(
                "relative flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300",
                isActive
                    ? "bg-white/25 text-white shadow-lg backdrop-blur-sm ring-2 ring-white/30"
                    : "text-gray-500 group-hover:text-blue-600 group-hover:bg-blue-100/70 group-hover:shadow-md group-hover:scale-110"
            )}>
                <Icon className={cn(
                    "transition-all duration-300",
                    isActive
                        ? "h-6 w-6 drop-shadow-sm text-white"
                        : "h-5 w-5 group-hover:scale-110 group-hover:text-blue-600"
                )} />

                {isActive && (
                    <>
                        <div className="absolute inset-0 bg-white/10 rounded-2xl animate-pulse" />
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/30 to-blue-600/30 rounded-2xl opacity-60 blur-lg animate-pulse" />
                    </>
                )}
            </div>

            {!isCollapsed && (
                <>
                    <span className={cn(
                        "flex-1 truncate transition-all duration-300",
                        isActive
                            ? "text-white font-bold tracking-wide drop-shadow-sm"
                            : "text-gray-600 group-hover:text-blue-700 group-hover:font-semibold"
                    )}>
                        {item.label}
                    </span>

                    {/* Active indicator dot */}
                    {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full shadow-lg animate-pulse" />
                    )}

                    {/* Hover arrow */}
                    {(isHovered && !isActive) && (
                        <ChevronRight className="h-4 w-4 text-blue-500 transition-all duration-300 translate-x-1" />
                    )}
                </>
            )}

            {/* Enhanced Active indicators */}
            {isActive && (
                <>
                    {/* Left border indicator - thicker and more prominent */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-12 bg-white rounded-r-xl shadow-xl" />

                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-2xl blur-xl -z-10" />

                    {/* Top and bottom accent lines */}
                    <div className="absolute top-0 left-4 right-4 h-0.5 bg-white/40 rounded-full" />
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-white/40 rounded-full" />

                    {/* Sparkle effect for extra emphasis */}
                    <div className="absolute top-2 right-2 w-1 h-1 bg-white/60 rounded-full animate-ping" />
                    <div className="absolute bottom-2 right-3 w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse delay-300" />
                </>
            )}

            {/* Hover effect for non-active items */}
            {!isActive && isHovered && (
                <>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-blue-400 rounded-r-full opacity-70 transition-all duration-300" />
                    <div className="absolute inset-0 bg-blue-50/50 rounded-2xl -z-10" />
                </>
            )}
        </Link>
    )

    if (isCollapsed) {
        return (
            <TooltipProvider>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        {itemContent}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2">
                        <div className="flex items-center gap-2">
                            <p className={cn(
                                "font-medium",
                                isActive ? "text-blue-600 font-bold" : "text-gray-700"
                            )}>
                                {item.label}
                            </p>
                            {isActive && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            )}
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return itemContent
}