import { useState } from "react";
import { useCreateBlockchainClinicalTest } from "@/hooks/use-blockchain";
import { BlockchainCreateClinicalTestRequest } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ClinicalTestCreateFormProps {
    patientId: number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const ClinicalTestCreateForm = ({ patientId, onSuccess, onCancel }: ClinicalTestCreateFormProps) => {
    const [formData, setFormData] = useState<BlockchainCreateClinicalTestRequest>({
        patientId,
        testType: "",
        testDate: Math.floor(Date.now() / 1000).toString(), // Current timestamp
        result: "",
        notes: ""
    });

    const { createClinicalTest, loading } = useCreateBlockchainClinicalTest();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createClinicalTest(formData);
            toast.success("Tạo kết quả xét nghiệm thành công!");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error creating clinical test:", error);
            toast.error("Có lỗi khi tạo kết quả xét nghiệm");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="testType">Loại xét nghiệm</Label>
                <Input
                    id="testType"
                    name="testType"
                    value={formData.testType}
                    onChange={handleChange}
                    placeholder="Nhập loại xét nghiệm"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="testDate">Ngày xét nghiệm</Label>
                <Input
                    id="testDate"
                    name="testDate"
                    type="date"
                    value={new Date(parseInt(formData.testDate) * 1000).toISOString().split('T')[0]}
                    onChange={(e) => {
                        const date = new Date(e.target.value);
                        setFormData(prev => ({
                            ...prev,
                            testDate: Math.floor(date.getTime() / 1000).toString()
                        }));
                    }}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="result">Kết quả xét nghiệm</Label>
                <Textarea
                    id="result"
                    name="result"
                    value={formData.result}
                    onChange={handleChange}
                    placeholder="Nhập kết quả xét nghiệm"
                    className="min-h-[100px]"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Nhập ghi chú (nếu có)"
                    className="min-h-[80px]"
                />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Đang tạo..." : "Tạo xét nghiệm"}
                </Button>
            </div>
        </form>
    );
};

export default ClinicalTestCreateForm;