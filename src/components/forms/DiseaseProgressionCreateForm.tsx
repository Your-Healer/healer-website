import { useState } from "react";
import { useCreateBlockchainDiseaseProgression } from "@/hooks/use-blockchain";
import { BlockchainCreateDiseaseProgressionRequest } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface DiseaseProgressionCreateFormProps {
    patientId: number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const DiseaseProgressionCreateForm = ({
    patientId,
    onSuccess,
    onCancel
}: DiseaseProgressionCreateFormProps) => {
    const currentDate = Math.floor(Date.now() / 1000).toString();

    const [formData, setFormData] = useState<BlockchainCreateDiseaseProgressionRequest>({
        patientId,
        visitDate: currentDate,
        symptoms: "",
        diagnosis: "",
        treatment: "",
        prescription: "",
        nextAppointment: ""
    });

    const { createDiseaseProgression, loading } = useCreateBlockchainDiseaseProgression();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createDiseaseProgression(formData);
            toast.success("Tạo tiến triển bệnh thành công!");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error creating disease progression:", error);
            toast.error("Có lỗi khi tạo tiến triển bệnh");
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
                        value={new Date(parseInt(formData.visitDate) * 1000).toISOString().split('T')[0]}
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
                    value={formData.symptoms}
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
                    value={formData.diagnosis}
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
                    value={formData.treatment}
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
                    value={formData.prescription}
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
                    {loading ? "Đang tạo..." : "Tạo tiến triển bệnh"}
                </Button>
            </div>
        </form>
    );
};

export default DiseaseProgressionCreateForm;