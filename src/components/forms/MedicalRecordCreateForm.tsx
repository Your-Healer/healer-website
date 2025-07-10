import { useState } from "react";
import { useCreateBlockchainMedicalRecord } from "@/hooks/use-blockchain";
import { BlockchainCreateMedicalRecordRequest } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface MedicalRecordCreateFormProps {
    patientId: number;
    diseaseProgressions?: { id: string; diagnosis: string }[];
    onSuccess?: () => void;
    onCancel?: () => void;
}

const MedicalRecordCreateForm = ({
    patientId,
    diseaseProgressions = [],
    onSuccess,
    onCancel
}: MedicalRecordCreateFormProps) => {
    const [formData, setFormData] = useState<BlockchainCreateMedicalRecordRequest>({
        patientId,
        diagnosis: "",
        treatment: ""
    });

    const [useDataPointer, setUseDataPointer] = useState(false);
    const [selectedProgression, setSelectedProgression] = useState<number | null>(null);

    const { createMedicalRecord, loading } = useCreateBlockchainMedicalRecord();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // If using a data pointer, add it to the request
        const finalData = useDataPointer && selectedProgression
            ? { ...formData, dataPointer: selectedProgression }
            : formData;

        try {
            await createMedicalRecord(finalData);
            toast.success("Tạo hồ sơ bệnh án thành công!");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error creating medical record:", error);
            toast.error("Có lỗi khi tạo hồ sơ bệnh án");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
                <Switch
                    id="use-data-pointer"
                    checked={useDataPointer}
                    onCheckedChange={setUseDataPointer}
                />
                <Label htmlFor="use-data-pointer">
                    Liên kết với tiến triển bệnh đã có
                </Label>
            </div>

            {useDataPointer && diseaseProgressions.length > 0 ? (
                <div className="space-y-2">
                    <Label htmlFor="dataPointer">Chọn tiến triển bệnh để liên kết</Label>
                    <select
                        id="dataPointer"
                        value={selectedProgression || ""}
                        onChange={(e) => setSelectedProgression(Number(e.target.value))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        required
                    >
                        <option value="">-- Chọn tiến triển bệnh --</option>
                        {diseaseProgressions.map(prog => (
                            <option key={prog.id} value={prog.id}>{prog.diagnosis}</option>
                        ))}
                    </select>
                </div>
            ) : (
                <>
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
                </>
            )}

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Đang tạo..." : "Tạo hồ sơ bệnh án"}
                </Button>
            </div>
        </form>
    );
};

export default MedicalRecordCreateForm;