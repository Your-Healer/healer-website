import { Bell, Search, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "@tanstack/react-router"
import { useSession } from "@/contexts/SessionProvider"
import logoImage from "@/assets/images/logo.png"

export function Header() {
    const { account, logout, user, staff } = useSession()
    const navigate = useNavigate()

    const handleProfile = () => {
        try {
            if (account?.role?.id === "1" || account?.role?.id === "2") {
                navigate({ to: "/profile" })
            }
        } catch (error) {
            console.error('Navigation error:', error)
        }
    }

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    if (!account || !user) return null

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img src={logoImage} alt="Your Healer Logo" className="h-8 w-auto" />
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input placeholder="Search..." className="pl-10 w-80" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm">
                        <Bell className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={account?.avatar} alt={`${user.firstname} ${user.lastname}`} />
                                    <AvatarFallback>
                                        {
                                            account.role?.id === "2" ?
                                                getInitials(staff?.firstname || '', staff?.lastname || '') :
                                                getInitials(user.firstname, user?.lastname)
                                        }
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {user.firstname} {user.lastname}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {`${account.role?.name?.charAt(0).toUpperCase()}${account.role?.name?.slice(1)}`}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleProfile}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout}>
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
