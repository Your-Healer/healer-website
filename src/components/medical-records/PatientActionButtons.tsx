import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    FileEdit,
    TestTube,
    FileText,
    TrendingUp,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import MedicalActions, { ActionType } from "./MedicalActions";

interface PatientActionButtonsProps {
    patientId: number;
    patientData: any;
    onSuccess: () => void;
    diseaseProgressions?: { id: string; diagnosis: string }[];
}

const PatientActionButtons = ({
    patientId,
    patientData,
    onSuccess,
    diseaseProgressions = []
}: PatientActionButtonsProps) => {
    const [actionType, setActionType] = useState<ActionType | null>(null);
    const [actionData, setActionData] = useState<any>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleAction = (type: ActionType, data?: any) => {
        setActionType(type);
        setActionData(data);
    };

    const handleClose = () => {
        setActionType(null);
        setActionData(null);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            <div className="flex flex-wrap gap-2 my-4">
                {/* Edit Patient Button - Always visible */}
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleAction(ActionType.UpdatePatient, patientData)}
                >
                    <FileEdit className="h-4 w-4" />
                    <span>Sửa thông tin</span>
                </Button>

                {/* Create Buttons - Always visible */}
                <Button
                    variant="default"
                    size="sm"
                    className="flex items-center gap-1 bg-blue-600"
                    onClick={() => handleAction(ActionType.CreateClinicalTest)}
                >
                    <TestTube className="h-4 w-4" />
                    <span>Thêm xét nghiệm</span>
                </Button>

                <Button
                    variant="default"
                    size="sm"
                    className="flex items-center gap-1 bg-green-600"
                    onClick={() => handleAction(ActionType.CreateDiseaseProgression)}
                >
                    <TrendingUp className="h-4 w-4" />
                    <span>Thêm tiến triển</span>
                </Button>

                <Button
                    variant="default"
                    size="sm"
                    className="flex items-center gap-1 bg-purple-600"
                    onClick={() => handleAction(ActionType.CreateMedicalRecord)}
                >
                    <FileText className="h-4 w-4" />
                    <span>Tạo hồ sơ</span>
                </Button>

                {/* Toggle Button for Extra Actions */}
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={toggleExpand}
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="h-4 w-4" />
                            <span>Thu gọn</span>
                        </>
                    ) : (
                        <>
                            <ChevronDown className="h-4 w-4" />
                            <span>Thêm thao tác</span>
                        </>
                    )}
                </Button>
            </div>

            {/* Additional actions when expanded */}
            {isExpanded && (
                <div className="border rounded-md p-4 my-2 bg-gray-50">
                    <h3 className="text-sm font-medium mb-2">Thao tác nâng cao</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center justify-start gap-1 text-blue-600"
                            onClick={() => {/* Additional action */ }}
                        >
                            <TestTube className="h-4 w-4" />
                            <span>Nhập từ file xét nghiệm</span>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center justify-start gap-1 text-green-600"
                            onClick={() => {/* Additional action */ }}
                        >
                            <TrendingUp className="h-4 w-4" />
                            <span>Báo cáo tiến triển</span>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center justify-start gap-1 text-purple-600"
                            onClick={() => {/* Additional action */ }}
                        >
                            <FileText className="h-4 w-4" />
                            <span>Xuất hồ sơ (PDF)</span>
                        </Button>
                    </div>
                </div>
            )}

            {/* The MedicalActions component handles all form dialogs */}
            <MedicalActions
                actionType={actionType}
                patientId={patientId}
                data={actionData}
                onClose={handleClose}
                onSuccess={() => {
                    onSuccess();
                    handleClose();
                }}
                diseaseProgressions={diseaseProgressions}
            />
        </>
    );
};

export default PatientActionButtons;