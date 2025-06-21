"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ButtonLoading } from "@/components/loading"
import { toast } from "sonner"

interface MedicalRecord {
    id: string
    patientId: string
    patientName: string
    diagnosis: string
    treatment: string
    status: "active" | "completed" | "pending"
    createdAt: string
    updatedAt: string
    doctorName: string
    department: string
}

interface EditingMedicalRecordDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    editingRecord: MedicalRecord | null
    onSuccess: () => void
}

interface FormData {
    patientId: string
    patientName: string
    diagnosis: string
    treatment: string
    status: string
    doctorName: string
    department: string
    notes: string
}

interface FormErrors {
    patientId?: string
    patientName?: string
    diagnosis?: string
    treatment?: string
    doctorName?: string
    department?: string
}

export function EditingMedicalRecordDialog({
    open,
    onOpenChange,
    editingRecord,
    onSuccess
}: EditingMedicalRecordDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        patientId: "",
        patientName: "",
        diagnosis: "",
        treatment: "",
        status: "pending",
        doctorName: "",
        department: "",
        notes: ""
    })
    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => {
        if (open) {
            if (editingRecord) {
                setFormData({
                    patientId: editingRecord.patientId || "",
                    patientName: editingRecord.patientName || "",
                    diagnosis: editingRecord.diagnosis || "",
                    treatment: editingRecord.treatment || "",
                    status: editingRecord.status || "pending",
                    doctorName: editingRecord.doctorName || "",
                    department: editingRecord.department || "",
                    notes: ""
                })
            } else {
                setFormData({
                    patientId: "",
                    patientName: "",
                    diagnosis: "",
                    treatment: "",
                    status: "pending",
                    doctorName: "",
                    department: "",
                    notes: ""
                })
            }
            setErrors({})
        }
    }, [open, editingRecord])

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.patientId.trim()) {
            newErrors.patientId = "Mã bệnh nhân không được để trống"
        }

        if (!formData.patientName.trim()) {
            newErrors.patientName = "Tên bệnh nhân không được để trống"
        }

        if (!formData.diagnosis.trim()) {
            newErrors.diagnosis = "Chẩn đoán không được để trống"
        }

        if (!formData.treatment.trim()) {
            newErrors.treatment = "Phương pháp điều trị không được để trống"
        }

        if (!formData.doctorName.trim()) {
            newErrors.doctorName = "Tên bác sĩ không được để trống"
        }

        if (!formData.department.trim()) {
            newErrors.department = "Khoa không được để trống"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            return
        }

        try {
            setIsSubmitting(true)

            const submitData = {
                patientId: formData.patientId.trim(),
                patientName: formData.patientName.trim(),
                diagnosis: formData.diagnosis.trim(),
                treatment: formData.treatment.trim(),
                status: formData.status,
                doctorName: formData.doctorName.trim(),
                department: formData.department.trim(),
                notes: formData.notes.trim()
            }

            if (editingRecord) {
                console.log("Updating medical record:", editingRecord.id, submitData)
                await new Promise(resolve => setTimeout(resolve, 1000))
                toast.success("Cập nhật hồ sơ bệnh án thành công")
            } else {
                console.log("Creating medical record:", submitData)
                await new Promise(resolve => setTimeout(resolve, 1000))
                toast.success("Tạo hồ sơ bệnh án thành công")
            }

            onSuccess()
            onOpenChange(false)
        } catch (error) {
            console.error("Error submitting medical record:", error)
            toast.error(editingRecord ? "Lỗi khi cập nhật hồ sơ" : "Lỗi khi tạo hồ sơ")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {editingRecord ? "Chỉnh Sửa Hồ Sơ Bệnh Án" : "Thêm Hồ Sơ Bệnh Án Mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {editingRecord ? "Cập nhật thông tin hồ sơ bệnh án" : "Tạo hồ sơ bệnh án mới cho bệnh nhân"}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="patientId">Mã bệnh nhân *</Label>
                            <Input
                                id="patientId"
                                value={formData.patientId}
                                onChange={(e) => handleInputChange("patientId", e.target.value)}
                                placeholder="Nhập mã bệnh nhân"
                                className={errors.patientId ? "border-red-500" : ""}
                            />
                            {errors.patientId && (
                                <p className="text-sm text-red-500">{errors.patientId}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="patientName">Tên bệnh nhân *</Label>
                            <Input
                                id="patientName"
                                value={formData.patientName}
                                onChange={(e) => handleInputChange("patientName", e.target.value)}
                                placeholder="Nhập tên bệnh nhân"
                                className={errors.patientName ? "border-red-500" : ""}
                            />
                            {errors.patientName && (
                                <p className="text-sm text-red-500">{errors.patientName}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="diagnosis">Chẩn đoán *</Label>
                        <Textarea
                            id="diagnosis"
                            value={formData.diagnosis}
                            onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                            placeholder="Nhập chẩn đoán bệnh"
                            className={errors.diagnosis ? "border-red-500" : ""}
                            rows={3}
                        />
                        {errors.diagnosis && (
                            <p className="text-sm text-red-500">{errors.diagnosis}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="treatment">Phương pháp điều trị *</Label>
                        <Textarea
                            id="treatment"
                            value={formData.treatment}
                            onChange={(e) => handleInputChange("treatment", e.target.value)}
                            placeholder="Nhập phương pháp điều trị"
                            className={errors.treatment ? "border-red-500" : ""}
                            rows={3}
                        />
                        {errors.treatment && (
                            <p className="text-sm text-red-500">{errors.treatment}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="doctorName">Bác sĩ phụ trách *</Label>
                            <Input
                                id="doctorName"
                                value={formData.doctorName}
                                onChange={(e) => handleInputChange("doctorName", e.target.value)}
                                placeholder="Nhập tên bác sĩ"
                                className={errors.doctorName ? "border-red-500" : ""}
                            />
                            {errors.doctorName && (
                                <p className="text-sm text-red-500">{errors.doctorName}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="department">Khoa *</Label>
                            <Select
                                value={formData.department}
                                onValueChange={(value) => handleInputChange("department", value)}
                            >
                                <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Chọn khoa" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Nội khoa">Nội khoa</SelectItem>
                                    <SelectItem value="Ngoại khoa">Ngoại khoa</SelectItem>
                                    <SelectItem value="Tiêu hóa">Tiêu hóa</SelectItem>
                                    <SelectItem value="Tim mạch">Tim mạch</SelectItem>
                                    <SelectItem value="Thần kinh">Thần kinh</SelectItem>
                                    <SelectItem value="Chấn thương chỉnh hình">Chấn thương chỉnh hình</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.department && (
                                <p className="text-sm text-red-500">{errors.department}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Trạng thái</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => handleInputChange("status", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Chờ xử lý</SelectItem>
                                <SelectItem value="active">Đang điều trị</SelectItem>
                                <SelectItem value="completed">Hoàn thành</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Ghi chú thêm</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => handleInputChange("notes", e.target.value)}
                            placeholder="Nhập ghi chú thêm (không bắt buộc)"
                            rows={2}
                        />
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
                            <ButtonLoading message={editingRecord ? "Đang cập nhật..." : "Đang tạo..."} />
                        ) : (
                            editingRecord ? "Cập Nhật" : "Tạo Hồ Sơ"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
