import { useState } from "react";
import { useDeleteBlockchainDiseaseProgression } from "@/hooks/use-blockchain";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface DiseaseProgressionDeleteConfirmationProps {
    progressionId: number;
    diagnosis: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const DiseaseProgressionDeleteConfirmation = ({
    progressionId,
    diagnosis,
    isOpen,
    onClose,
    onSuccess
}: DiseaseProgressionDeleteConfirmationProps) => {
    const { deleteDiseaseProgression, loading } = useDeleteBlockchainDiseaseProgression();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            await deleteDiseaseProgression(progressionId);
            toast.success("Đã xóa tiến triển bệnh thành công");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Error deleting disease progression:", error);
            toast.error("Có lỗi khi xóa tiến triển bệnh");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa tiến triển bệnh</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa tiến triển bệnh với chẩn đoán "{diagnosis}"?
                        Hành động này không thể hoàn tác và dữ liệu sẽ bị mất vĩnh viễn.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isDeleting ? "Đang xóa..." : "Xóa"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DiseaseProgressionDeleteConfirmation;