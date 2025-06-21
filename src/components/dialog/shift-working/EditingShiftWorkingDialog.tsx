"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ShiftWorkingDetails } from "@/models/models"
import { ButtonLoading } from "@/components/loading"
import { toast } from "sonner"
import { SelectStaffs } from "@/components/select/SelectStaffs"
import { SelectMedicalRoom } from "@/components/select/SelectMedicalRoom"
import { SelectDepartments } from "@/components/select/SelectDepartments"
import { useCreateShiftWorking, useUpdateShiftWorking } from "@/hooks/use-shift-working"

interface EditingShiftWorkingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    editingShiftWorking: ShiftWorkingDetails | null
    onSuccess: () => void
}

interface FormData {
    staffId: string
    roomId: string
    departmentId: string
    fromTime: string
    toTime: string
    date: string
}

interface FormErrors {
    staffId?: string
    roomId?: string
    fromTime?: string
    toTime?: string
    date?: string
}

export function EditingShiftWorkingDialog({
    open,
    onOpenChange,
    editingShiftWorking,
    onSuccess
}: EditingShiftWorkingDialogProps) {
    const { createShiftWorking, loading: createLoading } = useCreateShiftWorking()
    const { updateShiftWorking, loading: updateLoading } = useUpdateShiftWorking()
    const isSubmitting = createLoading || updateLoading

    const [formData, setFormData] = useState<FormData>({
        staffId: "",
        roomId: "",
        departmentId: "",
        fromTime: "",
        toTime: "",
        date: ""
    })
    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => {
        if (open) {
            if (editingShiftWorking) {
                const fromDate = new Date(editingShiftWorking.fromTime)
                const toDate = new Date(editingShiftWorking.toTime)

                setFormData({
                    staffId: editingShiftWorking.staffId,
                    roomId: editingShiftWorking.roomId,
                    departmentId: editingShiftWorking.room?.department?.id || "",
                    date: fromDate.toISOString().split('T')[0],
                    fromTime: fromDate.toTimeString().slice(0, 5),
                    toTime: toDate.toTimeString().slice(0, 5)
                })
            } else {
                const today = new Date()
                setFormData({
                    staffId: "",
                    roomId: "",
                    departmentId: "",
                    fromTime: "08:00",
                    toTime: "17:00",
                    date: today.toISOString().split('T')[0]
                })
            }
            setErrors({})
        }
    }, [open, editingShiftWorking])

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.staffId) {
            newErrors.staffId = "Vui lòng chọn nhân viên"
        }

        if (!formData.roomId) {
            newErrors.roomId = "Vui lòng chọn phòng khám"
        }

        if (!formData.date) {
            newErrors.date = "Vui lòng chọn ngày"
        } else {
            const selectedDate = new Date(formData.date)
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            if (selectedDate < today) {
                newErrors.date = "Không thể chọn ngày trong quá khứ"
            }
        }

        if (!formData.fromTime) {
            newErrors.fromTime = "Vui lòng chọn giờ bắt đầu"
        }

        if (!formData.toTime) {
            newErrors.toTime = "Vui lòng chọn giờ kết thúc"
        }

        if (formData.fromTime && formData.toTime && formData.fromTime >= formData.toTime) {
            newErrors.toTime = "Giờ kết thúc phải sau giờ bắt đầu"
        }

        // Check if shift duration is reasonable (at least 1 hour, max 16 hours)
        if (formData.fromTime && formData.toTime) {
            const from = new Date(`2000-01-01T${formData.fromTime}:00`)
            const to = new Date(`2000-01-01T${formData.toTime}:00`)
            const diffHours = (to.getTime() - from.getTime()) / (1000 * 60 * 60)

            if (diffHours < 1) {
                newErrors.toTime = "Ca làm việc phải ít nhất 1 giờ"
            } else if (diffHours > 16) {
                newErrors.toTime = "Ca làm việc không được vượt quá 16 giờ"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts changing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            return
        }

        try {
            const fromDateTime = new Date(`${formData.date}T${formData.fromTime}:00`)
            const toDateTime = new Date(`${formData.date}T${formData.toTime}:00`)

            const submitData = {
                staffId: formData.staffId,
                roomId: formData.roomId,
                fromTime: fromDateTime,
                toTime: toDateTime
            }

            if (editingShiftWorking) {
                await updateShiftWorking(editingShiftWorking.id, submitData)
                toast.success("Cập nhật ca làm việc thành công")
            } else {
                await createShiftWorking(submitData)
                toast.success("Tạo ca làm việc thành công")
            }

            onSuccess()
            onOpenChange(false)
        } catch (error: any) {
            console.error("Error submitting shift working:", error)

            // Handle specific API errors
            if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error(editingShiftWorking ? "Lỗi khi cập nhật ca làm việc" : "Lỗi khi tạo ca làm việc")
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {editingShiftWorking ? "Chỉnh Sửa Ca Làm Việc" : "Thêm Ca Làm Việc Mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {editingShiftWorking ? "Cập nhật thông tin ca làm việc" : "Tạo ca làm việc mới cho nhân viên"}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <SelectDepartments
                        label="Khoa *"
                        value={formData.departmentId}
                        onValueChange={(value) => {
                            handleInputChange("departmentId", value)
                            // Reset room when department changes
                            setFormData(prev => ({ ...prev, roomId: "" }))
                            setErrors(prev => ({ ...prev, roomId: undefined }))
                        }}
                        placeholder="Chọn khoa"
                        className={errors.roomId ? "border-red-500" : ""}
                    />

                    <SelectMedicalRoom
                        label="Phòng khám *"
                        value={formData.roomId}
                        onValueChange={(value) => handleInputChange("roomId", value)}
                        placeholder="Chọn phòng khám"
                        departmentId={formData.departmentId || undefined}
                        className={errors.roomId ? "border-red-500" : ""}
                    />
                    {errors.roomId && (
                        <p className="text-sm text-red-500">{errors.roomId}</p>
                    )}

                    <SelectStaffs
                        label="Nhân viên *"
                        value={formData.staffId}
                        onValueChange={(value) => handleInputChange("staffId", value)}
                        placeholder="Chọn nhân viên"
                        departmentId={formData.departmentId || undefined}
                        className={errors.staffId ? "border-red-500" : ""}
                    />
                    {errors.staffId && (
                        <p className="text-sm text-red-500">{errors.staffId}</p>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="date">Ngày làm việc *</Label>
                        <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleInputChange("date", e.target.value)}
                            className={errors.date ? "border-red-500" : ""}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        {errors.date && (
                            <p className="text-sm text-red-500">{errors.date}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="fromTime">Giờ bắt đầu *</Label>
                            <Input
                                id="fromTime"
                                type="time"
                                value={formData.fromTime}
                                onChange={(e) => handleInputChange("fromTime", e.target.value)}
                                className={errors.fromTime ? "border-red-500" : ""}
                            />
                            {errors.fromTime && (
                                <p className="text-sm text-red-500">{errors.fromTime}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="toTime">Giờ kết thúc *</Label>
                            <Input
                                id="toTime"
                                type="time"
                                value={formData.toTime}
                                onChange={(e) => handleInputChange("toTime", e.target.value)}
                                className={errors.toTime ? "border-red-500" : ""}
                            />
                            {errors.toTime && (
                                <p className="text-sm text-red-500">{errors.toTime}</p>
                            )}
                        </div>
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
                            <ButtonLoading message={editingShiftWorking ? "Đang cập nhật..." : "Đang tạo..."} />
                        ) : (
                            editingShiftWorking ? "Cập Nhật" : "Tạo Ca Làm Việc"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
