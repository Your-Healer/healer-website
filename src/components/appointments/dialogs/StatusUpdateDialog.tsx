"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { APPOINTMENTSTATUS } from "@/utils/enum";
import { getAppointmentStatusName } from "@/utils/utils";

interface StatusUpdateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedStatus: APPOINTMENTSTATUS | "";
    onStatusChange: (status: APPOINTMENTSTATUS) => void;
    onConfirm: () => void;
    isSubmitting: boolean;
}

export function StatusUpdateDialog({
    open,
    onOpenChange,
    selectedStatus,
    onStatusChange,
    onConfirm,
    isSubmitting
}: StatusUpdateDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cập nhật trạng thái lịch hẹn</DialogTitle>
                    <DialogDescription>
                        Chọn trạng thái mới cho lịch hẹn này
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="status">Trạng thái mới</Label>
                        <Select value={selectedStatus} onValueChange={onStatusChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={APPOINTMENTSTATUS.BOOKED}>
                                    {getAppointmentStatusName(APPOINTMENTSTATUS.BOOKED)}
                                </SelectItem>
                                <SelectItem value={APPOINTMENTSTATUS.IDLE}>
                                    {getAppointmentStatusName(APPOINTMENTSTATUS.IDLE)}
                                </SelectItem>
                                <SelectItem value={APPOINTMENTSTATUS.PAID}>
                                    {getAppointmentStatusName(APPOINTMENTSTATUS.PAID)}
                                </SelectItem>
                                <SelectItem value={APPOINTMENTSTATUS.CANCEL}>
                                    {getAppointmentStatusName(APPOINTMENTSTATUS.CANCEL)}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button onClick={onConfirm} disabled={!selectedStatus || isSubmitting}>
                        {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
