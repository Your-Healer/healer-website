import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Clock, Play, CheckCircle, Calendar } from "lucide-react"

interface SelectShiftStatusProps {
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
    disabled?: boolean
    includeAll?: boolean
    allLabel?: string
    label?: string
}

export function SelectShiftStatus({
    value,
    onValueChange,
    placeholder = "Chọn trạng thái",
    className,
    disabled = false,
    includeAll = false,
    allLabel = "Tất cả trạng thái",
    label,
}: SelectShiftStatusProps) {
    return (
        <div className="space-y-2">
            {label && <Label>{label}</Label>}
            <Select value={value} onValueChange={onValueChange} disabled={disabled}>
                <SelectTrigger className={className}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {includeAll && (
                        <SelectItem value="all">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full" />
                                {allLabel}
                            </div>
                        </SelectItem>
                    )}
                    <SelectItem value="upcoming">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            Sắp tới
                        </div>
                    </SelectItem>
                    <SelectItem value="active">
                        <div className="flex items-center gap-2">
                            <Play className="h-4 w-4 text-green-500" />
                            Đang diễn ra
                        </div>
                    </SelectItem>
                    <SelectItem value="completed">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-gray-500" />
                            Đã kết thúc
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

// Helper function to get status display name
export function getShiftStatusName(status?: string) {
    if (!status || status === "all") return "Tất cả trạng thái"

    switch (status) {
        case "upcoming": return "Sắp tới";
        case "active": return "Đang diễn ra";
        case "completed": return "Đã kết thúc";
        default: return "Không xác định";
    }
}
