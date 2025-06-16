import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CheckCircle, Clock } from "lucide-react"

interface SelectAccountStatusProps {
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
    disabled?: boolean
    includeAll?: boolean
    allLabel?: string
    label?: string
}

export function SelectAccountStatus({
    value,
    onValueChange,
    placeholder = "Chọn trạng thái",
    className,
    disabled = false,
    includeAll = false,
    allLabel = "Tất cả trạng thái",
    label,
}: SelectAccountStatusProps) {
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
                    <SelectItem value="verified">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Đã xác thực
                        </div>
                    </SelectItem>
                    <SelectItem value="unverified">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            Chưa xác thực
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

// Helper function to get status display name
export function getAccountStatusName(status?: string) {
    if (!status || status === "all") return "Tất cả trạng thái"

    switch (status) {
        case "verified": return "Đã xác thực";
        case "unverified": return "Chưa xác thực";
        default: return "Không xác định";
    }
}
