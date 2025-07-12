import { useState } from "react";
import { useDeleteBlockchainClinicalTest } from "@/hooks/use-blockchain";
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

interface ClinicalTestDeleteConfirmationProps {
    testId: number;
    testType: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const ClinicalTestDeleteConfirmation = ({
    testId,
    testType,
    isOpen,
    onClose,
    onSuccess
}: ClinicalTestDeleteConfirmationProps) => {
    const { deleteClinicalTest, loading } = useDeleteBlockchainClinicalTest();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            await deleteClinicalTest(testId);
            toast.success("Đã xóa xét nghiệm thành công");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Error deleting clinical test:", error);
            toast.error("Có lỗi khi xóa xét nghiệm");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa xét nghiệm</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa xét nghiệm "{testType}"?
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

export default ClinicalTestDeleteConfirmation;