"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Shield, UserCheck, Users } from "lucide-react"
import { AccountWithDetails } from "@/models/models"
import { ButtonLoading } from "@/components/loading"
import { toast } from "sonner"

interface EditingAccountDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    editingAccount: AccountWithDetails | null
    onSuccess: () => void
}

interface FormData {
    username: string
    email: string
    phoneNumber: string
    password: string
    roleId: string
}

interface FormErrors {
    username?: string
    email?: string
    phoneNumber?: string
    password?: string
    roleId?: string
}

export function EditingAccountDialog({
    open,
    onOpenChange,
    editingAccount,
    onSuccess
}: EditingAccountDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        roleId: "3"
    })
    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => {
        if (open) {
            if (editingAccount) {
                setFormData({
                    username: editingAccount.username || "",
                    email: editingAccount.email || "",
                    phoneNumber: editingAccount.phoneNumber || "",
                    password: "",
                    roleId: editingAccount.roleId || "3"
                })
            } else {
                setFormData({
                    username: "",
                    email: "",
                    phoneNumber: "",
                    password: "",
                    roleId: "3"
                })
            }
            setErrors({})
        }
    }, [open, editingAccount])

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = "Tên đăng nhập không được để trống"
        } else if (formData.username.length < 3) {
            newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự"
        }

        // Email validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ"
        }

        // Phone number validation
        if (formData.phoneNumber && !/^\d{10,11}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
            newErrors.phoneNumber = "Số điện thoại phải có 10-11 chữ số"
        }

        // Password validation for new accounts
        if (!editingAccount && !formData.password) {
            newErrors.password = "Mật khẩu không được để trống"
        } else if (formData.password && formData.password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"
        }

        // Role validation
        if (!formData.roleId) {
            newErrors.roleId = "Vui lòng chọn vai trò"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            return
        }

        try {
            setIsSubmitting(true)

            // Prepare data for API call
            const submitData = {
                username: formData.username.trim(),
                email: formData.email.trim() || null,
                phoneNumber: formData.phoneNumber.trim() || null,
                roleId: formData.roleId,
                ...(formData.password && { password: formData.password })
            }

            if (editingAccount) {
                // Update existing account
                // Replace with actual API call
                console.log("Updating account:", editingAccount.id, submitData)
                await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
                toast.success("Cập nhật tài khoản thành công")
            } else {
                // Create new account
                // Replace with actual API call
                console.log("Creating account:", submitData)
                await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
                toast.success("Tạo tài khoản thành công")
            }

            onSuccess()
            onOpenChange(false)
        } catch (error) {
            console.error("Error submitting account:", error)
            toast.error(editingAccount ? "Lỗi khi cập nhật tài khoản" : "Lỗi khi tạo tài khoản")
        } finally {
            setIsSubmitting(false)
        }
    }

    const getRoleDisplayName = (roleId: string) => {
        switch (roleId) {
            case "1": return "Quản trị viên"
            case "2": return "Nhân viên"
            case "3": return "Người dùng"
            default: return "Không xác định"
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {editingAccount ? "Chỉnh Sửa Tài Khoản" : "Thêm Tài Khoản Mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {editingAccount ? "Cập nhật thông tin tài khoản" : "Tạo tài khoản người dùng mới"}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="username">Tên đăng nhập *</Label>
                        <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => handleInputChange("username", e.target.value)}
                            placeholder="Nhập tên đăng nhập"
                            className={errors.username ? "border-red-500" : ""}
                        />
                        {errors.username && (
                            <p className="text-sm text-red-500">{errors.username}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="Nhập địa chỉ email"
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phoneNumber">Số điện thoại</Label>
                        <Input
                            id="phoneNumber"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                            placeholder="Nhập số điện thoại"
                            className={errors.phoneNumber ? "border-red-500" : ""}
                        />
                        {errors.phoneNumber && (
                            <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="roleId">Vai trò *</Label>
                        <Select
                            value={formData.roleId}
                            onValueChange={(value) => handleInputChange("roleId", value)}
                        >
                            <SelectTrigger className={errors.roleId ? "border-red-500" : ""}>
                                <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        Quản trị viên
                                    </div>
                                </SelectItem>
                                <SelectItem value="2">
                                    <div className="flex items-center gap-2">
                                        <UserCheck className="h-4 w-4" />
                                        Nhân viên
                                    </div>
                                </SelectItem>
                                <SelectItem value="3">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Người dùng
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.roleId && (
                            <p className="text-sm text-red-500">{errors.roleId}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">
                            Mật khẩu {editingAccount ? "" : "*"}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            placeholder={editingAccount ? "Để trống nếu không thay đổi" : "Nhập mật khẩu"}
                            className={errors.password ? "border-red-500" : ""}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password}</p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ButtonLoading message={editingAccount ? "Đang cập nhật..." : "Đang tạo..."} />
                        ) : (
                            editingAccount ? "Cập Nhật" : "Tạo Tài Khoản"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
