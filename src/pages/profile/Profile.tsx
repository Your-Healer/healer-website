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
import { UserProfile } from "@/utils/types"

export default function ProfilePage() {
    const { user, updateUser, isAuthenticated } = useSession()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            navigate({ to: "/" })
            return
        }

        if (user) {
            setProfile({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone || "",
                address: user.address || "",
                dateOfBirth: user.dateOfBirth || "",
                role: user.role === "admin" ? "Administrator" : "Receptionist",
                department: user.department,
                employeeId: user.employeeId,
                joinDate: user.joinDate || "",
                bio: user.bio || "",
                avatar: user.avatar || "",
            })
        }
    }, [user, isAuthenticated, navigate])

    const handleSave = () => {
        if (profile && user) {
            updateUser({
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                phone: profile.phone,
                address: profile.address,
                dateOfBirth: profile.dateOfBirth,
                bio: profile.bio,
                avatar: profile.avatar,
            })
            setIsEditing(false)
        }
    }

    const handleInputChange = (field: keyof UserProfile, value: string) => {
        if (profile) {
            setProfile((prev) => (prev ? { ...prev, [field]: value } : null))
        }
    }

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    const getPermissionBadges = () => {
        if (!user) return []

        const permissionMap: Record<string, { label: string; color: string; icon: any }> = {
            "user.create": { label: "User Management", color: "text-green-600", icon: User },
            "analytics.read": { label: "Analytics Access", color: "text-purple-600", icon: Activity },
            "system.settings": { label: "System Settings", color: "text-orange-600", icon: Settings },
            "patient.create": { label: "Patient Management", color: "text-blue-600", icon: User },
            "appointment.create": { label: "Appointment Management", color: "text-indigo-600", icon: Calendar },
        }

        return user.permissions
            .filter((permission) => permissionMap[permission])
            .map((permission) => ({
                ...permissionMap[permission],
                permission,
            }))
    }

    if (!isAuthenticated || !user || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    const isAdmin = user.role === "admin"
    const tabsConfig = isAdmin
        ? ["personal", "professional", "security", "activity"]
        : ["personal", "security", "activity"]

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole={user.role} />
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
                                                        src={profile.avatar || "/placeholder.svg?height=96&width=96"}
                                                        alt={`${profile.firstName} ${profile.lastName}`}
                                                    />
                                                    <AvatarFallback className="text-lg">
                                                        {getInitials(profile.firstName, profile.lastName)}
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
                                                    {profile.firstName} {profile.lastName}
                                                </h3>
                                                <p className="text-gray-600">{profile.role}</p>
                                                <Badge variant="secondary" className="mt-1">
                                                    {profile.department}
                                                </Badge>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    value={profile.firstName}
                                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    value={profile.lastName}
                                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
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
                                                        value={profile.email}
                                                        onChange={(e) => handleInputChange("email", e.target.value)}
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
                                                        value={profile.phone}
                                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                                        disabled={!isEditing}
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <Input
                                                        id="dateOfBirth"
                                                        type="date"
                                                        value={profile.dateOfBirth}
                                                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                                                        disabled={!isEditing}
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="employeeId">Employee ID</Label>
                                                <Input id="employeeId" value={profile.employeeId} disabled className="bg-gray-50" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address">Address</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                                <Textarea
                                                    id="address"
                                                    value={profile.address}
                                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                                    disabled={!isEditing}
                                                    className="pl-10"
                                                    rows={3}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Textarea
                                                id="bio"
                                                value={profile.bio}
                                                onChange={(e) => handleInputChange("bio", e.target.value)}
                                                disabled={!isEditing}
                                                rows={4}
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>
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
                                                    <Label htmlFor="employeeId">Employee ID</Label>
                                                    <Input id="employeeId" value={profile.employeeId} disabled className="bg-gray-50" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="role">Role</Label>
                                                    <Select value={profile.role} disabled={!isEditing}>
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
                                                <div className="space-y-2">
                                                    <Label htmlFor="department">Department</Label>
                                                    <Select value={profile.department} disabled={!isEditing}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Administration">Administration</SelectItem>
                                                            <SelectItem value="Cardiology">Cardiology</SelectItem>
                                                            <SelectItem value="Emergency">Emergency</SelectItem>
                                                            <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="joinDate">Join Date</Label>
                                                    <Input id="joinDate" type="date" value={profile.joinDate} disabled className="bg-gray-50" />
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="space-y-4">
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
                                            </div>
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
            </div>
        </div>
    )
}
