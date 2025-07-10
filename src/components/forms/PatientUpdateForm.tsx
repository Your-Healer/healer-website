import { useState } from "react";
import { useUpdateBlockchainPatient } from "@/hooks/use-blockchain";
import { BlockchainUpdatePatientRequest } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface PatientUpdateFormProps {
    patientId: number;
    initialData: {
        patientName: string;
        dateOfBirth: string;
        gender: string;
        address?: string;
        phoneNumber?: string;
        emergencyContact?: string;
    };
    onSuccess?: () => void;
    onCancel?: () => void;
}

const PatientUpdateForm = ({ patientId, initialData, onSuccess, onCancel }: PatientUpdateFormProps) => {
    const [formData, setFormData] = useState<BlockchainUpdatePatientRequest>({
        patientId,
        ...initialData
    });
    const { updatePatient, loading } = useUpdateBlockchainPatient();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenderChange = (value: string) => {
        setFormData(prev => ({ ...prev, gender: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updatePatient(formData);
            toast.success("Cập nhật thông tin bệnh nhân thành công!");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error updating patient:", error);
            toast.error("Có lỗi khi cập nhật thông tin bệnh nhân");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="patientName">Tên bệnh nhân</Label>
                    <Input
                        id="patientName"
                        name="patientName"
                        value={formData.patientName || ""}
                        onChange={handleChange}
                        placeholder="Nhập tên bệnh nhân"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                    <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth ? new Date(parseInt(formData.dateOfBirth) * 1000).toISOString().split('T')[0] : ""}
                        onChange={(e) => {
                            const date = new Date(e.target.value);
                            setFormData(prev => ({
                                ...prev,
                                dateOfBirth: Math.floor(date.getTime() / 1000).toString()
                            }));
                        }}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="gender">Giới tính</Label>
                    <Select
                        value={formData.gender || ""}
                        onValueChange={handleGenderChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Nam">Nam</SelectItem>
                            <SelectItem value="Nữ">Nữ</SelectItem>
                            <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Số điện thoại</Label>
                    <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber || ""}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                    id="address"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="emergencyContact">Liên hệ khẩn cấp</Label>
                <Input
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact || ""}
                    onChange={handleChange}
                    placeholder="Nhập số liên hệ khẩn cấp"
                />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                </Button>
            </div>
        </form>
    );
};

export default PatientUpdateForm;