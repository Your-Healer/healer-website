"use client"

import { useEffect, useState, useRef } from "react"
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
import { useGetMyAccount, useUpdateMyAvatar } from "@/hooks/use-accounts"
import { PageLoading, TableLoading } from "@/components/loading"
import { toast } from "sonner"

export default function ProfilePage() {
    const { account, updateUser, isAuthenticated } = useSession()
    const [isEditing, setIsEditing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Avatar upload hook
    const { updateAvatar, loading: avatarLoading } = useUpdateMyAvatar()

    // Form state for editing
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        introduction: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })

    if (!isAuthenticated || !account) {
        return <PageLoading />
    }

    const { account: getMyAccount, loading: getMyAccountLoading, refetch: refetchGetMyAccount } = useGetMyAccount(account?.id)

    // Update form data when account data is loaded
    useEffect(() => {
        if (getMyAccount) {
            setFormData({
                firstName: account.role?.id === "2" ? getMyAccount.staff?.firstname || "" : getMyAccount.user?.firstname || "",
                lastName: account.role?.id === "2" ? getMyAccount.staff?.lastname || "" : getMyAccount.user?.lastname || "",
                email: getMyAccount.email || "",
                phoneNumber: getMyAccount.phoneNumber || "",
                introduction: getMyAccount.staff?.introduction || "",
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            })
        }
    }, [getMyAccount, account.role?.id])

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = async () => {
        try {
            setIsSubmitting(true)
            // Add save logic here - call API to update profile
            console.log("Saving profile data:", formData)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            setIsEditing(false)
            // You can add toast notification here
        } catch (error) {
            console.error("Error saving profile:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handlePasswordChange = async () => {
        if (formData.newPassword !== formData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp")
            return
        }

        try {
            setIsSubmitting(true)
            // Add password change logic here
            console.log("Changing password")

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Clear password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }))
        } catch (error) {
            console.error("Error changing password:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAvatarClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            toast.error("Chỉ chấp nhận file ảnh (JPEG, PNG, WEBP)")
            return
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            toast.error("Kích thước file không được vượt quá 5MB")
            return
        }

        try {
            toast.loading("Đang tải ảnh lên...", { id: "avatar-upload" })

            await updateAvatar(file)

            toast.success("Cập nhật ảnh đại diện thành công", { id: "avatar-upload" })

            // Refresh account data to get new avatar
            await refetchGetMyAccount()

        } catch (error: any) {
            console.error("Error updating avatar:", error)
            toast.error("Lỗi khi cập nhật ảnh đại diện: " + (error.response?.data?.message || error.message), {
                id: "avatar-upload"
            })
        }

        // Clear the input value so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    const isAdmin = account?.role?.id === "1"
    const tabsConfig = isAdmin
        ? ["personal", "professional", "security", "activity"]
        : ["personal", "security", "activity"]

    if (getMyAccountLoading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar userRole={account.role?.id} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-6">
                        <div className="max-w-4xl mx-auto">
                            <TableLoading />
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole={account.role?.id} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Cài Đặt Hồ Sơ</h1>
                                <p className="text-gray-600">Quản lý thông tin tài khoản và thiết lập cá nhân</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {isEditing ? (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsEditing(false)}
                                            disabled={isSubmitting}
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            disabled={isSubmitting}
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={() => setIsEditing(true)}>
                                        <Settings className="h-4 w-4 mr-2" />
                                        Chỉnh sửa hồ sơ
                                    </Button>
                                )}
                            </div>
                        </div>

                        <Tabs defaultValue="personal" className="space-y-6 w-full">
                            <TabsList className={`grid w-full grid-cols-${tabsConfig.length}`}>
                                <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
                                {isAdmin && <TabsTrigger value="professional">Thông tin nghề nghiệp</TabsTrigger>}
                                <TabsTrigger value="security">Bảo mật</TabsTrigger>
                                <TabsTrigger value="activity">Hoạt động</TabsTrigger>
                            </TabsList>

                            <TabsContent value="personal" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Thông tin cá nhân</CardTitle>
                                        <CardDescription>Cập nhật thông tin cá nhân và liên hệ của bạn</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                <Avatar
                                                    className={`h-24 w-24 ${isEditing ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                                                    onClick={handleAvatarClick}
                                                >
                                                    <AvatarImage
                                                        src={getMyAccount?.avatar?.directory
                                                            ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/files/${getMyAccount.avatar.directory}/${getMyAccount.avatar.fileName}`
                                                            : "/placeholder.svg?height=96&width=96"
                                                        }
                                                        alt={getMyAccount?.roleId == "2" ? `${getMyAccount?.staff?.firstname} ${getMyAccount?.staff?.lastname}` : `${getMyAccount?.user?.firstname} ${getMyAccount?.user?.lastname}`}
                                                    />
                                                    <AvatarFallback className="text-lg">
                                                        {getMyAccount?.roleId == "2" ?
                                                            getInitials(getMyAccount?.staff?.firstname || "", getMyAccount?.staff?.lastname || "") :
                                                            getInitials(getMyAccount?.user?.firstname || "", getMyAccount?.user?.lastname || "")
                                                        }
                                                    </AvatarFallback>
                                                </Avatar>
                                                {isEditing && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-white border-2 border-white shadow-lg hover:bg-gray-50"
                                                            onClick={handleAvatarClick}
                                                            disabled={avatarLoading}
                                                        >
                                                            {avatarLoading ? (
                                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                                                            ) : (
                                                                <Camera className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        <input
                                                            ref={fileInputRef}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleAvatarChange}
                                                            className="hidden"
                                                        />
                                                    </>
                                                )}
                                                {avatarLoading && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    {getMyAccount?.roleId == "2" ? `${getMyAccount?.staff?.firstname} ${getMyAccount?.staff?.lastname}` : `${getMyAccount?.user?.firstname} ${getMyAccount?.user?.lastname}`}
                                                </h3>
                                                <p className="text-gray-600">{getMyAccount?.role?.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="secondary">
                                                        {getMyAccount?.emailIsVerified ? "Đã xác thực email" : "Chưa xác thực email"}
                                                    </Badge>
                                                    {isEditing && (
                                                        <p className="text-xs text-gray-500">
                                                            Nhấp vào ảnh để thay đổi
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">Họ</Label>
                                                <Input
                                                    id="firstName"
                                                    value={formData.firstName}
                                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Tên</Label>
                                                <Input
                                                    id="lastName"
                                                    value={formData.lastName}
                                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Tên đăng nhập / Địa chỉ email</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                                        disabled={!isEditing}
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Số điện thoại</Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <Input
                                                        id="phone"
                                                        value={formData.phoneNumber}
                                                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                                        disabled={!isEditing}
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {getMyAccount?.roleId === "2" && (
                                            <div className="space-y-2">
                                                <Label htmlFor="introduction">Giới thiệu bản thân</Label>
                                                <Textarea
                                                    id="introduction"
                                                    value={formData.introduction}
                                                    onChange={(e) => handleInputChange("introduction", e.target.value)}
                                                    disabled={!isEditing}
                                                    rows={4}
                                                    placeholder="Hãy giới thiệu về bản thân bạn..."
                                                />
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {isAdmin && (
                                <TabsContent value="professional" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Thông tin nghề nghiệp</CardTitle>
                                            <CardDescription>Chi tiết công việc và chứng chỉ của bạn</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="role">Vai trò</Label>
                                                    <Select value={getMyAccount?.role?.name} disabled={!isEditing}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Administrator">Quản trị viên</SelectItem>
                                                            <SelectItem value="Doctor">Bác sĩ</SelectItem>
                                                            <SelectItem value="Nurse">Y tá</SelectItem>
                                                            <SelectItem value="Receptionist">Lễ tân</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="education">Trình độ học vấn</Label>
                                                    <Input
                                                        id="education"
                                                        value={getMyAccount?.staff?.educationLevel || "Chưa có thông tin"}
                                                        disabled={!isEditing}
                                                    />
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="space-y-4">
                                                <h4 className="text-sm font-medium">Quyền hạn & Truy cập</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-blue-600" />
                                                            <span className="text-sm">Quản lý bệnh nhân</span>
                                                        </div>
                                                        <Badge variant="default">Được phép</Badge>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-green-600" />
                                                            <span className="text-sm">Lập lịch hẹn</span>
                                                        </div>
                                                        <Badge variant="default">Được phép</Badge>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <Settings className="h-4 w-4 text-purple-600" />
                                                            <span className="text-sm">Cài đặt hệ thống</span>
                                                        </div>
                                                        <Badge variant="default">Được phép</Badge>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <Activity className="h-4 w-4 text-orange-600" />
                                                            <span className="text-sm">Báo cáo thống kê</span>
                                                        </div>
                                                        <Badge variant="default">Được phép</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            )}

                            <TabsContent value="security" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Cài đặt bảo mật</CardTitle>
                                        <CardDescription>Quản lý mật khẩu và thiết lập bảo mật</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-medium">Đổi mật khẩu</h4>
                                            <div className="grid grid-cols-1 gap-4 max-w-md">
                                                <div className="space-y-2">
                                                    <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                                                    <Input
                                                        id="currentPassword"
                                                        type="password"
                                                        value={formData.currentPassword}
                                                        onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                                                    <Input
                                                        id="newPassword"
                                                        type="password"
                                                        value={formData.newPassword}
                                                        onChange={(e) => handleInputChange("newPassword", e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                                                    <Input
                                                        id="confirmPassword"
                                                        type="password"
                                                        value={formData.confirmPassword}
                                                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                                    />
                                                </div>
                                                <Button
                                                    className="w-fit"
                                                    onClick={handlePasswordChange}
                                                    disabled={isSubmitting || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                                                >
                                                    <Key className="h-4 w-4 mr-2" />
                                                    {isSubmitting ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                                                </Button>
                                            </div>
                                        </div>

                                        {isAdmin && (
                                            <>
                                                <Separator />
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-medium">Thông tin bảo mật</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <span className="text-sm">Lần đổi mật khẩu cuối</span>
                                                            <span className="text-sm text-gray-600">3 tháng trước</span>
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <span className="text-sm">Xác thực hai yếu tố</span>
                                                            <Badge variant="outline">Chưa bật</Badge>
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <span className="text-sm">Thông báo đăng nhập</span>
                                                            <Badge variant="default">Đã bật</Badge>
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <span className="text-sm">Địa chỉ ví Blockchain</span>
                                                            <span className="text-xs text-gray-600 font-mono">
                                                                {getMyAccount?.walletAddress ?
                                                                    `${getMyAccount.walletAddress.slice(0, 6)}...${getMyAccount.walletAddress.slice(-4)}` :
                                                                    "Chưa có"
                                                                }
                                                            </span>
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
                                        <CardTitle>Hoạt động gần đây</CardTitle>
                                        <CardDescription>Các hành động gần đây và lịch sử đăng nhập</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {(isAdmin
                                                ? [
                                                    { action: "Đăng nhập vào hệ thống", time: "2 giờ trước", ip: "192.168.1.100" },
                                                    { action: "Cập nhật hồ sơ bệnh nhân", time: "4 giờ trước", ip: "192.168.1.100" },
                                                    { action: "Tạo báo cáo thống kê", time: "1 ngày trước", ip: "192.168.1.100" },
                                                    { action: "Thêm nhân viên mới", time: "2 ngày trước", ip: "192.168.1.100" },
                                                    { action: "Cập nhật cài đặt hệ thống", time: "3 ngày trước", ip: "192.168.1.100" },
                                                ]
                                                : [
                                                    { action: "Đăng nhập vào hệ thống", time: "1 giờ trước", ip: "192.168.1.101" },
                                                    { action: "Đăng ký bệnh nhân mới", time: "3 giờ trước", ip: "192.168.1.101" },
                                                    { action: "Cập nhật thông tin bệnh nhân", time: "5 giờ trước", ip: "192.168.1.101" },
                                                    { action: "Đặt lịch hẹn", time: "1 ngày trước", ip: "192.168.1.101" },
                                                    { action: "Đăng nhập vào hệ thống", time: "2 ngày trước", ip: "192.168.1.101" },
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
