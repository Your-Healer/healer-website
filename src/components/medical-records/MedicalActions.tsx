import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";

import PatientUpdateForm from "../forms/PatientUpdateForm";
import ClinicalTestCreateForm from "../forms/ClinicalTestCreateForm";
import ClinicalTestUpdateForm from "../forms/ClinicalTestUpdateForm";
import ClinicalTestDeleteConfirmation from "../forms/ClinicalTestDeleteConfirmation";
import DiseaseProgressionCreateForm from "../forms/DiseaseProgressionCreateForm";
import DiseaseProgressionUpdateForm from "../forms/DiseaseProgressionUpdateForm";
import DiseaseProgressionDeleteConfirmation from "../forms/DiseaseProgressionDeleteConfirmation";
import MedicalRecordCreateForm from "../forms/MedicalRecordCreateForm";

export enum ActionType {
    UpdatePatient = "UPDATE_PATIENT",
    CreateClinicalTest = "CREATE_CLINICAL_TEST",
    UpdateClinicalTest = "UPDATE_CLINICAL_TEST",
    DeleteClinicalTest = "DELETE_CLINICAL_TEST",
    CreateDiseaseProgression = "CREATE_DISEASE_PROGRESSION",
    UpdateDiseaseProgression = "UPDATE_DISEASE_PROGRESSION",
    DeleteDiseaseProgression = "DELETE_DISEASE_PROGRESSION",
    CreateMedicalRecord = "CREATE_MEDICAL_RECORD"
}

interface MedicalActionsProps {
    actionType: ActionType | null;
    patientId: number;
    data?: any;  // For update/delete operations
    onClose: () => void;
    onSuccess?: () => void;
    diseaseProgressions?: { id: string; diagnosis: string }[];
}

const MedicalActions = ({
    actionType,
    patientId,
    data,
    onClose,
    onSuccess,
    diseaseProgressions = []
}: MedicalActionsProps) => {
    if (!actionType) return null;

    const getTitleByActionType = () => {
        switch (actionType) {
            case ActionType.UpdatePatient:
                return "Cập nhật thông tin bệnh nhân";
            case ActionType.CreateClinicalTest:
                return "Tạo xét nghiệm mới";
            case ActionType.UpdateClinicalTest:
                return "Cập nhật xét nghiệm";
            case ActionType.DeleteClinicalTest:
                return "Xóa xét nghiệm";
            case ActionType.CreateDiseaseProgression:
                return "Tạo tiến triển bệnh mới";
            case ActionType.UpdateDiseaseProgression:
                return "Cập nhật tiến triển bệnh";
            case ActionType.DeleteDiseaseProgression:
                return "Xóa tiến triển bệnh";
            case ActionType.CreateMedicalRecord:
                return "Tạo hồ sơ bệnh án mới";
            default:
                return "Thao tác y tế";
        }
    };

    const getDescriptionByActionType = () => {
        switch (actionType) {
            case ActionType.UpdatePatient:
                return "Cập nhật thông tin cá nhân của bệnh nhân";
            case ActionType.CreateClinicalTest:
                return "Tạo một xét nghiệm mới cho bệnh nhân";
            case ActionType.UpdateClinicalTest:
                return "Cập nhật thông tin xét nghiệm";
            case ActionType.DeleteClinicalTest:
                return "Xác nhận xóa xét nghiệm";
            case ActionType.CreateDiseaseProgression:
                return "Thêm mới tiến triển bệnh";
            case ActionType.UpdateDiseaseProgression:
                return "Cập nhật thông tin tiến triển bệnh";
            case ActionType.DeleteDiseaseProgression:
                return "Xác nhận xóa tiến triển bệnh";
            case ActionType.CreateMedicalRecord:
                return "Tạo hồ sơ bệnh án blockchain cho bệnh nhân";
            default:
                return "";
        }
    };

    // For delete operations, we use AlertDialog components directly
    if (actionType === ActionType.DeleteClinicalTest) {
        return (
            <ClinicalTestDeleteConfirmation
                testId={data?.testId}
                testType={data?.testType}
                isOpen={true}
                onClose={onClose}
                onSuccess={onSuccess}
            />
        );
    }

    if (actionType === ActionType.DeleteDiseaseProgression) {
        return (
            <DiseaseProgressionDeleteConfirmation
                progressionId={data?.progressionId}
                diagnosis={data?.diagnosis}
                isOpen={true}
                onClose={onClose}
                onSuccess={onSuccess}
            />
        );
    }

    // For other operations, we use Dialog with respective forms
    return (
        <Dialog open={!!actionType} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{getTitleByActionType()}</DialogTitle>
                    <DialogDescription>{getDescriptionByActionType()}</DialogDescription>
                </DialogHeader>

                {actionType === ActionType.UpdatePatient && (
                    <PatientUpdateForm
                        patientId={patientId}
                        initialData={data}
                        onSuccess={onSuccess}
                        onCancel={onClose}
                    />
                )}

                {actionType === ActionType.CreateClinicalTest && (
                    <ClinicalTestCreateForm
                        patientId={patientId}
                        onSuccess={onSuccess}
                        onCancel={onClose}
                    />
                )}

                {actionType === ActionType.UpdateClinicalTest && (
                    <ClinicalTestUpdateForm
                        testId={data.testId}
                        initialData={data}
                        onSuccess={onSuccess}
                        onCancel={onClose}
                    />
                )}

                {actionType === ActionType.CreateDiseaseProgression && (
                    <DiseaseProgressionCreateForm
                        patientId={patientId}
                        onSuccess={onSuccess}
                        onCancel={onClose}
                    />
                )}

                {actionType === ActionType.UpdateDiseaseProgression && (
                    <DiseaseProgressionUpdateForm
                        progressionId={data.progressionId}
                        initialData={data}
                        onSuccess={onSuccess}
                        onCancel={onClose}
                    />
                )}

                {actionType === ActionType.CreateMedicalRecord && (
                    <MedicalRecordCreateForm
                        patientId={patientId}
                        diseaseProgressions={diseaseProgressions}
                        onSuccess={onSuccess}
                        onCancel={onClose}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default MedicalActions;