import { useState } from "react";
import { useUpdateBlockchainClinicalTest } from "@/hooks/use-blockchain";
import { BlockchainUpdateClinicalTestRequest } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ClinicalTestUpdateFormProps {
    testId: number;
    initialData: {
        testType: string;
        testDate: string;
        result: string;
        notes: string;
    };
    onSuccess?: () => void;
    onCancel?: () => void;
}

const ClinicalTestUpdateForm = ({
    testId,
    initialData,
    onSuccess,
    onCancel
}: ClinicalTestUpdateFormProps) => {
    const [formData, setFormData] = useState<BlockchainUpdateClinicalTestRequest>({
        testId,
        testType: initialData.testType,
        testDate: initialData.testDate,
        result: initialData.result,
        notes: initialData.notes
    });

    const { updateClinicalTest, loading } = useUpdateBlockchainClinicalTest();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateClinicalTest(formData);
            toast.success("Cập nhật xét nghiệm thành công!");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error updating clinical test:", error);
            toast.error("Có lỗi khi cập nhật xét nghiệm");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="testType">Loại xét nghiệm</Label>
                <Input
                    id="testType"
                    name="testType"
                    value={formData.testType || ""}
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
                    value={formData.testDate ? new Date(parseInt(formData.testDate) * 1000).toISOString().split('T')[0] : ""}
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
                    value={formData.result || ""}
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
                    value={formData.notes || ""}
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
                    {loading ? "Đang cập nhật..." : "Cập nhật xét nghiệm"}
                </Button>
            </div>
        </form>
    );
};

export default ClinicalTestUpdateForm;