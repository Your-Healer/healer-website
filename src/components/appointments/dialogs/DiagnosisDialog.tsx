"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface DiagnosisFormData {
    disease: string;
    confidence: number;
    description: string;
    suggestedByAI: string;
}

interface DiagnosisDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    formData: DiagnosisFormData;
    onFormDataChange: (data: DiagnosisFormData) => void;
    onConfirm: () => void;
    isSubmitting: boolean;
}

export function DiagnosisDialog({
    open,
    onOpenChange,
    formData,
    onFormDataChange,
    onConfirm,
    isSubmitting
}: DiagnosisDialogProps) {
    const handleFieldChange = (field: keyof DiagnosisFormData, value: string | number) => {
        onFormDataChange({ ...formData, [field]: value });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Thêm chẩn đoán</DialogTitle>
                    <DialogDescription>
                        Thêm chẩn đoán mới cho lịch hẹn này
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="disease">Tên bệnh *</Label>
                        <Input
                            id="disease"
                            value={formData.disease}
                            onChange={(e) => handleFieldChange("disease", e.target.value)}
                            placeholder="Nhập tên bệnh"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confidence">Độ tin cậy: {formData.confidence}%</Label>
                        <input
                            type="range"
                            id="confidence"
                            min="0"
                            max="100"
                            value={formData.confidence}
                            onChange={(e) => handleFieldChange("confidence", parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả (tùy chọn)</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleFieldChange("description", e.target.value)}
                            placeholder="Nhập mô tả chi tiết về chẩn đoán"
                            rows={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="suggestedByAI">Gợi ý từ AI (tùy chọn)</Label>
                        <Textarea
                            id="suggestedByAI"
                            value={formData.suggestedByAI}
                            onChange={(e) => handleFieldChange("suggestedByAI", e.target.value)}
                            placeholder="Nhập gợi ý từ AI nếu có..."
                            rows={3}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button onClick={onConfirm} disabled={!formData.disease || isSubmitting}>
                        {isSubmitting ? "Đang thêm..." : "Thêm chẩn đoán"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
