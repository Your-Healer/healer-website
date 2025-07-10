import { useState } from "react";
import { useUpdateBlockchainDiseaseProgression } from "@/hooks/use-blockchain";
import { BlockchainUpdateDiseaseProgressionRequest } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface DiseaseProgressionUpdateFormProps {
    progressionId: number;
    initialData: {
        visitDate: string;
        symptoms: string;
        diagnosis: string;
        treatment: string;
        prescription: string;
        nextAppointment?: string;
    };
    onSuccess?: () => void;
    onCancel?: () => void;
}

const DiseaseProgressionUpdateForm = ({
    progressionId,
    initialData,
    onSuccess,
    onCancel
}: DiseaseProgressionUpdateFormProps) => {
    const [formData, setFormData] = useState<BlockchainUpdateDiseaseProgressionRequest>({
        progressionId,
        visitDate: initialData.visitDate,
        symptoms: initialData.symptoms,
        diagnosis: initialData.diagnosis,
        treatment: initialData.treatment,
        prescription: initialData.prescription,
        nextAppointment: initialData.nextAppointment
    });

    const { updateDiseaseProgression, loading } = useUpdateBlockchainDiseaseProgression();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateDiseaseProgression(formData);
            toast.success("Cập nhật tiến triển bệnh thành công!");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error updating disease progression:", error);
            toast.error("Có lỗi khi cập nhật tiến triển bệnh");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="visitDate">Ngày khám</Label>
                    <Input
                        id="visitDate"
                        name="visitDate"
                        type="date"
                        value={formData.visitDate ? new Date(parseInt(formData.visitDate) * 1000).toISOString().split('T')[0] : ""}
                        onChange={(e) => {
                            const date = new Date(e.target.value);
                            setFormData(prev => ({
                                ...prev,
                                visitDate: Math.floor(date.getTime() / 1000).toString()
                            }));
                        }}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="nextAppointment">Lịch hẹn tiếp theo</Label>
                    <Input
                        id="nextAppointment"
                        name="nextAppointment"
                        type="date"
                        value={formData.nextAppointment ? new Date(parseInt(formData.nextAppointment) * 1000).toISOString().split('T')[0] : ""}
                        onChange={(e) => {
                            if (e.target.value) {
                                const date = new Date(e.target.value);
                                setFormData(prev => ({
                                    ...prev,
                                    nextAppointment: Math.floor(date.getTime() / 1000).toString()
                                }));
                            } else {
                                setFormData(prev => ({ ...prev, nextAppointment: "" }));
                            }
                        }}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="symptoms">Triệu chứng</Label>
                <Textarea
                    id="symptoms"
                    name="symptoms"
                    value={formData.symptoms || ""}
                    onChange={handleChange}
                    placeholder="Mô tả triệu chứng của bệnh nhân"
                    className="min-h-[80px]"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="diagnosis">Chẩn đoán</Label>
                <Textarea
                    id="diagnosis"
                    name="diagnosis"
                    value={formData.diagnosis || ""}
                    onChange={handleChange}
                    placeholder="Nhập chẩn đoán"
                    className="min-h-[80px]"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="treatment">Phương pháp điều trị</Label>
                <Textarea
                    id="treatment"
                    name="treatment"
                    value={formData.treatment || ""}
                    onChange={handleChange}
                    placeholder="Mô tả phương pháp điều trị"
                    className="min-h-[80px]"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="prescription">Đơn thuốc</Label>
                <Textarea
                    id="prescription"
                    name="prescription"
                    value={formData.prescription || ""}
                    onChange={handleChange}
                    placeholder="Nhập đơn thuốc (nếu có)"
                    className="min-h-[80px]"
                />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Đang cập nhật..." : "Cập nhật tiến triển bệnh"}
                </Button>
            </div>
        </form>
    );
};

export default DiseaseProgressionUpdateForm;