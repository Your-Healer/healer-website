import { ReactNode } from "react"
import { useLocation } from "@tanstack/react-router"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Sidebar } from "@/components/layout/Sidebar/Sidebar"
import { Header } from "@/components/layout/Header/Header"
import { useSession } from "@/contexts/SessionProvider"

interface AppLayoutProps {
    children: ReactNode
    breadcrumbs?: Array<{ label: string; href?: string }>
}

export default function AppLayout({ children, breadcrumbs = [] }: AppLayoutProps) {
    const location = useLocation()
    const { account, isAuthenticated } = useSession()

    // Routes that should not have sidebar
    const noSidebarRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/']
    const shouldShowSidebar = isAuthenticated && !noSidebarRoutes.includes(location.pathname)

    // If no sidebar needed, render simple layout
    if (!shouldShowSidebar) {
        return (
            <div className="min-h-screen bg-gray-50">
                {children}
            </div>
        )
    }

    // Render layout with sidebar for authenticated routes
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole={account?.role?.id} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto">
                    {/* Breadcrumb Header */}
                    {breadcrumbs.length > 0 && (
                        <div className="bg-white border-b border-gray-200 px-6 py-4">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {breadcrumbs.map((breadcrumb, index) => (
                                        <BreadcrumbItem key={index}>
                                            {index === breadcrumbs.length - 1 ? (
                                                <BreadcrumbPage className="text-gray-900 font-medium">
                                                    {breadcrumb.label}
                                                </BreadcrumbPage>
                                            ) : (
                                                <>
                                                    <BreadcrumbLink
                                                        href={breadcrumb.href}
                                                        className="text-gray-600 hover:text-gray-900 transition-colors"
                                                    >
                                                        {breadcrumb.label}
                                                    </BreadcrumbLink>
                                                    <BreadcrumbSeparator className="text-gray-400" />
                                                </>
                                            )}
                                        </BreadcrumbItem>
                                    ))}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="flex-1">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
