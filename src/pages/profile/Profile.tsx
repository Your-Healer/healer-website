"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar/Sidebar"
import { Header } from "@/components/layout/Header/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, MapPin, Calendar, Camera, Save, Key, Activity, Clock, Settings } from "lucide-react"
import { useSession } from "@/contexts/SessionProvider"
import { useNavigate } from "@tanstack/react-router"
import { useGetMyAccount } from "@/hooks/use-accounts"
import { PageLoading } from "@/components/loading"
import AdminDashboard from '../dashboard/AdminDashboard';

export default function ProfilePage() {
    const { account, updateUser, isAuthenticated } = useSession()
    const [isEditing, setIsEditing] = useState(false)
    const navigate = useNavigate()

    if (!isAuthenticated || !account) {
        return (
            <PageLoading />
        )
    }

    const { account: getMyAccount, loading: getMyAccountLoading, refetch: refetchGetMyAccount } = useGetMyAccount(account?.id)

    const handleSave = () => {

    }

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    const isAdmin = account?.role?.id === "1"
    const tabsConfig = isAdmin
        ? ["personal", "professional", "security", "activity"]
        : ["personal", "security", "activity"]

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole={account.role?.id} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                                <p className="text-gray-600">Manage your account information and preferences</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {isEditing ? (
                                    <>
                                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSave}>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={() => setIsEditing(true)}>
                                        <Settings className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                        </div>

                        <Tabs defaultValue="personal" className="space-y-6 w-full">
                            <TabsList className={`grid w-full grid-cols-${tabsConfig.length}`}>
                                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                                {isAdmin && <TabsTrigger value="professional">Professional</TabsTrigger>}
                                <TabsTrigger value="security">Security</TabsTrigger>
                                <TabsTrigger value="activity">Activity</TabsTrigger>
                            </TabsList>

                            <TabsContent value="personal" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Personal Information</CardTitle>
                                        <CardDescription>Update your personal details and contact information</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                <Avatar className="h-24 w-24">
                                                    <AvatarImage
                                                        src={"/placeholder.svg?height=96&width=96"}
                                                        alt={getMyAccount?.roleId == "2" ? `${getMyAccount?.staff?.firstname} ${getMyAccount?.staff?.lastname}` : `${getMyAccount?.user?.firstname} ${getMyAccount?.user?.lastname}`}
                                                    />
                                                    <AvatarFallback className="text-lg">
                                                        {

                                                            getMyAccount?.roleId == "2" ?
                                                                getInitials(getMyAccount?.staff?.firstname || "", getMyAccount?.staff?.lastname || "") :
                                                                getInitials(getMyAccount?.user?.firstname || "", getMyAccount?.user?.lastname || "")
                                                        }
                                                    </AvatarFallback>
                                                </Avatar>
                                                {isEditing && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                                                    >
                                                        <Camera className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    {getMyAccount?.roleId == "2" ? `${getMyAccount?.staff?.firstname} ${getMyAccount?.staff?.lastname}` : `${getMyAccount?.user?.firstname} ${getMyAccount?.user?.lastname}`}
                                                </h3>
                                                <p className="text-gray-600">{getMyAccount?.role?.name}</p>
                                                {/* <Badge variant="secondary" className="mt-1">
                                                    {getMyAccount?.staff}
                                                </Badge> */}
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    value={account.role?.id === "2" ? getMyAccount?.user?.firstname : getMyAccount?.staff?.firstname}
                                                    onChange={
                                                        // (e) => handleInputChange("firstName", e.target.value)
                                                        () => { }
                                                    }
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    value={account.role?.id === "2" ? getMyAccount?.user?.lastname : getMyAccount?.staff?.lastname}
                                                    onChange={
                                                        // (e) => handleInputChange("lastName", e.target.value)
                                                        () => { }
                                                    }
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Username / Email Address</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={getMyAccount?.email}
                                                        onChange={
                                                            // (e) => handleInputChange("email", e.target.value)
                                                            () => { }
                                                        }
                                                        disabled={!isEditing}
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <Input
                                                        id="phone"
                                                        value={getMyAccount?.phoneNumber}
                                                        onChange={
                                                            // (e) => handleInputChange("phone", e.target.value)
                                                            () => { }
                                                        }
                                                        disabled={!isEditing}
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {
                                            getMyAccount?.roleId === "2" && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="introduction">Bio</Label>
                                                    <Textarea
                                                        id="introduction"
                                                        value={getMyAccount.staff?.introduction}
                                                        onChange={
                                                            // (e) => handleInputChange("introduction", e.target.value)
                                                            () => { }
                                                        }
                                                        disabled={!isEditing}
                                                        rows={4}
                                                        placeholder="Tell us about yourself..."
                                                    />
                                                </div>
                                            )
                                        }

                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {isAdmin && (
                                <TabsContent value="professional" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Professional Information</CardTitle>
                                            <CardDescription>Your work-related details and credentials</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="role">Role</Label>
                                                    <Select value={getMyAccount?.role?.name} disabled={!isEditing}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Administrator">Administrator</SelectItem>
                                                            <SelectItem value="Doctor">Doctor</SelectItem>
                                                            <SelectItem value="Nurse">Nurse</SelectItem>
                                                            <SelectItem value="Receptionist">Receptionist</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <Separator />

                                            {/* <div className="space-y-4">
                                                <h4 className="text-sm font-medium">Permissions & Access</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {getPermissionBadges().map((perm, index) => {
                                                        const IconComponent = perm.icon
                                                        return (
                                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                                <div className="flex items-center gap-2">
                                                                    <IconComponent className={`h-4 w-4 ${perm.color}`} />
                                                                    <span className="text-sm">{perm.label}</span>
                                                                </div>
                                                                <Badge variant="default">Enabled</Badge>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div> */}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            )}

                            <TabsContent value="security" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Security Settings</CardTitle>
                                        <CardDescription>Manage your password and security preferences</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-medium">Change Password</h4>
                                            <div className="grid grid-cols-1 gap-4 max-w-md">
                                                <div className="space-y-2">
                                                    <Label htmlFor="currentPassword">Current Password</Label>
                                                    <Input id="currentPassword" type="password" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="newPassword">New Password</Label>
                                                    <Input id="newPassword" type="password" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                                    <Input id="confirmPassword" type="password" />
                                                </div>
                                                <Button className="w-fit">
                                                    <Key className="h-4 w-4 mr-2" />
                                                    Update Password
                                                </Button>
                                            </div>
                                        </div>

                                        {isAdmin && (
                                            <>
                                                <Separator />
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-medium">Security Information</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <span className="text-sm">Last Password Change</span>
                                                            <span className="text-sm text-gray-600">3 months ago</span>
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <span className="text-sm">Two-Factor Authentication</span>
                                                            <Badge variant="outline">Not Enabled</Badge>
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <span className="text-sm">Login Notifications</span>
                                                            <Badge variant="default">Enabled</Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="activity" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Activity</CardTitle>
                                        <CardDescription>Your recent actions and login history</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {(isAdmin
                                                ? [
                                                    { action: "Logged in", time: "2 hours ago", ip: "192.168.1.100" },
                                                    { action: "Updated patient record", time: "4 hours ago", ip: "192.168.1.100" },
                                                    { action: "Generated analytics report", time: "1 day ago", ip: "192.168.1.100" },
                                                    { action: "Added new staff member", time: "2 days ago", ip: "192.168.1.100" },
                                                    { action: "Updated system settings", time: "3 days ago", ip: "192.168.1.100" },
                                                ]
                                                : [
                                                    { action: "Logged in", time: "1 hour ago", ip: "192.168.1.101" },
                                                    { action: "Registered new patient", time: "3 hours ago", ip: "192.168.1.101" },
                                                    { action: "Updated patient information", time: "5 hours ago", ip: "192.168.1.101" },
                                                    { action: "Scheduled appointment", time: "1 day ago", ip: "192.168.1.101" },
                                                    { action: "Logged in", time: "2 days ago", ip: "192.168.1.101" },
                                                ]
                                            ).map((activity, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <Clock className="h-4 w-4 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium">{activity.action}</p>
                                                            <p className="text-xs text-gray-600">IP: {activity.ip}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500">{activity.time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div >
        </div >
    )
}
